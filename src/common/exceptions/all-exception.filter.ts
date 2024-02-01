/*
 * @Author: ztao
 * @Date: 2024-02-01 22:32:08
 * @LastEditTime: 2024-02-01 22:36:46
 * @Description: 所有异常过滤器
 */
import { FastifyReply, FastifyRequest } from 'fastify';

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    //! 非 HTTP 标准异常的处理
    response.status(HttpStatus.SERVICE_UNAVAILABLE).send({
      code: HttpStatus.SERVICE_UNAVAILABLE,
      timestamp: new Date().toLocaleString('zh-CN', {
        timeZone: 'Asia/Shanghai',
      }),
      path: request.url,
      message: exception.message,
      data: {},
    });
  }
}
