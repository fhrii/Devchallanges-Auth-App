import { FileManager } from '@/application/utilities';

export class GetImageUsecase {
  constructor(private readonly fileManager: FileManager) {}

  async execute(fileName: string) {
    const fileBuffer = await this.fileManager.readFile(`./images/${fileName}`);

    if (!fileBuffer) {
      const noImageFileBuffer = await this.fileManager.readFile(
        './assets/no-image.png',
      );

      return { buffer: noImageFileBuffer, mime: 'image/png' };
    }

    const mime = this.getFileMime(fileName);

    return { buffer: fileBuffer, mime };
  }

  getFileMime(fileName: string) {
    const splittedFileNameAndExtension = fileName.split('.');
    const extension =
      splittedFileNameAndExtension[splittedFileNameAndExtension.length - 1];

    if (extension === 'jpg') return 'image/jpeg';

    return 'image/png';
  }
}
