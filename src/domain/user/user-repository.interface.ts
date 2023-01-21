import { User } from './entities';
import { UserProvider } from './types';

export interface UserRepository {
  getByIdOrThrow: (id: string) => Promise<User>;
  getByEmail: (email: string) => Promise<User>;
  getByEmailOrThrow: (email: string) => Promise<User>;
  getPasswordByEmail: (email: string) => Promise<string>;
  create: (
    email: string,
    password: string,
    provider: UserProvider,
  ) => Promise<User>;
}
