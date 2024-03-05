import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BatchModule } from 'src/batch/batch.module';
import { RootEventModule } from 'src/event/root-event.module';
import { RootPlatformModule } from 'src/root-platform-api/root-platform.module';
import { RootPlatformService } from 'src/root-platform-api/root-platform.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    RootEventModule,
    BatchModule,
    RootPlatformModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
  constructor(private readonly rootPlatformService: RootPlatformService) {
  }

  async onApplicationBootstrap() {
    console.log('The application is starting...');
    const webhook = await this.rootPlatformService.createWebhook();
  }
}
