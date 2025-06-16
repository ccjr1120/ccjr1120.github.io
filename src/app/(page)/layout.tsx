import type { Metadata } from 'next'
import Image from 'next/image'
import '@/assets/styles/globals.css'
import BackgroundLines from '@/components/BackgroundLines'
import Navigation from '@/components/Navigation'
import Link from 'next/link'

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
    <BackgroundLines className="max-h-screen min-h-screen overflow-hidden">
      {/* Container */}
      <div className="mx-auto h-screen max-w-[1440px] px-12">
        {/* Page Container */}
        <div className="relative flex h-screen flex-col">
          {/* Header */}
          <header className="flex h-20 w-full flex-shrink-0 items-center justify-between border-b border-gray-300">
            <Link href="/">
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                  <Image
                    src="/images/avatar.png"
                    alt="Avatar"
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* Name */}
                <h2>匆匆孑然</h2>
              </div>
            </Link>

            {/* Navigation */}
            <Navigation />
          </header>

          {/* Main Content */}
          <main className="flex flex-1 items-center justify-center py-8">
            {children}
          </main>
        </div>
      </div>
    </BackgroundLines>
  )
} 