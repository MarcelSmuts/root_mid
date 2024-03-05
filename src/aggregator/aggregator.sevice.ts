import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { json2csv } from 'json-2-csv';
import { MIDHeaderRecord } from 'src/models/mid-record';

// TODO: Move these to types files
export enum JobStatusEnum {
    SUCCESS = "SUCCESS",
    FAILURE = "FAILURE"
}

export type JobStatus = {
  status: JobStatusEnum;
}

export interface JobSuccess {
  status: JobStatusEnum.SUCCESS;
}

export interface JobFailure extends JobStatus {
  status: JobStatusEnum.FAILURE;
  message: string;
  jobs: Array<Job>;
}

@Injectable()
export class AggregatorService {
  private readonly logger = new Logger(AggregatorService.name);

  async processJobs(jobs: Array<Job>, callback: Function): Promise<JobSuccess | JobFailure> {
    this.logger.log(`Processing ${jobs.length} jobs...`)

    // TODO: Send the jobs off to lambda to be processed

    try {
      this.createRecords(jobs)
    } catch (error) {
      this.logger.error(`Error processing jobs: ${error.message}`)
      callback({
        status: JobStatusEnum.FAILURE,
        message: error.message,
        jobs
      });
      return
    }
  
    this.logger.log(`Successfully proccessed ${jobs.length} jobs`)
    callback({
      status: JobStatusEnum.SUCCESS,
    });
  }

  // TODO: Generate CSV
  private async createRecords(jobs: Array<Job>): Promise<void> {

    const headerRecord = new MIDHeaderRecord({
      date: 20210101,
      fileSequenceNumber: 1,
      supplierId: '1234'
    })

    const records = jobs.map((job: Job) => {
      return job.data
    })
  }
}
