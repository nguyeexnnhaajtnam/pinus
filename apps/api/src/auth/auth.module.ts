import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthIpRateGuard } from './auth-ip-rate.guard';
import { AuthRateLimiter } from './auth-rate-limiter.service';
import { AuthService } from './auth.service';
import { SessionRepository } from './session.repository';
import { TokenService } from './token.service';
import { CurrentSignOutGuard } from './current-sign-out.guard';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthGuard,
    AuthIpRateGuard,
    CurrentSignOutGuard,
    AuthRateLimiter,
    SessionRepository,
    TokenService,
  ],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
