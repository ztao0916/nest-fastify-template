/*
 * @Author: ztao
 * @Date: 2024-01-29 21:48:36
 * @LastEditTime: 2024-01-30 15:39:47
 * @Description:
 */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AppController],
})
export class AppModule {}
