import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { AuthenticationException } from './auth.exception';
import { AuthService } from './auth.service';
import type { CurrentUserContext } from './auth.types';

export type AuthenticatedRequest = Request & {
  currentUser?: CurrentUserContext;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;
    if (!authorization?.startsWith('Bearer '))
      throw new AuthenticationException();
    request.currentUser = await this.auth.validateAccess(
      authorization.slice(7),
    );
    return true;
  }
}
