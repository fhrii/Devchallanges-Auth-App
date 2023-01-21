import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TokenManager } from '@/application/securities';
import { User } from '@/domain/user';
import { AppConfig } from '@/infrastructur/config';

@Injectable()
export class TokenManagerImpl extends TokenManager {
  constructor(
    private readonly jwtService: JwtService,
    private readonly appConfig: AppConfig,
  ) {
    super();
  }

  async createAccessToken(payload: User) {
    const { id } = payload;
    return this.jwtService.signAsync(
      { id },
      {
        secret: this.appConfig.ACCESS_TOKEN_SECRET,
        expiresIn: this.appConfig.ACCESS_TOKEN_EXPIRE,
      },
    );
  }

  async createRefreshToken(payload: User) {
    const { id } = payload;
    return this.jwtService.signAsync(
      { id },
      {
        secret: this.appConfig.REFRESH_TOKEN_SECRET,
        expiresIn: this.appConfig.REFRESH_TOKEN_EXPIRE,
      },
    );
  }

  async verifyAccessToken(token: string) {
    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.appConfig.ACCESS_TOKEN_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Access token is expired!');
    }
  }

  async verifyRefreshToken(token: string) {
    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.appConfig.REFRESH_TOKEN_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Refresh token is expired!');
    }
  }
}
