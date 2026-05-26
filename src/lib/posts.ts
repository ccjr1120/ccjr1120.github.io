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

const postFiles = import.meta.glob('/content/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }
  return { data: parseYaml(match[1]) ?? {}, content: match[2] }
}

function parsePost(filePath: string, raw: string): Post {
  const { data, content } = parseFrontmatter(raw)
  const slug = filePath.replace('/content/', '').replace('.md', '')
  return {
    slug,
    title: (data.title as string) ?? slug,
    date: data.date ? new Date(data.date as string).toISOString().slice(0, 10) : '1970-01-01',
    tags: (data.tags as string[]) ?? [],
    description: (data.description as string) ?? '',
    cover: data.cover as string | undefined,
    content,
  }
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
