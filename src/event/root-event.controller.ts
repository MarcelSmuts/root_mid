import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { RootRequest } from 'src/guards/root-request.guard';
import { Response } from 'express';
import { RootEventPayload } from 'src/models/root-event-payload';

@Controller()
export class RootEventController {
  constructor(@InjectQueue(String(process.env.QUEUE_NAME)) private readonly rootPlatformEventQueue: Queue) {
  }

  @UseGuards(RootRequest)
  @Post('rootPlatformEvent')
  async rootPlatformEvent(@Body() eventData: RootEventPayload, @Res() response: Response) {
    await this.rootPlatformEventQueue.add('rootPlatformEvent', eventData)
    return response.status(HttpStatus.OK).send()
  }
}
