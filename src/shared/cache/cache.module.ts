/*
 * @Author: ztao
 * @Date: 2024-02-16 09:28:42
 * @LastEditTime: 2024-02-16 09:42:32
 * @Description:
 */
import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';

@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
