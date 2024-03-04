import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { RootEventController } from './rootEvent.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

console.log(process.env.REDIS_HOST)
console.log(process.env.REDIS_PORT)

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT')
        }
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: String(process.env.QUEUE_NAME),
    })
  ],
  controllers: [RootEventController],
})

export class RootEventModule {}