import dayjs from 'dayjs'
import Link from 'next/link'
import { getBlogPosts } from '@/utils/posts'

export type Blog = ReturnType<typeof getBlogPosts>[number]
export default function Home() {
  const allBlogs = getBlogPosts()
  return (
    <main className="flex flex-col gap-12">
      {allBlogs.map(({ title, slug, metadata }) => (
        <article key={slug} className="article-item">
          <Link key={slug} className="flex flex-col" href={`/blog/${slug}`}>
            <h2 className="text-pri font-mono text-xl">{title}</h2>
          </Link>
          <div className="mt-1 text-sm">{metadata.desc}</div>
          <div className="mt-0.5 text-sm">
            <span>{dayjs(metadata.date).format('M月D日')}</span>
            <span>{`, ⏱️ ${metadata.readMinutes}分钟读完`}</span>
          </div>
        </article>
      ))}
    </main>
  )
}
