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
import { AppleIdentityTokenVerifier } from './social/apple-identity.verifier';
import { GoogleIdentityTokenVerifier } from './social/google-identity.verifier';
import { SocialAuthService } from './social/social-auth.service';
import { SocialIdentityRepository } from './social/social-identity.repository';
import {
  APPLE_IDENTITY_VERIFIER,
  GOOGLE_IDENTITY_VERIFIER,
} from './social/social.types';

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
    GoogleIdentityTokenVerifier,
    AppleIdentityTokenVerifier,
    {
      provide: GOOGLE_IDENTITY_VERIFIER,
      useExisting: GoogleIdentityTokenVerifier,
    },
    {
      provide: APPLE_IDENTITY_VERIFIER,
      useExisting: AppleIdentityTokenVerifier,
    },
    SocialIdentityRepository,
    SocialAuthService,
  ],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
