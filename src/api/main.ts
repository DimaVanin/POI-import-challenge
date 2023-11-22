import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

import { ApiModule } from './api.module';
import { PORT } from '../common/config';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule, {
    cors: true,
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(PORT);

  return app;
}

bootstrap();
