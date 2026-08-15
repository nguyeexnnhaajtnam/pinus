import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class GoogleSocialAuthRequestDto {
  @ApiProperty({ description: 'Google identity token', writeOnly: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(16_384)
  identityToken!: string;
}

export class AppleSocialAuthRequestDto {
  @ApiProperty({ description: 'Apple identity token', writeOnly: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(16_384)
  identityToken!: string;

  @ApiProperty({ description: 'Ephemeral raw nonce', writeOnly: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  rawNonce!: string;
}
