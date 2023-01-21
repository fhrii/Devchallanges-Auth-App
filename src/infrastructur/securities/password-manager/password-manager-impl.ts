import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PasswordManager } from '@/application/securities';

export class PasswordManagerImpl extends PasswordManager {
  constructor(private readonly crypt: typeof bcrypt) {
    super();
  }

  async hash(password: string) {
    return this.crypt.hash(password, 10);
  }

  async compare(password: string, hashedPassword: string) {
    const isPasswordTheSame = await this.crypt.compare(
      password,
      hashedPassword,
    );

    if (!isPasswordTheSame)
      throw new UnauthorizedException('Email or password is wrong!');
  }
}
