import { ProfileRepository } from '@/domain/profile';

export class GetProfileByUserIdUsecase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(userId: string) {
    return this.profileRepository.getByUserId(userId);
  }
}
