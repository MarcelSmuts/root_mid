import { Body, Controller, Get, Post } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller()
export class RootEventController {
  constructor(@InjectQueue(String(process.env.QUEUE_NAME)) private readonly rootPlatformEventQueue: Queue) {
  }

  @Post('rootPlatformEvent')
  async rootPlatformEvent(@Body() eventData): Promise<void> {
    console.log('rootPlatformEvent', eventData)
    await this.rootPlatformEventQueue.add('rootPlatformEvent', { name: 'rootPlatformEvent' })
  }
}
