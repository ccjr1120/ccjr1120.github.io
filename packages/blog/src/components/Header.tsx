import { Link } from '@tanstack/react-router'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  return (
    <header className="w-full px-8 py-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
          >
            CCJR
          </Link>
          <Link
            to="/blog"
            className="text-sm text-text-muted transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
          >
            博客
          </Link>
          <Link
            to="/about"
            className="text-sm text-text-muted transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
          >
            关于
          </Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  )
}
