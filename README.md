## nest-fastify-template

### 部署到vercel

创建项目`nest new nest-fastify-template`,更改默认端口为`8888`,启动运行正常

在项目根目录创建`vercel.json`,内容如下,`name`要保持和`package.json`的name一致

```json
{
  "version": 2,
  "name": "nest-fastify-template",
  "builds": [
    {
      "src": "dist/main.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/main.js"
    }
  ]
}

```

推送项目到github







