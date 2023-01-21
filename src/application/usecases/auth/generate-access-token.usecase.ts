import { TokenManager } from '@/application/securities';
import { User } from '@/domain/user';

export class GenerateAccessTokenUsecase {
  constructor(private readonly tokenManager: TokenManager) {}

  async execute(user: User) {
    return this.tokenManager.createAccessToken(user);
  }
}
