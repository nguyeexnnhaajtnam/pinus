import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ACCESS_TOKEN_TTL_SECONDS } from './auth.constants';
import { AuthenticationException } from './auth.exception';
import { TokenService } from './token.service';

describe('TokenService', () => {
  const values: Record<string, string> = {
    JWT_ACCESS_SECRET: 'access-test-secret-at-least-32-characters',
    JWT_REFRESH_SECRET: 'refresh-test-secret-at-least-32-characters',
    JWT_ISSUER: 'pinus-test',
    JWT_AUDIENCE: 'pinus-mobile-test',
  };
  const service = new TokenService(new JwtService(), {
    getOrThrow: (key: string) => values[key],
  } as ConfigService);

  it('issues separated token types with approved access lifetime', async () => {
    const pair = await service.issuePair({
      userId: 'user',
      sessionId: 'session',
      version: 0,
      sessionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    await expect(service.verifyAccess(pair.accessToken)).resolves.toMatchObject(
      {
        sub: 'user',
        sid: 'session',
        type: 'access',
      },
    );
    await expect(
      service.verifyRefresh(pair.refreshToken),
    ).resolves.toMatchObject({
      sub: 'user',
      sid: 'session',
      type: 'refresh',
      ver: 0,
    });
    expect(pair.accessTokenExpiresIn).toBe(ACCESS_TOKEN_TTL_SECONDS);
  });

  it('rejects using a token for the wrong purpose', async () => {
    const pair = await service.issuePair({
      userId: 'user',
      sessionId: 'session',
      version: 0,
      sessionExpiresAt: new Date(Date.now() + 60_000),
    });
    await expect(
      service.verifyAccess(pair.refreshToken),
    ).rejects.toBeInstanceOf(AuthenticationException);
    await expect(
      service.verifyRefresh(pair.accessToken),
    ).rejects.toBeInstanceOf(AuthenticationException);
  });

  it('hashes deterministically and compares safely', () => {
    const hash = service.hashRefreshToken('high-entropy-token');
    expect(hash).toHaveLength(64);
    expect(service.hashesMatch(hash, hash)).toBe(true);
    expect(service.hashesMatch(hash, service.hashRefreshToken('other'))).toBe(
      false,
    );
  });
});
