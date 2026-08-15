import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AuthenticationException } from './auth.exception';
import { AuthRateLimiter } from './auth-rate-limiter.service';
import type {
  CurrentUserContext,
  TokenPair,
  TrustedProviderIdentity,
} from './auth.types';
import { SessionRepository } from './session.repository';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sessions: SessionRepository,
    private readonly tokens: TokenService,
    private readonly limiter: AuthRateLimiter,
  ) {}

  async issueForVerifiedIdentity(
    identity: TrustedProviderIdentity,
  ): Promise<TokenPair> {
    const provider = identity.provider.trim().toLowerCase();
    if (!provider || !identity.providerSubject)
      throw new AuthenticationException();
    const account = await this.prisma.account.findUnique({
      where: {
        provider_providerSubject: {
          provider,
          providerSubject: identity.providerSubject,
        },
      },
    });
    if (!account) throw new AuthenticationException();
    return this.issueForUser(account.userId);
  }

  async issueForUser(userId: string): Promise<TokenPair> {
    let pair: TokenPair | undefined;
    await this.sessions.createForUser(userId, async (sessionId, expiresAt) => {
      pair = await this.tokens.issuePair({
        userId,
        sessionId,
        version: 0,
        sessionExpiresAt: expiresAt,
      });
      return this.tokens.hashRefreshToken(pair.refreshToken);
    });
    if (!pair) throw new AuthenticationException();
    return pair;
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    const claims = await this.tokens.verifyRefresh(refreshToken);
    this.limiter.checkRefreshSession(claims.sid);
    const session = await this.sessions.findSession(claims.sid);
    if (
      !session ||
      session.userId !== claims.sub ||
      session.revokedAt ||
      session.expiresAt <= new Date()
    )
      throw new AuthenticationException();

    const nextPair = await this.tokens.issuePair({
      userId: claims.sub,
      sessionId: claims.sid,
      version: claims.ver + 1,
      sessionExpiresAt: session.expiresAt,
    });
    const outcome = await this.sessions.rotate({
      sessionId: claims.sid,
      userId: claims.sub,
      expectedVersion: claims.ver,
      expectedHash: this.tokens.hashRefreshToken(refreshToken),
      nextHash: this.tokens.hashRefreshToken(nextPair.refreshToken),
    });
    if (outcome !== 'rotated') throw new AuthenticationException();
    return nextPair;
  }

  async validateAccess(accessToken: string): Promise<CurrentUserContext> {
    const claims = await this.tokens.verifyAccess(accessToken);
    const session = await this.sessions.findSession(claims.sid);
    if (
      !session ||
      session.userId !== claims.sub ||
      session.revokedAt ||
      session.expiresAt <= new Date()
    )
      throw new AuthenticationException('AUTH_SESSION_INVALID');
    return Object.freeze({ userId: claims.sub, sessionId: claims.sid });
  }

  async validateAccessForCurrentSignOut(
    accessToken: string,
  ): Promise<CurrentUserContext> {
    const claims = await this.tokens.verifyAccess(accessToken);
    const session = await this.sessions.findSession(claims.sid);
    if (
      !session ||
      session.userId !== claims.sub ||
      session.expiresAt <= new Date()
    )
      throw new AuthenticationException('AUTH_SESSION_INVALID');
    return Object.freeze({ userId: claims.sub, sessionId: claims.sid });
  }

  signOutCurrent(context: CurrentUserContext): Promise<void> {
    return this.sessions.revokeCurrent(context.userId, context.sessionId);
  }

  signOutOthers(context: CurrentUserContext): Promise<void> {
    return this.sessions.revokeOthers(context.userId, context.sessionId);
  }
}
