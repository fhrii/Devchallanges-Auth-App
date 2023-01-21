import { BadRequestException } from '../bad-request.exception';
import { ClientException } from '../client.exception';

describe('Bad Request Exception', () => {
  it('should create an error correctly', () => {
    const badRequestException = new BadRequestException('an error occurs');

    expect(badRequestException).toBeInstanceOf(BadRequestException);
    expect(badRequestException).toBeInstanceOf(ClientException);
    expect(badRequestException).toBeInstanceOf(Error);
    expect(badRequestException.errorCode).toBe(400);
    expect(badRequestException.message).toBe('an error occurs');
    expect(badRequestException.name).toBe('BadRequestException');
  });
});
