import { Module } from '@nestjs/common';
import { MessagesQueueService } from './messages-queue.service';

@Module({
  imports: [],
  controllers: [],
  providers: [MessagesQueueService],
  exports: [MessagesQueueService],
})
export class MessagesQueueModule {}
