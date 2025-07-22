'use client'

import Link from 'next/link'
import BlogCard from '@/components/BlogCard'
import { Article } from '@/types/blog'

// 示例文章数据
const articles: Article[] = [
  {
    id: '1',
    title: 'Next.js 15 新特性深度解析',
    excerpt:
      '探索Next.js 15带来的令人兴奋的新功能，包括Turbopack、Server Components改进以及性能优化。',
    date: '2024-01-15',
    author: '匆匆孑然',
    tags: ['Next.js', 'React', 'Web开发'],
    slug: 'nextjs-15-features'
  },
  {
    id: '2',
    title: 'Three.js 3D模型优化指南',
    excerpt:
      '学习如何优化Three.js中的3D模型，提升渲染性能，减少加载时间，打造流畅的3D体验。',
    date: '2024-01-10',
    author: '匆匆孑然',
    tags: ['Three.js', '3D', '性能优化'],
    slug: 'threejs-model-optimization'
  },
  {
    id: '3',
    title: 'TypeScript 高级类型技巧',
    excerpt:
      '深入了解TypeScript的高级类型特性，掌握泛型、条件类型和映射类型的实际应用。',
    date: '2024-01-05',
    author: '匆匆孑然',
    tags: ['TypeScript', 'JavaScript', '编程技巧'],
    slug: 'typescript-advanced-types'
  },
  {
    id: '4',
    title: 'WebGPU 入门指南',
    excerpt:
      'WebGPU即将改变Web图形渲染的游戏规则，了解如何开始使用这个强大的新API。',
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
  return (
    <div className="min-h-screen">
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

        {/* 底部导航 */}
        <div className="mt-16 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full px-8 py-3 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              background:
                'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
              color: 'white'
            }}
          >
            查看所有文章
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
