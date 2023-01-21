import { User } from '@/domain/user';

import { TokenManager } from '../token-manager';

describe('Token Manager', () => {
  it('should throw error when invoke abstract method', async () => {
    const now = new Date();
    const user = new User(
      '1',
      'some.email@gmail.com',
      'encryptedPassword',
      'EMAIL',
      now,
      now,
    );

    const tokenManager = new TokenManager();

    await expect(tokenManager.createAccessToken(user)).rejects.toThrow(
      'METHOD_NOT_IMPLEMENTED',
    );

    await expect(tokenManager.createRefreshToken(user)).rejects.toThrow(
      'METHOD_NOT_IMPLEMENTED',
    );

    await expect(
      tokenManager.verifyAccessToken('some.access.token'),
    ).rejects.toThrow('METHOD_NOT_IMPLEMENTED');

    await expect(
      tokenManager.verifyRefreshToken('some.refresh.token'),
    ).rejects.toThrow('METHOD_NOT_IMPLEMENTED');
  });
});
