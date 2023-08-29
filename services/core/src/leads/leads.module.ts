import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [LeadsController],
  providers: [LeadsService],
  imports: [HttpModule],
})
export class LeadsModule {}
