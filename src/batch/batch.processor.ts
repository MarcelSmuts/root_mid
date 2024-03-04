import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor(String(process.env.QUEUE_NAME))
export class BatchProcessor {
  private readonly logger = new Logger(BatchProcessor.name);

  @Process('rootPlatformEvent')
  handleRootPlatformEvent(job: Job) {
    this.logger.debug('handleRootPlatformEvent');
    this.logger.debug(job.data);
    this.logger.debug('handleRootPlatformEvent completed');
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }
}