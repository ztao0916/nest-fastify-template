/*
 * @Author: ztao
 * @Date: 2024-01-29 21:48:36
 * @LastEditTime: 2024-02-01 22:51:23
 * @Description:
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '@/app.controller';
import { UserModule } from '@/user/user.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, //全局使用
      envFilePath: '.dev.env', //也可以接收数组,根据proccess.env.NODE_ENV判断加载什么文件
    }),
    UserModule,
    SharedModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
