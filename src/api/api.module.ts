import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { ImportModule } from './modules/import/import.module';
import { HealthModule } from './modules/health/health.module';
import { PINO_LOGGER_OPTIONS } from '../common/config';

@Module({
  imports: [
    ImportModule,
    HealthModule,
    LoggerModule.forRoot(PINO_LOGGER_OPTIONS),
  ],
})
export class ApiModule {}
