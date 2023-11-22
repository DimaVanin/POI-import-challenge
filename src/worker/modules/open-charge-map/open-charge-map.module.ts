import { Module } from '@nestjs/common';

import { OpenChargeMapService } from './open-charge-map.service';

@Module({
  imports: [],
  controllers: [],
  providers: [OpenChargeMapService],
  exports: [OpenChargeMapService],
})
export class OpenChargeMapModule {}
