import { Profile } from './entities';

export interface ProfileRepository {
  getByUserId: (id: string) => Promise<Profile>;
  getByUserIdOrThrow: (id: string) => Promise<Profile>;
  update: (
    userId: string,
    name?: string,
    bio?: string,
    phone?: string,
    photo?: string,
  ) => Promise<Profile>;
}
