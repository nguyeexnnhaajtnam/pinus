import { Body, Controller, Ip, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthRateLimiter } from './auth-rate-limiter.service';
import { AuthGuard } from './auth.guard';
import { AuthIpRateGuard } from './auth-ip-rate.guard';
import { AuthService } from './auth.service';
import type { CurrentUserContext } from './auth.types';
import { CurrentUser } from './current-user.decorator';
import { CurrentSignOutGuard } from './current-sign-out.guard';
import {
  RefreshRequestDto,
  SignOutResultDto,
  TokenPairDto,
} from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly limiter: AuthRateLimiter,
  ) {}

  @Post('refresh')
  @ApiResponse({ status: 201, type: TokenPairDto })
  @ApiResponse({ status: 401, description: 'Authentication failed' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  refresh(
    @Body() body: RefreshRequestDto,
    @Ip() ip: string,
    @Req() request: Request,
  ): Promise<TokenPairDto> {
    this.limiter.checkIp(ip || request.socket.remoteAddress || 'unknown');
    return this.auth.refresh(body.refreshToken);
  }

  @Post('sign-out')
  @UseGuards(AuthIpRateGuard, CurrentSignOutGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: SignOutResultDto })
  @ApiResponse({ status: 401, description: 'Authentication failed' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async signOut(
    @CurrentUser() currentUser: CurrentUserContext,
  ): Promise<SignOutResultDto> {
    await this.auth.signOutCurrent(currentUser);
    return { success: true };
  }

  @Post('sign-out-others')
  @UseGuards(AuthIpRateGuard, AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: SignOutResultDto })
  @ApiResponse({ status: 401, description: 'Authentication failed' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async signOutOthers(
    @CurrentUser() currentUser: CurrentUserContext,
  ): Promise<SignOutResultDto> {
    await this.auth.signOutOthers(currentUser);
    return { success: true };
  }
}
