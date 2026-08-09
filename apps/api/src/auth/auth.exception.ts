import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthenticationException extends HttpException {
  constructor(errorId = 'AUTH_INVALID_CREDENTIAL') {
    super(
      { errorId, message: 'Authentication failed' },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class AuthenticationRateLimitException extends HttpException {
  constructor() {
    super(
      { errorId: 'AUTH_RATE_LIMITED', message: 'Too many requests' },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
