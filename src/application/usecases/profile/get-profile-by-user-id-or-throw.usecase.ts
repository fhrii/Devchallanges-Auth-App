import { ProfileRepository } from '@/domain/profile';

export class GetProfileByUserIdOrThrowUsecase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(userId: string) {
    return this.profileRepository.getByUserIdOrThrow(userId);
  }
}
