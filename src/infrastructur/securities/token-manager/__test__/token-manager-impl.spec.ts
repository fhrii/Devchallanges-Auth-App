import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { User } from '@/domain/user';
import { AppConfig, ConfigModule } from '@/infrastructur/config';

import { TokenManagerImpl } from '../token-manager-impl';

describe('Token Manager', () => {
  let tokenManager: TokenManagerImpl;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [JwtService, TokenManagerImpl, AppConfig],
    }).compile();

    tokenManager = moduleRef.get<TokenManagerImpl>(TokenManagerImpl);
    jwtService = await moduleRef.resolve(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Create access token action', () => {
    it('should create the access token correctly', async () => {
      const now = new Date();
      const user = new User(
        '1',
        'some.email@gmail.com',
        'encryptedPassword',
        'EMAIL',
        now,
        now,
      );
      const expectedToken = 'some.jwt.token';

      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(expectedToken);

      const token = await tokenManager.createAccessToken(user);

      expect(token).toEqual(expectedToken);
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { id: '1' },
        {
          secret: process.env.ACCESS_TOKEN_SECRET,
          expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
        },
      );
    });
  });

  describe('Create refresh token action', () => {
    it('should create the refresh token correctly', async () => {
      const now = new Date();
      const user = new User(
        '1',
        'some.email@gmail.com',
        'encryptedPassword',
        'EMAIL',
        now,
        now,
      );
      const expectedToken = 'some.jwt.token';

      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(expectedToken);

      const token = await tokenManager.createRefreshToken(user);

      expect(token).toEqual(expectedToken);
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { id: '1' },
        {
          secret: process.env.REFRESH_TOKEN_SECRET,
          expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
        },
      );
    });
  });

  describe('Verify Access Token', () => {
    it('should verify the access token correctly', async () => {
      const token = 'some.jwt.token';

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ id: '1' });

      await expect(tokenManager.verifyAccessToken(token)).resolves.not.toThrow(
        new UnauthorizedException('Access token is expired!'),
      );
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
    });

    it('should throw error when access token is invalid', async () => {
      const token = 'some.jwt.token.invalid';

      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockRejectedValue(new Error('Token is invalid!'));

      await expect(tokenManager.verifyAccessToken(token)).rejects.toThrow(
        new UnauthorizedException('Access token is expired!'),
      );
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
    });
  });

  describe('Verify Refresh Token', () => {
    it('should verify the refresh token correctly', async () => {
      const token = 'some.jwt.token';

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ id: '1' });

      await expect(tokenManager.verifyRefreshToken(token)).resolves.not.toThrow(
        new UnauthorizedException('Access token is expired!'),
      );
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(token, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
    });

    it('should throw error when access token is invalid', async () => {
      const token = 'some.jwt.token.invalid';

      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockRejectedValue(new Error('Token is invalid!'));

      await expect(tokenManager.verifyRefreshToken(token)).rejects.toThrow(
        new UnauthorizedException('Refresh token is expired!'),
      );
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(token, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
    });
  });
});
