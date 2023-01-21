import { User } from '@/domain/user';
import { UsecaseProxy } from '@/infrastructur/usecase-proxy';

import { GenerateAccessTokenUsecase } from './generate-access-token.usecase';
import { GenerateRefreshTokenUsecase } from './generate-refresh-token.usecase';
import { AuthToken } from './types';

export class GenerateTokenUsecase {
  constructor(
    private readonly generateAccessTokenUsecaseProxy: UsecaseProxy<GenerateAccessTokenUsecase>,
    private readonly generateRefreshTokenUsecaseProxy: UsecaseProxy<GenerateRefreshTokenUsecase>,
  ) {}

  async execute(user: User): Promise<AuthToken> {
    const accessToken = await this.generateAccessTokenUsecaseProxy
      .getInstance()
      .execute(user);
    const refreshToken = await this.generateRefreshTokenUsecaseProxy
      .getInstance()
      .execute(user);

    return { accessToken, refreshToken };
  }
}
