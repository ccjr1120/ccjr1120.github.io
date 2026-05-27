import { createFileRoute, Link } from '@tanstack/react-router'
import { getPost, getAllPosts } from '@/lib/posts'
import { TagBadge } from '@/components/TagBadge'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'

export const Route = createFileRoute('/blog/$slug')({
  component: PostPage,
})

function PostPage() {
  const { slug } = Route.useParams()
  const post = getPost(slug)

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-text-muted mb-8">文章未找到</p>
        <Link
          to="/blog"
          className="inline-flex min-h-11 items-center justify-center rounded-md px-3 font-medium text-primary transition-colors hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
        >
          &larr; 返回博客
        </Link>
      </div>
    )
  }

  const allPosts = getAllPosts()
  const idx = allPosts.findIndex((p) => p.slug === slug)
  const prev = idx < allPosts.length - 1 ? allPosts[idx + 1] : null
  const next = idx > 0 ? allPosts[idx - 1] : null

  return (
    <article className="max-w-3xl mx-auto px-4 py-16">
      <header className="mb-10">
        <time className="text-sm text-text-muted font-mono">{post.date}</time>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight">{post.title}</h1>
        {post.description && (
          <p className="mt-3 text-lg text-text-muted">{post.description}</p>
        )}
        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}
      </header>

      <div className="prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight, rehypeSlug]}>
          {post.content}
        </ReactMarkdown>
      </div>

      {(prev || next) && (
        <nav className="mt-16 pt-8 border-t border-border grid grid-cols-2 gap-4">
          {prev ? (
            <Link
              to="/blog/$slug"
              params={{ slug: prev.slug }}
              className="group rounded-xl border border-border p-4 transition-colors hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
            >
              <span className="text-xs text-text-muted">&larr; 上一篇</span>
              <p className="mt-1 font-medium transition-colors line-clamp-1 group-hover:text-primary">{prev.title}</p>
            </Link>
          ) : <div />}
          {next ? (
            <Link
              to="/blog/$slug"
              params={{ slug: next.slug }}
              className="group rounded-xl border border-border p-4 text-right transition-colors hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
            >
              <span className="text-xs text-text-muted">下一篇 &rarr;</span>
              <p className="mt-1 font-medium transition-colors line-clamp-1 group-hover:text-primary">{next.title}</p>
            </Link>
          ) : <div />}
        </nav>
      )}
    </article>
  )
}
