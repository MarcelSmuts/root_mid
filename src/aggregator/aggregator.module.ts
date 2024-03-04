import { Module } from '@nestjs/common';
import { AggregatorService } from './aggregator.sevice';

@Module({
  imports: [],
  providers: [AggregatorService],
  exports: [AggregatorService],
})
export class AggregatorModule {}