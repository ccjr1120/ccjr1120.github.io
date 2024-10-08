import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import AppBackground from './components/AppBackground.tsx'
import AppHeader from './components/Header/index.tsx'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Blog｜匆匆孑然',
  description: '成长，生命，幸福还有我的朋友'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} mx-16`}>
        <AppBackground />
        <div id="app" className="mx-auto min-h-screen max-w-3xl py-8">
          <AppHeader />
          <main className="h-[calc(100vh-306px)] w-full">{children}</main>
        </div>
      </body>
    </html>
  )
}
