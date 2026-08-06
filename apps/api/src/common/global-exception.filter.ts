import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

export interface ErrorEnvelope {
  statusCode: number;
  errorId: string;
  message: string;
  path: string;
  timestamp: string;
  correlationId: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request & { id?: string }>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const body =
      exception instanceof HttpException ? exception.getResponse() : undefined;
    response.status(status).json({
      statusCode: status,
      errorId: status === 500 ? 'INTERNAL_SERVER_ERROR' : `HTTP_${status}`,
      message: this.messageFor(status, body),
      path: request.originalUrl ?? request.url,
      timestamp: new Date().toISOString(),
      correlationId: request.id ?? 'unavailable',
    } satisfies ErrorEnvelope);
  }

  private messageFor(
    status: number,
    body: string | object | undefined,
  ): string {
    if (status >= 500) return 'Internal server error';
    if (typeof body === 'string') return body;
    if (body && 'message' in body) {
      const message = body.message;
      return Array.isArray(message) ? message.join(', ') : String(message);
    }
    return 'Request failed';
  }
}
