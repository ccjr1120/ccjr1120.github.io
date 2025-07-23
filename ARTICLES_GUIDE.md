# 📝 文章系统使用指南

## 🚀 快速开始

### 创建新文章

使用便捷的脚本命令来创建新文章：

```bash
npm run create-article "article-slug" "文章标题" "标签1,标签2,标签3"
```

**示例:**

```bash
npm run create-article "react-hooks" "React Hooks 深度解析" "React,JavaScript,前端"
npm run create-article "typescript-tips" "TypeScript 实用技巧" "TypeScript,编程"
```

### 文章目录结构

```
src/app/articles/
├── game-of-life/
│   └── page.mdx
├── nextjs-optimization/
│   └── page.mdx
└── your-new-article/
    └── page.mdx
```

## 📄 文章格式

每篇文章的 `page.mdx` 文件应包含以下 frontmatter：

```markdown
---
title: 文章标题
excerpt: 文章摘要描述...
date: 2023-12-15
author: 匆匆孑然
tags: ['标签1', '标签2', '标签3']
---

# 文章标题

## 前言

你的文章内容...
```

### 必需字段

- `title`: 文章标题
- `excerpt`: 文章摘要（用于首页卡片显示）
- `date`: 发布日期 (YYYY-MM-DD 格式)
- `author`: 作者名称
- `tags`: 标签数组

## 🛠️ 技术实现

### 服务器端组件 (推荐)

```tsx
import { getAllArticles } from '@/lib/articles'

export default function ArticlesPage() {
  const articles = getAllArticles()

  return (
    <div>
      {articles.map((article) => (
        <div key={article.id}>{article.title}</div>
      ))}
    </div>
  )
}
```

### 客户端组件

```tsx
'use client'
import { useArticles } from '@/hooks/useArticles'

export default function ClientArticlesPage() {
  const { articles, loading, error } = useArticles()

  if (loading) return <div>加载中...</div>
  if (error) return <div>错误: {error}</div>

  return (
    <div>
      {articles.map((article) => (
        <div key={article.id}>{article.title}</div>
      ))}
    </div>
  )
}
```

## 🔧 可用功能

### 服务器端函数

```typescript
import {
  getAllArticles, // 获取所有文章
  getArticleById, // 根据ID获取文章
  getArticleBySlug, // 根据slug获取文章
  getArticlesByTag, // 按标签筛选
  getLatestArticles, // 获取最新N篇
  searchArticles, // 搜索文章
  getAllTags, // 获取所有标签
  getArticleContent // 获取文章内容
} from '@/lib/articles'
```

### 客户端Hooks

```typescript
import {
  useArticles, // 获取文章列表
  useArticle, // 获取单篇文章
  useTags // 获取所有标签
} from '@/hooks/useArticles'
```

### API 路由

- `GET /api/articles` - 获取所有文章
- `GET /api/articles?tag=标签` - 按标签筛选
- `GET /api/articles?search=关键词` - 搜索文章
- `GET /api/articles?action=tags` - 获取所有标签
- `GET /api/articles/[slug]` - 获取单篇文章内容

## 🎯 使用场景

### 1. 首页文章列表 ✅

已实现在 `src/app/page.tsx`

### 2. 按标签筛选文章

```tsx
const articles = getArticlesByTag('React')
// 或在客户端
const { articles } = useArticles({ tag: 'React' })
```

### 3. 文章搜索

```tsx
const articles = searchArticles('性能优化')
// 或在客户端
const { articles } = useArticles({ search: '性能优化' })
```

### 4. 获取文章详情

```tsx
const result = getArticleContent('article-slug')
// 或在客户端
const { article, content } = useArticle('article-slug')
```

## 📁 文件结构说明

```
src/
├── lib/articles.ts           # 服务器端文章处理逻辑
├── hooks/useArticles.ts      # 客户端文章数据hooks
├── app/
│   ├── api/articles/         # REST API 路由
│   ├── articles/             # 实际文章文件
│   └── page.tsx              # 首页 (服务器组件)
└── scripts/
    └── create-article.mjs    # 文章创建脚本
```

## 🔄 自动化特性

- ✅ **自动扫描**: 自动检测 `articles/` 目录下的新文章
- ✅ **元数据提取**: 自动从 MDX frontmatter 提取文章信息
- ✅ **日期排序**: 文章按发布日期自动排序
- ✅ **摘要生成**: 如果未提供摘要，自动从内容生成
- ✅ **错误处理**: 完善的错误处理和日志记录

## 🚨 注意事项

1. **文件路径**: 文章必须放在 `src/app/articles/[slug]/page.mdx`
2. **slug格式**: 文章slug只能包含小写字母、数字和连字符
3. **服务器组件**: 优先使用服务器组件以获得更好的性能
4. **客户端组件**: 只在需要交互时使用客户端组件和API路由
