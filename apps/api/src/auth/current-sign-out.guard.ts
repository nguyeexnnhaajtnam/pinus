import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticationException } from './auth.exception';
import type { AuthenticatedRequest } from './auth.guard';
import { AuthService } from './auth.service';

@Injectable()
export class CurrentSignOutGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;
    if (!authorization?.startsWith('Bearer '))
      throw new AuthenticationException();
    request.currentUser = await this.auth.validateAccessForCurrentSignOut(
      authorization.slice(7),
    );
    return true;
  }
}
