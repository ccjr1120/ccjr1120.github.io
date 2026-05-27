import { parse as parseYaml } from 'yaml'

export interface PostMeta {
  slug: string
  title: string
  date: string
  tags: string[]
  description: string
  cover?: string
}

export interface Post extends PostMeta {
  content: string
}

const postFiles = import.meta.glob('../../../../blog/content/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }
  return { data: parseYaml(match[1]) ?? {}, content: match[2] }
}

function parsePost(filePath: string, raw: string): Post {
  const { data, content } = parseFrontmatter(raw)
  const slug = filePath.split('/').pop()!.replace(/\.md$/, '')
  const { title, body } = extractTitle(content, slug)
  return {
    slug,
    title,
    date: data.date ? new Date(data.date as string).toISOString().slice(0, 10) : '1970-01-01',
    tags: (data.tags as string[]) ?? [],
    description: (data.description as string) ?? '',
    cover: data.cover as string | undefined,
    content: body,
  }
}

function extractTitle(content: string, slug: string): { title: string; body: string } {
  const match = content.match(/^\s*#\s+(.+?)\s*$/m)
  if (!match) return { title: slug, body: content }
  const body = content.slice(0, match.index) + content.slice(match.index! + match[0].length)
  return { title: match[1].trim(), body: body.replace(/^\s+/, '') }
}

let _posts: Post[] | null = null

export function getAllPosts(): Post[] {
  if (!_posts) {
    _posts = Object.entries(postFiles)
      .map(([path, raw]) => parsePost(path, raw))
      .sort((a, b) => b.date.localeCompare(a.date))
  }
  return _posts
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug)
}

export function getAllTags(): Map<string, number> {
  const tags = new Map<string, number>()
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      tags.set(tag, (tags.get(tag) ?? 0) + 1)
    }
  }
  return tags
}
