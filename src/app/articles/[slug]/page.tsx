import { notFound } from 'next/navigation'
import { getAllMDXSlugs, getMDXData } from '@/lib/mdx-utils'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

// 生成静态路径
export async function generateStaticParams() {
  const slugs = getAllMDXSlugs()
  return slugs.map((slug) => ({
    slug: slug
  }))
}

// 生成元数据
export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params
  const mdxData = getMDXData(slug)

  if (!mdxData) {
    return {
      title: '文章未找到',
      description: '您访问的文章不存在'
    }
  }

  const { frontmatter } = mdxData

  return {
    title: frontmatter.title,
    description: frontmatter.excerpt,
    authors: [{ name: frontmatter.author }],
    keywords: frontmatter.tags,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.excerpt,
      type: 'article',
      publishedTime: frontmatter.date,
      authors: [frontmatter.author],
      tags: frontmatter.tags
    }
  }
}

// 强制静态渲染
export const dynamic = 'force-static'

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const mdxData = getMDXData(slug)

  if (!mdxData) {
    notFound()
  }

  const { frontmatter } = mdxData

  // 动态导入MDX文件
  let MDXContent
  try {
    const mdxModule = await import(`../content/${slug}/index.mdx`)
    MDXContent = mdxModule.default
  } catch (error) {
    console.error(`Failed to import MDX file: ${slug}`, error)
    notFound()
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      {/* 文章头部信息 */}
      <header className="mb-8 pb-8">
        <h1 className="mb-4 text-4xl leading-tight font-bold">
          {frontmatter.title}
        </h1>

        <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <span>作者：{frontmatter.author}</span>
          <span>发布时间：{formatDate(frontmatter.date)}</span>
        </div>
      </header>

      {/* MDX文章内容 */}
      <main className="prose prose-lg prose-gray dark:prose-invert max-w-none">
        <MDXContent />
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
    day: 'numeric'
  })
}
