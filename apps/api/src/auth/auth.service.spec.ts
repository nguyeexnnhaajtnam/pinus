import { AuthenticationException } from './auth.exception';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const session = {
    id: 'session',
    userId: 'user',
    refreshTokenVersion: 0,
    refreshTokenHash: 'hash',
    expiresAt: new Date(Date.now() + 60_000),
    revokedAt: null,
  };
  const tokens = {
    verifyAccess: jest
      .fn()
      .mockResolvedValue({ sub: 'user', sid: 'session', type: 'access' }),
    verifyRefresh: jest.fn(),
    issuePair: jest.fn(),
    hashRefreshToken: jest.fn(),
  };
  const sessions = {
    findSession: jest.fn().mockResolvedValue(session),
    revokeCurrent: jest.fn(),
    revokeOthers: jest.fn(),
    rotate: jest.fn(),
    createForUser: jest.fn(),
  };
  const service = new AuthService(
    { account: { findUnique: jest.fn() } } as never,
    sessions as never,
    tokens as never,
    { checkRefreshSession: jest.fn() } as never,
  );

  beforeEach(() => jest.clearAllMocks());

  it('creates immutable current-user context only for a live owned session', async () => {
    const context = await service.validateAccess('access');
    expect(context).toEqual({ userId: 'user', sessionId: 'session' });
    expect(Object.isFrozen(context)).toBe(true);
  });

  it('rejects a revoked session immediately', async () => {
    sessions.findSession.mockResolvedValueOnce({
      ...session,
      revokedAt: new Date(),
    });
    await expect(service.validateAccess('access')).rejects.toBeInstanceOf(
      AuthenticationException,
    );
  });

  it('allows an owned revoked session only for idempotent current sign-out', async () => {
    sessions.findSession.mockResolvedValueOnce({
      ...session,
      revokedAt: new Date(),
    });
    await expect(
      service.validateAccessForCurrentSignOut('access'),
    ).resolves.toEqual({ userId: 'user', sessionId: 'session' });
  });

  it('scopes sign-out operations to verified context', async () => {
    const context = { userId: 'user', sessionId: 'session' };
    await service.signOutCurrent(context);
    await service.signOutOthers(context);
    expect(sessions.revokeCurrent).toHaveBeenCalledWith('user', 'session');
    expect(sessions.revokeOthers).toHaveBeenCalledWith('user', 'session');
  });
});
