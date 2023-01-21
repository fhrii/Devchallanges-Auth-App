export enum UserProviderEnum {
  EMAIL = 'EMAIL',
  GITHUB = 'GITHUB',
}

export type UserProvider = keyof typeof UserProviderEnum;
