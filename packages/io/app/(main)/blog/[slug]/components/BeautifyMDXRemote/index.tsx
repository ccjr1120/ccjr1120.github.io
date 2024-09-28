/* eslint-disable @typescript-eslint/no-explicit-any */
import { type MDXComponents } from 'mdx/types'
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
    <code className={`${className} text-lime-500`} {...other} />
  )
}
const overrideComponents: MDXComponents = {
  p: P,
  code: Code,
  h2: ({ children }) => (
    <h2 className="center text-pri my-4 text-xl font-bold">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="center text-pri my-4 text-lg font-bold">{children}</h3>
  ),
  h4: ({ children }) => (
    <h3 className="center text-pri my-4 text-base font-bold">{children}</h3>
  ),
  img: (props) => {
    // https://raw.githubusercontent.com/ccjr1120/ccjr1120.github.io/refs/heads/main/posts/%F0%9F%93%B7/%E8%B0%88%E8%B0%88%E5%90%91%E6%97%A5%E8%91%B5/assets/full.jpg
    // https://raw.githubusercontent.com/ccjr1120/ccjr1120.github.io/refs/heads/main/posts/%F0%9F%93%B7/%E8%B0%88%E8%B0%88%E5%90%91%E6%97%A5%E8%91%B5/assets/full.jpg
    const root =
      'https://raw.githubusercontent.com/ccjr1120/ccjr1120.github.io/refs/heads/main/'
    const imageSrc = `${root}${props.src}`
    return (
      <img
        {...props}
        src={imageSrc}
        width={'48%'}
        style={{ objectFit: 'fill', display: 'inline' }}
      />
    )
  }
}
export default function BeautifyMDXRemote({ source }: { source: string }) {
  return <MDXRemote source={source} components={overrideComponents} />
}
