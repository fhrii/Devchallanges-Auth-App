import { Controller, Get, Inject, Param, StreamableFile } from '@nestjs/common';

import { GetImageUsecase } from '@/application/usecases/image';
import {
  UsecaseProxy,
  UsecaseProxyModule,
} from '@/infrastructur/usecase-proxy';

@Controller('image')
export class ImageController {
  constructor(
    @Inject(UsecaseProxyModule.GetImageUsecaseProxy)
    private readonly getImageUsecaseProxy: UsecaseProxy<GetImageUsecase>,
  ) {}

  @Get(':name')
  async getImage(@Param('name') name: string) {
    const { buffer, mime: type } = await this.getImageUsecaseProxy
      .getInstance()
      .execute(name);
    return new StreamableFile(buffer, { type });
  }
}
