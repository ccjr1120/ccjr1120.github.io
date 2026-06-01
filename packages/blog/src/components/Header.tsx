import { Link } from '@tanstack/react-router'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  return (
    <header className="w-full px-8 py-6">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="text-sm text-text-muted transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
        >
          Home
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}
