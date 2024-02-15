/*
 * @Author: ztao
 * @Date: 2024-01-30 22:06:00
 * @LastEditTime: 2024-02-15 10:38:44
 * @Description:
 */
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'nest-fastify-template部署成功,请尽情使用吧！';
  }
}
