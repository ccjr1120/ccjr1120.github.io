import { notFound, redirect } from 'next/navigation'
import {
  getAllArticleSlugs,
  resolveArticleByDisplaySlug,
  extractTableOfContents,
  isCategoryPath
} from '@/lib/mdx-utils'
import TableOfContents from '@/components/TableOfContents'

interface ArticlePageProps {
  params: Promise<{ slug: string[] }>
}

// 生成静态路径
export async function generateStaticParams() {
  const slugs = getAllArticleSlugs()
  return slugs.map((slug) => ({ slug }))
}

// 生成元数据
export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params
  const mdxData = resolveArticleByDisplaySlug(slug)

  if (!mdxData) {
    return {
      title: '文章未找到',
      description: '您访问的文章不存在'
    }
  }

  const { frontmatter } = mdxData

  return {
    title: String(frontmatter.title),
    description: String(frontmatter.excerpt),
    authors: [{ name: String(frontmatter.author) }],
    keywords: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    openGraph: {
      title: String(frontmatter.title),
      description: String(frontmatter.excerpt),
      type: 'article',
      publishedTime: String(frontmatter.date),
      authors: [String(frontmatter.author)],
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : []
    }
  }
}

// 强制静态渲染
export const dynamic = 'force-static'

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params

  // 如果是分类路径：
  const cat = isCategoryPath(slug)
  if (cat.isCategory) {
    if (cat.hasIndex) {
      // 有 index.mdx 时按文章渲染（落到 下面 resolve）
    } else {
      // 没有 index.mdx 时返回到 /blog 列表
      redirect('/blog')
    }
  }

  const mdxData = resolveArticleByDisplaySlug(slug)

  if (!mdxData) {
    notFound()
  }

  const { frontmatter, content } = mdxData

  // 提取目录
  const tocItems = extractTableOfContents(content)

  // 动态导入MDX文件 - 根据真实路径自动查找
  let MDXContent
  try {
    const mdxModule = await import(`../content/${mdxData.realPathRelative}`)
    MDXContent = mdxModule.default
  } catch (error) {
    console.error(`Failed to import MDX file: ${slug?.join('/')}`, error)
    notFound()
  }

  return (
    <div className="relative">
      <div className="max-w-7xl px-6 py-8 lg:px-36">
        {/* 右侧目录 - 固定定位 */}
        <TableOfContents items={tocItems} />

        {/* 主要内容区域 */}
        <div className="mx-auto w-full max-w-4xl">
          <div className="w-full">
            {/* 文章头部信息 */}
            <header className="mb-8 pb-8">
              <h1 className="mb-4 text-4xl leading-tight font-bold">
                {String(frontmatter.title)}
              </h1>

              <div
                className="mb-4 flex flex-wrap items-center gap-4 text-sm"
                style={{ color: 'var(--color-default-600)' }}
              >
                <span>作者：{String(frontmatter.author)}</span>
                <span>发布时间：{formatDate(String(frontmatter.date))}</span>
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
