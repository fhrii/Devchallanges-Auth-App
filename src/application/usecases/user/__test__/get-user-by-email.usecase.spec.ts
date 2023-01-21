import { mock } from 'jest-mock-extended';

import { User, UserRepository } from '@/domain/user';

import { GetUserByEmailUsecase } from '../get-user-by-email.usecase';

describe('Get User By Email Usecase', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should orchestrating the get user by email action correctly', async () => {
    const now = new Date();
    const expectedUser = new User(
      '1',
      'some.email@gmail.com',
      'someencryptedpassword',
      'EMAIL',
      now,
      now,
    );

    const userRepositoryMock = mock<UserRepository>();
    userRepositoryMock.getByEmail.mockResolvedValue(expectedUser);

    const getUserByEmailUsecase = new GetUserByEmailUsecase(userRepositoryMock);
    const user = await getUserByEmailUsecase.execute('some.email@gmail.com');

    expect(user).toStrictEqual(expectedUser);
    expect(userRepositoryMock.getByEmail).toHaveBeenCalledWith(
      'some.email@gmail.com',
    );
  });

  it('should orchestrating the get user by email action correctly when user not found', async () => {
    const userRepositoryMock = mock<UserRepository>();
    userRepositoryMock.getByEmail.mockResolvedValue(null);

    const getUserByEmailUsecase = new GetUserByEmailUsecase(userRepositoryMock);
    const user = await getUserByEmailUsecase.execute('some.email@gmail.com');

    expect(user).toBeNull();
    expect(userRepositoryMock.getByEmail).toHaveBeenCalledWith(
      'some.email@gmail.com',
    );
  });
});
