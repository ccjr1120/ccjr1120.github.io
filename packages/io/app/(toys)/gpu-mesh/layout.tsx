import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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
          <header className="relative px-4 py-4">
            <h1 className="text-2xl font-bold">GPU Mesh</h1>
            <div
              id="divider"
              className="absolute bottom-0 left-0 h-[0.5px] w-full bg-slate-500"
            />
          </header>
          <main className="mt-12 flex justify-center">
            <Nav />
            <div id="content" className="mb-12 ms-12 max-w-3xl pe-9">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
