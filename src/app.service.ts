/*
 * @Author: ztao
 * @Date: 2024-01-29 21:48:36
 * @LastEditTime: 2024-01-29 22:16:20
 * @Description:
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'nest-fastify-template部署成功！';
  }
}
