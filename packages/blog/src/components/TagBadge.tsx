import clsx from 'clsx'

export function TagBadge({ tag, size = 'sm' }: { tag: string; size?: 'sm' | 'md' }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full bg-surface-muted font-medium text-text-muted',
        size === 'md'
          ? 'min-h-11 px-4 text-sm'
          : 'px-2.5 py-0.5 text-xs',
      )}
    >
      #{tag}
    </span>
  )
}
