// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-secrets/no-secrets */
import { Module } from '@nestjs/common';

import { PasswordManager, TokenManager } from '@/application/securities';
import {
  GenerateAccessTokenUsecase,
  GenerateRefreshTokenUsecase,
  GenerateTokenUsecase,
  LoginUsecase,
  RegisterUsecase,
} from '@/application/usecases/auth';
import { GetImageUsecase } from '@/application/usecases/image';
import {
  GetProfileByUserIdOrThrowUsecase,
  GetProfileByUserIdUsecase,
  UpdateProfileByUserIdUsecase,
  UpdateProfilePhotoByUserIdUsecase,
} from '@/application/usecases/profile';
import {
  CreateUserUsecase,
  GetUserByEmailOrThrowUsecase,
  GetUserByEmailUsecase,
  GetUserByIdOrThrowUsecase,
} from '@/application/usecases/user';
import { FileManager, Random } from '@/application/utilities';

import {
  ProfileRepositoryImpl,
  RepositoriesModule,
  UserRepositoryImpl,
} from '../repositories';
import { SecuritiesModule } from '../securities';
import { UtilitiesModule } from '../utilities';
import { UsecaseProxy } from './usecase-proxy';

@Module({
  imports: [RepositoriesModule, SecuritiesModule, UtilitiesModule],
  providers: [
    {
      provide: UsecaseProxyModule.GenerateAccessTokenUsecaseProxy,
      inject: [TokenManager],
      useFactory: (tokenManager: TokenManager) =>
        new UsecaseProxy(new GenerateAccessTokenUsecase(tokenManager)),
    },
    {
      provide: UsecaseProxyModule.GenerateRefreshTokenUsecaseProxy,
      inject: [TokenManager],
      useFactory: (tokenManager: TokenManager) =>
        new UsecaseProxy(new GenerateRefreshTokenUsecase(tokenManager)),
    },
    {
      provide: UsecaseProxyModule.GenerateTokenUsecaseProxy,
      inject: [
        UsecaseProxyModule.GenerateAccessTokenUsecaseProxy,
        UsecaseProxyModule.GenerateRefreshTokenUsecaseProxy,
      ],
      useFactory: (
        generateAccessTokenUsecaseProxy: UsecaseProxy<GenerateAccessTokenUsecase>,
        generateRefreshTokenUsecaseProxy: UsecaseProxy<GenerateRefreshTokenUsecase>,
      ) =>
        new UsecaseProxy(
          new GenerateTokenUsecase(
            generateAccessTokenUsecaseProxy,
            generateRefreshTokenUsecaseProxy,
          ),
        ),
    },
    {
      provide: UsecaseProxyModule.LoginUsecaseProxy,
      inject: [
        PasswordManager,
        UserRepositoryImpl,
        UsecaseProxyModule.GetUserByEmailOrThrowUsecaseProxy,
      ],
      useFactory: (
        passwordManager: PasswordManager,
        userRepositoryImpl: UserRepositoryImpl,
        getUserByEmailOrThrowUsecase: UsecaseProxy<GetUserByEmailOrThrowUsecase>,
      ) =>
        new UsecaseProxy(
          new LoginUsecase(
            passwordManager,
            userRepositoryImpl,
            getUserByEmailOrThrowUsecase,
          ),
        ),
    },
    {
      provide: UsecaseProxyModule.RegisterUsecaseProxy,
      inject: [
        TokenManager,
        PasswordManager,
        UsecaseProxyModule.CreateUserUsecaseProxy,
      ],
      useFactory: (
        tokenManager: TokenManager,
        passwordManager: PasswordManager,
        createUserByEmailUsecaseProxy: UsecaseProxy<CreateUserUsecase>,
      ) =>
        new UsecaseProxy(
          new RegisterUsecase(
            tokenManager,
            passwordManager,
            createUserByEmailUsecaseProxy,
          ),
        ),
    },
    {
      provide: UsecaseProxyModule.GetImageUsecaseProxy,
      inject: [FileManager],
      useFactory: (fileManager: FileManager) =>
        new UsecaseProxy(new GetImageUsecase(fileManager)),
    },
    {
      provide: UsecaseProxyModule.CreateUserUsecaseProxy,
      inject: [UserRepositoryImpl],
      useFactory: (userRepositoryImpl: UserRepositoryImpl) =>
        new UsecaseProxy(new CreateUserUsecase(userRepositoryImpl)),
    },
    {
      provide: UsecaseProxyModule.GetUserByIdOrThrowUsecaseProxy,
      inject: [UserRepositoryImpl],
      useFactory: (userRepositoryImpl: UserRepositoryImpl) =>
        new UsecaseProxy(new GetUserByIdOrThrowUsecase(userRepositoryImpl)),
    },
    {
      provide: UsecaseProxyModule.GetUserByEmailUsecaseProxy,
      inject: [UserRepositoryImpl],
      useFactory: (userRepositoryImpl: UserRepositoryImpl) =>
        new UsecaseProxy(new GetUserByEmailUsecase(userRepositoryImpl)),
    },
    {
      provide: UsecaseProxyModule.GetUserByEmailOrThrowUsecaseProxy,
      inject: [UserRepositoryImpl],
      useFactory: (userRepositoryImpl: UserRepositoryImpl) =>
        new UsecaseProxy(new GetUserByEmailOrThrowUsecase(userRepositoryImpl)),
    },
    {
      provide: UsecaseProxyModule.GetProfileByUserIdUsecaseProxy,
      inject: [ProfileRepositoryImpl],
      useFactory: (profileRepositoryImpl: ProfileRepositoryImpl) =>
        new UsecaseProxy(new GetProfileByUserIdUsecase(profileRepositoryImpl)),
    },
    {
      provide: UsecaseProxyModule.GetProfileByUserIdOrThrowUsecaseProxy,
      inject: [ProfileRepositoryImpl],
      useFactory: (profileRepositoryImpl: ProfileRepositoryImpl) =>
        new UsecaseProxy(
          new GetProfileByUserIdOrThrowUsecase(profileRepositoryImpl),
        ),
    },
    {
      provide: UsecaseProxyModule.UpdateProfileByUserIdUsecaseProxy,
      inject: [ProfileRepositoryImpl],
      useFactory: (profileRepositoryImpl: ProfileRepositoryImpl) =>
        new UsecaseProxy(
          new UpdateProfileByUserIdUsecase(profileRepositoryImpl),
        ),
    },
    {
      provide: UsecaseProxyModule.UpdateProfilePhotoByUserIdUsecaseProxy,
      inject: [
        FileManager,
        Random,
        UsecaseProxyModule.UpdateProfileByUserIdUsecaseProxy,
      ],
      useFactory: (
        fileManager: FileManager,
        random: Random,
        updateProfileByUserIdUsecaseProxy: UsecaseProxy<UpdateProfileByUserIdUsecase>,
      ) =>
        new UsecaseProxy(
          new UpdateProfilePhotoByUserIdUsecase(
            fileManager,
            random,
            updateProfileByUserIdUsecaseProxy,
          ),
        ),
    },
  ],
  exports: [
    UsecaseProxyModule.GenerateAccessTokenUsecaseProxy,
    UsecaseProxyModule.GenerateRefreshTokenUsecaseProxy,
    UsecaseProxyModule.GenerateTokenUsecaseProxy,
    UsecaseProxyModule.LoginUsecaseProxy,
    UsecaseProxyModule.RegisterUsecaseProxy,
    UsecaseProxyModule.GetImageUsecaseProxy,
    UsecaseProxyModule.CreateUserUsecaseProxy,
    UsecaseProxyModule.GetUserByIdOrThrowUsecaseProxy,
    UsecaseProxyModule.GetUserByEmailOrThrowUsecaseProxy,
    UsecaseProxyModule.GetProfileByUserIdUsecaseProxy,
    UsecaseProxyModule.GetProfileByUserIdOrThrowUsecaseProxy,
    UsecaseProxyModule.UpdateProfileByUserIdUsecaseProxy,
    UsecaseProxyModule.UpdateProfilePhotoByUserIdUsecaseProxy,
  ],
})
export class UsecaseProxyModule {
  static GenerateAccessTokenUsecaseProxy = 'GenerateAccessTokenUsecaseProxy';
  static GenerateRefreshTokenUsecaseProxy = 'GenerateRefershTokenUsecaseProxy';
  static GenerateTokenUsecaseProxy = 'GenerateTokenUsecaseProxy';
  static LoginUsecaseProxy = 'LoginUsecaseProxy';
  static RegisterUsecaseProxy = 'RegisterUsecaseProxy';

  static GetImageUsecaseProxy = 'GetImageUsecaseProxy';

  static CreateUserUsecaseProxy = 'CreateUserUsecaseProxy';
  static GetUserByIdOrThrowUsecaseProxy = 'GetUserByIdOrThrowUsecaseProxy';
  static GetUserByEmailUsecaseProxy = 'GetUserByEmailUsecaseProxy';
  static GetUserByEmailOrThrowUsecaseProxy =
    'GetUserByEmailOrThrowUsecaseProxy';

  static GetProfileByUserIdUsecaseProxy = 'GetProfileByUserIdUsecaseProxy';
  static GetProfileByUserIdOrThrowUsecaseProxy =
    'GetProfileByUserIdOrThrowUsecaseProxy';
  static UpdateProfileByUserIdUsecaseProxy =
    'UpdateProfileByUserIdUsecaseProxy';
  static UpdateProfilePhotoByUserIdUsecaseProxy =
    'UpdateProfilePhotoByUserIdUsecaseProxy';
}
