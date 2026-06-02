import { createFileRoute, Link } from '@tanstack/react-router'
import { getAllPosts } from '@/lib/posts'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const posts = getAllPosts()

  return (
    <div style={{ minHeight: '100vh', background: '#FEF5F6', fontFamily: 'var(--font-sans)' }}>
      {/* TopBar */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', padding: '36px 40px 24px', overflow: 'hidden' }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '18px', color: '#321E26', whiteSpace: 'nowrap', flexShrink: 0 }}>
          Home
        </span>
        <div style={{ flex: 1 }} />
        <div style={{ width: '80px', flexShrink: 0 }} />
      </div>

      {/* AvatarSection — big serif name */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '48px', paddingBottom: '32px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '56px',
            fontWeight: 700,
            color: '#321E26',
            margin: 0,
            letterSpacing: 0,
          }}
        >
          CCJR
        </h1>
      </div>

      {/* Body */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', boxSizing: 'border-box' }}>
        {/* About row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            padding: '12px 0',
            fontFamily: 'var(--font-sans)',
            fontWeight: 400,
          }}
        >
          <span style={{ fontSize: '18px', color: '#321E26', width: '120px', flexShrink: 0, lineHeight: 'normal' }}>
            About
          </span>
          <p style={{ flex: 1, fontSize: '15px', color: '#A57686', lineHeight: 1.7, margin: 0 }}>
            试着用心感受。
          </p>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 0' }}>
          <div style={{ flex: 1, height: '1px' }} />
          <div style={{ width: '80px', height: '1px', background: 'rgba(207,84,115,0.4)', flexShrink: 0 }} />
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#CF5473',
              flexShrink: 0,
            }}
          />
          <div style={{ width: '80px', height: '1px', background: 'rgba(207,84,115,0.4)', flexShrink: 0 }} />
          <div style={{ flex: 1, height: '1px' }} />
        </div>

        {/* Posts row */}
        <div
          style={{
            display: 'flex',
            gap: '24px',
            alignItems: 'flex-start',
            paddingTop: '8px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 400,
          }}
        >
          <span style={{ fontSize: '18px', color: '#321E26', width: '120px', flexShrink: 0, lineHeight: 'normal' }}>
            Posts
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            {posts.length === 0 ? (
              <p style={{ color: '#A57686', fontSize: '15px', margin: 0 }}>No posts yet. Stay tuned.</p>
            ) : (
              posts.map((post, i) => (
                <Link
                  key={post.slug}
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                  className="post-row"
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 0',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <div style={{ display: 'flex', flex: 1, gap: '8px', alignItems: 'center', minWidth: 0, overflow: 'hidden' }}>
                      {i === 0 && (
                        <span style={{ color: '#CF5473', fontSize: '12px', flexShrink: 0 }}>✦</span>
                      )}
                      <span style={{ fontSize: '15px', color: '#321E26' }}>{post.title}</span>
                      <span style={{ fontSize: '13px', color: '#A57686', flexShrink: 0 }}>
                        · {estimateReadTime(post.content)} min
                      </span>
                    </div>
                    <time style={{ fontSize: '13px', color: '#A57686', flexShrink: 0 }}>
                      {formatDateChinese(post.date)}
                    </time>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        .post-row:hover span[style*="#321E26"] {
          color: #CF5473 !important;
        }
      `}</style>
    </div>
  )
}

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

function formatDateChinese(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}
