/*
 * @Author: ztao
 * @Date: 2024-02-16 22:09:22
 * @LastEditTime: 2024-02-16 22:13:04
 * @Description: prismaService-抽象出 Prisma Client API 以在服务中进行数据库查询
 */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: [
        //打印sql到控制台
        {
          emit: 'stdout',
          level: 'query',
        },
      ],
    });
  }
  async onModuleInit() {
    await this.$connect();
  }
}
