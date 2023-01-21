import { ProfileRepository } from '@/domain/profile';

export class UpdateProfileByUserIdUsecase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(
    userId: string,
    name?: string,
    bio?: string,
    phone?: string,
    photo?: string,
  ) {
    return this.profileRepository.update(userId, name, bio, phone, photo);
  }
}
