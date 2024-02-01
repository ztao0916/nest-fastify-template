/*
 * @Author: ztao
 * @Date: 2024-01-29 21:48:36
 * @LastEditTime: 2024-02-01 22:43:46
 * @Description:
 */
import { NestFactory } from '@nestjs/core';
import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from '@/common/exceptions/http-exception.filter';
import { AllExceptionsFilter } from '@/common/exceptions/all-exception.filter';

declare const module: any;

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

  //绑定拦截器
  app.useGlobalInterceptors(new TransformInterceptor()); //全局响应拦截器

  //绑定过滤器
  app.useGlobalFilters(new HttpExceptionFilter()); //全局http异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter()); //全局所有异常过滤器

  //热重载
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  //默认127.0.0.1本地调用
  await app.listen(8888);
  //局域网内其他小伙伴也可以调用,代码如下
  // await app.listen(8888, '0.0.0.0');
}
bootstrap();
