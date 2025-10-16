import { Controller, Get } from '@nestjs/common';
import { DashboardCountService } from './dashboard-count.service';

@Controller('dashboard-count')
export class DashboardCountController {
  constructor(private readonly dashboardCountService: DashboardCountService) { }

  @Get()
  async getStatusCountsBase() {
    return await this.dashboardCountService.getStatusCounts();
  }
}
