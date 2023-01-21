import { UserProvider, UserRepository } from '@/domain/user';

export class CreateUserUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string, password: string, provider: UserProvider) {
    return this.userRepository.create(email, password, provider);
  }
}
