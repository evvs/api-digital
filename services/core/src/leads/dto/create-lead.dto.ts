// create-lead.dto.ts

import {
  IsEmail,
  IsNotEmpty,
  IsArray,
  IsString,
  IsNumber,
  IsPhoneNumber,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeadDto {
  @ApiProperty({
    description: 'Phone number of the lead.',
    example: '+79161112234',
  })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    description: 'Email address of the lead.',
    example: 'name@test.ru',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Name of the lead.',
    example: 'ЛИД 123',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1)
  lead_name: string;

  @ApiProperty({
    description: 'Name of the contact.',
    example: 'Петров Иван',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1)
  contact_name: string;

  @ApiProperty({
    description: 'Questions and their corresponding answers.',
    example: [['Тестовый вопрос?', 'Тестовый ответ']],
  })
  @IsArray()
  @IsNotEmpty()
  questions_answers: [string, string][];

  @ApiProperty({
    description: 'Name of the company associated with the lead.',
    example: 'sitename',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1)
  companyname: string;

  @ApiProperty({
    description: 'Source code for the lead generation.',
    example: 1,
  })
  @IsNumber()
  leadsourcecode: number;
}
