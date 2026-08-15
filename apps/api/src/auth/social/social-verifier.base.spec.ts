import { createHash } from 'node:crypto';
import { createServer, type Server } from 'node:http';
import { ConfigService } from '@nestjs/config';
import {
  createLocalJWKSet,
  exportJWK,
  generateKeyPair,
  SignJWT,
  type JWTVerifyGetKey,
  type JWTPayload,
  type KeyLike,
} from 'jose';
import {
  SocialCredentialException,
  SocialProviderUnavailableException,
} from './social.exception';
import { AppleIdentityTokenVerifier } from './apple-identity.verifier';
import { GoogleIdentityTokenVerifier } from './google-identity.verifier';
import { SocialVerifierBase } from './social-verifier.base';

class ControlledVerifier extends SocialVerifierBase {
  constructor(keySet: JWTVerifyGetKey) {
    super('https://unused.example/jwks', 'https://issuer.example', [
      'pinus-audience',
    ]);
    this.useKeySet(keySet);
  }

  verify(token: string) {
    return this.verifyJwt(token);
  }

  nonce(raw: string) {
    return this.hashNonce(raw);
  }
}

class ControlledRemoteVerifier extends SocialVerifierBase {
  constructor(jwksUrl: string) {
    super(jwksUrl, 'https://issuer.example', ['pinus-audience'], {
      cooldownDuration: 0,
      cacheMaxAge: 60_000,
      timeoutDuration: 1_000,
    });
  }

  verify(token: string) {
    return this.verifyJwt(token);
  }
}

class ControlledGoogleVerifier extends GoogleIdentityTokenVerifier {
  constructor(keySet: JWTVerifyGetKey) {
    super(new ConfigService({ GOOGLE_AUTH_AUDIENCES: ['pinus-audience'] }));
    this.useKeySet(keySet);
  }
}

class ControlledAppleVerifier extends AppleIdentityTokenVerifier {
  constructor(keySet: JWTVerifyGetKey) {
    super(new ConfigService({ APPLE_AUTH_AUDIENCES: ['pinus-audience'] }));
    this.useKeySet(keySet);
  }
}

describe('SocialVerifierBase', () => {
  let privateKey: KeyLike;
  let verifier: ControlledVerifier;
  let keySet: JWTVerifyGetKey;

  beforeAll(async () => {
    const pair = await generateKeyPair('RS256');
    privateKey = pair.privateKey;
    const publicJwk = await exportJWK(pair.publicKey);
    keySet = createLocalJWKSet({
      keys: [{ ...publicJwk, kid: 'controlled-key' }],
    });
    verifier = new ControlledVerifier(keySet);
  });

  async function token(overrides: Partial<JWTPayload> = {}) {
    const now = Math.floor(Date.now() / 1000);
    const payload: JWTPayload = {
      sub: 'provider-subject',
      iss: 'https://issuer.example',
      aud: 'pinus-audience',
      iat: now,
      exp: now + 300,
      ...overrides,
    };
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'RS256', kid: 'controlled-key' })
      .sign(privateKey);
  }

  it('accepts a controlled valid identity token', async () => {
    await expect(verifier.verify(await token())).resolves.toMatchObject({
      sub: 'provider-subject',
    });
  });

  it.each([
    ['issuer', { iss: 'https://attacker.example' }],
    ['audience', { aud: 'different-audience' }],
    ['subject', { sub: '' }],
    ['issued-at', { iat: undefined }],
    ['expiry', { exp: 1 }],
  ])('rejects invalid %s claims', async (_name, claims) => {
    await expect(verifier.verify(await token(claims))).rejects.toBeInstanceOf(
      SocialCredentialException,
    );
  });

  it('rejects an invalid signature and malformed token', async () => {
    const other = await generateKeyPair('RS256');
    const now = Math.floor(Date.now() / 1000);
    const wrongSignature = await new SignJWT({ sub: 'provider-subject' })
      .setProtectedHeader({ alg: 'RS256', kid: 'controlled-key' })
      .setIssuer('https://issuer.example')
      .setAudience('pinus-audience')
      .setIssuedAt(now)
      .setExpirationTime(now + 300)
      .sign(other.privateKey);
    await expect(verifier.verify(wrongSignature)).rejects.toBeInstanceOf(
      SocialCredentialException,
    );
    await expect(verifier.verify('not-a-jwt')).rejects.toBeInstanceOf(
      SocialCredentialException,
    );
  });

  it('hashes the ephemeral Apple nonce with SHA-256', () => {
    expect(verifier.nonce('raw-nonce')).toBe(
      createHash('sha256').update('raw-nonce').digest('hex'),
    );
  });

  it('normalizes a verified Google subject and optional email', async () => {
    const google = new ControlledGoogleVerifier(keySet);
    const identity = await google.verify({
      identityToken: await token({
        iss: 'https://accounts.google.com',
        email: ' person@example.test ',
      }),
    });
    expect(identity).toEqual({
      provider: 'google',
      providerSubject: 'provider-subject',
      email: 'person@example.test',
    });
    expect(Object.isFrozen(identity)).toBe(true);
  });

  it('enforces Apple nonce binding and allows missing email', async () => {
    const apple = new ControlledAppleVerifier(keySet);
    const rawNonce = 'raw-nonce';
    const identityToken = await token({
      iss: 'https://appleid.apple.com',
      nonce: createHash('sha256').update(rawNonce).digest('hex'),
    });
    await expect(apple.verify({ identityToken, rawNonce })).resolves.toEqual({
      provider: 'apple',
      providerSubject: 'provider-subject',
      email: undefined,
    });
    await expect(
      apple.verify({ identityToken, rawNonce: 'wrong-nonce' }),
    ).rejects.toBeInstanceOf(SocialCredentialException);
  });

  it('maps key retrieval failures to retryable provider unavailability', async () => {
    const unavailable = new ControlledVerifier(() => {
      throw new TypeError('network details must not escape');
    });
    await expect(unavailable.verify(await token())).rejects.toBeInstanceOf(
      SocialProviderUnavailableException,
    );
  });

  it('reuses cached keys, refreshes once for a new key ID, and bounds misses', async () => {
    const first = await generateKeyPair('RS256');
    const second = await generateKeyPair('RS256');
    const missing = await generateKeyPair('RS256');
    const firstJwk = { ...(await exportJWK(first.publicKey)), kid: 'first' };
    const secondJwk = { ...(await exportJWK(second.publicKey)), kid: 'second' };
    let keys = [firstJwk];
    let requests = 0;
    const server: Server = createServer((_request, response) => {
      requests += 1;
      response.setHeader('content-type', 'application/json');
      response.end(JSON.stringify({ keys }));
    });
    await new Promise<void>((resolve) =>
      server.listen(0, '127.0.0.1', resolve),
    );
    const address = server.address();
    if (!address || typeof address === 'string')
      throw new Error('No test port');
    const remote = new ControlledRemoteVerifier(
      `http://127.0.0.1:${address.port}/jwks`,
    );
    const now = Math.floor(Date.now() / 1000);
    const sign = (key: KeyLike, kid: string) =>
      new SignJWT({ sub: 'provider-subject' })
        .setProtectedHeader({ alg: 'RS256', kid })
        .setIssuer('https://issuer.example')
        .setAudience('pinus-audience')
        .setIssuedAt(now)
        .setExpirationTime(now + 300)
        .sign(key);

    try {
      const firstToken = await sign(first.privateKey, 'first');
      await remote.verify(firstToken);
      await remote.verify(firstToken);
      expect(requests).toBe(1);

      keys = [firstJwk, secondJwk];
      await remote.verify(await sign(second.privateKey, 'second'));
      expect(requests).toBe(2);

      await expect(
        remote.verify(await sign(missing.privateKey, 'missing')),
      ).rejects.toBeInstanceOf(SocialCredentialException);
      expect(requests).toBe(3);
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
    }
  });
});
