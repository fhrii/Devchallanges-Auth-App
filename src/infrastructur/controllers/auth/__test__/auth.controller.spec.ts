import { Test } from '@nestjs/testing';
import { Request, Response } from 'express';
import { mock } from 'jest-mock-extended';

import {
  GenerateAccessTokenUsecase,
  GenerateTokenUsecase,
  RegisterUsecase,
} from '@/application/usecases/auth';
import { User } from '@/domain/user';
import { AppConfig, ConfigModule } from '@/infrastructur/config';
import {
  UsecaseProxy,
  UsecaseProxyModule,
} from '@/infrastructur/usecase-proxy';

import { AuthController } from '../auth.controller';
import { RegisterUserDto } from '../dto';

describe('Auth Controller', () => {
  let authController: AuthController;
  let registerUsecaseProxy: UsecaseProxy<RegisterUsecase>;
  let generateAccessTokenUsecaseProxy: UsecaseProxy<GenerateAccessTokenUsecase>;
  let generateTokenUsecaseProxy: UsecaseProxy<GenerateTokenUsecase>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule, UsecaseProxyModule],
      controllers: [AuthController, AppConfig],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    registerUsecaseProxy = moduleRef.get<UsecaseProxy<RegisterUsecase>>(
      UsecaseProxyModule.RegisterUsecaseProxy,
    );
    generateAccessTokenUsecaseProxy = moduleRef.get<
      UsecaseProxy<GenerateAccessTokenUsecase>
    >(UsecaseProxyModule.GenerateAccessTokenUsecaseProxy);
    generateTokenUsecaseProxy = moduleRef.get<
      UsecaseProxy<GenerateTokenUsecase>
    >(UsecaseProxyModule.GenerateTokenUsecaseProxy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it("should register the user correctly and return the user's token", async () => {
      const expectedAccessToken = 'some.access.token';
      const expectedRefreshToken = 'some.refresh.token';

      const expressResponseMock = mock<Response>();
      const registerUsecaseMock = mock<RegisterUsecase>();

      registerUsecaseMock.execute.mockResolvedValue({
        accessToken: expectedAccessToken,
        refreshToken: expectedRefreshToken,
      });
      jest
        .spyOn(registerUsecaseProxy, 'getInstance')
        .mockReturnValue(registerUsecaseMock);

      const authEmailUserDto: RegisterUserDto = {
        email: 'some.email@gmail.com',
        password: 'somePassword',
      };

      const { accessToken, refreshToken } = await authController.register(
        expressResponseMock,
        authEmailUserDto,
      );

      expect(accessToken).toBe(expectedAccessToken);
      expect(refreshToken).toBe(expectedRefreshToken);
      expect(registerUsecaseMock.execute).toHaveBeenCalledWith(
        'some.email@gmail.com',
        'somePassword',
      );
      expect(expressResponseMock.cookie).toHaveBeenCalledWith(
        process.env.REFRESH_TOKEN_COOKIE,
        refreshToken,
        { httpOnly: true },
      );
    });
  });

  describe('loginEmail', () => {
    it("should login the user correctly and return the user's token", async () => {
      const now = new Date();
      const user = new User(
        '1',
        'some-email@gmail.com',
        'encryptedPassword',
        'EMAIL',
        now,
        now,
      );
      const expectedAccessToken = 'some.access.token';
      const expectedRefreshToken = 'some.refresh.token';

      const expressResponseMock = mock<Response>();
      const expressRequestMock = mock<Request>({
        user,
      });
      const generateTokenUsecaseMock = mock<GenerateTokenUsecase>();

      generateTokenUsecaseMock.execute.mockResolvedValue({
        accessToken: expectedAccessToken,
        refreshToken: expectedRefreshToken,
      });
      jest
        .spyOn(generateTokenUsecaseProxy, 'getInstance')
        .mockReturnValue(generateTokenUsecaseMock);

      const { accessToken, refreshToken } = await authController.loginEmail(
        expressResponseMock,
        expressRequestMock,
      );

      expect(accessToken).toBe(expectedAccessToken);
      expect(refreshToken).toBe(expectedRefreshToken);
      expect(expressResponseMock.cookie).toHaveBeenCalledWith(
        process.env.REFRESH_TOKEN_COOKIE,
        refreshToken,
        { httpOnly: true },
      );
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh the access token correctly', async () => {
      const now = new Date();
      const user = new User(
        '1',
        'some-email@gmail.com',
        'encryptedPassword',
        'EMAIL',
        now,
        now,
      );
      const expectedAccessToken = 'some.access.token';

      const expressRequestMock = mock<Request>({
        user,
      });
      const generateTokenUsecaseMock = mock<GenerateAccessTokenUsecase>();

      generateTokenUsecaseMock.execute.mockResolvedValue(expectedAccessToken);
      jest
        .spyOn(generateAccessTokenUsecaseProxy, 'getInstance')
        .mockReturnValue(generateTokenUsecaseMock);

      const { accessToken, refreshToken } =
        await authController.refreshAccessToken(expressRequestMock);

      expect(accessToken).toBe(expectedAccessToken);
      expect(refreshToken).toBe('');
    });
  });
});
