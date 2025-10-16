import { Module } from '@nestjs/common';
import { DashboardCountService } from './dashboard-count.service';
import { DashboardCountController } from './dashboard-count.controller';
import { DbStorageService } from '../../Common/firebase/db-storage.service';
import { CommonModule } from '../../Common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [DashboardCountController],
  providers: [DashboardCountService, DbStorageService],
})
export class DashboardCountModule { }
