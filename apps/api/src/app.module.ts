import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { validateEnvironment } from './config/environment';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? 'info',
        genReqId: (request, response) => {
          const incoming = request.headers['x-correlation-id'];
          const correlationId =
            typeof incoming === 'string' && incoming.length > 0
              ? incoming
              : crypto.randomUUID();
          response.setHeader('x-correlation-id', correlationId);
          return correlationId;
        },
        customProps: (request) => ({ correlationId: request.id }),
        redact: {
          paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'password',
            'DATABASE_URL',
            'req.body.refreshToken',
            'refreshToken',
            'accessToken',
            'refreshTokenHash',
            'JWT_ACCESS_SECRET',
            'JWT_REFRESH_SECRET',
          ],
          censor: '[REDACTED]',
        },
      },
    }),
    DatabaseModule,
    AuthModule,
    HealthModule,
  ],
})
export class AppModule {}
