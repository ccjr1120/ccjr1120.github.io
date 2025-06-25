import { handleTextFormatting } from './textFormatting'

// 处理选中模式的交互
export function handleSelectionMode(el: HTMLElement, event: KeyboardEvent, range: Range) {
  // 处理文本格式化
  handleTextFormatting(el, event, range)
  
  // 可以在这里添加其他选中模式的处理逻辑
  // 例如：快捷键操作、批量操作等
} 