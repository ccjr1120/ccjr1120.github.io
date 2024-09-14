import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '../components/Header'

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
      <body
        className={`${inter.className} mx-auto min-h-screen max-w-2xl py-8`}
      >
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
