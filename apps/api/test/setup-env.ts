process.env.NODE_ENV ??= 'test';
process.env.PORT ??= '3000';
process.env.DATABASE_URL ??=
  'postgresql://pinus:pinus_local_only@localhost:5432/pinus';
process.env.LOG_LEVEL ??= 'silent';
process.env.JWT_ACCESS_SECRET ??= 'access-test-secret-at-least-32-characters';
process.env.JWT_REFRESH_SECRET ??= 'refresh-test-secret-at-least-32-characters';
process.env.JWT_ISSUER ??= 'pinus-test';
process.env.JWT_AUDIENCE ??= 'pinus-mobile-test';
process.env.GOOGLE_AUTH_AUDIENCES ??= 'pinus-google-test';
process.env.APPLE_AUTH_AUDIENCES ??= 'com.pinus.pinusMobile';
