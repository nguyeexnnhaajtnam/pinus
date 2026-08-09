import { createHash, randomUUID, timingSafeEqual } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
} from './auth.constants';
import { AuthenticationException } from './auth.exception';
import type { AccessClaims, RefreshClaims, TokenPair } from './auth.types';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async issuePair(input: {
    userId: string;
    sessionId: string;
    version: number;
    sessionExpiresAt: Date;
  }): Promise<TokenPair> {
    const common = {
      issuer: this.config.getOrThrow<string>('JWT_ISSUER'),
      audience: this.config.getOrThrow<string>('JWT_AUDIENCE'),
    };
    const remaining = Math.max(
      1,
      Math.floor((input.sessionExpiresAt.getTime() - Date.now()) / 1000),
    );
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        { sub: input.userId, sid: input.sessionId, type: 'access' },
        {
          ...common,
          secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
          expiresIn: ACCESS_TOKEN_TTL_SECONDS,
        },
      ),
      this.jwt.signAsync(
        {
          sub: input.userId,
          sid: input.sessionId,
          ver: input.version,
          jti: randomUUID(),
          type: 'refresh',
        },
        {
          ...common,
          secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
          expiresIn: Math.min(REFRESH_TOKEN_TTL_SECONDS, remaining),
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      accessTokenExpiresIn: ACCESS_TOKEN_TTL_SECONDS,
    };
  }

  async verifyAccess(token: string): Promise<AccessClaims> {
    const claims = await this.verify<AccessClaims>(token, 'JWT_ACCESS_SECRET');
    if (claims.type !== 'access' || !claims.sub || !claims.sid) {
      throw new AuthenticationException();
    }
    return claims;
  }

  async verifyRefresh(token: string): Promise<RefreshClaims> {
    const claims = await this.verify<RefreshClaims>(
      token,
      'JWT_REFRESH_SECRET',
    );
    if (
      claims.type !== 'refresh' ||
      !claims.sub ||
      !claims.sid ||
      !Number.isInteger(claims.ver) ||
      !claims.jti
    ) {
      throw new AuthenticationException();
    }
    return claims;
  }

  hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  hashesMatch(left: string, right: string): boolean {
    const a = Buffer.from(left, 'hex');
    const b = Buffer.from(right, 'hex');
    return a.length === b.length && timingSafeEqual(a, b);
  }

  private async verify<T extends object>(
    token: string,
    secretKey: string,
  ): Promise<T> {
    try {
      return await this.jwt.verifyAsync<T>(token, {
        secret: this.config.getOrThrow<string>(secretKey),
        issuer: this.config.getOrThrow<string>('JWT_ISSUER'),
        audience: this.config.getOrThrow<string>('JWT_AUDIENCE'),
      });
    } catch {
      throw new AuthenticationException();
    }
  }
}
