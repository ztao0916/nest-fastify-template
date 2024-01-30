/*
 * @Author: ztao
 * @Date: 2024-01-29 21:48:36
 * @LastEditTime: 2024-01-30 15:27:55
 * @Description:
 */
import { NestFactory } from '@nestjs/core';
import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  //版本控制
  app.enableVersioning({
    type: VersioningType.URI, //URI版本控制类型
    // defaultVersion: '1', //默认版本v1
    defaultVersion: [VERSION_NEUTRAL, '1'], //默认版本v1和中性版本,中性版本是指不带版本号的请求
  });
  //默认127.0.0.1本地调用
  await app.listen(8888);
  //局域网内其他小伙伴也可以调用,代码如下
  // await app.listen(8888, '0.0.0.0');
}
bootstrap();
