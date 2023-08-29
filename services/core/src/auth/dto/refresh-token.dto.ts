import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token',
    example:
      'sdfsdf.51Akq0XwXXALTTscasca5Akq0XwXXALTTusawqe33u.jT-51Akq0XwXXALTTu-6byoNDJbbrr5SgbJT2dd_tFA',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1)
  refresh_token: string;
}
