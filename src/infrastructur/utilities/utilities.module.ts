import { Module } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as uuid from 'uuid';

import { FileManager, Random } from '@/application/utilities';

import { FileManagerImpl } from './file-manager';
import { RandomImpl } from './random';

@Module({
  providers: [
    {
      provide: Random,
      useFactory: () => new RandomImpl(uuid.v4),
    },
    {
      provide: FileManager,
      useFactory: () => new FileManagerImpl(fs),
    },
  ],
  exports: [Random, FileManager],
})
export class UtilitiesModule {}
