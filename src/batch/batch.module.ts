import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { BatchProcessor } from './batch.processor';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [],
  providers: [BatchProcessor],
})
export class BatchModule {}