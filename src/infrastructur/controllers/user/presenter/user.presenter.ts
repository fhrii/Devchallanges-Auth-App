import { Exclude } from 'class-transformer';

import { User, UserProvider } from '@/domain/user';

import { ProfilePresenter } from '../../profile';

export class UserPresenter {
  readonly id: string;
  readonly email: string;

  @Exclude()
  readonly password: string;

  @Exclude()
  readonly provider: UserProvider;

  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly profile?: ProfilePresenter;

  constructor(user: User) {
    Object.assign(this, user);

    if (user.profile) this.profile = new ProfilePresenter(user.profile);
  }
}
