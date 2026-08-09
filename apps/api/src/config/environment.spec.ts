import { validateEnvironment } from './environment';

describe('validateEnvironment', () => {
  const valid = {
    NODE_ENV: 'test',
    PORT: '3000',
    DATABASE_URL: 'postgresql://pinus:secret@localhost:5432/pinus',
    JWT_ACCESS_SECRET: 'access-test-secret-at-least-32-characters',
    JWT_REFRESH_SECRET: 'refresh-test-secret-at-least-32-characters',
    JWT_ISSUER: 'pinus-test',
    JWT_AUDIENCE: 'pinus-mobile-test',
  };

  it('normalizes valid configuration', () => {
    expect(validateEnvironment(valid)).toEqual({
      ...valid,
      PORT: 3000,
      LOG_LEVEL: 'info',
    });
  });

  it.each([
    'NODE_ENV',
    'PORT',
    'DATABASE_URL',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'JWT_ISSUER',
    'JWT_AUDIENCE',
  ])('rejects invalid %s', (key) => {
    expect(() => validateEnvironment({ ...valid, [key]: '' })).toThrow();
  });

  it('rejects using one signing secret for both token types', () => {
    expect(() =>
      validateEnvironment({
        ...valid,
        JWT_REFRESH_SECRET: valid.JWT_ACCESS_SECRET,
      }),
    ).toThrow('must be different');
  });
});
