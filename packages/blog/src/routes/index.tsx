import { createFileRoute, Link } from '@tanstack/react-router'
import { getAllPosts } from '@/lib/posts'
import { PostCard } from '@/components/PostCard'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const posts = getAllPosts()
  const [featured, ...rest] = posts
  const bentoPosts = rest.slice(0, 2)
  const hasPosts = posts.length > 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Hero */}
      <section className="mb-8 md:mb-10">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Hi, I'm <span className="text-primary">CCJR</span>
        </h1>
        <p className="mt-3 max-w-2xl text-base md:text-lg text-text-muted">
          欢迎来到我的博客。这里记录着我的技术探索、项目经验和思考。
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/blog"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-6 py-2.5 font-semibold text-on-primary transition-colors hover:bg-primary-hover active:bg-primary-active focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
          >
            阅读博客
          </Link>
          <Link
            to="/about"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-6 py-2.5 font-semibold text-text transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
          >
            了解更多
          </Link>
        </div>
      </section>

      {/* Posts / Empty state */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl md:text-2xl font-bold">最新文章</h2>
          {hasPosts && (
            <Link
              to="/blog"
              className="text-sm font-medium text-text-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
            >
              查看全部 &rarr;
            </Link>
          )}
        </div>

        {hasPosts ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[minmax(0,1fr)]">
            <div className="md:col-span-2 lg:row-span-2">
              <PostCard post={featured} featured />
            </div>
            {bentoPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <EmptyPosts />
        )}
      </section>
    </div>
  )
}

function EmptyPosts() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface px-6 py-16 text-center">
      <p className="font-mono text-xs uppercase tracking-wider text-text-muted">
        // status: drafting
      </p>
      <h3 className="mt-4 text-2xl font-bold">第一篇还在构思中</h3>
      <p className="mt-2 max-w-md text-sm text-text-muted">
        博客刚刚搭好，第一批文章正在路上。先去看看「关于」，或者过几天再来。
      </p>
      <Link
        to="/about"
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-5 py-2 text-sm font-medium text-text transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
      >
        了解更多 &rarr;
      </Link>
    </div>
  )
}
