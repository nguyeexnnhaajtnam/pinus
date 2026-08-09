import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { AuthRateLimiter } from './auth-rate-limiter.service';

@Injectable()
export class AuthIpRateGuard implements CanActivate {
  constructor(private readonly limiter: AuthRateLimiter) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    this.limiter.checkIp(
      request.ip || request.socket.remoteAddress || 'unknown',
    );
    return true;
  }
}
