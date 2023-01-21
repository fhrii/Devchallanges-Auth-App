import { UserRepository } from '@/domain/user';

export class GetUserByEmailOrThrowUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string) {
    return this.userRepository.getByEmailOrThrow(email);
  }
}
