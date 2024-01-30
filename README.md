## nest-fastify-template

### 部署到vercel

创建项目`nest new nest-fastify-template`,更改默认端口为`8888`,启动运行正常

在项目根目录创建`vercel.json`,内容如下

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/main.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/main.ts",
      "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"]
    }
  ]
}

```

推送项目到github

本地执行`npm install -g vercel`,全局安装`vercel`依赖

然后执行命令`vercel .`, 根据英文提示进行操作即可,最后命令行展示的`Production`后面的链接就是部署完成的地址

然后使用`cloudflare`绑定域名即可

在`vercel`后台管理那里,关联`github`项目,然后把`github`自动生成的域名绑定上去

以后每次提交代码到`github`上,`vercel`都会自动更新代码

### 使用fastify

相比较于`express`,`fastify`更快,更优秀,所以使用`fastify`做底层框架,适配参考: [传送门](https://nest.nodejs.cn/techniques/performance#%E6%80%A7%E8%83%BD%EF%BC%88fastify%EF%BC%89)

安装依赖包: 

```
pnpm add @nestjs/platform-fastify
```

更新`main.ts`文件

```typescript
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  //默认127.0.0.1本地调用
  await app.listen(8888);
  //局域网内其他小伙伴也可以调用,代码如下
  // await app.listen(8888, '0.0.0.0');
}
bootstrap();
```

至此,适配`fastify`就完成了



### 版本控制

使用命令`nest g res user`创建`user`模块作为通用模板的使用模块

具体的版本控制方式有哪些以及细节请参考文档: [传送门](https://nest.nodejs.cn/techniques/versioning#%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6),这里只纪录常规用法

#### 全局版本(使用)

在使用的过程中一般采用全局版本,`main.ts`更改如下如下

```typescript
import { NestFactory } from '@nestjs/core';
import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  //版本控制
  app.enableVersioning({
    type: VersioningType.URI, //URI版本控制类型
    // defaultVersion: '1', //默认版本v1, /v1/user可以请求成功,/user请求失败
    defaultVersion: [VERSION_NEUTRAL, '1'], //默认版本v1和中性版本(指不带版本号的请求),/v1/user和/user都可以请求成功
  });
  //默认127.0.0.1本地调用
  await app.listen(8888);
  //局域网内其他小伙伴也可以调用,代码如下
  // await app.listen(8888, '0.0.0.0');
}
bootstrap();
```

#### 控制器版本(了解)

**该模式很少使用,优先级高于全局默认版本**

字面理解,`xxx.controller.ts`文件内添加版本,举例`user.controller.ts`如下:

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller({
  path: 'user',
  version: '2',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 默认user请求,不做更改
  @Get()
  findAll() {
    return 'nest-fastify-template部署成功！首页重定向到user页面';
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
```

在`@Controller`那里做了变更,访问只能通过携带v2参数,即`http://localhost:8888/v2/user`这样的链接才可以

#### 路由版本(了解)

**该模式很少使用,优先级高于控制器版本**

在`user.controller.ts`中新增代码

```typescript
@Version('3')
@Get('cats')
findV3(): string {
    return '验证v3';
}
```

使用`http://localhost:8888/v1/user/cats`访问报错

```json
{
    "message": "Cannot GET /v1/user/cats",
    "error": "Not Found",
    "statusCode": 404
}
```

使用`http://localhost:8888/v3/user/cats`访问,正确返回`验证v3`的结果















