import { UserRepository } from '@/domain/user';

export class GetUserByEmailUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string) {
    return this.userRepository.getByEmail(email);
  }
}
