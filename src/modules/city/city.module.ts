import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { CommonModule } from '../../Common/common.module';

@Module({
  imports:[CommonModule],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
