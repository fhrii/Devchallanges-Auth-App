import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, HttpAdapterHost } from '@nestjs/core';

import { AuthModule } from '../auth';
import { AllExceptionFilter } from '../common/filters/all-exception.filter';
import { TransformResponseInterceptor } from '../common/interceptors/transform-response.interceptor';
import { ConfigModule } from '../config';
import { ControllersModule } from '../controllers';

@Module({
  imports: [AuthModule, ConfigModule, ControllersModule],
  providers: [
    {
      provide: APP_FILTER,
      inject: [HttpAdapterHost],
      useFactory: (httpAdapter: HttpAdapterHost) =>
        new AllExceptionFilter(httpAdapter),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
