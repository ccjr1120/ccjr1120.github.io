import fs from 'fs'
import path from 'path'
import { Article, ArticleData } from '@/types/blog'

const articlesDirectory = path.join(process.cwd(), 'src/app/articles')

// 从JSON文件中读取文章元数据
function loadArticleData(articlePath: string, slug: string): Article | null {
  try {
    const dataFile = path.join(articlePath, 'article.json')
    const componentFile = path.join(articlePath, 'component.tsx')
    
    if (!fs.existsSync(dataFile) || !fs.existsSync(componentFile)) {
      return null
    }

    const fileContents = fs.readFileSync(dataFile, 'utf8')
    const data: ArticleData = JSON.parse(fileContents)
    
    // 获取文件创建时间作为默认日期
    const stats = fs.statSync(dataFile)
    const defaultDate = stats.birthtime.toISOString().split('T')[0]

    return {
      id: slug,
      title: data.title || '无标题',
      excerpt: data.excerpt || '暂无摘要',
      date: data.date || defaultDate,
      author: data.author || '匆匆孑然',
      tags: data.tags || [],
      slug: slug,
      componentPath: `@/app/articles/${slug}/component`
    }
  } catch (error) {
    console.error(`Error reading article ${articlePath}:`, error)
    return null
  }
}

// 获取所有文章
export function getAllArticles(): Article[] {
  try {
    if (!fs.existsSync(articlesDirectory)) {
      console.warn('Articles directory does not exist')
      return []
    }

    const articles: Article[] = []
    const articleFolders = fs.readdirSync(articlesDirectory)

    for (const folder of articleFolders) {
      const folderPath = path.join(articlesDirectory, folder)
      const stat = fs.statSync(folderPath)

      if (stat.isDirectory()) {
        const article = loadArticleData(folderPath, folder)
        if (article) {
          articles.push(article)
        }
      }
    }

    // 按日期排序
    return articles.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  } catch (error) {
    console.error('Error reading articles:', error)
    return []
  }
}

// 根据ID获取文章
export function getArticleById(id: string): Article | undefined {
  return getAllArticles().find((article) => article.id === id)
}

// 根据slug获取文章
export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find((article) => article.slug === slug)
}

// 根据标签筛选文章
export function getArticlesByTag(tag: string): Article[] {
  return getAllArticles().filter((article) =>
    article.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase()))
  )
}

// 获取最新的N篇文章
export function getLatestArticles(count: number): Article[] {
  return getAllArticles().slice(0, count)
}

// 搜索文章
export function searchArticles(query: string): Article[] {
  const searchTerm = query.toLowerCase()
  return getAllArticles().filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm) ||
      article.excerpt.toLowerCase().includes(searchTerm) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
  )
}

// 获取所有标签
export function getAllTags(): string[] {
  const allTags = getAllArticles().flatMap((article) => article.tags)
  return [...new Set(allTags)].sort()
}

// 获取文章内容（用于详情页）
export function getArticleContent(slug: string): { article: Article } | null {
  try {
    const article = getArticleBySlug(slug)
    
    if (!article) {
      return null
    }

    return { article }
  } catch (error) {
    console.error(`Error reading article content for ${slug}:`, error)
    return null
  }
}

// 获取文章组件路径
export function getArticleComponentPath(slug: string): string | null {
  const article = getArticleBySlug(slug)
  return article?.componentPath || null
}
