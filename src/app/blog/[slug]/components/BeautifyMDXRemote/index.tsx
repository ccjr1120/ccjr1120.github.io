import { MDXComponents } from 'mdx/types'
import { MDXRemote } from 'next-mdx-remote/rsc'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomP({ children }: any) {
  // tailwind letter-spacing

  return <p className="mb-2 indent-8 leading-6">{children as string}</p>
}
const overrideComponents: MDXComponents = {
  p: CustomP
}
export default function BeautifyMDXRemote({ source }: { source: string }) {
  return <MDXRemote source={source} components={overrideComponents} />
}
