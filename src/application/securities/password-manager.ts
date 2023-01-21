/* eslint-disable @typescript-eslint/no-unused-vars */
export class PasswordManager {
  async hash(password: string): Promise<string> {
    throw new Error('PASSWORD_MANAGER.HASH.METHOD_NOT_IMPLEMENTED');
  }

  async compare(password: string, hashedPassword: string): Promise<void> {
    throw new Error('PASSWORD_MANAGER.COMPARE.METHOD_NOT_IMPLEMENTED');
  }
}
