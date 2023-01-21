import { mock } from 'jest-mock-extended';

import { FileManager } from '@/application/utilities';

import { GetImageUsecase } from '../get-image.usecase';

describe('Get Image Usecase', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should orchestrating the get jpeg image action correctly', async () => {
    const expectedBuffer = Buffer.from([1]);

    const fileManagerMock = mock<FileManager>();
    fileManagerMock.readFile.mockResolvedValue(expectedBuffer);

    const getImageUsecase = new GetImageUsecase(fileManagerMock);

    const { buffer, mime } = await getImageUsecase.execute('file-name.jpg');

    expect(buffer).toBe(expectedBuffer);
    expect(mime).toBe('image/jpeg');
    expect(fileManagerMock.readFile).toHaveBeenCalledWith(
      './images/file-name.jpg',
    );
  });

  it('should orchestrating the get png image action correctly', async () => {
    const expectedBuffer = Buffer.from([1]);

    const fileManagerMock = mock<FileManager>();
    fileManagerMock.readFile.mockResolvedValue(expectedBuffer);

    const getImageUsecase = new GetImageUsecase(fileManagerMock);

    const { buffer, mime } = await getImageUsecase.execute('file-name.png');

    expect(buffer).toBe(expectedBuffer);
    expect(mime).toBe('image/png');
    expect(fileManagerMock.readFile).toHaveBeenCalledWith(
      './images/file-name.png',
    );
  });

  it('should orchestrating the get image action correctly when file is not exist', async () => {
    const expectedBuffer = Buffer.from([1]);

    const fileManagerMock = mock<FileManager>();
    fileManagerMock.readFile
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(expectedBuffer);

    const getImageUsecase = new GetImageUsecase(fileManagerMock);

    const { buffer, mime } = await getImageUsecase.execute('file-name.jpg');

    expect(buffer).toBe(expectedBuffer);
    expect(mime).toBe('image/png');
    expect(fileManagerMock.readFile).toHaveBeenCalledWith(
      './assets/no-image.png',
    );
  });
});
