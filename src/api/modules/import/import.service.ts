import { Logger, Injectable } from '@nestjs/common';

import { ImportJobParameters } from '../../../common/types';
import { MessagesQueueService } from '../../../common/modules/messages-queue/messages-queue.service';
import { POI_IMPORT_QUEUE_NAME } from '../../../common/constants';

@Injectable()
export class ImportService {
  private logger = new Logger(ImportService.name);

  constructor(private readonly messagesQueueService: MessagesQueueService) {}

  public async addJob(
    parameters: Omit<ImportJobParameters, 'iterationStep'>,
  ): Promise<string> {
    const jobId = await this.messagesQueueService.addJob<ImportJobParameters>(
      POI_IMPORT_QUEUE_NAME,
      { ...parameters, iterationStep: 0 },
    );

    return jobId;
  }
}
