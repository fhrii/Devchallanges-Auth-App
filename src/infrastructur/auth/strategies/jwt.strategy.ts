import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenPayload } from '@/application/securities';
import { GetUserByIdOrThrowUsecase } from '@/application/usecases/user';
import { AppConfig } from '@/infrastructur/config';
import {
  UsecaseProxy,
  UsecaseProxyModule,
} from '@/infrastructur/usecase-proxy';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(UsecaseProxyModule.GetUserByIdOrThrowUsecaseProxy)
    private readonly getUserByIdOrThrowUsecaseProxy: UsecaseProxy<GetUserByIdOrThrowUsecase>,
    appConfig: AppConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: TokenPayload) {
    return this.getUserByIdOrThrowUsecaseProxy
      .getInstance()
      .execute(payload.id);
  }
}
