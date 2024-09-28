'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const pathName = usePathname()
  const navItems = [
    { label: '介绍', href: '/gpu-mesh' },
    { label: '示例', href: '/gpu-mesh/examples' },
    { label: '使用文档', href: '/gpu-mesh/doc' },
    { label: 'Playground', href: '/gpu-mesh/playground' }
  ]
  return (
    <nav className="w-24">
      <ul className="flex flex-col gap-3">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <li
              className={`text-stone-400 duration-300 hover:text-white active:text-violet-400 ${pathName === item.href ? '!text-violet-500' : ''}`}
            >
              {item.label}
            </li>
          </Link>
        ))}
      </ul>
    </nav>
  )
}
