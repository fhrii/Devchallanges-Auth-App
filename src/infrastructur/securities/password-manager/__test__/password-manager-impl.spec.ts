import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { mock } from 'jest-mock-extended';

import { PasswordManagerImpl } from '../password-manager-impl';

describe('Password Manager', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Hash password action', () => {
    it('should hash the password correctly', async () => {
      const password = 'somePassword';
      const expectedHashedPassword = 'encryptedPassword';

      const bcryptMock = mock<typeof bcrypt>({
        hash: async () => expectedHashedPassword,
      });
      const bcryptHashSpy = jest.spyOn(bcryptMock, 'hash');
      const passwordManager = new PasswordManagerImpl(bcryptMock);

      const hashedPassword = await passwordManager.hash(password);

      expect(hashedPassword).not.toEqual(password);
      expect(hashedPassword).toEqual(hashedPassword);
      expect(bcryptHashSpy).toHaveBeenCalledWith('somePassword', 10);
    });
  });

  describe('Compare password action', () => {
    it('should compare the password with hashed password correctly', async () => {
      const password = 'somePassword';
      const hashedPassword = 'someEncryptedPassword';

      const bcryptMock = mock<typeof bcrypt>({
        compare: async () => true,
      });
      const passwordManager = new PasswordManagerImpl(bcryptMock);

      await expect(
        passwordManager.compare(password, hashedPassword),
      ).resolves.not.toThrow(UnauthorizedException);
    });

    it('should throw error UnAuthorizedException when password not match', async () => {
      const password = 'somePassword';
      const hashedPassword = 'someEncryptedPassword';

      const bcryptMock = mock<typeof bcrypt>({
        compare: async () => false,
      });
      const passwordManager = new PasswordManagerImpl(bcryptMock);

      await expect(
        passwordManager.compare(password, hashedPassword),
      ).rejects.toThrow(
        new UnauthorizedException('Email or password is wrong!'),
      );
    });
  });
});
