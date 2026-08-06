export type AppEnvironment = 'development' | 'test' | 'production';

export interface ValidatedEnvironment {
  NODE_ENV: AppEnvironment;
  PORT: number;
  DATABASE_URL: string;
  LOG_LEVEL: string;
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
  return {
    NODE_ENV: nodeEnvironment as AppEnvironment,
    PORT: port,
    DATABASE_URL: databaseUrl,
    LOG_LEVEL: stringValue(values.LOG_LEVEL, 'info'),
  };
}
