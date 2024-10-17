import { getBlogPosts } from '@/utils/posts'
import BeautifyMDXRemote from './components/BeautifyMDXRemote'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return getBlogPosts()
}
export function generateMetadata({
  params: { slug }
}: {
  params: { slug: string }
}): Metadata {
  const { metadata, title } =
    getBlogPosts().find((post) => post.slug === slug) || {}

  return {
    title: title,
    description: metadata?.desc
  }
}

export default function Page({
  params: { slug }
}: {
  params: { slug: string; title: string }
}) {
  const { metadata, title, content } =
    getBlogPosts().find((post) => post.slug === slug) || {}

  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="title text-pri text-xl font-semibold tracking-tighter">
        {title}
      </h1>
      <div className="mb-8 mt-2 flex items-center justify-between text-sm">
        <p className="text-sm text-muted">{metadata?.date}</p>
      </div>
      <article className="prose text tracking-widest">
        <BeautifyMDXRemote source={content || ''} />
      </article>
    </section>
  )
}
