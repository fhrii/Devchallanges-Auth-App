import { FileManager } from '../file-manager';

describe('FileManager', () => {
  it('should throw error when invoke abstract method', async () => {
    const fileManager = new FileManager();

    await expect(
      fileManager.writeFile('someFile.txt', Buffer.from([1])),
    ).rejects.toThrow('FILE_MANAGER.WRITE_FILE.METHOD_NOT_IMPLEMENTED');
    await expect(fileManager.readFile('someFile.txt')).rejects.toThrow(
      'FILE_MANAGER.READ_FILE.METHOD_NOT_IMPLEMENTED',
    );
    await expect(fileManager.emptyDir('someDir')).rejects.toThrow(
      'FILE_MANAGER.EMPTY_DIR.METHOD_NOT_IMPLEMENTED',
    );
  });
});
