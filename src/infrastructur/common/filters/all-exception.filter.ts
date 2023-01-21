import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { ClientException } from '@/common/exception';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapter: HttpAdapterHost) {}

  catch(exception: Error, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapter;
    const ctx = host.switchToHttp();

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse() as Record<string, any>;
      const message = Array.isArray(exceptionResponse.message)
        ? exceptionResponse.message[0]
        : exceptionResponse.message;

      const responseBody = {
        statusCode,
        message,
      };

      httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
      return;
    }

    if (exception instanceof ClientException) {
      const statusCode = exception.errorCode;
      const { message } = exception;
      const responseBody = {
        statusCode,
        message,
      };

      httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
      return;
    }

    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const { message } = exception;

    const responseBody = {
      statusCode,
      message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}
