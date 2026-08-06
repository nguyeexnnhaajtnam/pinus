import { ApiProperty } from '@nestjs/swagger';

export class HealthChecksDto {
  @ApiProperty({ example: 'up', enum: ['up', 'down'] })
  database!: 'up' | 'down';
}

export class HealthResponseDto {
  @ApiProperty({ example: 'healthy', enum: ['healthy', 'unhealthy'] })
  status!: 'healthy' | 'unhealthy';

  @ApiProperty({ type: HealthChecksDto })
  checks!: HealthChecksDto;
}
