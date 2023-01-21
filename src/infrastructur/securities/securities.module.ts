import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PasswordManager, TokenManager } from '@/application/securities';

import { ConfigModule } from '../config';
import { AppConfig } from '../config/app';
import { PasswordManagerImpl } from './password-manager';
import { TokenManagerImpl } from './token-manager';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      secret: 'a',
    }),
  ],
  providers: [
    {
      provide: PasswordManager,
      useFactory: () => new PasswordManagerImpl(bcrypt),
    },
    {
      provide: TokenManager,
      inject: [JwtService, AppConfig],
      useFactory: (jwtService: JwtService, appConfig: AppConfig) =>
        new TokenManagerImpl(jwtService, appConfig),
    },
  ],
  exports: [PasswordManager, TokenManager],
})
export class SecuritiesModule {}
