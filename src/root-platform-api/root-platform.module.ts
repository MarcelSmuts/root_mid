import { Module } from '@nestjs/common';
import { RootPlatformService } from './root-platform.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  exports: [RootPlatformService],
  providers: [RootPlatformService],
})
export class RootPlatformModule {}