import fs from 'fs'
import { globbySync } from 'globby'
import path from 'path'

type Metadata = {
  desc: string
  date: string
  slug: string
  readMinutes: number
  tags?: string[]
  series?: string
  status?: 'un-publish'
}

function uuid() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s: any[] = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = ''

  const uuid = s.join('')
  return uuid
}

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  const match = frontmatterRegex.exec(fileContent)
  const frontMatterBlock = match![1]
  const content = fileContent.replace(frontmatterRegex, '').trim()
  const frontMatterLines = frontMatterBlock.trim().split('\n')
  const metadata: Partial<Metadata> = {}
  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(': ')
    let value = valueArr.join(': ').trim()
    value = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes
    metadata[key.trim() as keyof Metadata] = (
      key.trim() === 'tags' ? value.split(',') : value
    ) as never
  })
  return { metadata: metadata as Metadata, content }
}

function getMDXFiles(dir: string) {
  return globbySync([`${dir}/**/*.mdx`, `${dir}/**/*.md`])
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, 'utf-8')
  const res = parseFrontmatter(rawContent)
  // 计算阅读时长
  res.metadata.readMinutes = Math.ceil(res.content.trim().length / 600)
  if (!res.metadata.slug) {
    res.metadata.slug = uuid()
    const fileContent = rawContent.replace(
      '---\n',
      `---\nslug: ${res.metadata.slug}\n`
    )
    fs.writeFileSync(filePath, fileContent)
  }
  if (!res.metadata.date) {
    res.metadata.date = new Date().toLocaleString()
    const fileContent = rawContent.replace(
      '---\n',
      `---\ndate: ${res.metadata.date}\n`
    )
    fs.writeFileSync(filePath, fileContent)
  }
  const maybeSeries = filePath.split('/').at(-1)?.startsWith('index')
    ? filePath.split('/').at(-2)
    : filePath.split('/').at(-3)
  if (maybeSeries !== 'posts') {
    res.metadata.series = maybeSeries
  }
  return res
}

function getPostTitle(file: string) {
  const paths = file.split('/')
  const fileName = path.basename(file, path.extname(file))
  let title = fileName === 'index' ? paths[paths.length - 2] : fileName
  const maybeSeries = fileName === 'index' ? paths.at(-3) : paths.at(-2)
  if (maybeSeries !== 'posts') {
    title = `${maybeSeries}：${title}`
  }
  return title
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir)
  return mdxFiles
    .map((file) => {
      const { metadata, content } = readMDXFile(file)
      const title = getPostTitle(file)
      return {
        metadata,
        slug: metadata.slug,
        title,
        content
      }
    })
    .filter((post) => post.metadata.status !== 'un-publish')
    .sort(
      (a, b) =>
        new Date(b.metadata.date).getTime() -
        new Date(a.metadata.date).getTime()
    )
}

export function formatDate(date: string, includeRelative = false) {
  const currentDate = new Date()
  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }
  const targetDate = new Date(date)

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  const daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ''

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  } else {
    formattedDate = 'Today'
  }

  const fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), '../../posts'))
}
