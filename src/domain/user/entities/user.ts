import { Profile } from '@/domain/profile';

import { UserProvider } from '../types';

export class User {
  readonly id: string;
  readonly email: string;
  readonly password: string;
  readonly provider: UserProvider;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly profile?: Profile;

  constructor(
    id: string,
    email: string,
    password: string,
    provider: UserProvider,
    createdAt: Date,
    updatedAt: Date,
    profile?: Profile,
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.provider = provider;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.profile = profile;
  }
}
