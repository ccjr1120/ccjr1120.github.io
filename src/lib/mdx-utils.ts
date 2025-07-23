import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'src/app/articles/content')

// 获取所有MDX文件的slug
export function getAllMDXSlugs(): string[] {
  try {
    if (!fs.existsSync(contentDirectory)) {
      console.warn('Content directory does not exist')
      return []
    }

    const files = fs.readdirSync(contentDirectory)
    return files
      .filter(file => file.endsWith('.mdx'))
      .map(file => file.replace(/\.mdx$/, ''))
  } catch (error) {
    console.error('Error reading content directory:', error)
    return []
  }
}

// 获取MDX文件的frontmatter数据
export function getMDXData(slug: string) {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.mdx`)
    
    if (!fs.existsSync(fullPath)) {
      return null
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

// 获取所有MDX文章的元数据
export function getAllMDXData() {
  const slugs = getAllMDXSlugs()
  return slugs
    .map(slug => getMDXData(slug))
    .filter(Boolean)
    .sort((a, b) => {
      if (!a || !b) return 0
      return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    })
} 