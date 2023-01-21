import { TokenManager } from '@/application/securities';
import { User } from '@/domain/user';

export class GenerateRefreshTokenUsecase {
  constructor(private readonly tokenManager: TokenManager) {}

  async execute(user: User) {
    return this.tokenManager.createRefreshToken(user);
  }
}
