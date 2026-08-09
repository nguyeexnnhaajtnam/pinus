export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
export const REFRESH_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60;
export const MAX_ACTIVE_SESSIONS = 5;

export const AUTH_ERROR = {
  invalidCredential: 'AUTH_INVALID_CREDENTIAL',
  sessionInvalid: 'AUTH_SESSION_INVALID',
  rateLimited: 'AUTH_RATE_LIMITED',
} as const;
