import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { ConfigModule } from '../../config.module';
import { AppConfig } from '../app.config';

describe('App Config', () => {
  let appConfig: AppConfig;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [AppConfig, ConfigService],
    }).compile();

    appConfig = moduleRef.get<AppConfig>(AppConfig);
  });

  describe('ENV', () => {
    it('should get ENV config correctly', () => {
      expect(appConfig.ENV).toEqual(process.env.NODE_ENV);
    });
  });

  describe('PORT', () => {
    it('should get PORT config correctly', () => {
      expect(appConfig.PORT).toEqual(+process.env.PORT);
    });
  });

  describe('ACCESS_TOKEN_SECRET', () => {
    it('should get ACCESS_TOKEN_SECRET config correctly', () => {
      expect(appConfig.ACCESS_TOKEN_SECRET).toEqual(
        process.env.ACCESS_TOKEN_SECRET,
      );
    });
  });

  describe('ACCESS_TOKEN_EXPIRE', () => {
    it('should get ACCESS_TOKEN_EXPIRE config correctly', () => {
      expect(appConfig.ACCESS_TOKEN_EXPIRE).toEqual(
        process.env.ACCESS_TOKEN_EXPIRE,
      );
    });
  });

  describe('REFRESH_TOKEN_SECRET', () => {
    it('should get REFRESH_TOKEN_SECRET config correctly', () => {
      expect(appConfig.REFRESH_TOKEN_SECRET).toEqual(
        process.env.REFRESH_TOKEN_SECRET,
      );
    });
  });

  describe('REFRESH_TOKEN_EXPIRE', () => {
    it('should get REFRESH_TOKEN_EXPIRE config correctly', () => {
      expect(appConfig.REFRESH_TOKEN_EXPIRE).toEqual(
        process.env.REFRESH_TOKEN_EXPIRE,
      );
    });
  });

  describe('REFRESH_TOKEN_COOKIE', () => {
    it('should get REFRESH_TOKEN_COOKIE config correctly', () => {
      expect(appConfig.REFRESH_TOKEN_COOKIE).toEqual(
        process.env.REFRESH_TOKEN_COOKIE,
      );
    });
  });
});
