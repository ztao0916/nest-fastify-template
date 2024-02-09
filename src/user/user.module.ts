/*
 * @Author: ztao
 * @Date: 2024-01-30 00:24:17
 * @LastEditTime: 2024-02-08 17:07:00
 * @Description:
 */
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SharedModule } from '@/shared/shared.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [SharedModule],
})
export class UserModule {}
