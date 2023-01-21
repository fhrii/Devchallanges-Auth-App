import { Module } from '@nestjs/common';

import { AppConfig, ConfigModule } from '../config';
import { UsecaseProxyModule } from '../usecase-proxy';
import { UtilitiesModule } from '../utilities';
import { AuthController } from './auth';
import { ImageController } from './image';
import { UserController } from './user';

@Module({
  imports: [ConfigModule, UsecaseProxyModule, UtilitiesModule],
  providers: [AppConfig],
  controllers: [AuthController, ImageController, UserController],
})
export class ControllersModule {}
