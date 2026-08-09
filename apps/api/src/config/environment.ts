export type AppEnvironment = 'development' | 'test' | 'production';

export interface ValidatedEnvironment {
  NODE_ENV: AppEnvironment;
  PORT: number;
  DATABASE_URL: string;
  LOG_LEVEL: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ISSUER: string;
  JWT_AUDIENCE: string;
}

function stringValue(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

export function validateEnvironment(
  values: Record<string, unknown>,
): ValidatedEnvironment {
  const nodeEnvironment = stringValue(values.NODE_ENV);
  if (!['development', 'test', 'production'].includes(nodeEnvironment)) {
    throw new Error('NODE_ENV must be one of development, test, or production');
  }
  const port = Number(values.PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }
  const databaseUrl = stringValue(values.DATABASE_URL);
  let parsedDatabaseUrl: URL;
  try {
    parsedDatabaseUrl = new URL(databaseUrl);
  } catch {
    throw new Error('DATABASE_URL must be a valid PostgreSQL URL');
  }
  if (!['postgres:', 'postgresql:'].includes(parsedDatabaseUrl.protocol)) {
    throw new Error('DATABASE_URL must use the PostgreSQL protocol');
  }
  const jwtAccessSecret = requiredSecret(
    values.JWT_ACCESS_SECRET,
    'JWT_ACCESS_SECRET',
  );
  const jwtRefreshSecret = requiredSecret(
    values.JWT_REFRESH_SECRET,
    'JWT_REFRESH_SECRET',
  );
  if (jwtAccessSecret === jwtRefreshSecret) {
    throw new Error('JWT access and refresh secrets must be different');
  }
  const jwtIssuer = requiredString(values.JWT_ISSUER, 'JWT_ISSUER');
  const jwtAudience = requiredString(values.JWT_AUDIENCE, 'JWT_AUDIENCE');
  return {
    NODE_ENV: nodeEnvironment as AppEnvironment,
    PORT: port,
    DATABASE_URL: databaseUrl,
    LOG_LEVEL: stringValue(values.LOG_LEVEL, 'info'),
    JWT_ACCESS_SECRET: jwtAccessSecret,
    JWT_REFRESH_SECRET: jwtRefreshSecret,
    JWT_ISSUER: jwtIssuer,
    JWT_AUDIENCE: jwtAudience,
  };
}

function requiredString(value: unknown, name: string): string {
  const result = stringValue(value).trim();
  if (!result) throw new Error(`${name} is required`);
  return result;
}

function requiredSecret(value: unknown, name: string): string {
  const result = requiredString(value, name);
  if (result.length < 32 || /^(change-me|placeholder)/i.test(result)) {
    throw new Error(
      `${name} must contain at least 32 non-placeholder characters`,
    );
  }
  return result;
}
