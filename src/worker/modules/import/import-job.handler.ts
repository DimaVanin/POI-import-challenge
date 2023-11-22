import { Logger, Injectable } from '@nestjs/common';
import { ImportJobParameters } from '../../../common/types';
import { OpenChargeMapService } from '../open-charge-map/open-charge-map.service';
import { MessagesQueueService } from '../../../common/modules/messages-queue/messages-queue.service';
import { POI_IMPORT_QUEUE_NAME } from '../../../common/constants';

@Injectable()
export class ImportJobHandler {
  private logger = new Logger(ImportJobHandler.name);

  constructor(
    private readonly openChargeMapService: OpenChargeMapService,
    private readonly messagesQueueService: MessagesQueueService,
  ) {}

  public async handle(parameters: ImportJobParameters) {
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
  }

  private async onHasMore(parameters: ImportJobParameters): Promise<void> {
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
  }
}
