import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { POIService } from './poi.service';
import { DataProvider, DataProviderSchema, POI, POISchema } from './schemas';
import { Connection, ConnectionSchema } from './schemas/connection.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: POI.name, schema: POISchema },
      { name: DataProvider.name, schema: DataProviderSchema },
      { name: Connection.name, schema: ConnectionSchema },
    ]),
  ],
  controllers: [],
  providers: [POIService],
  exports: [POIService],
})
export class POIModule {}
