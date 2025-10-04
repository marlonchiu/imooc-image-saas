import { serverCaller, createTRPCContext } from '@/utils/trpc'
export default async function Index() {
  const context = await createTRPCContext()
  const data = await serverCaller(context).greeting()

  return (
    <div className="h-screen flex flex-col justify-center items-center ">
      <p>Dashboard 看板</p>
      <p>服务端返回数据：{data.message}</p>
    </div>
  )
}
