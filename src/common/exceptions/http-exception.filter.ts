/*
 * @Author: ztao
 * @Date: 2024-02-01 22:29:56
 * @LastEditTime: 2024-02-01 22:31:37
 * @Description: http异常过滤器
 */
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const status = exception.getStatus();

    //fastify需要使用send方法
    response.status(status).send({
      code: status,
      timestamp: new Date().toLocaleString('zh-CN', {
        timeZone: 'Asia/Shanghai',
      }),
      data: {},
      path: request.url,
      message: exception.message,
    });
  }
}
