import { Exclude } from 'class-transformer';

import { Profile } from '@/domain/profile';

export class ProfilePresenter {
  readonly id: string;

  @Exclude()
  readonly userId: string;

  readonly name?: string;
  readonly bio?: string;
  readonly phone?: string;
  readonly photo?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(profile: Profile) {
    Object.assign(this, profile);
  }
}
