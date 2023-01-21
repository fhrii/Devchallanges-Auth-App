import { UserRepository } from '@/domain/user';

export class GetUserByIdOrThrowUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string) {
    return this.userRepository.getByIdOrThrow(id);
  }
}
