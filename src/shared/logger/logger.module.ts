/*
 * @Author: ztao
 * @Date: 2024-02-08 12:39:39
 * @LastEditTime: 2024-02-08 12:44:25
 * @Description:
 */
import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
