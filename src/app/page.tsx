import { getBlogPosts } from '@/posts/utils'
import moment from 'moment'
import Link from 'next/link'

export type Blog = ReturnType<typeof getBlogPosts>[number]
export default function Home() {
  const allBlogs = getBlogPosts()
  return (
    <main className="flex flex-col gap-12">
      {allBlogs.map((blog) => (
        <article key={blog.slug} className="article-item">
          <Link
            key={blog.slug}
            className="flex flex-col"
            href={`/blog/${blog.slug}`}
          >
            <h2 className="font-mono text-2xl text-pri">{blog.title}</h2>
          </Link>
          <div className="mt-1 text-sm">{blog.metadata.desc}</div>
          <div className="mt-0.5 text-sm">
            {moment(blog.metadata.date).format('M月D日')}, 大约
            {Math.max(blog.metadata.readMinutes, 1)}分钟内读完
          </div>
        </article>
      ))}
    </main>
  )
}
