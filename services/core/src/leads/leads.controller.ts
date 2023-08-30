import { Controller, HttpCode, Post, Body, UseFilters } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto'; // Adjust the path accordingly
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtExpirationFilter } from 'src/auth/jwt-expiration.filter';
import { UnauthorizedDto } from './dto/unauthorized.dto';
import { ExpiredDto } from './dto/expired.dto';
import { BlacklistedDto } from './dto/blacklisted.dto';

@ApiExtraModels(UnauthorizedDto, ExpiredDto, BlacklistedDto)
@ApiResponse({
  status: 401,
  description:
    'Unauthorized, Expired, Blacklisted responses. Check below -> Schema -> ...Dto -> message',
  schema: {
    oneOf: [
      { $ref: getSchemaPath(UnauthorizedDto) },
      { $ref: getSchemaPath(ExpiredDto) },
      { $ref: getSchemaPath(BlacklistedDto) },
    ],
  },
  content: {
    'application/json': {
      examples: {
        UnauthorizedDto: { value: UnauthorizedDto },
        ExpiredDto: { value: ExpiredDto },
      },
    },
  },
})
@UseFilters(JwtExpirationFilter)
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@ApiTags('Leads') // This will group endpoints under 'Leads' tag in Swagger UI
@Controller('leads')
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  @Post()
  @HttpCode(204)
  @ApiBody({ type: CreateLeadDto })
  async createLead(@Body() createLeadDto: CreateLeadDto) {
    return await this.leadsService.sendToCrm(createLeadDto);
  }
}
