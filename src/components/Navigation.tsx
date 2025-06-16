'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigationItems = [
  {
    href: '/blog',
    label: '博客',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
      </svg>
    )
  },
  {
    href: '/models',
    label: '模型',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.51 13.214c.046-.8.438-1.506 1.03-2.006a3.424 3.424 0 0 1 2.212-.79c.85 0 1.631.3 2.211.79.592.5.983 1.206 1.03 2.006.047.8-.291 1.536-.846 2.06-.555.523-1.307.523-1.862 0-.556-.524-.893-1.26-.846-2.06m-9.679 0c.046-.8.438-1.506 1.03-2.006a3.424 3.424 0 0 1 2.212-.79c.85 0 1.631.3 2.211.79.592.5.984 1.206 1.03 2.006.047.8-.291 1.536-.846 2.06-.555.523-1.307.523-1.862 0-.556-.524-.893-1.26-.846-2.06M12 3.67c2.48 0 4.5 2.02 4.5 4.5s-2.02 4.5-4.5 4.5-4.5-2.02-4.5-4.5 2.02-4.5 4.5-4.5zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    )
  }
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-4">
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-base font-medium transition-colors ${
            pathname === item.href
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
