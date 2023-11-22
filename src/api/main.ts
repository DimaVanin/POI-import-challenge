import { ValidationPipe } from '@nestjs/common';

import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { PORT } from '../common/config';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule, {
    cors: true,
    bufferLogs: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(PORT);

  return app;
}

bootstrap();
