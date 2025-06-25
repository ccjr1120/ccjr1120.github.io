import type { Metadata } from 'next'
import '@/assets/styles/globals.css'

export const metadata: Metadata = {
  title: '匆匆孑然',
  description: '匆匆孑然'
}

export default function PageLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div>{children}</div>
}
