import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import {
  GenerateAccessTokenUsecase,
  GenerateTokenUsecase,
  RegisterUsecase,
} from '@/application/usecases/auth';
import {
  JwtCookieAuthGuard,
  LocalAuthGuard,
} from '@/infrastructur/common/guards/auth';
import { AppConfig } from '@/infrastructur/config';
import {
  UsecaseProxy,
  UsecaseProxyModule,
} from '@/infrastructur/usecase-proxy';

import { RegisterUserDto } from './dto';
import { AuthPresenter } from './presenter';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly appConfig: AppConfig,
    @Inject(UsecaseProxyModule.RegisterUsecaseProxy)
    private readonly registerUsecaseProxy: UsecaseProxy<RegisterUsecase>,
    @Inject(UsecaseProxyModule.GenerateAccessTokenUsecaseProxy)
    private readonly generateAccessTokenUsecaseProxy: UsecaseProxy<GenerateAccessTokenUsecase>,
    @Inject(UsecaseProxyModule.GenerateTokenUsecaseProxy)
    private readonly generateTokenUsecaseProxy: UsecaseProxy<GenerateTokenUsecase>,
  ) {}

  @Post('register')
  async register(
    @Res({ passthrough: true }) response: Response,
    @Body() { email, password }: RegisterUserDto,
  ) {
    const tokens = await this.registerUsecaseProxy
      .getInstance()
      .execute(email, password);

    response.cookie(this.appConfig.REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
      httpOnly: true,
    });

    return new AuthPresenter(tokens);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async loginEmail(
    @Res({ passthrough: true }) response: Response,
    @Req() { user }: Request,
  ) {
    const token = await this.generateTokenUsecaseProxy
      .getInstance()
      .execute(user);

    response.cookie(this.appConfig.REFRESH_TOKEN_COOKIE, token.refreshToken, {
      httpOnly: true,
    });

    return new AuthPresenter(token);
  }

  @UseGuards(JwtCookieAuthGuard)
  @Post('refresh-token')
  async refreshAccessToken(@Req() { user }: Request) {
    const accessToken = await this.generateAccessTokenUsecaseProxy
      .getInstance()
      .execute(user);

    return new AuthPresenter({ accessToken, refreshToken: '' });
  }
}
