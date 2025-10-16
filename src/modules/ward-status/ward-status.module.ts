import { Module } from '@nestjs/common';
import { WardStatusService } from './ward-status.service';
import { WardStatusController } from './ward-status.controller';
import { CommonModule } from '../../Common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [WardStatusController],
  providers: [WardStatusService],
})
export class WardStatusModule { }
