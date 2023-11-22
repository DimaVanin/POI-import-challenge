import { Module } from '@nestjs/common';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';
import { MessagesQueueModule } from '../../../common/modules/messages-queue/messages-queue.module';

@Module({
  imports: [MessagesQueueModule],
  controllers: [ImportController],
  providers: [ImportService],
})
export class ImportModule {}
