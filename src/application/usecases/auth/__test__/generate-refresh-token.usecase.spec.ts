import { mock } from 'jest-mock-extended';

import { TokenManager } from '@/application/securities';
import { User } from '@/domain/user';

import { GenerateRefreshTokenUsecase } from '../generate-refresh-token.usecase';

describe('Generate Refresh Token Usecase', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should orchestrating the generate refresh token action correctly', async () => {
    const now = new Date();
    const user = new User(
      '1',
      'some.email@gmail.com',
      'encryptedPassword',
      'EMAIL',
      now,
      now,
    );
    const expectedRefreshToken = 'some.refresh.token';

    const tokenManagerMock = mock<TokenManager>();
    const generateRefreshTokenUsecase = new GenerateRefreshTokenUsecase(
      tokenManagerMock,
    );

    tokenManagerMock.createRefreshToken.mockResolvedValue(expectedRefreshToken);

    const accessToken = await generateRefreshTokenUsecase.execute(user);

    expect(accessToken).toBe(expectedRefreshToken);
    expect(tokenManagerMock.createRefreshToken).toHaveBeenCalledWith(user);
  });
});
