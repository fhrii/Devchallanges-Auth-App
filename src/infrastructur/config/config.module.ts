import { Module } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigService,
} from '@nestjs/config';
import * as Joi from 'joi';

import { AppConfig } from './app';

@Module({
  imports: [
    NestConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test'),
        PORT: Joi.number().default(4999),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_COOKIE: Joi.string().required(),
      }),
    }),
  ],
  providers: [AppConfig, ConfigService],
  exports: [AppConfig, ConfigService],
})
export class ConfigModule {}
