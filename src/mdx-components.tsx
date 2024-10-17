import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="first:after: relative my-6 pt-10 text-2xl font-bold after:absolute after:left-0 after:top-0 after:block after:h-[0.5px] after:w-full after:bg-gray-700 first:mt-0 first:py-0 first:after:content-[none]">
        {children}
      </h1>
    ),
    p: ({ children }) => <p>{children}</p>,
    ...components
  }
}
