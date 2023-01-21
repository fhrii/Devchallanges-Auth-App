import { FileManager, Random } from '@/application/utilities';
import { BadRequestException } from '@/common/exception';
import { UsecaseProxy } from '@/infrastructur/usecase-proxy';

import { UpdateProfileByUserIdUsecase } from './update-profile-by-user-id.usecase';

export class UpdateProfilePhotoByUserIdUsecase {
  constructor(
    private readonly fileManager: FileManager,
    private readonly random: Random,
    private readonly updateProfileUsecaseProxy: UsecaseProxy<UpdateProfileByUserIdUsecase>,
  ) {}

  async execute(userId: string, fileBuffer: Buffer, fileMime: string) {
    this.validateFile(fileMime);

    const randomString = await this.random.generateString();
    const fileExt = this.getFileExtension(fileMime);
    const fileName = `${randomString}.${fileExt}`;

    await this.fileManager.writeFile(`./images/${fileName}`, fileBuffer);
    return this.updateProfileUsecaseProxy
      .getInstance()
      .execute(userId, null, null, null, fileName);
  }

  private validateFile(mime: string) {
    if (mime !== 'image/jpeg' && mime !== 'image/png') {
      throw new BadRequestException('Image type is not supported');
    }
  }

  private getFileExtension(mime: string) {
    if (mime === 'image/jpeg') return 'jpg';
    return 'png';
  }
}
