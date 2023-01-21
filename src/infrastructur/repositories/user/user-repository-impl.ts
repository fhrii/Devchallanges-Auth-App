import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, User as UserEntity } from '@prisma/client';

import { User, UserProvider, UserRepository } from '@/domain/user';
import { DatabaseService } from '@/infrastructur/database';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async getByIdOrThrow(id: string) {
    try {
      const userEntity = await this.databaseService.user.findFirstOrThrow({
        where: { id },
      });
      return UserRepositoryImpl.userEntityToUserDomain(userEntity);
    } catch (error) {
      if (error instanceof Prisma.NotFoundError) {
        throw new NotFoundException('User not found!');
      }

      throw error;
    }
  }

  async getByEmail(email: string) {
    const userEntity = await this.databaseService.user.findFirst({
      where: { email },
    });

    if (!userEntity) return null;

    return UserRepositoryImpl.userEntityToUserDomain(userEntity);
  }

  async getByEmailOrThrow(email: string) {
    try {
      const userEntity = await this.databaseService.user.findFirstOrThrow({
        where: { email },
      });
      return UserRepositoryImpl.userEntityToUserDomain(userEntity);
    } catch (error) {
      if (error instanceof Prisma.NotFoundError) {
        throw new NotFoundException('User not found!');
      }

      throw error;
    }
  }

  async create(email: string, password: string, provider: UserProvider) {
    try {
      const userEntity = await this.databaseService.user.create({
        data: { email, password, provider, profile: { create: {} } },
      });
      return UserRepositoryImpl.userEntityToUserDomain(userEntity);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('User with the email already exists!');
      }

      throw error;
    }
  }

  async getPasswordByEmail(email: string) {
    try {
      const user = await this.getByEmailOrThrow(email);
      return user.password;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('Email or password is wrong!');
      }

      throw error;
    }
  }

  static userEntityToUserDomain(user: UserEntity) {
    return new User(
      user.id,
      user.email,
      user.password,
      user.provider,
      user.createdAt,
      user.updatedAt,
    );
  }
}
