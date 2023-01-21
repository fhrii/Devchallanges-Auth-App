import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppConfig } from '../config/app';
import { DatabaseService } from '../database';
import { AppModule } from './app.module';

export async function createServer() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(AppConfig);
  const databaseService = app.get(DatabaseService);

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, stopAtFirstError: true }),
  );

  await app.listen(appConfig.PORT);
  await databaseService.enableShutdownHooks(app);

  return app;
}
