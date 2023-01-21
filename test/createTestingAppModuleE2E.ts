import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';

import { DatabaseService } from '@/infrastructur/database';
import { AppModule } from '@/infrastructur/http';

export const createTestingAppModuleE2E = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  const databaseService = app.get(DatabaseService);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  await databaseService.enableShutdownHooks(app);

  return app;
};
