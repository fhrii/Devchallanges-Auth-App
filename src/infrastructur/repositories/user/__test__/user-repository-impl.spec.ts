import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Prisma, User as UserEntity } from '@prisma/client';

import { User } from '@/domain/user';
import { DatabaseService } from '@/infrastructur/database';

import { UserRepositoryImpl } from '../user-repository-impl';

describe('User Repository Implementation', () => {
  let databaseService: DatabaseService;
  let userRepositoryImpl: UserRepositoryImpl;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [DatabaseService, UserRepositoryImpl],
    }).compile();

    databaseService = await moduleRef.resolve(DatabaseService);
    userRepositoryImpl = moduleRef.get<UserRepositoryImpl>(UserRepositoryImpl);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Get User By Id Or Throw Action', () => {
    it('should get the user by id correctly', async () => {
      const now = new Date();
      const userEntity: UserEntity = {
        id: '1',
        email: 'some-email@gmail.com',
        password: 'encryptedPassword',
        provider: 'EMAIL',
        createdAt: now,
        updatedAt: now,
      };
      const expectedUser = new User(
        '1',
        'some-email@gmail.com',
        'encryptedPassword',
        'EMAIL',
        now,
        now,
      );

      const userEntityToUserDomainSpy = jest.spyOn(
        UserRepositoryImpl,
        'userEntityToUserDomain',
      );
      jest
        .spyOn(databaseService.user, 'findFirstOrThrow')
        .mockResolvedValue(userEntity);

      const user = await userRepositoryImpl.getByIdOrThrow('1');

      expect(user).toStrictEqual(expectedUser);
      expect(databaseService.user.findFirstOrThrow).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(userEntityToUserDomainSpy).toHaveBeenCalledWith(userEntity);
    });

    it('should throw error NotFoundException when user not found', async () => {
      jest
        .spyOn(databaseService.user, 'findFirstOrThrow')
        .mockRejectedValue(new Prisma.NotFoundError('User not found!'));

      await expect(
        userRepositoryImpl.getByIdOrThrow('1'),
      ).rejects.toStrictEqual(new NotFoundException('User not found!'));
      expect(databaseService.user.findFirstOrThrow).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw and forward the error when the error is not instance of Prisma.NotFoundError', async () => {
      jest
        .spyOn(databaseService.user, 'findFirstOrThrow')
        .mockRejectedValue(new Error('Something happened!'));

      await expect(
        userRepositoryImpl.getByIdOrThrow('1'),
      ).rejects.toStrictEqual(new Error('Something happened!'));
      expect(databaseService.user.findFirstOrThrow).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('Get User By Email Action', () => {
    it('should get the user by email correctly', async () => {
      const now = new Date();
      const userEntity: UserEntity = {
        id: '1',
        email: 'some-email@gmail.com',
        password: 'encryptedPassword',
        provider: 'EMAIL',
        createdAt: now,
        updatedAt: now,
      };
      const expectedUser = new User(
        '1',
        'some-email@gmail.com',
        'encryptedPassword',
        'EMAIL',
        now,
        now,
      );

      const userEntityToUserDomainSpy = jest.spyOn(
        UserRepositoryImpl,
        'userEntityToUserDomain',
      );
      jest
        .spyOn(databaseService.user, 'findFirst')
        .mockResolvedValue(userEntity);

      const user = await userRepositoryImpl.getByEmail('some.email@gmail.com');

      expect(user).toStrictEqual(expectedUser);
      expect(databaseService.user.findFirst).toHaveBeenCalledWith({
        where: { email: 'some.email@gmail.com' },
      });
      expect(userEntityToUserDomainSpy).toHaveBeenCalledWith(userEntity);
    });

    it('should return null when user not found', async () => {
      const userEntityToUserDomainSpy = jest.spyOn(
        UserRepositoryImpl,
        'userEntityToUserDomain',
      );
      jest.spyOn(databaseService.user, 'findFirst').mockResolvedValue(null);

      const user = await userRepositoryImpl.getByEmail('some.email@gmail.com');

      expect(user).toBeNull();
      expect(databaseService.user.findFirst).toHaveBeenCalledWith({
        where: { email: 'some.email@gmail.com' },
      });
      expect(userEntityToUserDomainSpy).not.toHaveBeenCalled();
    });
  });

  describe('Get User By Email Or Throw Action', () => {
    it('should get the user by email correctly', async () => {
      const now = new Date();
      const userEntity: UserEntity = {
        id: '1',
        email: 'some-email@gmail.com',
        password: 'encryptedPassword',
        provider: 'EMAIL',
        createdAt: now,
        updatedAt: now,
      };
      const expectedUser = new User(
        '1',
        'some-email@gmail.com',
        'encryptedPassword',
        'EMAIL',
        now,
        now,
      );

      const userEntityToUserDomainSpy = jest.spyOn(
        UserRepositoryImpl,
        'userEntityToUserDomain',
      );
      jest
        .spyOn(databaseService.user, 'findFirstOrThrow')
        .mockResolvedValue(userEntity);

      const user = await userRepositoryImpl.getByEmailOrThrow(
        'some.email@gmail.com',
      );

      expect(user).toStrictEqual(expectedUser);
      expect(databaseService.user.findFirstOrThrow).toHaveBeenCalledWith({
        where: { email: 'some.email@gmail.com' },
      });
      expect(userEntityToUserDomainSpy).toHaveBeenCalledWith(userEntity);
    });

    it('should throw error NotFoundException when user not found', async () => {
      jest
        .spyOn(databaseService.user, 'findFirstOrThrow')
        .mockRejectedValue(new Prisma.NotFoundError('User not found!'));

      await expect(
        userRepositoryImpl.getByEmailOrThrow('some.email@gmail.com'),
      ).rejects.toStrictEqual(new NotFoundException('User not found!'));
      expect(databaseService.user.findFirstOrThrow).toHaveBeenCalledWith({
        where: { email: 'some.email@gmail.com' },
      });
    });

    it('should throw and forward the error when the error is not instance of Prisma.NotFoundError', async () => {
      jest
        .spyOn(databaseService.user, 'findFirstOrThrow')
        .mockRejectedValue(new Error('Something happened!'));

      await expect(
        userRepositoryImpl.getByEmailOrThrow('some.email@gmail.com'),
      ).rejects.toStrictEqual(new Error('Something happened!'));
      expect(databaseService.user.findFirstOrThrow).toHaveBeenCalledWith({
        where: { email: 'some.email@gmail.com' },
      });
    });
  });

  describe('Create User Action', () => {
    it('should create the user correctly', async () => {
      const now = new Date();
      const userEntity: UserEntity = {
        id: '1',
        email: 'some-email@gmail.com',
        password: 'encryptedPassword',
        provider: 'EMAIL',
        createdAt: now,
        updatedAt: now,
      };
      const expectedUser = new User(
        '1',
        'some-email@gmail.com',
        'encryptedPassword',
        'EMAIL',
        now,
        now,
      );

      const userEntityToUserDomainSpy = jest.spyOn(
        UserRepositoryImpl,
        'userEntityToUserDomain',
      );
      jest.spyOn(databaseService.user, 'create').mockResolvedValue(userEntity);

      const user = await userRepositoryImpl.create(
        'some-email@gmail.com',
        'encryptedPassword',
        'EMAIL',
      );

      expect(user).toStrictEqual(expectedUser);
      expect(databaseService.user.create).toHaveBeenCalledWith({
        data: {
          email: 'some-email@gmail.com',
          password: 'encryptedPassword',
          provider: 'EMAIL',
          profile: { create: {} },
        },
      });
      expect(userEntityToUserDomainSpy).toHaveBeenCalledWith(userEntity);
    });

    it('should throw error ConflictException when user email already exists', async () => {
      jest.spyOn(databaseService.user, 'create').mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Email already taken!', {
          code: 'P2002',
          clientVersion: '',
        }),
      );

      await expect(
        userRepositoryImpl.create(
          'some-email@gmail.com',
          'encryptedPassword',
          'EMAIL',
        ),
      ).rejects.toStrictEqual(
        new ConflictException('User with the email already exists!'),
      );
      expect(databaseService.user.create).toHaveBeenCalledWith({
        data: {
          email: 'some-email@gmail.com',
          password: 'encryptedPassword',
          provider: 'EMAIL',
          profile: { create: {} },
        },
      });
    });

    it('should throw and forward the error when the error is not instance of Prisma.PrismaClientKnownRequestError and Error Code is not P2002', async () => {
      jest
        .spyOn(databaseService.user, 'create')
        .mockRejectedValue(new Error('Something happened!'));

      await expect(
        userRepositoryImpl.create(
          'some-email@gmail.com',
          'encryptedPassword',
          'EMAIL',
        ),
      ).rejects.toStrictEqual(new Error('Something happened!'));
      expect(databaseService.user.create).toHaveBeenCalledWith({
        data: {
          email: 'some-email@gmail.com',
          password: 'encryptedPassword',
          provider: 'EMAIL',
          profile: { create: {} },
        },
      });
    });
  });

  describe('Get User Password by Email Action', () => {
    it('should get the user password by email correctly', async () => {
      const now = new Date();
      const expectedUser = new User(
        '1',
        'some-email@gmail.com',
        'encryptedPassword',
        'EMAIL',
        now,
        now,
      );
      const expectedPassword = 'encryptedPassword';

      jest
        .spyOn(userRepositoryImpl, 'getByEmailOrThrow')
        .mockResolvedValue(expectedUser);

      const password = await userRepositoryImpl.getPasswordByEmail(
        'some-email@gmail.com',
      );

      expect(password).toBe(expectedPassword);
      expect(userRepositoryImpl.getByEmailOrThrow).toHaveBeenCalledWith(
        'some-email@gmail.com',
      );
    });

    it('should throw error NotFoundException when user not found', async () => {
      jest
        .spyOn(userRepositoryImpl, 'getByEmailOrThrow')
        .mockRejectedValue(new NotFoundException('User not found!'));

      await expect(
        userRepositoryImpl.getPasswordByEmail('some-email@gmail.com'),
      ).rejects.toStrictEqual(
        new UnauthorizedException('Email or password is wrong!'),
      );
      expect(userRepositoryImpl.getByEmailOrThrow).toHaveBeenCalledWith(
        'some-email@gmail.com',
      );
    });

    it('should throw and forward the error when the error is not instance of NotFoundException', async () => {
      jest
        .spyOn(userRepositoryImpl, 'getByEmailOrThrow')
        .mockRejectedValue(new Error('Something happened!'));

      await expect(
        userRepositoryImpl.getPasswordByEmail('some-email@gmail.com'),
      ).rejects.toStrictEqual(new Error('Something happened!'));
      expect(userRepositoryImpl.getByEmailOrThrow).toHaveBeenCalledWith(
        'some-email@gmail.com',
      );
    });
  });

  describe('User Entity to User Domain', () => {
    it('should converty user entity to user domain correctly', () => {
      const now = new Date();
      const userEntity: UserEntity = {
        id: '1',
        email: 'some-email@gmail.com',
        password: 'encryptedPassword',
        provider: 'EMAIL',
        createdAt: now,
        updatedAt: now,
      };
      const expectedUser = new User(
        '1',
        'some-email@gmail.com',
        'encryptedPassword',
        'EMAIL',
        now,
        now,
      );

      const user = UserRepositoryImpl.userEntityToUserDomain(userEntity);

      expect(user).toStrictEqual(expectedUser);
    });
  });
});
