import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// 默认content目录
const defaultContentDirectory = path.join(process.cwd(), 'src/app/blog/content')

// 获取所有MDX和MD文件的slug
export function getAllMDXSlugs(contentDir?: string): string[] {
  const contentDirectory = contentDir ? path.join(process.cwd(), contentDir) : defaultContentDirectory
  
  try {
    if (!fs.existsSync(contentDirectory)) {
      console.warn(`Content directory does not exist: ${contentDirectory}`)
      return []
    }

    const items = fs.readdirSync(contentDirectory, { withFileTypes: true })
    const slugs: string[] = []

    for (const item of items) {
      if (item.isDirectory()) {
        // 检查文件夹中是否有 index.mdx 或 index.md 文件
        const indexMdxPath = path.join(contentDirectory, item.name, 'index.mdx')
        const indexMdPath = path.join(contentDirectory, item.name, 'index.md')
        
        if (fs.existsSync(indexMdxPath) || fs.existsSync(indexMdPath)) {
          slugs.push(item.name)
        }
      } else if (item.isFile()) {
        // 兼容旧的直接文件格式
        if (item.name.endsWith('.mdx') || item.name.endsWith('.md')) {
          slugs.push(item.name.replace(/\.(mdx?|md)$/, ''))
        }
      }
    }

    return slugs
  } catch (error) {
    console.error('Error reading content directory:', error)
    return []
  }
}

// 获取MDX/MD文件的frontmatter数据
export function getMDXData(slug: string, contentDir?: string) {
  const contentDirectory = contentDir ? path.join(process.cwd(), contentDir) : defaultContentDirectory
  
  try {
    // 首先尝试从文件夹中读取 index.mdx
    let fullPath = path.join(contentDirectory, slug, 'index.mdx')
    
    if (!fs.existsSync(fullPath)) {
      // 尝试 index.md
      fullPath = path.join(contentDirectory, slug, 'index.md')
      
      if (!fs.existsSync(fullPath)) {
        // 兼容旧格式：直接的 .mdx 文件
        fullPath = path.join(contentDirectory, `${slug}.mdx`)
        
        if (!fs.existsSync(fullPath)) {
          // 兼容旧格式：直接的 .md 文件
          fullPath = path.join(contentDirectory, `${slug}.md`)
          if (!fs.existsSync(fullPath)) {
            return null
          }
        }
      }
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      frontmatter: {
        title: data.title || '无标题',
        excerpt: data.excerpt || '暂无摘要',
        date: data.date || new Date().toISOString().split('T')[0],
        author: data.author || '匆匆孑然',
        tags: data.tags || [],
        ...data
      },
      content
    }
  } catch (error) {
    console.error(`Error reading MDX file ${slug}:`, error)
    return null
  }
}

// 获取所有MDX/MD文章的元数据
export function getAllMDXData(contentDir?: string) {
  const slugs = getAllMDXSlugs(contentDir)
  return slugs
    .map(slug => getMDXData(slug, contentDir))
    .filter(Boolean)
    .sort((a, b) => {
      if (!a || !b) return 0
      return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    })
}

// 目录项接口
export interface TocItem {
  id: string
  title: string
  level: number
}

// 从markdown内容中提取标题生成目录
export function extractTableOfContents(content: string): TocItem[] {
  const toc: TocItem[] = []
  
  // 匹配markdown标题的正则表达式
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  let match
  
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length // #的数量表示标题级别
    const title = match[2].trim()
    
    // 生成锚点ID：将标题转换为URL友好的格式
    const id = title
      .toLowerCase()
      .replace(/[^\u4e00-\u9fa5a-z0-9\s-]/g, '') // 保留中文、英文、数字、空格、连字符
      .replace(/\s+/g, '-') // 将空格替换为连字符
      .replace(/-+/g, '-') // 合并多个连字符
      .replace(/^-|-$/g, '') // 移除首尾连字符
    
    toc.push({
      id,
      title,
      level
    })
  }
  
  return toc
} 