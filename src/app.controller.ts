import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'nest-fastify-template部署成功,请尽情使用吧！';
  }
}
