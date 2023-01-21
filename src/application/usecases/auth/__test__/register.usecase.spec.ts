import { mock } from 'jest-mock-extended';

import { PasswordManager, TokenManager } from '@/application/securities';
import { User, UserRepository } from '@/domain/user';
import { UsecaseProxy } from '@/infrastructur/usecase-proxy';

import { CreateUserUsecase } from '../../user';
import { RegisterUsecase } from '../register.usecase';

describe('Register Usecase', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should orchestrating the register action correctly', async () => {
    const now = new Date();
    const user = new User(
      '1',
      'some.email@gmail.com',
      'encryptedPassword',
      'EMAIL',
      now,
      now,
    );
    const expectedEncryptedPassword = 'someEncryptedPassword';
    const expectedAccessToken = 'some.access.token';
    const expectedRefreshToken = 'some.refresh.token';

    const tokenManagerMock = mock<TokenManager>();
    const passwordManagerMock = mock<PasswordManager>();
    const userRepositoryMock = mock<UserRepository>();
    const createUserUsecase = new CreateUserUsecase(userRepositoryMock);
    const createUserUsecaseProxy = new UsecaseProxy(createUserUsecase);
    const registerUsecase = new RegisterUsecase(
      tokenManagerMock,
      passwordManagerMock,
      createUserUsecaseProxy,
    );

    tokenManagerMock.createAccessToken.mockResolvedValue(expectedAccessToken);
    tokenManagerMock.createRefreshToken.mockResolvedValue(expectedRefreshToken);
    passwordManagerMock.hash.mockResolvedValue(expectedEncryptedPassword);
    userRepositoryMock.create.mockResolvedValue(user);

    const { accessToken, refreshToken } = await registerUsecase.execute(
      'some.email@gmail.com',
      'somePassword',
    );

    expect(accessToken).toBe(expectedAccessToken);
    expect(refreshToken).toBe(expectedRefreshToken);
    expect(tokenManagerMock.createAccessToken).toHaveBeenCalledWith(user);
    expect(tokenManagerMock.createRefreshToken).toHaveBeenCalledWith(user);
    expect(passwordManagerMock.hash).toHaveBeenCalledWith('somePassword');
    expect(userRepositoryMock.create).toHaveBeenCalledWith(
      'some.email@gmail.com',
      'someEncryptedPassword',
      'EMAIL',
    );
  });
});
