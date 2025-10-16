import { Controller, Get } from '@nestjs/common';
import { WardStatusService } from './ward-status.service';

@Controller('ward-status')
export class WardStatusController {
  constructor(private readonly wardStatusService: WardStatusService) { }

  @Get()
  async getWard() {
    return await this.wardStatusService.getWardStatus();
  };
};
