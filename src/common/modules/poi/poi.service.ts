import { Logger, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Connection, DataProvider, POI } from './schemas';
import { UpsertPOIDto } from './dto';

@Injectable()
export class POIService {
  private logger = new Logger(POIService.name);

  constructor(
    @InjectModel(POI.name) private poiModel: Model<POI>,
    @InjectModel(DataProvider.name)
    private dataProviderModel: Model<DataProvider>,
    @InjectModel(Connection.name)
    private connectionModel: Model<Connection>,
  ) {}

  public async upsert(dto: UpsertPOIDto): Promise<any> {
    const { dataProvider, connections, ...poiDto } = dto;

    const dataProviderModel = await this.upsertDataProvider(dataProvider);
    const connectionModels = await this.upsertConnections(connections);

    const result = await this.poiModel.updateOne(
      { externalId: dto.externalId },
      {
        ...poiDto,
        $set: {
          dataProvider: dataProviderModel,
          connections: connectionModels,
        },
      },
      { upsert: true },
    );

    // TODO: based on result (modified/upserted count) send poiCreated or poiUpdated events
    return result;
  }

  private upsertDataProvider = (
    dto: UpsertPOIDto['dataProvider'],
  ): Promise<DataProvider> =>
    this.dataProviderModel.findOneAndUpdate(
      { externalId: dto.externalId },
      dto,
      { upsert: true },
    );

  private upsertConnections = (
    dtos: UpsertPOIDto['connections'],
  ): Promise<Connection[]> =>
    Promise.all(
      dtos.map((connectionDto) =>
        this.connectionModel.findOneAndUpdate(
          { externalId: connectionDto.externalId },
          connectionDto,
          { upsert: true },
        ),
      ),
    );
}
