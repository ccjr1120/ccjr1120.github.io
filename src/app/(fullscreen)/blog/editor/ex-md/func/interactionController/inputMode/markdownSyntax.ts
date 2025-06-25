import { convertToHeading } from '../headingConverter'
import { getCurrentLineText } from '../textUtils'

// 处理输入模式下的 Markdown 语法
export function handleMarkdownSyntax(el: HTMLElement, event: KeyboardEvent, range: Range) {
  if (event.key === ' ') {
    handleSpaceKey(el, event, range)
  }
  
  // 可以在这里添加其他 Markdown 语法处理
  // 例如：**加粗**、*斜体*、[链接]等
}

// 处理空格键事件
function handleSpaceKey(el: HTMLElement, event: KeyboardEvent, range: Range) {
  // 获取当前行的内容
  const currentLineText = getCurrentLineText(el, range)
  
  // 检查是否是标题语法
  if (currentLineText === '#') {
    event.preventDefault() // 阻止默认空格输入
    convertToHeading(el, range, 1)
  } else if (currentLineText === '##') {
    event.preventDefault()
    convertToHeading(el, range, 2)
  } else if (currentLineText === '###') {
    event.preventDefault()
    convertToHeading(el, range, 3)
  }
  // 可以继续添加更多标题级别的支持
} 