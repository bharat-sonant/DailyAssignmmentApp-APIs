import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CityModule } from './modules/city/city.module';
import { CommonModule } from './Common/common.module';
import { LoginModule } from './modules/login/login.module';


@Module({
  imports: [CityModule,CommonModule, LoginModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
