/* eslint-disable @typescript-eslint/no-unused-vars */
export class FileManager {
  async writeFile(file: string, data: Buffer) {
    throw new Error('FILE_MANAGER.WRITE_FILE.METHOD_NOT_IMPLEMENTED');
  }

  async readFile(file: string): Promise<Buffer> {
    throw new Error('FILE_MANAGER.READ_FILE.METHOD_NOT_IMPLEMENTED');
  }

  async emptyDir(dir: string) {
    throw new Error('FILE_MANAGER.EMPTY_DIR.METHOD_NOT_IMPLEMENTED');
  }
}
