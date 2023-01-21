import { mock } from 'jest-mock-extended';

import { User, UserRepository } from '@/domain/user';

import { GetUserByIdOrThrowUsecase } from '../get-user-by-id-or-throw.usecase';

describe('Get User By Id Or Throw Usecase', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should orchestrating the get user by id action correctly', async () => {
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
    userRepositoryMock.getByIdOrThrow.mockResolvedValue(expectedUser);

    const getUserByIdOrThrowUsecase = new GetUserByIdOrThrowUsecase(
      userRepositoryMock,
    );
    const user = await getUserByIdOrThrowUsecase.execute('1');

    expect(user).toStrictEqual(expectedUser);
    expect(userRepositoryMock.getByIdOrThrow).toHaveBeenCalledWith('1');
  });
});
