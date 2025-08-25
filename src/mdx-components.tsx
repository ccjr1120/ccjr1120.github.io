import type { MDXComponents } from 'mdx/types'
import CodeBlock from './components/mdx/CodeBlock'

interface CodeProps {
  children: React.ReactNode
  className?: string
  'data-language'?: string
}

interface PreProps {
  children: React.ReactNode & {
    props?: { className?: string; children: string }
  }
}

const overrideComponents = {
  a: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a
      className="text-secondary"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  p: ({ children, ...props }: { children: React.ReactNode }) => {
    return (
      <p className="indent-[2rem]" {...props}>
        {children}
      </p>
    )
  },
  code: ({ children, className, ...props }: CodeProps) => {
    // 检查是否在 pre 标签内（代码块）
    const isCodeBlock =
      props['data-language'] || className?.includes('language-')

    if (isCodeBlock) {
      return <CodeBlock className={className}>{String(children)}</CodeBlock>
    }

    // 内联代码
    return (
      <code
        className="not-prose bg-content2 text-foreground border-content3 rounded border px-1.5 py-0.5 font-mono text-sm"
        {...props}
      >
        {children}
      </code>
    )
  },
  pre: ({ children, ...props }: PreProps) => {
    // 如果pre包含code，让code组件处理高亮
    if (children?.props?.className) {
      return (
        <CodeBlock className={children.props.className}>
          {String(children.props.children)}
        </CodeBlock>
      )
    }

    // 普通pre标签
    return (
      <pre
        className="bg-content2 border-content3 overflow-x-auto rounded-lg border p-4 text-sm"
        {...props}
      >
        {children}
      </pre>
    )
  }
}
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ...overrideComponents
  }
}
