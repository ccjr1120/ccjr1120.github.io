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
      <section className="mb-12 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-surface-muted border border-border overflow-hidden mb-5 flex items-center justify-center">
          <span className="text-3xl font-bold text-text-muted">C</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">CCJR</h1>
      </section>

      {/* About */}
      <Section label="About">
        <p className="text-text-muted leading-relaxed">
          一名开发者，喜欢把想法落成代码，把代码落成产品。记录技术探索、项目经验和思考。
        </p>
      </Section>

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
    <div className="flex gap-8 mb-8">
      <div className="w-16 shrink-0 pt-0.5">
        <span className="text-xs text-text-muted">{label}</span>
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}

function Divider() {
  return (
    <div className="flex gap-8 mb-8">
      <div className="w-16 shrink-0" />
      <div className="flex-1">
        <hr className="border-border" />
      </div>
    </div>
  )
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}
