import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SocialVerifierBase } from './social-verifier.base';
import type {
  GoogleIdentityVerifier,
  GoogleVerificationInput,
  VerifiedSocialIdentity,
} from './social.types';

@Injectable()
export class GoogleIdentityTokenVerifier
  extends SocialVerifierBase
  implements GoogleIdentityVerifier
{
  constructor(config: ConfigService) {
    super(
      'https://www.googleapis.com/oauth2/v3/certs',
      ['https://accounts.google.com', 'accounts.google.com'],
      config.getOrThrow<string[]>('GOOGLE_AUTH_AUDIENCES'),
    );
  }

  async verify(
    input: GoogleVerificationInput,
  ): Promise<VerifiedSocialIdentity> {
    const payload = await this.verifyJwt(input.identityToken);
    return Object.freeze({
      provider: 'google',
      providerSubject: payload.sub!,
      email: this.optionalEmail(payload),
    });
  }
}
