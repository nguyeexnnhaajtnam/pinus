import { validateEnvironment } from './environment';

describe('validateEnvironment', () => {
  const valid = {
    NODE_ENV: 'test',
    PORT: '3000',
    DATABASE_URL: 'postgresql://pinus:secret@localhost:5432/pinus',
  };

  it('normalizes valid configuration', () => {
    expect(validateEnvironment(valid)).toEqual({
      ...valid,
      PORT: 3000,
      LOG_LEVEL: 'info',
    });
  });

  it.each(['NODE_ENV', 'PORT', 'DATABASE_URL'])('rejects invalid %s', (key) => {
    expect(() => validateEnvironment({ ...valid, [key]: '' })).toThrow();
  });
});
