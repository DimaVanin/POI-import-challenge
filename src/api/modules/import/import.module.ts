import { Module } from '@nestjs/common';
import { ImportController } from './import.controller';

@Module({
  imports: [],
  controllers: [ImportController],
  providers: [],
})
export class ImportModule {}
