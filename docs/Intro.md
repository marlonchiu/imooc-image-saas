# imooc-image-saas

[慕课网 | 前端全栈进阶 Nextjs 打造跨框架 SaaS 应用](https://coding.imooc.com/class/835.html)

## 参考资源

> [Next.js](https://nextjs.org/docs)
> [Tailwind CSS](https://tailwindcss.com/docs)
> [shadcn/ui](https://ui.shadcn.com/docs)
> [Drizzle ORM](https://orm.drizzle.team/)
>
> [clerk](https://clerk.com/docs)
> [next-auth](https://next-auth.js.org/getting-started/example)
> [Zod](https://zod.dev/)
> [tRPC](https://trpc.io/docs/server/routers)
> [React Query Integration](https://trpc.io/docs/client/react/setup)
>
> [Amazon S3](https://aws.amazon.com/cn/s3/)
> [腾讯云 | 使用 AWS S3 SDK 访问 COS](https://cloud.tencent.com/document/product/436/37421)
> [uppy 上传](https://uppy.io/docs/quick-start/)

## drizzle orm 操作

```shell

# 操作指南
# https://orm.drizzle.team/docs/get-started/postgresql-new

# 生成数据库操作代码
npx drizzle-kit push


# 运行数据库操作代码
npx drizzle-kit studio

# 打开访问数据库 https://local.drizzle.studio/
```

## Auth

```shell
# 访问校验登录
# http://localhost:3000/api/auth/signin


# https://authjs.dev/getting-started/adapters/drizzle?_gl=1*9low1y*_gcl_au*NjgyMjI1NzUwLjE3NTkyMjQyMDYuNTAwODEyOTI1LjE3NTkyMjQ1MjEuMTc1OTIyNDUyMQ..
pnpm add @auth/drizzle-adapter

# gitlab callback url
# http://localhost:3000/api/auth/callback/gitlab

# github callback url
# http://localhost:3000/api/auth/callback
```

## Zod 数据验证

```shell
pnpm add zod

pnpm add drizzle-zod
```

## tRPC
```shell
pnpm add @trpc/server @trpc/client

pnpm add @trpc/react-query @tanstack/react-query
```

## uppy
```shell
pnpm add @uppy/core @uppy/aws-s3
pnpm add use-sync-external-store
pnpm add @types/use-sync-external-store --save-dev
```
