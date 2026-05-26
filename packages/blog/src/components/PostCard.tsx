import { Link } from '@tanstack/react-router'
import type { PostMeta } from '@/lib/posts'
import { TagBadge } from './TagBadge'
import clsx from 'clsx'

type Props = {
  post: PostMeta
  featured?: boolean
}

export function PostCard({ post, featured = false }: Props) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className={clsx(
        'group relative flex h-full flex-col rounded-2xl border border-border bg-surface transition-all',
        'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5',
        'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
        featured ? 'p-6 md:p-8' : 'p-5',
      )}
    >
      {featured && (
        <span className="absolute right-4 top-4 inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-on-primary">
          精选
        </span>
      )}
      {post.cover && (
        <img
          src={post.cover}
          alt=""
          className={clsx(
            'w-full rounded-xl object-cover',
            featured ? 'h-40 md:h-48 mb-4' : 'h-32 mb-3',
          )}
        />
      )}
      <time className="font-mono text-xs text-text-muted">{post.date}</time>
      <h3
        className={clsx(
          'mt-1 font-semibold leading-tight transition-colors group-hover:text-primary',
          featured ? 'text-xl md:text-2xl line-clamp-3' : 'text-lg line-clamp-2',
        )}
      >
        {post.title}
      </h3>
      {post.description && (
        <p
          className={clsx(
            'mt-2 text-text-muted',
            featured ? 'text-sm md:text-base line-clamp-3' : 'text-sm line-clamp-2',
          )}
        >
          {post.description}
        </p>
      )}
      {post.tags.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-2 pt-3">
          {post.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}
    </Link>
  )
}
