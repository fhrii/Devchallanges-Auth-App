import * as fsExtra from 'fs-extra';

import { FileManager } from '@/application/utilities';

export class FileManagerImpl extends FileManager {
  constructor(private readonly fs: typeof fsExtra) {
    super();
  }

  async writeFile(file: string, data: Buffer): Promise<void> {
    await this.fs.promises.writeFile(file, data);
  }

  async readFile(file: string): Promise<Buffer> {
    try {
      return await this.fs.promises.readFile(file);
    } catch (error) {
      const { code: errorCode }: { code: string } = error;

      if (errorCode === 'ENOENT') return null;
      throw error;
    }
  }

  async emptyDir(dir: string): Promise<void> {
    await this.fs.emptyDir(dir);
  }
}
