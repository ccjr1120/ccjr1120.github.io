#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function createArticle(slug, title, tags = []) {
  const articlesDir = path.join(__dirname, '../src/app/articles/content')
  const articlePath = path.join(articlesDir, `${slug}.mdx`)

  // 确保content目录存在
  if (!fs.existsSync(articlesDir)) {
    fs.mkdirSync(articlesDir, { recursive: true })
  }

  // 检查文章是否已存在
  if (fs.existsSync(articlePath)) {
    console.error(`❌ 文章 "${slug}" 已存在！`)
    process.exit(1)
  }

  // 生成当前日期
  const today = new Date().toISOString().split('T')[0]

  // 创建Markdown文件模板
  const markdownTemplate = `---
title: "${title}"
excerpt: "请在此处添加文章摘要..."
date: "${today}"
author: "匆匆孑然"
tags: [${tags.map((tag) => `"${tag}"`).join(', ')}]
---

# ${title}

## 前言

请在此处开始编写你的文章内容...

## 主要内容

### 小标题1

你的内容...

### 小标题2

你的内容...

## 代码示例

\`\`\`javascript
// 在这里添加代码示例
function example() {
  console.log('Hello World!');
}
\`\`\`

## 总结

总结你的文章要点...
`

  // 写入文件
  fs.writeFileSync(articlePath, markdownTemplate, 'utf8')

  console.log(`✅ 成功创建文章: ${slug}`)
  console.log(`📁 文件路径: ${articlePath}`)
  console.log(`📝 请编辑文件内容和 frontmatter 元数据`)
}

// 将kebab-case转换为标题格式
function slugToTitle(slug) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// 验证slug格式
function validateSlug(slug) {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  if (!slugRegex.test(slug)) {
    console.error(
      '❌ slug格式错误！slug只能包含小写字母、数字和连字符，且不能以连字符开头或结尾'
    )
    process.exit(1)
  }
}

// 解析命令行参数
const args = process.argv.slice(2)

if (args.length === 0) {
  console.log(`
📝 文章创建工具

用法:
  npm run create-article <slug> [title] [tags]

参数:
  slug   文章URL标识符（只能包含小写字母、数字和连字符）
  title  文章标题（可选，默认基于slug生成）
  tags   标签列表，用逗号分隔（可选，默认为空）

示例:
  npm run create-article "react-hooks"
  npm run create-article "react-hooks" "React Hooks 深度解析"
  npm run create-article "react-hooks" "React Hooks 深度解析" "React,JavaScript,前端"
`)
  process.exit(0)
}

const [slug, titleArg, tagsString] = args

// 生成默认标题（如果没有提供）
const title = titleArg || slugToTitle(slug)
const tags = tagsString ? tagsString.split(',').map((tag) => tag.trim()) : []

validateSlug(slug)
createArticle(slug, title, tags)
