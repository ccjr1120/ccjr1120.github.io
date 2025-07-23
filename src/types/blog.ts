import { ReactNode } from 'react'

export interface Article {
  id: string
  title: string
  excerpt: string
  date: string
  author: string
  tags: string[]
  slug: string
  componentPath?: string // 组件文件路径
}

export interface ArticleContent {
  article: Article
  component: () => ReactNode
}

export interface ArticleData {
  title: string
  excerpt: string
  date: string
  author: string
  tags: string[]
  slug: string
} 