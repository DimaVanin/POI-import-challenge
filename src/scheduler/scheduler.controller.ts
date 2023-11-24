import { Cron, CronExpression } from '@nestjs/schedule';
import { Logger, Controller } from '@nestjs/common';

import { MessagesQueueService } from '../common/modules/messages-queue/messages-queue.service';
import { POI_IMPORT_QUEUE_NAME } from '../common/constants';
import { ImportJobParameters } from '../common/types';

// Mode config to env values or database, etc;
const configs: Omit<ImportJobParameters, 'iterationStep'>[] = [
  {
    lat1: 50,
    lng1: 25,
    lat2: 40,
    lng2: 10,
  },
  {
    lat1: 60,
    lng1: -130,
    lat2: 30,
    lng2: -75,
  },
];

@Controller()
export class SchedulerController {
  private logger = new Logger(SchedulerController.name);

  constructor(private readonly messagesQueueService: MessagesQueueService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncWorkingLogsCron() {
    try {
      // TODO: get configs from chosen source
      // TODO: move this logic to service, controller is responsible for routing only
      await Promise.all(
        configs.map(async (parameters) => {
          const jobId =
            await this.messagesQueueService.addJob<ImportJobParameters>(
              POI_IMPORT_QUEUE_NAME,
              { ...parameters, iterationStep: 0 },
            );

          this.logger.log('New job created', { jobId });
        }),
      );
    } catch (error) {
      this.logger.error(error, 'Failed to schedule import jobs');
    }
  }
}
