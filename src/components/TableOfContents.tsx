'use client'

import { useEffect, useState, useRef } from 'react'
import { TocItem } from '@/lib/mdx-utils'

interface TableOfContentsProps {
  items: TocItem[]
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const initializedRef = useRef(false)

  useEffect(() => {
    // 默认激活第一个项目（只在初始化时执行一次）
    if (items.length > 0 && !initializedRef.current) {
      setActiveId(items[0].id)
      initializedRef.current = true
    }
  }, [items])

  useEffect(() => {
    // 添加锚点ID到实际的标题元素
    const addAnchorIds = () => {
      // 获取文章内容区域的所有标题元素
      const articleElement = document.querySelector('main.prose')
      if (!articleElement) return

      const headingElements = articleElement.querySelectorAll(
        'h1, h2, h3, h4, h5, h6'
      )
      let tocIndex = 0

      headingElements.forEach((element) => {
        if (tocIndex < items.length) {
          const headingLevel = parseInt(element.tagName.substring(1))
          const headingText = element.textContent?.trim() || ''

          // 匹配当前标题级别和文本
          if (
            headingLevel === items[tocIndex].level &&
            headingText === items[tocIndex].title
          ) {
            element.id = items[tocIndex].id
            tocIndex++
          }
        }
      })
    }

    // 页面加载后添加锚点ID，延迟确保DOM已渲染
    const timer = setTimeout(addAnchorIds, 200)

    // 监听滚动，高亮当前可见的标题
    const handleScroll = () => {
      const headings = items
        .map((item, index) => ({
          id: item.id,
          level: item.level,
          index: index,
          element: document.getElementById(item.id)
        }))
        .filter((h) => h.element)

      if (headings.length === 0) return

      const viewportTop = 150 // 激活区域：距离顶部150px以内
      let currentActiveId = items[0].id // 默认为第一个

      // 找到最接近视界顶部的可见标题
      let bestMatch = null
      let minDistance = Infinity

      for (let i = 0; i < headings.length; i++) {
        const heading = headings[i]
        if (heading.element) {
          const rect = heading.element.getBoundingClientRect()
          const headingTop = rect.top
          const headingBottom = rect.bottom

          // 标题必须在视界中（至少部分可见）
          if (headingBottom > 0 && headingTop < window.innerHeight) {
            // 计算标题到激活区域的距离
            let distance

            if (headingTop <= viewportTop) {
              // 标题在激活区域内或之上，距离为到激活线的距离
              distance = Math.abs(headingTop - viewportTop)
            } else {
              // 标题在激活区域下方，给它一个较大的权重，但仍然考虑
              distance = headingTop - viewportTop + 1000 // 增加权重，让它优先级较低
            }

            // 选择距离激活区域最近的标题
            if (distance < minDistance) {
              minDistance = distance
              bestMatch = heading
            }
          }
        }
      }

      // 特殊情况：如果没有标题在视界中，选择最后一个滚过的标题
      if (!bestMatch) {
        for (let i = headings.length - 1; i >= 0; i--) {
          const heading = headings[i]
          if (heading.element) {
            const rect = heading.element.getBoundingClientRect()
            if (rect.top <= viewportTop) {
              bestMatch = heading
              break
            }
          }
        }
      }

      // 如果找到了最佳匹配，使用它
      if (bestMatch) {
        currentActiveId = bestMatch.id
      }

      if (currentActiveId !== activeId) {
        setActiveId(currentActiveId)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // 延迟初始检查，确保DOM和样式都已加载
    const initialCheck = setTimeout(handleScroll, 300)

    return () => {
      clearTimeout(timer)
      clearTimeout(initialCheck)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [items, activeId])

  // 平滑滚动到指定标题
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -100 // 偏移量，避免被固定头部遮挡
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset

      window.scrollTo({
        top: y,
        behavior: 'smooth'
      })

      // 更新活跃状态
      setActiveId(id)
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="fixed right-4 top-24 z-20 hidden pt-2 lg:inline-block">
      <div
        className="w-64 rounded-lg shadow-sm"
        style={{
          color: 'var(--color-content1-foreground)'
        }}
      >
        <h3
          className="mb-4 text-sm font-semibold"
          style={{ color: 'var(--color-foreground)' }}
        >
          目录
        </h3>
        <nav className="max-h-[calc(100vh-200px)] space-y-1 overflow-y-auto">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToHeading(item.id)}
              className="block w-full rounded px-2 py-1 text-left text-sm transition-all duration-200"
              style={{
                paddingLeft: `${8 + (item.level - 1) * 12}px`,
                lineHeight: '1.5',
                color:
                  activeId === item.id
                    ? 'var(--color-primary)'
                    : 'var(--color-default-600)',
                backgroundColor:
                  activeId === item.id
                    ? 'var(--color-primary-50)'
                    : 'transparent',
                fontWeight: activeId === item.id ? '500' : '400'
              }}
              onMouseEnter={(e) => {
                if (activeId !== item.id) {
                  e.currentTarget.style.color = 'var(--color-primary)'
                  e.currentTarget.style.backgroundColor =
                    'var(--color-content2)'
                }
              }}
              onMouseLeave={(e) => {
                if (activeId !== item.id) {
                  e.currentTarget.style.color = 'var(--color-default-600)'
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <span className="block truncate">{item.title}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
