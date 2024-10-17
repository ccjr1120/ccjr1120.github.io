'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AppHeader() {
  const NAV_MENU = [
    { title: 'Blog', href: '/blog' },
    { title: '文章', href: '/article' },
    { title: 'Gpu Mesh', href: '/gpu-mesh', action: '_blank' }
  ]

  const pathname = usePathname()

  return (
    <header className="mb-4 flex items-end justify-between py-4">
      <nav className="flex gap-1">
        <ul className="flex items-end gap-4">
          {NAV_MENU.map((item) => (
            <li key={item.href}>
              <Link href={item.href} target={item.action}>
                <h1
                  className={`${pathname.startsWith(item.href) ? 'text-2xl' : 'text-muted'} font-black tracking-wide duration-150`}
                >
                  {item.title}
                </h1>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex aspect-square w-12 items-center justify-center rounded-full bg-primary font-bold text-[#162c35]">
        Fx
      </div>
    </header>
  )
}
