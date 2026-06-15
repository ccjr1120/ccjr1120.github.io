import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import fs from 'node:fs'

const contentDir = path.resolve(__dirname, '../../blog/content')
const slugs = fs.existsSync(contentDir)
  ? fs.readdirSync(contentDir).filter(f => f.endsWith('.md')).map(f => f.replace(/\.md$/, ''))
  : []

export default defineConfig({
  plugins: [
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
      pages: [
        { path: '/' },
        ...slugs.map(slug => ({ path: `/blog/${slug}` })),
      ],
    }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  assetsInclude: ['**/*.md'],
  server: { port: 8000, strictPort: true },
})
