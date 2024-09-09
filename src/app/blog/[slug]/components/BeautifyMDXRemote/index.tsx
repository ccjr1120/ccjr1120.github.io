/* eslint-disable @typescript-eslint/no-explicit-any */
import { MDXComponents } from 'mdx/types'
import { MDXRemote } from 'next-mdx-remote/rsc'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { irBlack } from 'react-syntax-highlighter/dist/esm/styles/hljs'

function P({ children }: any) {
  return (
    <p className="mb-2 indent-8 text-base leading-6">{children as string}</p>
  )
}
function Code({ className, ...other }: any) {
  const match = /language-(\w+)/.exec(className || '')
  return match ? (
    <SyntaxHighlighter
      language={match[1]}
      PreTag="div"
      {...other}
      className="mb-4 rounded-md border border-gray-700 !p-6"
      style={irBlack}
    />
  ) : (
    <code className={className} {...other} />
  )
}
const overrideComponents: MDXComponents = {
  p: P,
  code: Code,
  h2: ({ children }) => (
    <h2 className="center my-4 text-lg font-bold text-pri">{children}</h2>
  )
}
export default function BeautifyMDXRemote({ source }: { source: string }) {
  return <MDXRemote source={source} components={overrideComponents} />
}
