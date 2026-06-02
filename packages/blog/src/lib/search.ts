import Fuse from 'fuse.js'
import type { Post } from './posts'

export function createSearch(posts: Post[]) {
  return new Fuse(posts, {
    keys: ['title', 'description', 'tags'],
    threshold: 0.3,
  })
}
