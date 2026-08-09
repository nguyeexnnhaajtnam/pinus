import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { AuthRateLimiter } from '../src/auth/auth-rate-limiter.service';
import { GlobalExceptionFilter } from '../src/common/global-exception.filter';
import { PrismaService } from '../src/database/prisma.service';

describe('Authentication foundation (PostgreSQL integration)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let auth: AuthService;
  let limiter: AuthRateLimiter;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());
    await app.init();
    prisma = app.get(PrismaService);
    auth = app.get(AuthService);
    limiter = app.get(AuthRateLimiter);
  });

  beforeEach(async () => {
    limiter.reset();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => app.close());

  async function seedIdentity(subject = 'subject') {
    const user = await prisma.user.create({ data: {} });
    await prisma.account.create({
      data: { userId: user.id, provider: 'test', providerSubject: subject },
    });
    return user;
  }

  it('keeps email informational and provider identity unique', async () => {
    const first = await seedIdentity('first');
    const second = await prisma.user.create({ data: {} });
    await prisma.account.create({
      data: {
        userId: first.id,
        provider: 'test',
        providerSubject: 'with-email',
        email: 'shared@example.test',
      },
    });
    await expect(
      prisma.account.create({
        data: {
          userId: second.id,
          provider: 'other',
          providerSubject: 'other-subject',
          email: 'shared@example.test',
        },
      }),
    ).resolves.toBeDefined();
    await expect(
      prisma.account.create({
        data: { userId: second.id, provider: 'test', providerSubject: 'first' },
      }),
    ).rejects.toBeDefined();
  });

  it('revokes the deterministic oldest Session when creating a sixth', async () => {
    const user = await seedIdentity();
    for (let index = 0; index < 6; index += 1) {
      await auth.issueForVerifiedIdentity({
        provider: 'test',
        providerSubject: 'subject',
      });
    }
    const sessions = await prisma.session.findMany({
      where: { userId: user.id },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    });
    expect(sessions).toHaveLength(6);
    expect(sessions.filter((session) => !session.revokedAt)).toHaveLength(5);
    expect(sessions[0].revokedAt).not.toBeNull();
  });

  it('preserves the five-Session invariant during concurrent creation', async () => {
    await seedIdentity();
    await Promise.all(
      Array.from({ length: 6 }, () =>
        auth.issueForVerifiedIdentity({
          provider: 'test',
          providerSubject: 'subject',
        }),
      ),
    );
    expect(
      await prisma.session.count({
        where: { revokedAt: null, expiresAt: { gt: new Date() } },
      }),
    ).toBe(5);
  });

  it('rejects expired Sessions and mismatched ownership', async () => {
    await seedIdentity();
    const pair = await auth.issueForVerifiedIdentity({
      provider: 'test',
      providerSubject: 'subject',
    });
    const session = await prisma.session.findFirstOrThrow();
    await prisma.session.update({
      where: { id: session.id },
      data: { expiresAt: new Date(Date.now() - 1) },
    });
    await expect(auth.validateAccess(pair.accessToken)).rejects.toBeDefined();

    const other = await prisma.user.create({ data: {} });
    await prisma.session.update({
      where: { id: session.id },
      data: { userId: other.id, expiresAt: new Date(Date.now() + 60_000) },
    });
    await expect(auth.validateAccess(pair.accessToken)).rejects.toBeDefined();
  });

  it('rotates, rejects wrong token type, and revokes on reuse', async () => {
    await seedIdentity();
    const initial = await auth.issueForVerifiedIdentity({
      provider: 'test',
      providerSubject: 'subject',
    });
    const wrongType = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: initial.accessToken });
    expect(wrongType.status).toBe(401);
    const rotated = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: initial.refreshToken });
    expect(rotated.status).toBe(201);
    const reuse = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: initial.refreshToken });
    expect(reuse.status).toBe(401);
    const rotatedBody: unknown = rotated.body;
    if (
      !rotatedBody ||
      typeof rotatedBody !== 'object' ||
      !('refreshToken' in rotatedBody) ||
      typeof rotatedBody.refreshToken !== 'string'
    ) {
      throw new Error('Expected a refresh token response');
    }
    const successor = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: rotatedBody.refreshToken });
    expect(successor.status).toBe(401);
  });

  it('allows at most one race rotation and then revokes the device Session', async () => {
    await seedIdentity();
    const initial = await auth.issueForVerifiedIdentity({
      provider: 'test',
      providerSubject: 'subject',
    });
    const results = await Promise.all([
      request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: initial.refreshToken }),
      request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: initial.refreshToken }),
    ]);
    expect(
      results.filter((result) => result.status === 201).length,
    ).toBeLessThanOrEqual(1);
    const session = await prisma.session.findFirstOrThrow();
    expect(session.revokedAt).not.toBeNull();
  });

  it('does not revoke a Session from fabricated stale claims', async () => {
    await seedIdentity();
    const initial = await auth.issueForVerifiedIdentity({
      provider: 'test',
      providerSubject: 'subject',
    });
    const fabricated = `${initial.refreshToken.slice(0, -1)}x`;
    const response = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: fabricated });
    expect(response.status).toBe(401);
    expect((await prisma.session.findFirstOrThrow()).revokedAt).toBeNull();
  });

  it('keeps the fixed Session expiry across refresh rotation', async () => {
    await seedIdentity();
    const initial = await auth.issueForVerifiedIdentity({
      provider: 'test',
      providerSubject: 'subject',
    });
    const before = await prisma.session.findFirstOrThrow();
    await auth.refresh(initial.refreshToken);
    const after = await prisma.session.findFirstOrThrow();
    expect(after.expiresAt).toEqual(before.expiresAt);
  });

  it('rate limits auth endpoints without mutating Sessions', async () => {
    await seedIdentity();
    await auth.issueForVerifiedIdentity({
      provider: 'test',
      providerSubject: 'subject',
    });
    const before = await prisma.session.findFirstOrThrow();
    for (let index = 0; index < 10; index += 1) {
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: `invalid-${index}` });
    }
    const limited = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: 'invalid-excess' });
    expect(limited.status).toBe(429);
    expect(await prisma.session.findFirstOrThrow()).toMatchObject({
      id: before.id,
      refreshTokenHash: before.refreshTokenHash,
      refreshTokenVersion: before.refreshTokenVersion,
      revokedAt: null,
    });
  });

  it('signs out current or other Sessions without crossing User ownership', async () => {
    await seedIdentity();
    const current = await auth.issueForVerifiedIdentity({
      provider: 'test',
      providerSubject: 'subject',
    });
    await auth.issueForVerifiedIdentity({
      provider: 'test',
      providerSubject: 'subject',
    });
    const otherUser = await seedIdentity('other-subject');
    await auth.issueForVerifiedIdentity({
      provider: 'test',
      providerSubject: 'other-subject',
    });
    const others = await request(app.getHttpServer())
      .post('/auth/sign-out-others')
      .set('Authorization', `Bearer ${current.accessToken}`);
    expect(others.status).toBe(201);
    expect(
      await prisma.session.count({
        where: { userId: otherUser.id, revokedAt: null },
      }),
    ).toBe(1);
    const currentClaims = await auth.validateAccess(current.accessToken);
    expect(currentClaims.userId).toBeDefined();
    const signOut = await request(app.getHttpServer())
      .post('/auth/sign-out')
      .set('Authorization', `Bearer ${current.accessToken}`);
    expect(signOut.status).toBe(201);
    const repeatedSignOut = await request(app.getHttpServer())
      .post('/auth/sign-out')
      .set('Authorization', `Bearer ${current.accessToken}`);
    expect(repeatedSignOut.status).toBe(201);
    await expect(
      auth.validateAccess(current.accessToken),
    ).rejects.toBeDefined();
  });
});
