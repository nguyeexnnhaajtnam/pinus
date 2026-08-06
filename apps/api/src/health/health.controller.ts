import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { PrismaService } from '../database/prisma.service';
import { HealthResponseDto } from './health.dto';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOkResponse({ type: HealthResponseDto })
  @ApiServiceUnavailableResponse({ type: HealthResponseDto })
  async check(@Res() response: Response): Promise<void> {
    try {
      await this.prisma.isHealthy();
      response.status(HttpStatus.OK).json({
        status: 'healthy',
        checks: { database: 'up' },
      } satisfies HealthResponseDto);
    } catch {
      response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        status: 'unhealthy',
        checks: { database: 'down' },
      } satisfies HealthResponseDto);
    }
  }
}
