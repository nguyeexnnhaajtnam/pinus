export type SocialProvider = 'google' | 'apple';

export interface VerifiedSocialIdentity {
  readonly provider: SocialProvider;
  readonly providerSubject: string;
  readonly email?: string;
}

export interface GoogleVerificationInput {
  readonly identityToken: string;
}

export interface AppleVerificationInput {
  readonly identityToken: string;
  readonly rawNonce: string;
}

export interface GoogleIdentityVerifier {
  verify(input: GoogleVerificationInput): Promise<VerifiedSocialIdentity>;
}

export interface AppleIdentityVerifier {
  verify(input: AppleVerificationInput): Promise<VerifiedSocialIdentity>;
}

export const GOOGLE_IDENTITY_VERIFIER = Symbol('GOOGLE_IDENTITY_VERIFIER');
export const APPLE_IDENTITY_VERIFIER = Symbol('APPLE_IDENTITY_VERIFIER');
