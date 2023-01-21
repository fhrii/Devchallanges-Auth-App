import { mock } from 'jest-mock-extended';

import { User, UserRepository } from '@/domain/user';

import { CreateUserUsecase } from '../create-user.usecase';

describe('Create User Usecase', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should orchestrating the create user action correctly', async () => {
    const now = new Date();
    const expectedUser = new User(
      '1',
      'some.email@gmail.com',
      'someencryaptedpassword',
      'EMAIL',
      now,
      now,
    );

    const userRepositoryMock = mock<UserRepository>();
    userRepositoryMock.create.mockResolvedValue(expectedUser);

    const createUserUsecase = new CreateUserUsecase(userRepositoryMock);
    const user = await createUserUsecase.execute(
      'some.email@gmail.com',
      'someencryptedpassword',
      'EMAIL',
    );

    expect(user).toStrictEqual(expectedUser);
    expect(userRepositoryMock.create).toHaveBeenCalledWith(
      'some.email@gmail.com',
      'someencryptedpassword',
      'EMAIL',
    );
  });
});
