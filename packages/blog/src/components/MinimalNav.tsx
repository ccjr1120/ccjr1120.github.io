import { Link } from '@tanstack/react-router'
import { ThemeToggle } from './ThemeToggle'

export function MinimalNav() {
  return (
    <header className="w-full px-10 pt-8 pb-4 flex items-center justify-between">
      <nav className="flex items-center gap-6">
        <Link
          to="/"
          style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--color-text)', textDecoration: 'none' }}
          className="transition-opacity hover:opacity-70"
        >
          Home
        </Link>
        <Link
          to="/about"
          className="text-sm transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
          style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}
        >
          About
        </Link>
        <Link
          to="/blog"
          className="text-sm transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
          style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}
        >
          Posts
        </Link>
      </nav>
      <ThemeToggle />
    </header>
  )
}
