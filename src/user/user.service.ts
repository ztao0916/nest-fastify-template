/*
 * @Author: ztao
 * @Date: 2024-01-30 00:24:17
 * @LastEditTime: 2024-02-17 16:27:45
 * @Description: 和数据库交互的服务层
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor() {}
  create(data) {
    return `新增数据${JSON.stringify(data)}`;
  }

  findAll() {
    return '查询所有数据';
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
