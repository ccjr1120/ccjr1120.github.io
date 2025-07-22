import { getCurrentLineText } from '../textUtils'
import { renderHeading } from './render/heading'

function getMode(el: HTMLElement, event: KeyboardEvent) {
  if (event.key === ' ') {
    // 获取当前选择范围
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return { type: 'normal' }

    const range = selection.getRangeAt(0)
    const currentLineText = getCurrentLineText(el, range)

    // 检查是否是标题语法
    if (currentLineText === '#') {
      return { type: 'heading', level: 1 }
    } else if (currentLineText === '##') {
      return { type: 'heading', level: 2 }
    } else if (currentLineText === '###') {
      return { type: 'heading', level: 3 }
    } else if (currentLineText === '####') {
      return { type: 'heading', level: 4 }
    } else if (currentLineText === '#####') {
      return { type: 'heading', level: 5 }
    } else if (currentLineText === '######') {
      return { type: 'heading', level: 6 }
    }
  }

  return { type: 'normal' }
}

// 处理输入模式的交互
export function handleInputMode(el: HTMLElement, event: KeyboardEvent) {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return

  const range = selection.getRangeAt(0)

  // 其他输入模式处理
  const mode = getMode(el, event)
  const startContainer = range.startContainer
  const startOffset = range.startOffset

  if (mode.type !== 'normal') {
    event.preventDefault()
  }
  if (mode.type === 'heading' && mode.level) {
    renderHeading(startContainer, startOffset, mode.level)
  }
}
