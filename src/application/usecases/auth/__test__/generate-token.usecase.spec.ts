import { mock } from 'jest-mock-extended';

import { User } from '@/domain/user';
import { UsecaseProxy } from '@/infrastructur/usecase-proxy';

import { GenerateAccessTokenUsecase } from '../generate-access-token.usecase';
import { GenerateRefreshTokenUsecase } from '../generate-refresh-token.usecase';
import { GenerateTokenUsecase } from '../generate-token.usecase';

describe('Generate Token Usecase', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should orchestrating the generate token action correctly', async () => {
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
    const expectedRefreshToken = 'some.refresh.token';

    const generateAccessTokenUsecaseMock = mock<GenerateAccessTokenUsecase>();
    const generateRefreshTokenUsecaseMock = mock<GenerateRefreshTokenUsecase>();
    const generateAccessTokenUsecaseProxyMock =
      mock<UsecaseProxy<GenerateAccessTokenUsecase>>();
    const generateRefreshTokenUsecaseProxyMock =
      mock<UsecaseProxy<GenerateRefreshTokenUsecase>>();

    generateAccessTokenUsecaseMock.execute.mockResolvedValue(
      expectedAccessToken,
    );
    generateRefreshTokenUsecaseMock.execute.mockResolvedValue(
      expectedRefreshToken,
    );
    generateAccessTokenUsecaseProxyMock.getInstance.mockReturnValue(
      generateAccessTokenUsecaseMock,
    );
    generateRefreshTokenUsecaseProxyMock.getInstance.mockReturnValue(
      generateRefreshTokenUsecaseMock,
    );

    const generateTokenUsecase = new GenerateTokenUsecase(
      generateAccessTokenUsecaseProxyMock,
      generateRefreshTokenUsecaseProxyMock,
    );

    const { accessToken, refreshToken } = await generateTokenUsecase.execute(
      user,
    );

    expect(accessToken).toBe(expectedAccessToken);
    expect(refreshToken).toBe(expectedRefreshToken);
    expect(generateAccessTokenUsecaseMock.execute).toHaveBeenCalledWith(user);
    expect(generateRefreshTokenUsecaseMock.execute).toHaveBeenCalledWith(user);
    expect(generateAccessTokenUsecaseProxyMock.getInstance).toHaveBeenCalled();
    expect(generateRefreshTokenUsecaseProxyMock.getInstance).toHaveBeenCalled();
  });
});
