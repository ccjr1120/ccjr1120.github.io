import createMDX from '@next/mdx'
import path from 'path'
import { fileURLToPath } from 'url'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
  typescript: {
    tsconfigPath: './tsconfig.json'
  },
  outputFileTracingRoot: path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    '../../'
  )
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)
