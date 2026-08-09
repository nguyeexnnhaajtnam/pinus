import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshRequestDto {
  @ApiProperty({ description: 'Rotating refresh credential', writeOnly: true })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

export class TokenPairDto {
  @ApiProperty({ description: 'Short-lived access token' })
  accessToken!: string;

  @ApiProperty({ description: 'Rotating refresh token' })
  refreshToken!: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType!: 'Bearer';

  @ApiProperty({ example: 900 })
  accessTokenExpiresIn!: number;
}

export class SignOutResultDto {
  @ApiProperty({ example: true })
  success!: boolean;
}
