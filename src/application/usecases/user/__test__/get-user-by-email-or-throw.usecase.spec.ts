import { mock } from 'jest-mock-extended';

import { User, UserRepository } from '@/domain/user';

import { GetUserByEmailOrThrowUsecase } from '../get-user-by-email-or-throw.usecase';

describe('Get User By Email Or Throw Usecase', () => {
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
    userRepositoryMock.getByEmailOrThrow.mockResolvedValue(expectedUser);

    const getUserByEmailOrThrowUsecase = new GetUserByEmailOrThrowUsecase(
      userRepositoryMock,
    );
    const user = await getUserByEmailOrThrowUsecase.execute(
      'some.email@gmail.com',
    );

    expect(user).toStrictEqual(expectedUser);
    expect(userRepositoryMock.getByEmailOrThrow).toHaveBeenCalledWith(
      'some.email@gmail.com',
    );
  });
});
