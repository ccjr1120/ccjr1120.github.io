import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '../components/Header'
import Nav from './components/Nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GPU Mesh',
  description: '可以调用WebGPU进行渲染的简单API'
}
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <div id="app">
          <Header />
          <main className="mx-20 mt-12 flex">
            <Nav />
            <div id="content" className="ms-12">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
