import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BlacklistDto {
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

  @ApiProperty({
    description: 'Token that will be added to the blacklist',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inplbml0IiwiaWF0IjoxNjaDQ3LCJleHAiOasdd9.Im42ujwOM9hCjj5HfdawOQ40OVUs1czsOH0G--hHG3fM',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1)
  token: string;
}
