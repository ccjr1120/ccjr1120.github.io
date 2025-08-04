import BlogCard from '@/components/BlogCard'
import { getAllMDXData } from '@/lib/mdx-utils'

export default function Blog() {
  // 从MDX文件中读取文章列表
  const articles = getAllMDXData()

  // 转换MDX数据格式以兼容BlogCard组件
  const formattedArticles = articles
    .filter((article) => article !== null)
    .map((article) => ({
      id: article.slug,
      title: article.frontmatter.title,
      excerpt: article.frontmatter.excerpt,
      date: article.frontmatter.date,
      author: article.frontmatter.author,
      tags: article.frontmatter.tags,
      slug: article.slug
    }))

  return (
    <div className="">
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* 文章列表 */}
        <div className="grid gap-6 md:gap-8">
          {formattedArticles.map((article, index) => (
            <BlogCard key={article.id} article={article} index={index} />
          ))}
        </div>

        {/* 空状态提示 */}
        {formattedArticles.length === 0 && (
          <div className="text-center">
            <p
              className="text-lg"
              style={{ color: 'var(--color-default-600)' }}
            >
              暂无文章
            </p>
            <p className="mt-2" style={{ color: 'var(--color-default-500)' }}>
              敬请期待更多精彩内容
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
