import { Link } from '@tanstack/react-router'
import { ThemeToggle } from './ThemeToggle'
import { useState } from 'react'

const navItems = [
  { label: '首页', to: '/' },
  { label: '博客', to: '/blog' },
  { label: '项目', to: '/projects' },
  { label: '关于', to: '/about' },
] as const

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="rounded-lg text-xl font-bold tracking-tight text-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
        >
          CCJR
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={item.to === '/' ? { exact: true } : undefined}
              className="inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              activeProps={{ className: 'inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-semibold text-primary bg-primary/10' }}
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2 transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
            aria-label="菜单"
            aria-expanded={menuOpen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {menuOpen ? (
                <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              ) : (
                <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-border bg-surface px-4 py-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={item.to === '/' ? { exact: true } : undefined}
              className="inline-flex min-h-11 items-center rounded-lg px-3 text-base font-medium text-text-muted transition-colors hover:bg-surface-muted hover:text-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              activeProps={{ className: 'inline-flex min-h-11 items-center rounded-lg px-3 text-base font-semibold text-primary bg-primary/10' }}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
