import { createFileRoute, Link } from '@tanstack/react-router'
import { getPost, getAllPosts } from '@/lib/posts'
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
      <div style={{ minHeight: '100vh', background: '#FEF5F6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)' }}>
        <h1 style={{ fontSize: '48px', fontFamily: 'var(--font-serif)', color: '#321E26', margin: 0 }}>404</h1>
        <p style={{ color: '#A57686', marginTop: '12px' }}>Post not found</p>
        <Link to="/blog" style={{ marginTop: '24px', color: '#CF5473', textDecoration: 'none', fontSize: '15px' }}>
          ← Back to posts
        </Link>
      </div>
    )
  }

  const allPosts = getAllPosts()
  const idx = allPosts.findIndex((p) => p.slug === slug)
  const prev = idx < allPosts.length - 1 ? allPosts[idx + 1] : null
  const next = idx > 0 ? allPosts[idx - 1] : null

  return (
    <div style={{ minHeight: '100vh', background: '#FEF5F6', fontFamily: 'var(--font-sans)' }}>
      {/* TopBar */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '36px 80px 24px' }}>
        <Link to="/" style={{ fontSize: '18px', color: '#321E26', textDecoration: 'none' }}>
          Home
        </Link>
        <div style={{ flex: 1 }} />
        <div style={{ width: '80px' }} />
      </div>

      {/* Article */}
      <article style={{ maxWidth: '680px', margin: '0 auto', padding: '0 40px 80px' }}>
        <header style={{ marginBottom: '40px' }}>
          <time style={{ fontSize: '13px', color: '#A57686' }}>{formatDateChinese(post.date)}</time>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '32px',
              fontWeight: 700,
              color: '#321E26',
              marginTop: '8px',
              marginBottom: 0,
              lineHeight: 1.3,
            }}
          >
            {post.title}
          </h1>
          {post.description && (
            <p style={{ marginTop: '12px', fontSize: '16px', color: '#A57686', lineHeight: 1.6 }}>{post.description}</p>
          )}
        </header>

        <div className="prose" style={{ color: '#321E26' }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight, rehypeSlug]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {(prev || next) && (
          <nav style={{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid rgba(207,84,115,0.2)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {prev ? (
              <Link
                to="/blog/$slug"
                params={{ slug: prev.slug }}
                style={{
                  textDecoration: 'none',
                  padding: '16px',
                  border: '1px solid rgba(207,84,115,0.2)',
                  borderRadius: '8px',
                  display: 'block',
                }}
                className="post-nav-link"
              >
                <span style={{ fontSize: '12px', color: '#A57686' }}>← Previous</span>
                <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#321E26', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {prev.title}
                </p>
              </Link>
            ) : <div />}
            {next ? (
              <Link
                to="/blog/$slug"
                params={{ slug: next.slug }}
                style={{
                  textDecoration: 'none',
                  padding: '16px',
                  border: '1px solid rgba(207,84,115,0.2)',
                  borderRadius: '8px',
                  display: 'block',
                  textAlign: 'right',
                }}
                className="post-nav-link"
              >
                <span style={{ fontSize: '12px', color: '#A57686' }}>Next →</span>
                <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#321E26', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {next.title}
                </p>
              </Link>
            ) : <div />}
          </nav>
        )}
      </article>

      <style>{`
        .post-nav-link:hover { border-color: rgba(207,84,115,0.5) !important; }
        .post-nav-link:hover p { color: #CF5473 !important; }
      `}</style>
    </div>
  )
}

function formatDateChinese(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}
