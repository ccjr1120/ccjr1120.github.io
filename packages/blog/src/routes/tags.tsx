import { createFileRoute } from '@tanstack/react-router'
import { getAllPosts, getAllTags } from '@/lib/posts'
import { PostCard } from '@/components/PostCard'

type TagsSearch = { tag?: string }

export const Route = createFileRoute('/tags')({
  component: TagsPage,
  validateSearch: (search: Record<string, unknown>): TagsSearch => ({
    tag: typeof search.tag === 'string' ? search.tag : undefined,
  }),
})

function TagsPage() {
  const { tag: activeTag } = Route.useSearch()
  const allTags = getAllTags()
  const allPosts = getAllPosts()
  const filteredPosts = activeTag ? allPosts.filter((p) => p.tags.includes(activeTag)) : []

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Tags</h1>

      <div className="flex flex-wrap gap-3 mb-12">
        {[...allTags.entries()]
          .sort((a, b) => b[1] - a[1])
          .map(([tag, count]) => (
            <a
              key={tag}
              href={`/tags?tag=${encodeURIComponent(tag)}`}
              className={`inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ${activeTag === tag ? 'bg-primary text-on-primary hover:bg-primary-hover' : 'bg-surface-muted text-text-muted hover:bg-primary/10 hover:text-primary'}`}
              aria-current={activeTag === tag ? 'true' : undefined}
            >
              #{tag} <span className="ml-1 opacity-70">({count})</span>
            </a>
          ))}
      </div>

      {activeTag && (
        <>
          <h2 className="text-2xl font-bold mb-6">
            Tag: <span className="text-primary">#{activeTag}</span>
          </h2>
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-text-muted">No posts with this tag.</p>
          )}
        </>
      )}
    </div>
  )
}
