import { PasswordManager } from '../password-manager';

describe('Password Manager', () => {
  it('should throw error when invoke abstract method', async () => {
    const passwordManager = new PasswordManager();

    await expect(passwordManager.hash('somePassword')).rejects.toThrow(
      'PASSWORD_MANAGER.HASH.METHOD_NOT_IMPLEMENTED',
    );

    await expect(
      passwordManager.compare('somePassword', 'encryptedPassword'),
    ).rejects.toThrow('PASSWORD_MANAGER.COMPARE.METHOD_NOT_IMPLEMENTED');
  });
});
