import { Footer } from '@/components/footer'

export default function OpenMeteoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <Footer />
    </>
  )
}
