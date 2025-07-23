#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function createArticle(slug, title, tags = []) {
  const articlesDir = path.join(__dirname, '../src/app/articles')
  const articleDir = path.join(articlesDir, slug)
  const dataPath = path.join(articleDir, 'article.json')
  const componentPath = path.join(articleDir, 'component.tsx')
  
  // 确保articles目录存在
  if (!fs.existsSync(articlesDir)) {
    fs.mkdirSync(articlesDir, { recursive: true })
  }
  
  // 创建文章目录
  if (!fs.existsSync(articleDir)) {
    fs.mkdirSync(articleDir, { recursive: true })
  }
  
  // 检查文章是否已存在
  if (fs.existsSync(dataPath) || fs.existsSync(componentPath)) {
    console.error(`❌ 文章 "${slug}" 已存在！`)
    process.exit(1)
  }
  
  // 生成当前日期
  const today = new Date().toISOString().split('T')[0]
  
  // 创建文章数据文件
  const articleData = {
    title: title,
    excerpt: '请在此处添加文章摘要...',
    date: today,
    author: '匆匆孑然',
    tags: tags,
    slug: slug
  }
  
  // 创建React组件模板
  const componentTemplate = `export default function ${toPascalCase(slug)}Article() {
  return (
    <div className="prose prose-lg mx-auto max-w-4xl">
      <h1>${title}</h1>
      
      <h2>前言</h2>
      <p>
        请在此处开始编写你的文章内容...
      </p>
      
      <h2>主要内容</h2>
      
      <h3>小标题1</h3>
      <p>
        你的内容...
      </p>
      
      <h3>小标题2</h3>
      <p>
        你的内容...
      </p>
      
      <h2>代码示例</h2>
      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{\`// 在这里添加代码示例
function example() {
  console.log('Hello World!');
}\`}</code>
      </pre>
      
      <h2>总结</h2>
      <p>
        总结你的文章要点...
      </p>
    </div>
  );
}`

  // 写入文件
  fs.writeFileSync(dataPath, JSON.stringify(articleData, null, 2), 'utf8')
  fs.writeFileSync(componentPath, componentTemplate, 'utf8')
  
  console.log(`✅ 成功创建文章: ${slug}`)
  console.log(`📁 数据文件: ${dataPath}`)
  console.log(`📁 组件文件: ${componentPath}`)
  console.log(`📝 请编辑数据文件更新摘要，并在组件文件中编写文章内容`)
}

// 将kebab-case转换为PascalCase
function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

// 验证slug格式
function validateSlug(slug) {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  if (!slugRegex.test(slug)) {
    console.error('❌ slug格式错误！slug只能包含小写字母、数字和连字符，且不能以连字符开头或结尾')
    process.exit(1)
  }
}

// 解析命令行参数
const args = process.argv.slice(2)

if (args.length === 0) {
  console.log(`
📝 文章创建工具

用法:
  npm run create-article <slug> <title> [tags]

参数:
  slug   文章URL标识符（只能包含小写字母、数字和连字符）
  title  文章标题
  tags   标签列表，用逗号分隔（可选）

示例:
  npm run create-article "react-hooks" "React Hooks 深度解析" "React,JavaScript,前端"
  npm run create-article "typescript-tips" "TypeScript 实用技巧" "TypeScript,编程"
`)
  process.exit(0)
}

if (args.length < 2) {
  console.error('❌ 参数不足！请提供slug和title')
  process.exit(1)
}

const [slug, title, tagsString] = args
const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()) : []

validateSlug(slug)
createArticle(slug, title, tags) 