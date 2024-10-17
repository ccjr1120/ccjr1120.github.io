import dayjs from 'dayjs'
import Link from 'next/link'
import { getArticles } from '@/utils/posts'
import type { Metadata } from 'next'

export type Article = ReturnType<typeof getArticles>[number]
export const metadata: Metadata = {
  title: '文章',
  description: '成长，生命，幸福还有我的朋友'
}
export default function Article() {
  const allBlogs = getArticles()
  return (
    <main className="flex flex-col gap-12">
      <h2 className="text-base font-bold text-muted">
        这里我是用过心的
        <br />
        所以如果你对这里有一些意见或者需要帮助，请
        <a
          className="text-primary underline"
          target="_blank"
          href="https://github.com/ccjr1120/ccjr1120.github.io/issues/new"
          rel="noreferrer"
        >
          联系我
        </a>
        <br />
        因为我真的很用心
      </h2>
      {allBlogs.map(({ title, slug, metadata }) => (
        <article key={slug} className="article-item">
          <Link key={slug} className="flex flex-col" href={`/article/${slug}`}>
            <h2 className="text-pri font-mono text-xl">{title}</h2>
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
