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











