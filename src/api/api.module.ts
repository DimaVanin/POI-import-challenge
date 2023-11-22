import { Module } from '@nestjs/common';
import { ImportModule } from './modules/import/import.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [ImportModule, HealthModule],
})
export class ApiModule {}
