import type { NextConfig } from 'next'
import createMDX from '@next/mdx'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

/**
 * @type {import('next').NextConfig}
 */
const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  images: {
    unoptimized: true
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.wgsl$/,
      use: 'raw-loader'
    })
    return config
  }
}

const withMDX = createMDX({
  // MDX配置选项
  options: {
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    rehypePlugins: []
  }
})

export default withMDX(nextConfig)
