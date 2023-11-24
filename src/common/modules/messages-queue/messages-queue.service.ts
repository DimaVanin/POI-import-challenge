import { Logger, Injectable } from '@nestjs/common';
import { Job, Queue, QueueOptions, Worker } from 'bullmq';
import Redis from 'ioredis';

import { REDIS_URL } from '../../../common/config';
import {
  EVENTS_STREAM_MAX_LENGTH,
  MESSAGE_RETRY_ATTEMPTS,
  MESSAGE_RETRY_DELAY,
  WORKER_CONCURRENCY,
} from './constants';

@Injectable()
export class MessagesQueueService {
  private logger = new Logger(MessagesQueueService.name);

  private queueOptions: QueueOptions = {
    connection: new Redis(REDIS_URL, { maxRetriesPerRequest: null }),
    defaultJobOptions: {
      attempts: MESSAGE_RETRY_ATTEMPTS,
      backoff: {
        type: 'fixed',
        delay: MESSAGE_RETRY_DELAY,
      },
    },
    streams: {
      events: {
        maxLen: EVENTS_STREAM_MAX_LENGTH,
      },
    },
  };

  private workerOptions = {
    connection: new Redis(REDIS_URL, { maxRetriesPerRequest: null }),
    sharedConnection: true,
    concurrency: WORKER_CONCURRENCY,
  };

  private queues = new Map<string, Queue>();
  private workers = new Set<Worker>();

  public getQueue(name: string): Queue {
    if (!this.queues.has(name)) {
      this.setupQueue(name);
    }

    return this.queues.get(name);
  }

  public async addJob<T>(name: string, data: T): Promise<string> {
    const queue = this.getQueue(name);

    const job = await queue.add(name, data);

    this.logger.log({ jobId: job.id, data }, 'New job added');

    return job.id;
  }

  public getAllQueuesMap(): Queue[] {
    return [...this.queues.values()];
  }

  private setupQueue(name: string): void {
    const queue = new Queue(name, this.queueOptions);

    queue.on('error', (error: Error) => {
      this.logger.error(error, 'Queue error');
    });

    this.queues.set(name, queue);

    this.logger.debug({ name }, 'New queue is setup');
  }

  public subscribe<T, R>(
    name: string,
    handler: (data: T) => Promise<R>,
  ): () => void {
    const worker = new Worker(
      name,
      async (job: Job<T>) => {
        this.logger.debug({ name, jobId: job.id }, 'Job handled');

        try {
          const result = await handler(job.data);

          return result;
        } catch (error) {
          this.logger.error(
            {
              message: error.message,
              stack: error.stack,
              jobId: job.id,
              name,
            },
            'Failed to complete job',
          );

          throw error;
        }
      },
      this.workerOptions,
    );

    worker.on('error', (error: Error) => {
      this.logger.error(error, 'Worker error');
    });

    this.workers.add(worker);

    return () => {
      worker.disconnect();
      this.workers.delete(worker);
    };
  }
}
