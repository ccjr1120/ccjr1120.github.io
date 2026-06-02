import { createFileRoute } from '@tanstack/react-router'
import { getAllPosts } from '@/lib/posts'
import { PostCard } from '@/components/PostCard'
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
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight mb-8">博客</h1>

      {/* Search */}
      <div className="mb-6">
        <input
          type="search"
          placeholder="搜索文章..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-md min-h-11 rounded-xl border border-border bg-surface px-4 py-2.5 text-text placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
          aria-label="搜索文章"
        />
      </div>

      {/* Tags */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTag(null)}
          className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ${!activeTag ? 'bg-primary text-on-primary hover:bg-primary-hover' : 'bg-surface-muted text-text-muted hover:text-text'}`}
        >
          全部
        </button>
        {tags.map(([tag, count]) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ${activeTag === tag ? 'bg-primary text-on-primary hover:bg-primary-hover' : 'bg-surface-muted text-text-muted hover:bg-primary/10 hover:text-primary'}`}
            aria-pressed={activeTag === tag}
          >
            #{tag} ({count})
          </button>
        ))}
      </div>

      {/* Posts */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-text-muted py-12 text-center">没有找到匹配的文章。</p>
      )}
    </div>
  )
}
