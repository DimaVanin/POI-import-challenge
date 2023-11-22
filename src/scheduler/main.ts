import { ValidationPipe } from '@nestjs/common';

import { NestFactory } from '@nestjs/core';
import { SchedulerModule } from './scheduler.module';
import { PORT } from '../common/config';

async function bootstrap() {
  const app = await NestFactory.create(SchedulerModule, {
    cors: true,
    bufferLogs: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(PORT);

  return app;
}

bootstrap();
