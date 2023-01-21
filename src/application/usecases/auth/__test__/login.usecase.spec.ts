import { mock } from 'jest-mock-extended';

import { PasswordManager } from '@/application/securities';
import { User, UserRepository } from '@/domain/user';
import { UsecaseProxy } from '@/infrastructur/usecase-proxy';

import { GetUserByEmailOrThrowUsecase } from '../../user';
import { LoginUsecase } from '../login.usecase';

describe('Login Usecase Proxy', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should orchestrating the login usecase correctly', async () => {
    const now = new Date();
    const expectedUser = new User(
      '1',
      'some-email@gmail.com',
      'encryptedPassword',
      'EMAIL',
      now,
      now,
    );

    const userRepository = mock<UserRepository>();
    const passwordManagerMock = mock<PasswordManager>();
    const getUserByEmailOrThrowUsecaseMock =
      mock<GetUserByEmailOrThrowUsecase>();
    const getUserByEmailOrThrowUsecaseProxyMock =
      mock<UsecaseProxy<GetUserByEmailOrThrowUsecase>>();
    const loginUsecase = new LoginUsecase(
      passwordManagerMock,
      userRepository,
      getUserByEmailOrThrowUsecaseProxyMock,
    );

    userRepository.getPasswordByEmail.mockResolvedValue('encryptedPassword');
    passwordManagerMock.compare.mockResolvedValue();
    getUserByEmailOrThrowUsecaseMock.execute.mockResolvedValue(expectedUser);
    getUserByEmailOrThrowUsecaseProxyMock.getInstance.mockReturnValue(
      getUserByEmailOrThrowUsecaseMock,
    );

    const user = await loginUsecase.execute(
      'some-email@gmail.com',
      'somePassword',
    );

    expect(user).toStrictEqual(expectedUser);
    expect(userRepository.getPasswordByEmail).toHaveBeenCalledWith(
      'some-email@gmail.com',
    );
    expect(passwordManagerMock.compare).toHaveBeenCalledWith(
      'somePassword',
      'encryptedPassword',
    );
    expect(getUserByEmailOrThrowUsecaseMock.execute).toHaveBeenCalledWith(
      'some-email@gmail.com',
    );
  });
});
