import { notFound } from 'next/navigation'
import { getArticleContent, getAllArticles } from '@/lib/articles'
import dynamic from 'next/dynamic'

interface ArticlePageProps {
  params: {
    slug: string
  }
}

// 生成静态路径
export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

// 生成元数据
export async function generateMetadata({ params }: ArticlePageProps) {
  const result = getArticleContent(params.slug)
  
  if (!result) {
    return {
      title: '文章未找到',
      description: '您访问的文章不存在'
    }
  }

  const { article } = result

  return {
    title: article.title,
    description: article.excerpt,
    authors: [{ name: article.author }],
    keywords: article.tags,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
      tags: article.tags,
    },
  }
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const result = getArticleContent(params.slug)
  
  if (!result) {
    notFound()
  }

  const { article } = result

  // 动态导入文章组件
  const ArticleComponent = dynamic(() => import(`../${params.slug}/component`), {
    loading: () => (
      <div className="flex items-center justify-center py-16">
        <div className="text-lg">加载中...</div>
      </div>
    ),
    ssr: true,
  })

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      {/* 文章头部信息 */}
      <header className="mb-8 border-b pb-8">
        <h1 className="mb-4 text-4xl font-bold leading-tight">{article.title}</h1>
        
        <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <span>作者：{article.author}</span>
          <span>发布时间：{formatDate(article.date)}</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* 文章内容 */}
      <main>
        <ArticleComponent />
      </main>
    </div>
  )
}

// 格式化日期
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
} 