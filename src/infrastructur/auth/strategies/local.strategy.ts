import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { LoginUsecase } from '@/application/usecases/auth';
import {
  UsecaseProxy,
  UsecaseProxyModule,
} from '@/infrastructur/usecase-proxy';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(UsecaseProxyModule.LoginUsecaseProxy)
    private readonly loginUsecaseProxy: UsecaseProxy<LoginUsecase>,
  ) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string) {
    return this.loginUsecaseProxy.getInstance().execute(email, password);
  }
}
