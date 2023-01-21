import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfig {
  constructor(private readonly configService: ConfigService) {}

  get ENV() {
    return this.configService.get<string>('NODE_ENV');
  }

  get PORT() {
    return this.configService.get<number>('PORT');
  }

  get ACCESS_TOKEN_SECRET() {
    return this.configService.get<string>('ACCESS_TOKEN_SECRET');
  }

  get ACCESS_TOKEN_EXPIRE() {
    return this.configService.get<string>('ACCESS_TOKEN_EXPIRE');
  }

  get REFRESH_TOKEN_SECRET() {
    return this.configService.get<string>('REFRESH_TOKEN_SECRET');
  }

  get REFRESH_TOKEN_EXPIRE() {
    return this.configService.get<string>('REFRESH_TOKEN_EXPIRE');
  }

  get REFRESH_TOKEN_COOKIE() {
    return this.configService.get<string>('REFRESH_TOKEN_COOKIE');
  }
}
