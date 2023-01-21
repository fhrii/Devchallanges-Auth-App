import { PasswordManager } from '@/application/securities';
import { UserRepository } from '@/domain/user';
import { UsecaseProxy } from '@/infrastructur/usecase-proxy';

import { GetUserByEmailOrThrowUsecase } from '../user';

export class LoginUsecase {
  constructor(
    private readonly passwordManager: PasswordManager,
    private readonly userRepository: UserRepository,
    private readonly getUserByEmailOrThrowUsecaseProxy: UsecaseProxy<GetUserByEmailOrThrowUsecase>,
  ) {}

  async execute(email: string, password: string) {
    const encryptedPassword = await this.userRepository.getPasswordByEmail(
      email,
    );

    await this.passwordManager.compare(password, encryptedPassword);

    return this.getUserByEmailOrThrowUsecaseProxy.getInstance().execute(email);
  }
}
