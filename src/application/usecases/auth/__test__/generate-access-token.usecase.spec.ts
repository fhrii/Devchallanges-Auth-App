import { mock } from 'jest-mock-extended';

import { TokenManager } from '@/application/securities';
import { User } from '@/domain/user';

import { GenerateAccessTokenUsecase } from '../generate-access-token.usecase';

describe('Generate Access Token Usecase', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should orchestrating the generate access token action correctly', async () => {
    const now = new Date();
    const user = new User(
      '1',
      'some.email@gmail.com',
      'encryptedPassword',
      'EMAIL',
      now,
      now,
    );
    const expectedAccessToken = 'some.access.token';

    const tokenManagerMock = mock<TokenManager>();
    const generateAccessTokenUsecase = new GenerateAccessTokenUsecase(
      tokenManagerMock,
    );

    tokenManagerMock.createAccessToken.mockResolvedValue(expectedAccessToken);

    const accessToken = await generateAccessTokenUsecase.execute(user);

    expect(accessToken).toBe(expectedAccessToken);
    expect(tokenManagerMock.createAccessToken).toHaveBeenCalledWith(user);
  });
});
