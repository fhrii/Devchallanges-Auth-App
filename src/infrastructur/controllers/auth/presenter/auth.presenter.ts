import { Exclude } from 'class-transformer';

import { AuthToken } from '@/application/usecases/auth';

export class AuthPresenter {
  readonly accessToken: string;

  @Exclude() readonly refreshToken: string;

  constructor(authToken: AuthToken) {
    Object.assign(this, authToken);
  }
}
