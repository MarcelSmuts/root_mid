import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BatchModule } from 'src/batch/batch.module';
import { RootEventModule } from 'src/event/root-event.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    RootEventModule,
    BatchModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
