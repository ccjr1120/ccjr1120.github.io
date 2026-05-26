import Fuse from 'fuse.js'
import type { PostMeta } from './posts'

export function createSearch(posts: PostMeta[]) {
  return new Fuse(posts, {
    keys: ['title', 'description', 'tags'],
    threshold: 0.3,
  })
}
