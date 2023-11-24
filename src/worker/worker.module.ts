import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { MongooseModule } from '@nestjs/mongoose';

import { ImportModule } from './modules/import/import.module';
import { HealthModule } from './modules/health/health.module';
import { MONGODB_URL, PINO_LOGGER_OPTIONS } from '../common/config';
import { POIModule } from '../common/modules/poi/poi.module';

@Module({
  imports: [
    POIModule,
    ImportModule,
    HealthModule,
    LoggerModule.forRoot({ ...PINO_LOGGER_OPTIONS }),
    MongooseModule.forRoot(MONGODB_URL),
  ],
})
export class WorkerModule {}
