import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthenticationException } from '../auth.exception';

export class SocialCredentialException extends AuthenticationException {
  constructor() {
    super('SOCIAL_AUTH_INVALID_CREDENTIAL');
  }
}

export class SocialProviderUnavailableException extends HttpException {
  constructor() {
    super(
      {
        errorId: 'SOCIAL_AUTH_PROVIDER_UNAVAILABLE',
        message: 'Authentication provider is temporarily unavailable',
      },
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}
