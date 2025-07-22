'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// 文章接口定义
interface Article {
  id: string
  title: string
  excerpt: string
  date: string
  author: string
  tags: string[]
  slug: string
}

// 示例文章数据
const sampleArticles: Article[] = [
  {
    id: '1',
    title: 'Next.js 15 新特性深度解析',
    excerpt: '探索Next.js 15带来的令人兴奋的新功能，包括Turbopack、Server Components改进以及性能优化。',
    date: '2024-01-15',
    author: '匆匆孑然',
    tags: ['Next.js', 'React', 'Web开发'],
    slug: 'nextjs-15-features'
  },
  {
    id: '2', 
    title: 'Three.js 3D模型优化指南',
    excerpt: '学习如何优化Three.js中的3D模型，提升渲染性能，减少加载时间，打造流畅的3D体验。',
    date: '2024-01-10',
    author: '匆匆孑然',
    tags: ['Three.js', '3D', '性能优化'],
    slug: 'threejs-model-optimization'
  },
  {
    id: '3',
    title: 'TypeScript 高级类型技巧',
    excerpt: '深入了解TypeScript的高级类型特性，掌握泛型、条件类型和映射类型的实际应用。',
    date: '2024-01-05',
    author: '匆匆孑然',
    tags: ['TypeScript', 'JavaScript', '编程技巧'],
    slug: 'typescript-advanced-types'
  },
  {
    id: '4',
    title: 'WebGPU 入门指南',
    excerpt: 'WebGPU即将改变Web图形渲染的游戏规则，了解如何开始使用这个强大的新API。',
    date: '2023-12-28',
    author: '匆匆孑然',
    tags: ['WebGPU', '图形渲染', 'Web技术'],
    slug: 'webgpu-getting-started'
  },
  {
    id: '5',
    title: 'CSS 变量与主题切换实践',
    excerpt: '使用CSS自定义属性实现优雅的主题切换，提升用户体验和界面美观度。',
    date: '2023-12-20',
    author: '匆匆孑然',
    tags: ['CSS', '主题', 'UI设计'],
    slug: 'css-variables-theming'
  }
]

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟异步加载文章数据
    const loadArticles = async () => {
      setLoading(true)
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 800))
      setArticles(sampleArticles)
      setLoading(false)
    }

    loadArticles()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
            <p className="mt-4 text-gray-600">正在加载文章...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* 页面头部 */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-light text-gray-900">
            技术博客
          </h1>
          <p className="text-lg text-gray-600">
            分享前端开发、3D图形和新技术的心得体会
          </p>
        </div>

        {/* 文章列表 */}
        <div className="space-y-8">
          {articles.map((article) => (
            <article
              key={article.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4">
                <h2 className="mb-2 text-2xl font-medium text-gray-900 hover:text-gray-700">
                  <Link href={`/blog/${article.slug}`}>
                    {article.title}
                  </Link>
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span>作者：{article.author}</span>
                  <span>发布于：{formatDate(article.date)}</span>
                </div>
                <Link
                  href={`/blog/${article.slug}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  阅读全文 →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* 空状态提示 */}
        {articles.length === 0 && !loading && (
          <div className="text-center text-gray-500">
            <p className="text-lg">暂无文章</p>
            <p className="mt-2">敬请期待更多精彩内容</p>
          </div>
        )}

        {/* 底部导航 */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-block rounded-lg bg-gray-900 px-6 py-3 text-white transition-colors hover:bg-gray-800"
          >
            查看所有文章
          </Link>
        </div>
      </div>
    </div>
  )
}
