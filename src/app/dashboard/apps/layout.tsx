export default function AppLayout({
  children,
  intercepting
}: {
  children: React.ReactNode
  intercepting: React.ReactNode
}) {
  console.log(children, intercepting)

  return (
    <>
      {children}
      {intercepting}
    </>
  )
}
