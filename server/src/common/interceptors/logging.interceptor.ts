import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    
    const { method, url } = req;
    const userAgent = req.get('User-Agent') || '';
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const { statusCode } = res;
        const duration = Date.now() - start;
        
        this.logger.log(
          `${method} ${url} ${statusCode} ${duration}ms - ${userAgent}`,
        );
      }),
    );
  }
}
