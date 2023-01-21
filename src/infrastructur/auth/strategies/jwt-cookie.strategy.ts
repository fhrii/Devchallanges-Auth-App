import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

import { TokenPayload } from '@/application/securities';
import { GetUserByIdOrThrowUsecase } from '@/application/usecases/user';
import { AppConfig } from '@/infrastructur/config';
import {
  UsecaseProxy,
  UsecaseProxyModule,
} from '@/infrastructur/usecase-proxy';

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(Strategy, 'jwtCookie') {
  constructor(
    @Inject(UsecaseProxyModule.GetUserByIdOrThrowUsecaseProxy)
    private readonly getUserByIdOrThrowUsecaseProxy: UsecaseProxy<GetUserByIdOrThrowUsecase>,
    appConfig: AppConfig,
  ) {
    super({
      jwtFromRequest: (request: Request) =>
        request &&
        request.cookies &&
        (request.cookies as Record<string, unknown>)[
          appConfig.REFRESH_TOKEN_COOKIE
        ],
      ignoreExpiration: false,
      secretOrKey: appConfig.REFRESH_TOKEN_SECRET,
    });
  }

  async validate(payload: TokenPayload) {
    return this.getUserByIdOrThrowUsecaseProxy
      .getInstance()
      .execute(payload.id);
  }
}
