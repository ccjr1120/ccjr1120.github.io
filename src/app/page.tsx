import BlogCard from '@/components/BlogCard'
import { getAllArticles } from '@/lib/articles'

export default function Home() {
  // 从实际的MDX文件中读取文章列表
  const articles = getAllArticles()

  return (
    <div className="">
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* 文章列表 */}
        <div className="grid gap-6 md:gap-8">
          {articles.map((article, index) => (
            <BlogCard key={article.id} article={article} index={index} />
          ))}
        </div>

        {/* 空状态提示 */}
        {articles.length === 0 && (
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
