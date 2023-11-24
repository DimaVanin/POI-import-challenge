import { Logger, Injectable } from '@nestjs/common';

import { ImportJobParameters, ImportJobResult } from '../../../common/types';
import { MessagesQueueService } from '../../../common/modules/messages-queue/messages-queue.service';
import { POI_IMPORT_QUEUE_NAME } from '../../../common/constants';
import { POIService } from '../../../common/modules/poi/poi.service';
import { OpenChargeMapService } from '../open-charge-map/open-charge-map.service';
import { POIItemResponse } from '../open-charge-map/types';
import { UpsertPOIDto } from 's../../../src/common/modules/poi/dto';

@Injectable()
export class ImportJobHandler {
  private logger = new Logger(ImportJobHandler.name);

  constructor(
    private readonly openChargeMapService: OpenChargeMapService,
    private readonly messagesQueueService: MessagesQueueService,
    private readonly poiService: POIService,
  ) {}

  public async handle(
    parameters: ImportJobParameters,
  ): Promise<ImportJobResult> {
    this.logger.log({ parameters }, 'Import POI job handled');

    const { hasMore, data } = await this.openChargeMapService.list(parameters);

    if (hasMore) {
      this.logger.debug(
        'Current bounding box has more POI. Creating new jobs...',
      );

      return this.onHasMore(parameters);
    }

    this.logger.log(
      {
        iterationStep: parameters.iterationStep,
        resultCount: data.length,
      },
      'Got final step',
    );

    await Promise.all(
      data.map((item) =>
        this.poiService.upsert(this.mapPoiResponseToPoiDto(item)),
      ),
    );

    return { isFinal: true };
  }

  private async onHasMore(
    parameters: ImportJobParameters,
  ): Promise<ImportJobResult> {
    await Promise.all(
      [
        {
          lat1: parameters.lat1,
          lng1: parameters.lng1,
          lat2: (parameters.lat2 + parameters.lat1) / 2,
          lng2: (parameters.lng1 + parameters.lng2) / 2,
        },
        {
          lat1: parameters.lat1,
          lng1: (parameters.lng1 + parameters.lng2) / 2,
          lat2: (parameters.lat2 + parameters.lat1) / 2,
          lng2: parameters.lng2,
        },
        {
          lat1: (parameters.lat2 + parameters.lat1) / 2,
          lng1: parameters.lng1,
          lat2: parameters.lat2,
          lng2: (parameters.lng1 + parameters.lng2) / 2,
        },
        {
          lat1: (parameters.lat2 + parameters.lat1) / 2,
          lng1: (parameters.lng1 + parameters.lng2) / 2,
          lat2: parameters.lat2,
          lng2: parameters.lng2,
        },
      ].map(({ lat1, lng1, lat2, lng2 }) =>
        this.messagesQueueService.addJob<ImportJobParameters>(
          POI_IMPORT_QUEUE_NAME,
          {
            ...parameters,
            lat1,
            lng1,
            lat2,
            lng2,
            iterationStep: parameters.iterationStep + 1,
          },
        ),
      ),
    );

    return { isFinal: false };
  }

  private mapPoiResponseToPoiDto = (
    poiItem: POIItemResponse,
  ): UpsertPOIDto => ({
    externalId: poiItem.id,
    dateCreated: poiItem.dateCreated,
    numberOfPoints: poiItem.numberOfPoints,
    addressInfo: {
      externalId: poiItem.addressInfo.id,
      latitude: poiItem.addressInfo.latitude,
      longitude: poiItem.addressInfo.longitude,
      countryId: poiItem.addressInfo.countryID,
      title: poiItem.addressInfo.title,
    },
    dataProvider: {
      externalId: poiItem.dataProvider.id,
      title: poiItem.dataProvider.title,
      websiteURL: poiItem.dataProvider.websiteURL,
      isApprovedImport: poiItem.dataProvider.isApprovedImport,
    },
    connections: poiItem.connections.map((connection) => ({
      externalId: connection.id,
      quantity: connection.quantity,
      currentTypeId: connection.currentTypeID,
      powerKW: connection.powerKW,
      amps: connection.amps,
      voltage: connection.voltage,
      statusTypeId: connection.statusTypeID,
      connectionTypeId: connection.connectionTypeID,
    })),
  });
}
