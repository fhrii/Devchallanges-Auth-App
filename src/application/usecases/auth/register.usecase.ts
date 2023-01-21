import { PasswordManager, TokenManager } from '@/application/securities';
import { UsecaseProxy } from '@/infrastructur/usecase-proxy';

import { CreateUserUsecase } from '../user';

export class RegisterUsecase {
  constructor(
    private readonly tokenManager: TokenManager,
    private readonly passwordManager: PasswordManager,
    private readonly createUserUsecaseProxy: UsecaseProxy<CreateUserUsecase>,
  ) {}

  async execute(email: string, password: string) {
    const hashedPassword = await this.passwordManager.hash(password);
    const user = await this.createUserUsecaseProxy
      .getInstance()
      .execute(email, hashedPassword, 'EMAIL');
    const accessToken = await this.tokenManager.createAccessToken(user);
    const refreshToken = await this.tokenManager.createRefreshToken(user);

    return { accessToken, refreshToken };
  }
}
