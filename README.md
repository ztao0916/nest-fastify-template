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



### 热重载

会用即可,仅用于本地开发环境

文档: [传送门](https://nest.nodejs.cn/recipes/hot-reload#%E7%83%AD%E9%87%8D%E8%BD%BD)

安装依赖包

```javascript
pnpm add webpack-node-externals run-script-webpack-plugin webpack -D
```

安装完成后,在应用的根目录中创建一个 `webpack-hmr.config.js` 文件,内容如下

```javascript
import nodeExternals from 'webpack-node-externals';
import { RunScriptWebpackPlugin } from 'run-script-webpack-plugin';

export default function (options, webpack) {
  return {
    ...options,
    entry: ['webpack/hot/poll?100', options.entry],
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?100'],
      }),
    ],
    plugins: [
      ...options.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin({
        paths: [/\.js$/, /\.d\.ts$/],
      }),
      new RunScriptWebpackPlugin({
        name: options.output.filename,
        autoRestart: false,
      }),
    ],
  };
}
```

要启用 HMR,请打开应用入口文件（`main.ts`）并添加以下 webpack 相关指令

```typescript
import { NestFactory } from '@nestjs/core';
import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  //版本控制
  app.enableVersioning({
    type: VersioningType.URI, //URI版本控制类型
    // defaultVersion: '1', //默认版本v1
    defaultVersion: [VERSION_NEUTRAL, '1'], //默认版本v1和中性版本,中性版本是指不带版本号的请求
  });

  //热重载
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  //默认127.0.0.1本地调用
  await app.listen(8888);
  //局域网内其他小伙伴也可以调用,代码如下
  // await app.listen(8888, '0.0.0.0');
}
bootstrap();
```

OK,热重载已实现



### 统一全局返参

需要使用拦截器,文档关于拦截器:[传送门](https://nest.nodejs.cn/interceptors#%E6%8B%A6%E6%88%AA%E5%99%A8)的介绍如下图

![](https://cdn.jsdelivr.net/gh/ztao0916/image@main/img/20240201215216.png)

参考拦截器的响应映射.

这里的返回结构和公司的接口返回结构一致,如下:

```json
{
   data, // 数据
   message: 'success', // 异常信息
   code：'0000' // 接口业务返回状态,0000和9999
}
```

创建`src/common/interceptors/transform.interceptor.ts`文件,内容如下

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next
      .handle()
      .pipe(map((data) => ({ code: '0000', message: '请求成功', data })));
  }
}
```

在`main.ts`中引入并且新增代码如下,即可实现统一返参

```typescript
 //绑定拦截器
 app.useGlobalInterceptors(new TransformInterceptor()); //全局响应拦截器
```

按部就班的CV即可解决问题

### 全局异常拦截

异常过滤器: [传送门](https://nest.nodejs.cn/exception-filters#%E5%BC%82%E5%B8%B8%E8%BF%87%E6%BB%A4%E5%99%A8)

```typescript
//基本描述
Nest 带有一个内置的异常层，负责处理应用中所有未处理的异常。当你的应用代码未处理异常时，该层会捕获该异常，然后自动发送适当的用户友好响应
```

装饰器`@Catch`传参问题注意下

新增文件`src/common/exceptions/all-exception.filter.ts`和`src/common/exceptions/http-exception.filter.ts`,内容如下



```typescript
//http-exception.filter.ts
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const status = exception.getStatus();

    //fastify需要使用send方法
    response.status(status).send({
      code: status,
      timestamp: new Date().toLocaleString('zh-CN', {
        timeZone: 'Asia/Shanghai',
      }),
      data: {},
      path: request.url,
      message: exception.message,
    });
  }
}
```



```typescript
//all-exception.filter.ts
import { FastifyReply, FastifyRequest } from 'fastify';

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    //! 非 HTTP 标准异常的处理
    response.status(HttpStatus.SERVICE_UNAVAILABLE).send({
      code: HttpStatus.SERVICE_UNAVAILABLE,
      timestamp: new Date().toLocaleString('zh-CN', {
        timeZone: 'Asia/Shanghai',
      }),
      path: request.url,
      message: exception.message,
      data: {},
    });
  }
}
```

在`main.ts`中引入,并新增代码如下,即可实现异常拦截

```typescript
//绑定过滤器
app.useGlobalFilters(new HttpExceptionFilter()); //全局http异常过滤器
app.useGlobalFilters(new AllExceptionsFilter()); //全局所有异常过滤器
```



### 环境变量

文档:[传送门](https://nest.nodejs.cn/techniques/configuration#%E9%85%8D%E7%BD%AE)

安装依赖(`@nestjs/config` 包内部使用 dotenv)

```ts
pnpm add @nestjs/config
```

更改`app.module.ts`文件

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '@/app.controller';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, //全局使用
      envFilePath: '.dev.env', //也可以接收数组,根据proccess.env.NODE_ENV判断加载什么文件
    }),
    UserModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
```

在根目录创建`.dev.env`文件,添加内容如下

```
NODE_ENV="dev"   #环境

FEISHU_URL='https://open.feishu.cn/open-apis' #飞书请求url
FEISHU_API_HOST='https://open.feishu.cn' #飞书请求主机
```

安装依赖

```
pnpm add cross-env
```

修改`package.json`文件启动命令

```
"start:dev": "cross-env RUN_ENV=dev nest start --watch",
```

在`user.controller.ts`中引入,新增代码如下

```typescript
//引入文件
...
import { ConfigService } from '@nestjs/config';

...
//构造器
constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

...
// 默认user请求,不做更改
  @Get()
  findAll() {
    console.log(this.configService.get('FEISHU_URL'));
    return 'user模块,默认请求';
  }
```

调用接口就可以获得环境变量

### 记录日志

### 数据库连接

### 共享模块

### 接口文档









