import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import fs from 'node:fs'

const SITE_URL = 'https://ccjr1120.github.io'

const contentDir = path.resolve(__dirname, '../../blog/content')
const slugs = fs.existsSync(contentDir)
  ? fs.readdirSync(contentDir).filter(f => f.endsWith('.md')).map(f => f.replace(/\.md$/, ''))
  : []

function sitemapPlugin() {
  return {
    name: 'generate-sitemap',
    closeBundle() {
      const outDir = path.resolve(__dirname, 'dist/client')
      if (!fs.existsSync(outDir)) return
      const urls = ['/', ...slugs.map(s => `/blog/${encodeURIComponent(s)}`)]
      const today = new Date().toISOString().slice(0, 10)
      const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls.map(u => `  <url>\n    <loc>${SITE_URL}${u}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`),
        '</urlset>',
      ].join('\n')
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml, 'utf-8')
      console.log(`[sitemap] wrote ${urls.length} URLs`)
    },
  }
}

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
    sitemapPlugin(),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  assetsInclude: ['**/*.md'],
  server: { port: 8000, strictPort: true },
})
