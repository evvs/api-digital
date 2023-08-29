import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthTokenDto {
  @ApiProperty({
    description: 'User',
    example: 'fc_rivals',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1)
  user: string;

  @ApiProperty({
    description: 'Password',
    example: '12345',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1)
  password: string;
}
