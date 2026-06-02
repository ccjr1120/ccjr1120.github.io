import { createFileRoute, Link } from '@tanstack/react-router'
import { getAllPosts } from '@/lib/posts'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const posts = getAllPosts()

  return (
    <div className="max-w-2xl mx-auto px-8 pb-16">
      {/* Profile */}
      <section className="mb-12 flex items-start gap-6">
        <div className="w-20 h-20 rounded-full bg-surface-muted border border-border overflow-hidden shrink-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-text-muted">C</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CCJR</h1>
          <p className="mt-2 text-text-muted">一名开发者，喜欢把想法落成代码，把代码落成产品。</p>
        </div>
      </section>

      <Divider />

      {/* Posts */}
      <Section label="Posts">
        {posts.length === 0 ? (
          <p className="text-text-muted text-sm">暂无文章，敬请期待。</p>
        ) : (
          <ul className="space-y-0">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="group flex items-baseline justify-between gap-4 py-2.5 text-sm transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded"
                >
                  <span className="text-text group-hover:text-primary transition-colors leading-snug">
                    {post.title}
                  </span>
                  <time className="shrink-0 font-mono text-xs text-text-muted tabular-nums">
                    {formatDate(post.date)}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">{label}</h2>
      {children}
    </section>
  )
}

function Divider() {
  return <hr className="border-border mb-10" />
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}
