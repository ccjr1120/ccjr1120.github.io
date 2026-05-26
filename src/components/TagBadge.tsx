import { Link } from '@tanstack/react-router'
import clsx from 'clsx'

export function TagBadge({ tag, size = 'sm' }: { tag: string; size?: 'sm' | 'md' }) {
  return (
    <Link
      to="/tags"
      search={{ tag }}
      className={clsx(
        'inline-flex items-center rounded-full bg-surface-muted font-medium text-text-muted transition-colors',
        'hover:bg-primary/10 hover:text-primary',
        'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
        size === 'md'
          ? 'min-h-11 px-4 text-sm'
          : 'px-2.5 py-0.5 text-xs',
      )}
    >
      #{tag}
    </Link>
  )
}
