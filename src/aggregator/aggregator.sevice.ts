import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { InstructionUpdateType, MIDHeaderRecord, MIDInstructionRecord, MIDTrailerRecord } from 'src/models/mid-record';
import * as fs from 'fs'

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

// TODO: Move to db
let fileSequenceNumber = 0;

@Injectable()
export class AggregatorService {
  private readonly logger = new Logger(AggregatorService.name);

  async processJobs(jobs: Array<Job>, callback: Function): Promise<JobSuccess | JobFailure> {
    this.logger.log(`Processing ${jobs.length} jobs...`)

    // TODO: Send the jobs off to lambda to be processed

    try {
      const instructionRecords = this.createInstructionRecords(jobs)
      await this.createFlatFile(instructionRecords)
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

  private createInstructionRecords(jobs: Array<Job>): Array<MIDInstructionRecord> {

    const records: Array<MIDInstructionRecord> = jobs.map((job: Job) => {
      return MIDInstructionRecord.fromRootEventPayload(job.data)
    })

    return records
  }

  private async createFlatFile(records: Array<MIDInstructionRecord>): Promise<void> {
    fileSequenceNumber++
    const path = './flatFiles';

    fs.mkdirSync(path, { recursive: true })
    const filePath = `${path}/ff-${new Date().getTime()}-${fileSequenceNumber}`;

    const headerRecord = new MIDHeaderRecord({
      date: new Date().getTime(),
      fileSequenceNumber: fileSequenceNumber,
      supplierId: '1234'
    })

    const trailerRecord = new MIDTrailerRecord({
      fileSequenceNumber: fileSequenceNumber,
      recordCount: records.length
    })

    try {
      const stream = fs.createWriteStream(filePath, {flags: 'a'});

      stream.write(`${headerRecord.format()}\n`, 'utf8');
      records.forEach((record) => {
        stream.write(`${record.format()}\n`, 'utf8');
      })
      stream.write(`${trailerRecord.format()}\n`, 'utf8');

      stream.end();
    } catch (err) {
      console.log(err.message);
    }
  }
}
