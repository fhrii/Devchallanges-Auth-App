import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof StreamableFile) return data;

        const { statusCode }: Response = context.switchToHttp().getResponse();

        if (typeof data === 'string') {
          const message = data;
          return { statusCode, message };
        }

        return { statusCode, data };
      }),
    );
  }
}
