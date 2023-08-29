import { Controller, HttpCode, Post, Body, UseFilters } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto'; // Adjust the path accordingly
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtExpirationFilter } from 'src/auth/jwt-expiration.filter';

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
