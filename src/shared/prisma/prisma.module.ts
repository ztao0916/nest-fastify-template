/*
 * @Author: ztao
 * @Date: 2024-02-16 22:09:27
 * @LastEditTime: 2024-02-16 22:10:46
 * @Description:
 */
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
