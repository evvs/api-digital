import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';

@Injectable()
export class LeadsService {
  constructor(private httpService: HttpService) {}

  async sendToCrm(dto: CreateLeadDto) {
    const transformedData = this.transformLeadData(dto);

    try {
      const response = await this.httpService.axiosRef.post(
        'http://sup9crm02/fczenit/api/data/v9.1/leads',
        transformedData,
        {
          headers: {
            // Add your NTLM auth header here
          },
        },
      );

      if (response.status === 204) {
        return { status: 204 };
      } else {
        throw new Error(`CRM responded with status: ${response.status}`);
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  transformLeadData(dto: CreateLeadDto) {
    return {
      mobilephone: dto.phone,
      emailaddress1: dto.email,
      subject: dto.lead_name,
      firstname: dto.contact_name,
      description: JSON.stringify(dto.questions_answers),
      companyname: dto.companyname,
      leadsourcecode: dto.leadsourcecode,
    };
  }
}
