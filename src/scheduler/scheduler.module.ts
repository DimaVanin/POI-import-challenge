import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { HealthModule } from './modules/health/health.module';
import { PINO_LOGGER_OPTIONS } from '../common/config';
import { MessagesQueueModule } from '../common/modules/messages-queue/messages-queue.module';
import { SchedulerController } from './scheduler.controller';

@Module({
  imports: [
    HealthModule,
    LoggerModule.forRoot(PINO_LOGGER_OPTIONS),
    MessagesQueueModule,
  ],
  controllers: [SchedulerController],
})
export class SchedulerModule {}
