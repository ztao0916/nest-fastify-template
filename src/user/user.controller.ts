/*
 * @Author: ztao
 * @Date: 2024-01-30 10:02:10
 * @LastEditTime: 2024-02-01 22:56:37
 * @Description:
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';

@Controller({
  path: 'user',
})
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  // 默认user请求,不做更改
  @Get()
  findAll() {
    console.log(this.configService.get('FEISHU_URL'));
    return 'user模块,默认请求';
  }

  @Version('3')
  @Get('cats')
  findV3(): string {
    return '验证v3';
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
