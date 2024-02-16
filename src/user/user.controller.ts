/*
 * @Author: ztao
 * @Date: 2024-01-30 10:02:10
 * @LastEditTime: 2024-02-16 22:30:56
 * @Description:
 */
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoggerService } from '@/shared/logger/logger.service';

@ApiTags('user') // 修改这里的标签名称为 'user'
@Controller({
  path: 'user',
})
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: LoggerService,
  ) {}

  // 默认user请求,不做更改
  @Get()
  findAll() {
    this.logger.info('user模块,默认请求');
    return this.userService.findAll();
  }

  //params参数,获取id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
