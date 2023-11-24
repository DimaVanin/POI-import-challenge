import { Module } from '@nestjs/common';

import { MessagesQueueModule } from '../../../common/modules/messages-queue/messages-queue.module';
import { POIModule } from '../../../common/modules/poi/poi.module';
import { OpenChargeMapModule } from '../open-charge-map/open-charge-map.module';
import { ImportController } from './import.controller';
import { ImportJobHandler } from './import-job.handler';

@Module({
  imports: [MessagesQueueModule, OpenChargeMapModule, POIModule],
  controllers: [ImportController],
  providers: [ImportJobHandler],
})
export class ImportModule {}
