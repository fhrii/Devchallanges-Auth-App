import { Random } from '../random';

describe('Random', () => {
  it('should throw error when invoke abstract method', async () => {
    const random = new Random();

    await expect(random.generateString()).rejects.toThrow(
      'RANDOM.GENERATE_STRING.METHOD_NOT_IMPLEMENTED',
    );
  });
});
