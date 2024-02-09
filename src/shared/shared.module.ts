/*
 * @Author: ztao
 * @Date: 2024-02-08 12:35:00
 * @LastEditTime: 2024-02-08 12:39:52
 * @Description: 共享模块,整合需要全局使用的文件功能
 */
import { Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [LoggerModule],
  exports: [LoggerModule],
})
export class SharedModule {}
