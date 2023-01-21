export class ClientException extends Error {
  constructor(message: string, public readonly errorCode: number) {
    super(message);

    if (this.constructor.name === 'ClientException') {
      throw new Error("ClientException class can't be instantiated");
    }

    this.name = 'ClientException';
  }
}
