import * as fs from 'fs-extra';
import { mock } from 'jest-mock-extended';

import { FileManagerImpl } from '../file-manager-impl';

describe('File Manager Implementation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Write file action', () => {
    it('should write file correctly', async () => {
      const fsPromisesMock = mock<typeof fs.promises>();
      const fsMock = mock<typeof fs>({ promises: fsPromisesMock });

      fsPromisesMock.writeFile.mockResolvedValue();

      const fileManager = new FileManagerImpl(fsMock);

      await fileManager.writeFile('some-file.txt', Buffer.from([1]));

      expect(fsPromisesMock.writeFile).toHaveBeenCalledWith(
        'some-file.txt',
        Buffer.from([1]),
      );
    });
  });

  describe('Read File Action', () => {
    it('should read file correctly', async () => {
      const expectedBuffer = Buffer.from([1]);

      const fsPromisesMock = mock<typeof fs.promises>();
      const fsMock = mock<typeof fs>({ promises: fsPromisesMock });

      fsPromisesMock.readFile.mockResolvedValue(expectedBuffer);

      const fileManager = new FileManagerImpl(fsMock);
      const buffer = await fileManager.readFile('some-file.txt');

      expect(buffer).toBe(expectedBuffer);
      expect(fsPromisesMock.readFile).toHaveBeenCalledWith('some-file.txt');
    });

    it('should return null when file is not exist', async () => {
      const fsPromisesMock = mock<typeof fs.promises>();
      const fsMock = mock<typeof fs>({ promises: fsPromisesMock });

      fsPromisesMock.readFile.mockRejectedValue({ code: 'ENOENT' });

      const fileManager = new FileManagerImpl(fsMock);

      await expect(fileManager.readFile('some-file.txt')).resolves.toBeNull();
      expect(fsPromisesMock.readFile).toHaveBeenCalledWith('some-file.txt');
    });

    it('should forward error when error is not file not exist', async () => {
      const fsPromisesMock = mock<typeof fs.promises>();
      const fsMock = mock<typeof fs>({ promises: fsPromisesMock });

      fsPromisesMock.readFile.mockRejectedValue(
        new Error('Something happened!'),
      );

      const fileManager = new FileManagerImpl(fsMock);

      await expect(fileManager.readFile('some-file.txt')).rejects.toThrow(
        'Something happened!',
      );
      expect(fsPromisesMock.readFile).toHaveBeenCalledWith('some-file.txt');
    });
  });

  describe('Empty Dir Action', () => {
    it('should empty directory correctly', async () => {
      const fsMock = mock<typeof fs>();

      fsMock.emptyDir.mockImplementation(() => Promise.resolve());

      const fileManager = new FileManagerImpl(fsMock);

      await fileManager.emptyDir('./images');

      expect(fsMock.emptyDir).toHaveBeenCalledWith('./images');
    });
  });
});
