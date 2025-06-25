import { handleInputMode } from './inputMode'
import { handleSelectionMode } from './selectionMode'

export default function createInteractionController(el: HTMLElement) {
  // 添加键盘事件监听器
  const handleKeyDown = (event: KeyboardEvent) => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)

    // 判断交互模式并分发
    if (hasTextSelection(selection)) {
      // 选中模式 - 用户选中了文本
      handleSelectionMode(el, event, range)
    } else {
      // 输入模式 - 用户正在输入
      handleInputMode(el, event)
    }
  }

  // 初始化事件监听
  el.addEventListener('keydown', handleKeyDown)

  // 返回清理函数
  return {
    destroy: () => {
      el.removeEventListener('keydown', handleKeyDown)
    }
  }
}

// 判断是否有文本选中
function hasTextSelection(selection: Selection): boolean {
  return selection.rangeCount > 0 && !selection.getRangeAt(0).collapsed
}

// 导出交互控制器类型
export type InteractionController = ReturnType<
  typeof createInteractionController
>
