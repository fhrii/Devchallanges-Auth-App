import { Module } from '@nestjs/common';

import { DatabaseModule, DatabaseService } from '../database';
import { ProfileRepositoryImpl } from './profile';
import { UserRepositoryImpl } from './user';

@Module({
  imports: [DatabaseModule],
  providers: [DatabaseService, ProfileRepositoryImpl, UserRepositoryImpl],
  exports: [ProfileRepositoryImpl, UserRepositoryImpl],
})
export class RepositoriesModule {}
