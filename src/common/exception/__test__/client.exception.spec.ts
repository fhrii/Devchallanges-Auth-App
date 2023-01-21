import { ClientException } from '../client.exception';

describe('Client Exception', () => {
  it('should throw error when directly use it', () => {
    expect(() => new ClientException('Error', 500)).toThrow(
      "ClientException class can't be instantiated",
    );
  });
});
