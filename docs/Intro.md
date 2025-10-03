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
