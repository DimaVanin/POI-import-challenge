import { Controller, Logger } from '@nestjs/common';

import { POI_IMPORT_QUEUE_NAME } from '../../../common/constants';
import { MessagesQueueService } from '../../../common/modules/messages-queue/messages-queue.service';
import { ImportJobHandler } from './import-job.handler';

@Controller()
export class ImportController {
  private logger = new Logger(ImportController.name);

  private subscription: () => void;

  constructor(
    private readonly importJobHandler: ImportJobHandler,
    private readonly messagesQueueService: MessagesQueueService,
  ) {}

  async onApplicationBootstrap() {
    this.subscription = this.messagesQueueService.subscribe<any>(
      POI_IMPORT_QUEUE_NAME,
      async (data: any) => this.importJobHandler.handle(data),
    );

    this.logger.log('Jobs subscription initiated');
  }

  async onApplicationShutdown() {
    return this.subscription?.();
  }
}
