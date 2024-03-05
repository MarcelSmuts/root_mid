import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { RootRequest } from 'src/guards/root-request.guard';


export interface eventPayload {
  webhook_id:	string
  event: object
  verification_token?: string
  environment: string
}

@Controller()
export class RootEventController {
  constructor(@InjectQueue(String(process.env.QUEUE_NAME)) private readonly rootPlatformEventQueue: Queue) {
  }

  @UseGuards(RootRequest)
  @Post('rootPlatformEvent')
  async rootPlatformEvent(@Body() eventData: eventPayload): Promise<void> {
    console.log('rootPlatformEvent', eventData)
    await this.rootPlatformEventQueue.add('rootPlatformEvent', { name: 'rootPlatformEvent' })
  }
}
