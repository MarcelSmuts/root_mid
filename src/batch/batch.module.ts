import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { BatchProcessor } from './batch.processor';
import { ConfigModule } from '@nestjs/config';
import { AggregatorModule } from 'src/aggregator/aggregator.module';

@Module({
  imports: [AggregatorModule],
  providers: [BatchProcessor],
})
export class BatchModule {}