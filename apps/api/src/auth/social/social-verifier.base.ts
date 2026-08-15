import { createHash } from 'node:crypto';
import {
  createRemoteJWKSet,
  errors,
  jwtVerify,
  type JWTVerifyGetKey,
  type JWTPayload,
  type RemoteJWKSetOptions,
} from 'jose';
import {
  SocialCredentialException,
  SocialProviderUnavailableException,
} from './social.exception';

export abstract class SocialVerifierBase {
  private keySet: JWTVerifyGetKey;

  protected constructor(
    jwksUrl: string,
    private readonly issuer: string | string[],
    private readonly audiences: string[],
    keySetOptions: RemoteJWKSetOptions = {},
  ) {
    this.keySet = createRemoteJWKSet(new URL(jwksUrl), {
      cooldownDuration: 30_000,
      cacheMaxAge: 10 * 60_000,
      timeoutDuration: 5_000,
      ...keySetOptions,
    });
  }

  protected useKeySet(keySet: JWTVerifyGetKey): void {
    this.keySet = keySet;
  }

  protected async verifyJwt(token: string): Promise<JWTPayload> {
    try {
      const { payload } = await jwtVerify(token, this.keySet, {
        issuer: this.issuer,
        audience: this.audiences,
        clockTolerance: 30,
        algorithms: ['RS256'],
        requiredClaims: ['sub', 'iat', 'exp'],
      });
      if (!payload.sub?.trim()) throw new SocialCredentialException();
      return payload;
    } catch (error) {
      if (error instanceof SocialCredentialException) throw error;
      if (
        error instanceof errors.JWKSTimeout ||
        error instanceof TypeError ||
        (error instanceof errors.JOSEError &&
          error.code === 'ERR_JWKS_FETCH_FAILED')
      ) {
        throw new SocialProviderUnavailableException();
      }
      throw new SocialCredentialException();
    }
  }

  protected optionalEmail(payload: JWTPayload): string | undefined {
    return typeof payload.email === 'string' && payload.email.trim()
      ? payload.email.trim()
      : undefined;
  }

  protected hashNonce(rawNonce: string): string {
    return createHash('sha256').update(rawNonce).digest('hex');
  }
}
