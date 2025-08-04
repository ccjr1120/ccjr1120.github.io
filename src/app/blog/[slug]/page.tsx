import { notFound } from 'next/navigation'
import {
  getAllMDXSlugs,
  getMDXData,
  extractTableOfContents
} from '@/lib/mdx-utils'
import TableOfContents from '@/components/TableOfContents'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ dir?: string }>
}

// 生成静态路径
export async function generateStaticParams() {
  const slugs = getAllMDXSlugs()
  return slugs.map((slug) => ({
    slug: slug
  }))
}

// 生成元数据
export async function generateMetadata({
  params,
  searchParams
}: ArticlePageProps) {
  const { slug } = await params
  const searchParamsResolved = await searchParams
  const contentDir = searchParamsResolved?.dir
  const mdxData = getMDXData(slug, contentDir)

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

export default async function ArticlePage({
  params,
  searchParams
}: ArticlePageProps) {
  const { slug } = await params
  const searchParamsResolved = await searchParams
  const contentDir = searchParamsResolved?.dir
  const mdxData = getMDXData(slug, contentDir)

  if (!mdxData) {
    notFound()
  }

  const { frontmatter, content } = mdxData

  // 提取目录
  const tocItems = extractTableOfContents(content)

  // 动态导入MDX文件 - 使用预定义的映射
  let MDXContent
  try {
    if (contentDir) {
      // 如果指定了自定义目录，这里可以扩展支持
      throw new Error(`Custom directory import not implemented: ${contentDir}`)
    } else {
      // 默认从blog/content目录导入
      switch (slug) {
        case 'game-of-life':
          const gameOfLifeModule = await import(
            '../content/game-of-life/index.mdx'
          )
          MDXContent = gameOfLifeModule.default
          break
        default:
          throw new Error(`Article not found: ${slug}`)
      }
    }
  } catch (error) {
    console.error(`Failed to import MDX file: ${slug}`, error)
    notFound()
  }

  return (
    <div className="relative">
      <div className="max-w-7xl px-6 py-8 lg:px-36">
        {/* 右侧目录 - 固定定位 */}
        <TableOfContents items={tocItems} />

        {/* 主要内容区域 */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="w-full">
            {/* 文章头部信息 */}
            <header className="mb-8 pb-8">
              <h1 className="mb-4 text-4xl leading-tight font-bold">
                {frontmatter.title}
              </h1>

              <div
                className="mb-4 flex flex-wrap items-center gap-4 text-sm"
                style={{ color: 'var(--color-default-600)' }}
              >
                <span>作者：{frontmatter.author}</span>
                <span>发布时间：{formatDate(frontmatter.date)}</span>
                {contentDir && <span>目录：{contentDir}</span>}
              </div>
            </header>

            {/* MDX文章内容 */}
            <main className="prose prose-lg prose-gray dark:prose-invert max-w-none">
              <MDXContent />
            </main>
          </div>
        </div>
      </div>
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
