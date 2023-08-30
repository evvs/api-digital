import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BlacklistOkResponseDto {
  @ApiProperty({
    description: 'Status',
    example: 'success',
  })
  @IsString()
  status: string;

  @ApiProperty({
    description: 'Message',
    example: 'Token blacklisted successfully',
  })
  @IsString()
  message: string;
}
