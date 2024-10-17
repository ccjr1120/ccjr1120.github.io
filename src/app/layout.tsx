import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AppHeader from './components/AppHeader'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { template: '%s｜匆匆孑然', default: '匆匆孑然' },
  description: '成长，生命，幸福还有我的朋友'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh">
      <body className={`${inter.className} bg-fill text-base`}>
        <div id="app" className="mx-auto min-h-screen max-w-3xl py-8">
          <AppHeader />
          {children}
        </div>
      </body>
    </html>
  )
}
