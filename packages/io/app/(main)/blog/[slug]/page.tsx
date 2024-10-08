import { getBlogPosts } from '@/utils/posts'
import BeautifyMDXRemote from './components/BeautifyMDXRemote'

export async function generateStaticParams() {
  return getBlogPosts()
}

export default function Page({
  params: { slug }
}: {
  params: { slug: string }
}) {
  const { metadata, title, content } =
    getBlogPosts().find((post) => post.slug === slug) || {}

  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="title text-pri text-xl font-semibold tracking-tighter">
        {title}
      </h1>
      <div className="mb-8 mt-2 flex items-center justify-between text-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {metadata?.date}
        </p>
      </div>
      <article className="prose text tracking-widest">
        <BeautifyMDXRemote source={content || ''} />
      </article>
    </section>
  )
}
