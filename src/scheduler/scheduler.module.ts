import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { HealthModule } from './modules/health/health.module';
import { PINO_LOGGER_OPTIONS } from '../common/config';

@Module({
  imports: [HealthModule, LoggerModule.forRoot(PINO_LOGGER_OPTIONS)],
})
export class SchedulerModule {}
