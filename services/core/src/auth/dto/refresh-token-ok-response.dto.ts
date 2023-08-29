import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenOkResponseDto {
  @ApiProperty({
    description: 'Access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpJ9.eyJ1c2VybmFtZSI6Inplbml0IeHAiOjE2OTM0MDYwODJ9.XpuwDRZ3d7UZwYg0VXBYvUdRrePp1OFPE',
  })
  @IsString()
  access_token: string;

  @ApiProperty({
    description: 'Token type',
    example: 'Bearer',
  })
  @IsString()
  token_type: string;

  @ApiProperty({
    description: 'Expires in',
    example: 86400,
  })
  @IsString()
  expires_in: number;
}
