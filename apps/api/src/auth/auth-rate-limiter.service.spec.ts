import { AuthenticationRateLimitException } from './auth.exception';
import { AuthRateLimiter } from './auth-rate-limiter.service';

describe('AuthRateLimiter', () => {
  it('limits every IP after ten requests per minute', () => {
    const limiter = new AuthRateLimiter();
    for (let index = 0; index < 10; index += 1) limiter.checkIp('127.0.0.1');
    expect(() => limiter.checkIp('127.0.0.1')).toThrow(
      AuthenticationRateLimitException,
    );
    expect(() => limiter.checkIp('127.0.0.2')).not.toThrow();
  });

  it('additionally limits refresh by session', () => {
    const limiter = new AuthRateLimiter();
    for (let index = 0; index < 30; index += 1)
      limiter.checkRefreshSession('session');
    expect(() => limiter.checkRefreshSession('session')).toThrow(
      AuthenticationRateLimitException,
    );
  });
});
