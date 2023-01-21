import { User } from '@/domain/user';

declare module 'express' {
  export interface Request {
    user: User;
  }
}
