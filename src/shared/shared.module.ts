/*
 * @Author: ztao
 * @Date: 2024-02-08 12:35:00
 * @LastEditTime: 2024-02-16 09:39:26
 * @Description: 共享模块,整合需要全局使用的文件功能
 */
import { Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [LoggerModule, CacheModule],
  exports: [LoggerModule, CacheModule],
})
export class SharedModule {}
