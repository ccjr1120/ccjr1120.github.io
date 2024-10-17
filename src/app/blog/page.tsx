import dayjs from 'dayjs'
import Link from 'next/link'
import { getBlogPosts } from '@/utils/posts'
import type { Metadata } from 'next'

export type Blog = ReturnType<typeof getBlogPosts>[number]
export const metadata: Metadata = {
  title: 'Blog',
  description: '成长，生命，幸福还有我的朋友'
}
export default function Blog() {
  const allBlogs = getBlogPosts()
  return (
    <main className="flex flex-col gap-12">
      <h2 className="text-base font-bold text-muted">
        随思随写，任意徜徉 <br />
        如果你来到这里，那是不是意味着你无处可去？
        <br /> 我很推荐你去
        <Link className="text-primary underline" href="/article">
          这里
        </Link>
        看看
      </h2>
      {allBlogs.map(({ title, slug, metadata }) => (
        <article key={slug} className="article-item">
          <Link key={slug} className="flex flex-col" href={`/blog/${slug}`}>
            <h2 className="text-pri font-mono text-xl font-semibold">
              {title}
            </h2>
          </Link>
          <div className="mt-1 text-sm text-muted">{metadata.desc}</div>
          <div className="mt-0.5 text-sm text-muted">
            <span>{dayjs(metadata.date).format('M月D日')}</span>
            <span>{`, ⏱️ ${metadata.readMinutes}分钟读完`}</span>
          </div>
        </article>
      ))}
    </main>
  )
}
