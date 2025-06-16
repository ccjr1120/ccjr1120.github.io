import type { Metadata } from 'next'
import '@/assets/styles/globals.css'

export const metadata: Metadata = {
  title: '3D 模型查看器 - ccjr1120',
  description: '在线 3D 模型查看器'
}

export default function FullscreenLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
