import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AppConfig, ConfigModule } from '../config';
import { UsecaseProxyModule } from '../usecase-proxy';
import { JwtCookieStrategy, JwtStrategy, LocalStrategy } from './strategies';

@Module({
  imports: [ConfigModule, UsecaseProxyModule, PassportModule],
  providers: [AppConfig, JwtStrategy, JwtCookieStrategy, LocalStrategy],
})
export class AuthModule {}
