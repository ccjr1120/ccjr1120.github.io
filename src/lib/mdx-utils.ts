import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// 默认content目录
const defaultContentDirectory = path.join(process.cwd(), 'src/app/blog/content')

// 获取所有MDX和MD文件的slug（仅用于向后兼容，不包含分类/系列规则）
export function getAllMDXSlugs(contentDir?: string): string[] {
  const contentDirectory = contentDir
    ? path.join(process.cwd(), contentDir)
    : defaultContentDirectory

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

// 获取MDX/MD文件的frontmatter数据（路径为真实内容路径，而非展示用slug）
export function getMDXData(slug: string, contentDir?: string) {
  const contentDirectory = contentDir
    ? path.join(process.cwd(), contentDir)
    : defaultContentDirectory

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

// ===== 新增：基于 meta.ts 的递归发现与 URL 规则支持 =====

interface ParsedMeta {
  type: 'category' | 'series' | undefined
  titleTemplate?: string
}

function parseMetaFromDir(absoluteDir: string): ParsedMeta | undefined {
  const metaPath = path.join(absoluteDir, 'meta.ts')
  if (!fs.existsSync(metaPath)) return undefined
  try {
    const raw = fs.readFileSync(metaPath, 'utf8')
    // 非严格解析：仅提取 type 与 titleTemplate 这两个字段
    const typeMatch = raw.match(/type\s*:\s*['"](category|series)['"]/)
    const titleTplMatch = raw.match(/titleTemplate\s*:\s*['"]([^'"]+)['"]/)
    const type = (typeMatch?.[1] as ParsedMeta['type']) || undefined
    const titleTemplate = titleTplMatch?.[1]
    return { type, titleTemplate }
  } catch (e) {
    console.warn('Failed to parse meta.ts in', absoluteDir, e)
    return undefined
  }
}

interface ArticleEntry {
  // 展示用的 slug 片段（用于路由）
  displaySlugSegments: string[]
  // 真实内容相对路径（相对 content 根目录），用于定位实际 MDX 文件夹
  realPathRelative: string
  // frontmatter 与内容（延后读取）
  frontmatter: Record<string, unknown>
  // 是否属于某个系列，若是则包含系列的 titleTemplate
  seriesTitleTemplate?: string
  // 是否为系列的首篇文章（index.mdx）
  isSeriesIndex?: boolean
}

function hasIndexMDX(absoluteDir: string): boolean {
  return (
    fs.existsSync(path.join(absoluteDir, 'index.mdx')) ||
    fs.existsSync(path.join(absoluteDir, 'index.md'))
  )
}

function readFrontmatterFromDir(
  absoluteDir: string,
  { relativePath }: { relativePath: string } = { relativePath: '' }
) {
  const mdx = ['index.mdx', 'index.md']
  for (const f of mdx) {
    const p = path.join(absoluteDir, f)
    if (fs.existsSync(p)) {
      const fileContents = fs.readFileSync(p, 'utf8')
      const { data, content } = matter(fileContents)
      return {
        relativePath: `${relativePath}/${f}`,
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
    }
  }
  const p = `${absoluteDir}.mdx`
  if (fs.existsSync(p)) {
    const fileContents = fs.readFileSync(p, 'utf8')
    const { data, content } = matter(fileContents)
    return {
      relativePath: `${relativePath}.mdx`,
      frontmatter: data,
      content
    }
  }

  return null
}

interface WalkContext {
  // 已累积的分类段
  categorySegments: string[]
  // 当前所处系列的信息（若有）
  currentSeriesName?: string
  currentSeriesTitleTemplate?: string
}

function walkContentDir(
  absoluteDir: string,
  relativeDirFromContent: string,
  ctx: WalkContext,
  entries: ArticleEntry[]
) {
  const meta = parseMetaFromDir(absoluteDir)
  const dirEntries = fs.readdirSync(absoluteDir, { withFileTypes: true })

  const isCategory = meta?.type === 'category'
  const isSeries = meta?.type === 'series'

  const nextCtx: WalkContext = { ...ctx }
  const basename = path.basename(absoluteDir)

  if (isCategory) {
    nextCtx.categorySegments = [...ctx.categorySegments, basename]
  }
  if (isSeries) {
    nextCtx.currentSeriesName = basename
    nextCtx.currentSeriesTitleTemplate = meta?.titleTemplate
  }

  // 如果当前目录是文章（没有 meta 且有 index.mdx），并且不在系列目录下，则直接作为文章
  const isArticleDir = !meta && hasIndexMDX(absoluteDir)
  if (isArticleDir && !ctx.currentSeriesName) {
    const fm = readFrontmatterFromDir(absoluteDir)
    if (fm) {
      entries.push({
        displaySlugSegments: [...nextCtx.categorySegments, basename],
        realPathRelative: relativeDirFromContent,
        frontmatter: fm.frontmatter
      })
    }
    // 文章目录下不再向下递归
    return
  }

  // 如果是系列目录且有 index.mdx，将其作为系列的首篇文章（但不显示在列表中）
  if (isSeries && hasIndexMDX(absoluteDir)) {
    const fm = readFrontmatterFromDir(absoluteDir)
    if (fm) {
      entries.push({
        displaySlugSegments: [...nextCtx.categorySegments, basename],
        realPathRelative: relativeDirFromContent,
        frontmatter: fm.frontmatter,
        seriesTitleTemplate: meta?.titleTemplate,
        isSeriesIndex: true // 标记为系列首篇文章
      })
    }
  }

  // 遍历子项
  for (const de of dirEntries) {
    const childAbs = path.join(absoluteDir, de.name)
    const childRel = path.join(relativeDirFromContent, de.name)

    if (de.isDirectory()) {
      const childMeta = parseMetaFromDir(childAbs)

      // 如果当前是系列目录，则其直接子项若为文章目录（有 index.mdx 且无 meta），生成组合 slug
      if (isSeries) {
        if (!childMeta && hasIndexMDX(childAbs)) {
          const fm = readFrontmatterFromDir(childAbs)
          if (fm) {
            const articleName = de.name
            entries.push({
              displaySlugSegments: [
                ...nextCtx.categorySegments,
                `${basename}-${articleName}`
              ],
              realPathRelative: childRel,
              frontmatter: fm.frontmatter,
              seriesTitleTemplate: meta?.titleTemplate
            })
          }
          continue
        }
      }

      // 其他情况继续递归
      walkContentDir(childAbs, childRel, nextCtx, entries)
    } else if (de.isFile()) {
      // 直接文件（.mdx/.md）视为文章，但排除 README.md 和 index.mdx/index.md
      if (
        (de.name.endsWith('.mdx') || de.name.endsWith('.md')) &&
        de.name !== 'README.md' &&
        de.name !== 'index.mdx' &&
        de.name !== 'index.md'
      ) {
        const base = de.name.replace(/\.(mdx?|md)$/i, '')
        const fileAbs = childAbs
        const fileRel = childRel
        const fileRaw = fs.readFileSync(fileAbs, 'utf8')
        const { data } = matter(fileRaw)
        const fm = {
          title: data.title || '无标题',
          excerpt: data.excerpt || '暂无摘要',
          date: data.date || new Date().toISOString().split('T')[0],
          author: data.author || '匆匆孑然',
          tags: data.tags || [],
          ...data
        }
        if (isSeries) {
          entries.push({
            displaySlugSegments: [
              ...nextCtx.categorySegments,
              `${basename}-${base}`
            ],
            realPathRelative: fileRel.replace(/\.(mdx?|md)$/i, ''),
            frontmatter: fm,
            seriesTitleTemplate: meta?.titleTemplate
          })
        } else {
          entries.push({
            displaySlugSegments: [...nextCtx.categorySegments, base],
            realPathRelative: fileRel.replace(/\.(mdx?|md)$/i, ''),
            frontmatter: fm
          })
        }
      }
    }
  }
}

function discoverAllArticles(): ArticleEntry[] {
  const contentRoot = defaultContentDirectory
  if (!fs.existsSync(contentRoot)) return []
  const entries: ArticleEntry[] = []
  walkContentDir(contentRoot, '', { categorySegments: [] }, entries)
  // 排序：按日期倒序
  entries.sort((a, b) => {
    const ad = new Date(String(a.frontmatter.date)).getTime()
    const bd = new Date(String(b.frontmatter.date)).getTime()
    return bd - ad
  })
  return entries
}

export function getAllArticleSlugs(): string[][] {
  return discoverAllArticles().map((e) => e.displaySlugSegments)
}

export function getAllMDXData() {
  // 使用新的发现逻辑，过滤掉系列的首篇文章，但保留系列下的其他文章
  const entries = discoverAllArticles()
  return entries
    .filter((e) => !e.isSeriesIndex) // 过滤掉系列的首篇文章
    .map((e) => ({
      slug: e.displaySlugSegments.join('/'),
      frontmatter: applySeriesTitle(e.frontmatter, e.seriesTitleTemplate)
    }))
}

function applySeriesTitle(
  frontmatter: Record<string, unknown>,
  seriesTitleTemplate?: string
) {
  if (seriesTitleTemplate) {
    const title = String(frontmatter.title || '无标题')
    const newTitle = seriesTitleTemplate.replace('%s', title)
    return { ...frontmatter, title: newTitle }
  }
  return frontmatter
}

export function resolveArticleByDisplaySlug(displaySlugSegments: string[]) {
  const entries = discoverAllArticles() // 获取所有文章，包括系列首篇文章
  const key = displaySlugSegments.join('/')
  const found = entries.find((e) => e.displaySlugSegments.join('/') === key)
  if (!found) return null
  const absDir = path.join(defaultContentDirectory, found.realPathRelative)
  // 读取内容
  const data = readFrontmatterFromDir(absDir, {
    relativePath: found.realPathRelative
  })
  if (!data) return null
  return {
    realPathRelative: data.relativePath,
    frontmatter: applySeriesTitle(data.frontmatter, found.seriesTitleTemplate),
    content: data.content
  }
}

export function isCategoryPath(slugSegments: string[]): {
  isCategory: boolean
  hasIndex: boolean
} {
  // 检查该路径是否为分类目录
  const absDir = path.join(defaultContentDirectory, ...slugSegments)
  const meta = parseMetaFromDir(absDir)
  const isCategory = meta?.type === 'category'
  const hasIndex = isCategory && hasIndexMDX(absDir)
  return { isCategory: !!isCategory, hasIndex: !!hasIndex }
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
