import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class UnauthorizedDto {
  @ApiProperty({
    description: 'Status code',
    example: 401,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'Timestamp',
    example: '2023-08-30T11:46:43.630Z',
  })
  @IsDate()
  timestamp: Date;

  @ApiProperty({
    description: 'Route path',
    example: '/leads',
  })
  @IsString()
  path: string;

  @ApiProperty({
    description: 'Error message',
    example: 'Unauthorized',
  })
  @IsString()
  message: string;
}
