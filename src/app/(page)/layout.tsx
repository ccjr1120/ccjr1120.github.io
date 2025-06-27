import type { Metadata } from 'next'
import '@/assets/styles/globals.css'
import Header from '@/components/App/Header'

export const metadata: Metadata = {
  title: '匆匆孑然',
  description: '匆匆孑然'
}

export default function PageLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div id="app" className="min-h-screen w-screen">
      <Header />
      <main>{children}</main>
    </div>
  )
}
