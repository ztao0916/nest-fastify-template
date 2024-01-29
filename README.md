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

以后部署就按这个逻辑来即可,不需要`github Action`自动部署













