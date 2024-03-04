import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, JobId } from 'bull';
import { AggregatorService, JobFailure, JobStatusEnum, JobSuccess } from 'src/aggregator/aggregator.sevice';

@Processor(String(process.env.QUEUE_NAME))
export class BatchProcessor {
  private maxJobs = Number(process.env.BATCH_MAX_JOBS) || 10;
  private batchInterval = Number(process.env.BATCH_INTERVAL_IN_MILLISECONDS) || 10000;
  private maxAttempts = Number(process.env.PROCESS_MAX_ATTEMPTS) || 3;
  private maxConcurrentProcesses = Number(process.env.PROCESS_CONCURRENT_PROCESSES) || 1;
  private concurrentProcesses = 0;
  private currentJobs: Array<Job> = []
  private timeout: NodeJS.Timeout;

  constructor(private aggregatorService: AggregatorService) {}

  @Process('rootPlatformEvent')
  async handleRootPlatformEvent(job: Job) {
    
    // If we've reached the max number of attempts, move the job to the failed queue
    if (job.attemptsMade > this.maxAttempts) {
      job.moveToFailed({ message: 'Max attempts reached' });
      return;
    }

    this.currentJobs.push(job);

    // If we've reached the max number of jobs, process them
    if (this.currentJobs.length >= this.maxJobs) {
      this.process()
      return
    }

    // If this is the first job for this batch, start a timer
    this.timeout = this.timeout || setTimeout(() => {
      this.process()
    }, this.batchInterval)
  }

  private process = () => {
    // TODO: Maintain a list of concurrent processes. If we're at the limit, wait until a process becomes available
    clearTimeout(this.timeout);
    this.timeout = null;

    this.aggregatorService.processJobs(this.currentJobs, this.processJobsCallback);
    this.currentJobs = [];
  }

  private async processJobsCallback(jobResult: JobSuccess | JobFailure) {
    if (jobResult.status === JobStatusEnum.FAILURE) {
      // Put the jobs back on the queue and try again
      this.currentJobs.forEach(job => {
        job.retry();
      });
    }
  }
}