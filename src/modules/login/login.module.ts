import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { CommonModule } from '../../Common/common.module';

@Module({
  imports:[CommonModule],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
