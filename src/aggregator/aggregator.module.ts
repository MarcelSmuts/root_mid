import { Module } from '@nestjs/common';
import { AggregatorService } from './aggregator.sevice';
import { RootPlatformModule } from 'src/root-platform-api/root-platform.module';

@Module({
  imports: [RootPlatformModule],
  providers: [AggregatorService],
  exports: [AggregatorService],
})
export class AggregatorModule {}