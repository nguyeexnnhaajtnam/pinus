export interface CurrentUserContext {
  readonly userId: string;
  readonly sessionId: string;
}

export interface AccessClaims {
  sub: string;
  sid: string;
  type: 'access';
}

export interface RefreshClaims {
  sub: string;
  sid: string;
  ver: number;
  jti: string;
  type: 'refresh';
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  accessTokenExpiresIn: number;
}

export interface TrustedProviderIdentity {
  readonly provider: string;
  readonly providerSubject: string;
}
