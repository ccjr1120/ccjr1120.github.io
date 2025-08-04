'use client'

import { useEffect, useState } from 'react'
import { createHighlighter, type Highlighter } from 'shiki'
import styles from './styles.module.css'

interface CodeBlockProps {
  children: string
  className?: string
  'data-language'?: string
}

export default function CodeBlock({ children, className }: CodeBlockProps) {
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null)
  const [highlightedCode, setHighlightedCode] = useState<string>('')
  const [isDark, setIsDark] = useState(false)

  // 从className中提取语言，格式通常是 "language-ts" 或 "language-javascript"
  const language = className?.replace(/language-/, '') || 'text'

  // 检测主题
  const detectTheme = () => {
    return (
      window.matchMedia('(prefers-color-scheme: dark)').matches ||
      document.documentElement.classList.contains('dark') ||
      document.documentElement.getAttribute('data-theme') === 'dark'
    )
  }

  useEffect(() => {
    async function initHighlighter() {
      const hl = await createHighlighter({
        themes: ['github-dark', 'github-light'],
        langs: [
          'javascript',
          'typescript',
          'jsx',
          'tsx',
          'css',
          'html',
          'json',
          'markdown',
          'bash',
          'sh',
          'yaml',
          'sql',
          'python',
          'rust',
          'go',
          'java',
          'c',
          'cpp',
          'glsl'
        ]
      })
      setHighlighter(hl)
    }

    // 初始化主题检测
    setIsDark(detectTheme())

    // 监听主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleThemeChange = () => setIsDark(detectTheme())

    mediaQuery.addEventListener('change', handleThemeChange)

    // 监听手动主题切换（如果有的话）
    const observer = new MutationObserver(handleThemeChange)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    })

    initHighlighter()

    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (highlighter && children) {
      try {
        const highlighted = highlighter.codeToHtml(children.trim(), {
          lang: language,
          theme: isDark ? 'github-dark' : 'github-light'
        })
        setHighlightedCode(highlighted)
      } catch (error) {
        console.warn(
          `Failed to highlight code for language: ${language}`,
          error
        )
        // 回退到纯文本
        setHighlightedCode(`<pre><code>${children}</code></pre>`)
      }
    }
  }, [highlighter, children, language, isDark])

  if (!highlightedCode) {
    // 加载状态，显示原始代码
    return (
      <pre className={styles.loadingPre}>
        <code className={styles.loadingCode}>{children}</code>
      </pre>
    )
  }

  return (
    <div className={styles.container}>
      {/* 代码高亮内容 */}
      <div
        className={`${styles.shikiContainer} [&>pre]:bg-content2 [&>pre]:border-content3 [&>pre]:border`}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </div>
  )
}
