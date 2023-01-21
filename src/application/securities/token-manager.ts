/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from '@/domain/user';

export class TokenManager {
  async createAccessToken(payload: User): Promise<string> {
    throw new Error('TOKEN_MANAGER.CREATE_ACCESS_TOKEN.METHOD_NOT_IMPLEMENTED');
  }

  async createRefreshToken(payload: User): Promise<string> {
    throw new Error(
      'TOKEN_MANAGER.CREATE_REFRESH_TOKEN.METHOD_NOT_IMPLEMENTED',
    );
  }

  async verifyAccessToken(token: string): Promise<void> {
    throw new Error('TOKEN_MANAGER.VERIFY_ACCESS_TOKEN.METHOD_NOT_IMPLEMENTED');
  }

  async verifyRefreshToken(token: string): Promise<void> {
    throw new Error(
      'TOKEN_MANAGER.VERIFY_REFRESH_TOKEN.METHOD_NOT_IMPLEMENTED',
    );
  }
}
