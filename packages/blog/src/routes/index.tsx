import { createFileRoute, Link } from '@tanstack/react-router'
import { getAllPosts } from '@/lib/posts'
import { useTheme } from '@/lib/theme'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const posts = getAllPosts()
  const { theme, toggleTheme } = useTheme()

  return (
    <div style={{ minHeight: '100vh', background: theme === 'dark' ? '#111827' : '#FEF5F6', fontFamily: 'var(--font-sans)' }}>
      {/* TopBar */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', padding: '36px 40px 24px', overflow: 'hidden' }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '18px', color: theme === 'dark' ? '#F9FAFB' : '#321E26', whiteSpace: 'nowrap', flexShrink: 0 }}>
          Home
        </span>
        <div style={{ flex: 1 }} />
        <div style={{ width: '80px', flexShrink: 0 }} />
      </div>

      {/* AvatarSection — big theme toggle icon */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '48px', paddingBottom: '32px' }}>
        <button
          onClick={toggleTheme}
          style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            border: 'none',
            background: theme === 'dark' ? '#374151' : '#FDF2F8',
            color: theme === 'dark' ? '#F472B6' : '#E60076',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            boxShadow: theme === 'dark' ? '0 4px 24px rgba(244,114,182,0.2)' : '0 4px 24px rgba(230,0,118,0.15)',
          }}
          aria-label={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
        >
          {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>

      {/* Body */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', boxSizing: 'border-box' }}>
        {/* About row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            padding: '10px 0',
            fontFamily: 'var(--font-sans)',
            fontWeight: 400,
          }}
        >
          <span style={{ fontSize: '18px', color: theme === 'dark' ? '#F9FAFB' : '#321E26', width: '120px', flexShrink: 0, lineHeight: 'normal' }}>
            About
          </span>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', minHeight: '22.5px' }}>
            <p style={{ fontSize: '15px', color: theme === 'dark' ? '#9CA3AF' : '#A57686', lineHeight: 'normal', margin: 0 }}>
              在很长一段时期里，我都是早早就躺下了。
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 0' }}>
          <div style={{ flex: 1, height: '1px' }} />
          <div style={{ width: '80px', height: '1px', background: theme === 'dark' ? 'rgba(244,114,182,0.4)' : 'rgba(207,84,115,0.4)', flexShrink: 0 }} />
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: theme === 'dark' ? '#F472B6' : '#CF5473',
              flexShrink: 0,
            }}
          />
          <div style={{ width: '80px', height: '1px', background: theme === 'dark' ? 'rgba(244,114,182,0.4)' : 'rgba(207,84,115,0.4)', flexShrink: 0 }} />
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
          <span style={{ fontSize: '18px', color: theme === 'dark' ? '#F9FAFB' : '#321E26', width: '120px', flexShrink: 0, lineHeight: 'normal' }}>
            Posts
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            {posts.length === 0 ? (
              <p style={{ color: theme === 'dark' ? '#9CA3AF' : '#A57686', fontSize: '15px', margin: 0 }}>No posts yet. Stay tuned.</p>
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
                        <span style={{ color: theme === 'dark' ? '#F472B6' : '#CF5473', fontSize: '12px', flexShrink: 0 }}>✦</span>
                      )}
                      <span style={{ fontSize: '15px', color: theme === 'dark' ? '#F9FAFB' : '#321E26' }}>{post.title}</span>
                      <span style={{ fontSize: '13px', color: theme === 'dark' ? '#9CA3AF' : '#A57686', flexShrink: 0 }}>
                        · {estimateReadTime(post.content)} min
                      </span>
                    </div>
                    <time style={{ fontSize: '13px', color: theme === 'dark' ? '#9CA3AF' : '#A57686', flexShrink: 0 }}>
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
        .post-row:hover span {
          color: ${theme === 'dark' ? '#F472B6' : '#CF5473'} !important;
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
