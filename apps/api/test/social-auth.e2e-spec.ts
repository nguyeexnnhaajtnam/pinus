import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { AuthRateLimiter } from '../src/auth/auth-rate-limiter.service';
import { GlobalExceptionFilter } from '../src/common/global-exception.filter';
import { PrismaService } from '../src/database/prisma.service';
import {
  SocialCredentialException,
  SocialProviderUnavailableException,
} from '../src/auth/social/social.exception';
import {
  APPLE_IDENTITY_VERIFIER,
  GOOGLE_IDENTITY_VERIFIER,
  type AppleVerificationInput,
  type GoogleVerificationInput,
  type VerifiedSocialIdentity,
} from '../src/auth/social/social.types';

class FakeGoogleVerifier {
  calls = 0;
  identity: VerifiedSocialIdentity = Object.freeze({
    provider: 'google',
    providerSubject: 'google-subject',
    email: 'person@example.test',
  });

  verify(input: GoogleVerificationInput) {
    this.calls += 1;
    if (input.identityToken === 'invalid')
      throw new SocialCredentialException();
    if (input.identityToken === 'unavailable')
      throw new SocialProviderUnavailableException();
    return Promise.resolve(this.identity);
  }
}

class FakeAppleVerifier {
  identity: VerifiedSocialIdentity = Object.freeze({
    provider: 'apple',
    providerSubject: 'apple-subject',
  });

  verify(input: AppleVerificationInput) {
    if (input.identityToken === 'invalid')
      throw new SocialCredentialException();
    return Promise.resolve(this.identity);
  }
}

describe('Social authentication (PostgreSQL integration)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let limiter: AuthRateLimiter;
  const google = new FakeGoogleVerifier();
  const apple = new FakeAppleVerifier();

  beforeAll(async () => {
    const fixture = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(GOOGLE_IDENTITY_VERIFIER)
      .useValue(google)
      .overrideProvider(APPLE_IDENTITY_VERIFIER)
      .useValue(apple)
      .compile();
    app = fixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());
    await app.init();
    prisma = app.get(PrismaService);
    limiter = app.get(AuthRateLimiter);
  });

  beforeEach(async () => {
    limiter.reset();
    google.calls = 0;
    google.identity = Object.freeze({
      provider: 'google',
      providerSubject: 'google-subject',
      email: 'person@example.test',
    });
    apple.identity = Object.freeze({
      provider: 'apple',
      providerSubject: 'apple-subject',
    });
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => app.close());

  it('creates then reuses a Google identity and issues Pinus Sessions', async () => {
    const first = await request(app.getHttpServer())
      .post('/auth/social/google')
      .send({ identityToken: 'valid-google-token' });
    const second = await request(app.getHttpServer())
      .post('/auth/social/google')
      .send({ identityToken: 'another-valid-token' });

    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
    const firstBody: unknown = first.body;
    expect(firstBody).toMatchObject({
      accessToken: expect.any(String) as unknown,
      refreshToken: expect.any(String) as unknown,
    });
    expect(await prisma.user.count()).toBe(1);
    expect(await prisma.account.count()).toBe(1);
    expect(await prisma.session.count()).toBe(2);
  });

  it('accepts missing email and never merges identities by shared email', async () => {
    const appleResponse = await request(app.getHttpServer())
      .post('/auth/social/apple')
      .send({ identityToken: 'valid-apple-token', rawNonce: 'raw-nonce' });
    google.identity = Object.freeze({
      provider: 'google',
      providerSubject: 'google-subject',
      email: 'shared@example.test',
    });
    await request(app.getHttpServer())
      .post('/auth/social/google')
      .send({ identityToken: 'valid-google-token' });
    apple.identity = Object.freeze({
      provider: 'apple',
      providerSubject: 'second-apple-subject',
      email: 'shared@example.test',
    });
    await request(app.getHttpServer())
      .post('/auth/social/apple')
      .send({ identityToken: 'second-apple-token', rawNonce: 'raw-nonce' });

    expect(appleResponse.status).toBe(201);
    expect(await prisma.user.count()).toBe(3);
    expect(await prisma.account.count()).toBe(3);
  });

  it('converges concurrent first login on one User without an orphan', async () => {
    const responses = await Promise.all(
      Array.from({ length: 5 }, () =>
        request(app.getHttpServer())
          .post('/auth/social/google')
          .send({ identityToken: 'valid-google-token' }),
      ),
    );

    expect(responses.every((response) => response.status === 201)).toBe(true);
    expect(await prisma.user.count()).toBe(1);
    expect(await prisma.account.count()).toBe(1);
    expect(await prisma.session.count()).toBe(5);
  });

  it('keeps the same provider subject distinct across providers', async () => {
    google.identity = Object.freeze({
      provider: 'google',
      providerSubject: 'shared-provider-subject',
    });
    apple.identity = Object.freeze({
      provider: 'apple',
      providerSubject: 'shared-provider-subject',
    });
    await request(app.getHttpServer())
      .post('/auth/social/google')
      .send({ identityToken: 'valid-google-token' });
    await request(app.getHttpServer())
      .post('/auth/social/apple')
      .send({ identityToken: 'valid-apple-token', rawNonce: 'raw-nonce' });

    expect(await prisma.user.count()).toBe(2);
    expect(await prisma.account.count()).toBe(2);
  });

  it('rejects invalid proof and client identity injection with sanitized errors', async () => {
    const invalid = await request(app.getHttpServer())
      .post('/auth/social/google')
      .send({ identityToken: 'invalid' });
    const injected = await request(app.getHttpServer())
      .post('/auth/social/google')
      .send({ identityToken: 'valid', email: 'attacker@example.test' });
    const unsupported = await request(app.getHttpServer())
      .post('/auth/social/facebook')
      .send({ identityToken: 'valid' });

    expect(invalid.status).toBe(401);
    expect(JSON.stringify(invalid.body)).not.toContain('google-subject');
    expect(injected.status).toBe(400);
    expect(unsupported.status).toBe(404);
    expect(await prisma.user.count()).toBe(0);
    expect(await prisma.session.count()).toBe(0);
  });

  it('sanitizes temporary provider failure without persistence', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/social/google')
      .send({ identityToken: 'unavailable' });

    expect(response.status).toBe(503);
    expect(response.body).toMatchObject({
      errorId: 'SOCIAL_AUTH_PROVIDER_UNAVAILABLE',
    });
    expect(await prisma.user.count()).toBe(0);
    expect(await prisma.account.count()).toBe(0);
    expect(await prisma.session.count()).toBe(0);
  });

  it('persists no provider token or Apple raw nonce', async () => {
    await request(app.getHttpServer()).post('/auth/social/apple').send({
      identityToken: 'provider-token-secret',
      rawNonce: 'raw-nonce-secret',
    });
    const persisted = JSON.stringify({
      accounts: await prisma.account.findMany(),
      sessions: await prisma.session.findMany(),
    });
    expect(persisted).not.toContain('provider-token-secret');
    expect(persisted).not.toContain('raw-nonce-secret');
  });

  it('rate limits before verifier and persistence on request eleven', async () => {
    for (let index = 0; index < 10; index += 1) {
      await request(app.getHttpServer())
        .post('/auth/social/google')
        .send({ identityToken: 'invalid' });
    }
    const limited = await request(app.getHttpServer())
      .post('/auth/social/google')
      .send({ identityToken: 'valid-google-token' });

    expect(limited.status).toBe(429);
    expect(google.calls).toBe(10);
    expect(await prisma.user.count()).toBe(0);
    expect(await prisma.session.count()).toBe(0);
  });
});
