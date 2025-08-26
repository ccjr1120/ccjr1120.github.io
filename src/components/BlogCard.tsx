import Link from 'next/link'
import { Article } from '@/types/blog'

interface BlogCardProps {
  article: Article
  index: number
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function BlogCard({ article }: BlogCardProps) {
  const routePath = `/blog/${article.slug}`
  return (
    <article
      className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.01]"
      style={{
        background: `linear-gradient(135deg, var(--color-content1) 0%, var(--color-content2) 100%)`,
        border: '1px solid var(--color-default-200)'
      }}
    >
      <Link href={routePath} style={{}}>
        <div className="relative p-8">
          {/* 标题和描述 */}
          <div className="mb-6">
            <h2 className="mb-4 text-2xl leading-tight font-medium transition-colors duration-200 group-hover:opacity-80">
              {article.title}
            </h2>
            <p
              className="text-base leading-relaxed"
              style={{ color: 'var(--color-foreground)' }}
            >
              {article.excerpt}
            </p>
          </div>

          {/* 标签 */}
          <div className="mb-6 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors duration-200"
                style={{ color: 'var(--color-default-600)' }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 底部信息 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <span style={{ color: 'var(--color-default-600)' }}>
                {article.author}
              </span>
              <span style={{ color: 'var(--color-default-500)' }}>
                {formatDate(article.date)}
              </span>
            </div>
            <div
              className="inline-flex items-center gap-1 text-sm font-medium transition-colors duration-200 hover:opacity-80"
              style={{ color: 'var(--color-primary)' }}
            >
              阅读全文
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
