import {
  Body,
  Controller,
  Get,
  Inject,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

import {
  GetProfileByUserIdOrThrowUsecase,
  UpdateProfileByUserIdUsecase,
  UpdateProfilePhotoByUserIdUsecase,
} from '@/application/usecases/profile';
import { User } from '@/domain/user';
import { JwtAuthGuard } from '@/infrastructur/common/guards/auth';
import {
  UsecaseProxy,
  UsecaseProxyModule,
} from '@/infrastructur/usecase-proxy';

import { UpdateProfileDto } from '../profile';
import { UserPresenter } from './presenter';

@Controller('users')
export class UserController {
  constructor(
    @Inject(UsecaseProxyModule.GetProfileByUserIdUsecaseProxy)
    private readonly getProfileByUserIdUsecaseProxy: UsecaseProxy<GetProfileByUserIdOrThrowUsecase>,
    @Inject(UsecaseProxyModule.UpdateProfileByUserIdUsecaseProxy)
    private readonly updateProfileUsecaseProxy: UsecaseProxy<UpdateProfileByUserIdUsecase>,
    @Inject(UsecaseProxyModule.UpdateProfilePhotoByUserIdUsecaseProxy)
    private readonly updateProfilePhotoByUserIdUsecaseProxy: UsecaseProxy<UpdateProfilePhotoByUserIdUsecase>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() { user }: Request) {
    const profile = await this.getProfileByUserIdUsecaseProxy
      .getInstance()
      .execute(user.id);

    return new UserPresenter(
      profile
        ? new User(
            user.id,
            user.email,
            user.password,
            user.provider,
            user.createdAt,
            user.updatedAt,
            profile,
          )
        : user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async putMe(
    @Req() { user }: Request,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const { name, bio, phone } = updateProfileDto;
    const profile = await this.updateProfileUsecaseProxy
      .getInstance()
      .execute(user.id, name, bio, phone);

    const newUser = new User(
      user.id,
      user.email,
      user.password,
      user.provider,
      user.createdAt,
      user.updatedAt,
      profile,
    );

    return new UserPresenter(newUser);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/image')
  @UseInterceptors(FileInterceptor('image'))
  async putMeImage(
    @Req() { user }: Request,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    const profile = await this.updateProfilePhotoByUserIdUsecaseProxy
      .getInstance()
      .execute(user.id, file.buffer, file.mimetype);

    const newUser = new User(
      user.id,
      user.email,
      user.password,
      user.provider,
      user.createdAt,
      user.updatedAt,
      profile,
    );

    return new UserPresenter(newUser);
  }
}
