import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import type { TokenPair } from '../auth.types';
import { SocialIdentityRepository } from './social-identity.repository';
import {
  APPLE_IDENTITY_VERIFIER,
  GOOGLE_IDENTITY_VERIFIER,
  type AppleIdentityVerifier,
  type GoogleIdentityVerifier,
} from './social.types';

@Injectable()
export class SocialAuthService {
  constructor(
    @Inject(GOOGLE_IDENTITY_VERIFIER)
    private readonly google: GoogleIdentityVerifier,
    @Inject(APPLE_IDENTITY_VERIFIER)
    private readonly apple: AppleIdentityVerifier,
    private readonly identities: SocialIdentityRepository,
    private readonly auth: AuthService,
  ) {}

  async authenticateGoogle(identityToken: string): Promise<TokenPair> {
    const identity = await this.google.verify({ identityToken });
    const userId = await this.identities.resolveOrCreate(identity);
    return this.auth.issueForUser(userId);
  }

  async authenticateApple(
    identityToken: string,
    rawNonce: string,
  ): Promise<TokenPair> {
    const identity = await this.apple.verify({ identityToken, rawNonce });
    const userId = await this.identities.resolveOrCreate(identity);
    return this.auth.issueForUser(userId);
  }
}
