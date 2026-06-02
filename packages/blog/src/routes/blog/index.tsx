import { createFileRoute, Link } from '@tanstack/react-router'
import { getAllPosts } from '@/lib/posts'
import { createSearch } from '@/lib/search'
import { useState, useMemo } from 'react'

export const Route = createFileRoute('/blog/')({
  component: BlogPage,
})

function BlogPage() {
  const allPosts = getAllPosts()
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const tags = useMemo(() => {
    const m = new Map<string, number>()
    for (const p of allPosts) for (const t of p.tags) m.set(t, (m.get(t) ?? 0) + 1)
    return [...m.entries()].sort((a, b) => b[1] - a[1])
  }, [allPosts])

  const search = useMemo(() => createSearch(allPosts), [allPosts])

  const filtered = useMemo(() => {
    let posts = query ? search.search(query).map((r) => r.item) : allPosts
    if (activeTag) posts = posts.filter((p) => p.tags.includes(activeTag))
    return posts
  }, [query, activeTag, allPosts, search])

  return (
    <div style={{ minHeight: '100vh', background: '#FEF5F6', fontFamily: 'var(--font-sans)' }}>
      {/* TopBar */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', padding: '36px 40px 24px' }}>
        <Link to="/" style={{ fontSize: '18px', color: '#321E26', textDecoration: 'none' }}>
          Home
        </Link>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: '18px', color: '#321E26' }}>Posts</span>
        <div style={{ width: '80px' }} />
      </div>

      {/* Name */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '48px', paddingBottom: '32px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '56px',
            fontWeight: 700,
            color: '#321E26',
            margin: 0,
          }}
        >
          CCJR
        </h1>
      </div>

      {/* Body */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', boxSizing: 'border-box' }}>
        {/* Search row */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', padding: '12px 0' }}>
          <span style={{ fontSize: '18px', color: '#321E26', width: '120px', flexShrink: 0 }}>Search</span>
          <input
            type="search"
            placeholder="Search posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 0',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(207,84,115,0.3)',
              fontSize: '15px',
              color: '#321E26',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
            }}
          />
        </div>

        {/* Tags row */}
        {tags.length > 0 && (
          <>
            <Divider />
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', padding: '12px 0' }}>
              <span style={{ fontSize: '18px', color: '#321E26', width: '120px', flexShrink: 0 }}>Tags</span>
              <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <button
                  onClick={() => setActiveTag(null)}
                  style={{
                    padding: '4px 14px',
                    borderRadius: '999px',
                    border: '1px solid rgba(207,84,115,0.4)',
                    background: !activeTag ? '#CF5473' : 'transparent',
                    color: !activeTag ? '#FEF5F6' : '#A57686',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  All
                </button>
                {tags.map(([tag, count]) => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                    style={{
                      padding: '4px 14px',
                      borderRadius: '999px',
                      border: '1px solid rgba(207,84,115,0.4)',
                      background: activeTag === tag ? '#CF5473' : 'transparent',
                      color: activeTag === tag ? '#FEF5F6' : '#A57686',
                      fontSize: '13px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    #{tag} ({count})
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <Divider />

        {/* Posts row */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', paddingTop: '8px' }}>
          <span style={{ fontSize: '18px', color: '#321E26', width: '120px', flexShrink: 0 }}>Posts</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            {filtered.length === 0 ? (
              <p style={{ color: '#A57686', fontSize: '15px', margin: 0 }}>No matching posts found.</p>
            ) : (
              filtered.map((post, i) => (
                <Link
                  key={post.slug}
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                  className="post-row"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', flex: 1, gap: '8px', alignItems: 'center', minWidth: 0, overflow: 'hidden' }}>
                      {i === 0 && <span style={{ color: '#CF5473', fontSize: '12px', flexShrink: 0 }}>✦</span>}
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

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 0' }}>
      <div style={{ flex: 1, height: '1px' }} />
      <div style={{ width: '80px', height: '1px', background: 'rgba(207,84,115,0.4)' }} />
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#CF5473' }} />
      <div style={{ width: '80px', height: '1px', background: 'rgba(207,84,115,0.4)' }} />
      <div style={{ flex: 1, height: '1px' }} />
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
