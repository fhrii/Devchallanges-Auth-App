import { v4 as uuidv4 } from 'uuid';

import { Random } from '@/application/utilities';

export class RandomImpl extends Random {
  constructor(private readonly uuid: typeof uuidv4) {
    super();
  }

  async generateString(): Promise<string> {
    return this.uuid();
  }
}
