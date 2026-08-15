import { timingSafeEqual } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SocialCredentialException } from './social.exception';
import { SocialVerifierBase } from './social-verifier.base';
import type {
  AppleIdentityVerifier,
  AppleVerificationInput,
  VerifiedSocialIdentity,
} from './social.types';

@Injectable()
export class AppleIdentityTokenVerifier
  extends SocialVerifierBase
  implements AppleIdentityVerifier
{
  constructor(config: ConfigService) {
    super(
      'https://appleid.apple.com/auth/keys',
      'https://appleid.apple.com',
      config.getOrThrow<string[]>('APPLE_AUTH_AUDIENCES'),
    );
  }

  async verify(input: AppleVerificationInput): Promise<VerifiedSocialIdentity> {
    const payload = await this.verifyJwt(input.identityToken);
    const actual = typeof payload.nonce === 'string' ? payload.nonce : '';
    const expected = this.hashNonce(input.rawNonce);
    const left = Buffer.from(actual);
    const right = Buffer.from(expected);
    if (left.length !== right.length || !timingSafeEqual(left, right)) {
      throw new SocialCredentialException();
    }
    return Object.freeze({
      provider: 'apple',
      providerSubject: payload.sub!,
      email: this.optionalEmail(payload),
    });
  }
}
