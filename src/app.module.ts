import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CityModule } from './modules/city/city.module';
import { CommonModule } from './Common/common.module';
import { LoginModule } from './modules/login/login.module';
import { DashboardCountModule } from './modules/dashboard-count/dashboard-count.module';
import { WardStatusModule } from './modules/ward-status/ward-status.module';


@Module({
  imports: [CityModule,CommonModule, LoginModule, DashboardCountModule, WardStatusModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
