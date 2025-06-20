function getTextWithLineBreaks(element: HTMLElement): string {
  // 递归获取文本内容，保留换行信息
  function getTextContent(node: Node): string {
    let text = ''
    
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        text += child.textContent || ''
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const tagName = (child as Element).tagName.toLowerCase()
        if (tagName === 'br') {
          text += '\n'
        } else if (tagName === 'div' || tagName === 'p') {
          // 如果div/p前面已经有内容，添加换行
          if (text && !text.endsWith('\n')) {
            text += '\n'
          }
          text += getTextContent(child)
          // div/p后面也添加换行（除非已经以换行结尾）
          if (text && !text.endsWith('\n')) {
            text += '\n'
          }
        } else {
          text += getTextContent(child)
        }
      }
    }
    
    return text
  }
  
  return getTextContent(element)
}

function getCursorPositionInText(element: HTMLElement): number {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return 0
  
  const range = selection.getRangeAt(0)
  const preCaretRange = range.cloneRange()
  preCaretRange.selectNodeContents(element)
  preCaretRange.setEnd(range.startContainer, range.startOffset)
  
  // 获取光标前的内容，并转换为带换行的文本
  const tempDiv = document.createElement('div')
  tempDiv.appendChild(preCaretRange.cloneContents())
  
  return getTextWithLineBreaks(tempDiv).length
}

function getLineInfo(text: string, cursorPosition: number) {
  // 按换行符分割文本
  const lines = text.split('\n')
  const lineCount = lines.length
  
  let currentLine = 1
  let currentColumn = 1
  let charCount = 0
  
  for (let i = 0; i < lines.length; i++) {
    const lineLength = lines[i].length
    
    if (charCount + lineLength >= cursorPosition) {
      currentLine = i + 1
      currentColumn = cursorPosition - charCount + 1
      break
    }
    
    // +1 for the newline character (except for the last line)
    charCount += lineLength + (i < lines.length - 1 ? 1 : 0)
  }
  
  return {
    lineCount,
    currentLine,
    currentColumn
  } as const
}

// 推导行信息类型
export type LineInfo = ReturnType<typeof getLineInfo>

function getElementState(element: HTMLElement) {
  // 获取带换行的文本内容
  const textWithBreaks = getTextWithLineBreaks(element)
  const textLength = textWithBreaks.length
  
  // 获取光标位置
  const cursorPosition = getCursorPositionInText(element)
  
  // 获取选择范围
  const selection = window.getSelection()
  const range = selection?.rangeCount ? selection.getRangeAt(0) : null
  
  const selectionStart = cursorPosition
  let selectionEnd = cursorPosition
  
  if (range && !range.collapsed) {
    // 计算选择结束位置
    const preSelectionEndRange = range.cloneRange()
    preSelectionEndRange.selectNodeContents(element)
    preSelectionEndRange.setEnd(range.endContainer, range.endOffset)
    
    const tempDiv = document.createElement('div')
    tempDiv.appendChild(preSelectionEndRange.cloneContents())
    selectionEnd = getTextWithLineBreaks(tempDiv).length
  }
  
  // 计算行信息
  const lineInfo = getLineInfo(textWithBreaks, cursorPosition)
  
  return {
    textLength,
    text: textWithBreaks,
    cursorPosition,
    selectionStart,
    selectionEnd,
    hasSelection: selectionStart !== selectionEnd,
    ...lineInfo
  } as const
}

// 通过 typeof 推导状态类型
export type ExMdState = ReturnType<typeof getElementState>

// 定义事件类型
const EVENTS = ['input', 'keyup', 'mouseup', 'selectionchange'] as const
export type EditorEvent = typeof EVENTS[number]
export type EditorEvents = typeof EVENTS

// 状态变化回调类型
export type StateCallback = (state: ExMdState) => void

// 事件监听器映射类型
type EventListenersMap = Record<EditorEvent, () => void>

export default function createStateManager(element: HTMLElement) {
  const stateCallbacks: Array<StateCallback> = []

  // 处理状态变化
  const handleStateChange = () => {
    const state = getElementState(element)
    stateCallbacks.forEach((callback) => callback(state))
  }

  // 监听相关事件
  const eventListeners: EventListenersMap = {} as EventListenersMap

  // 添加事件监听器
  EVENTS.forEach((eventType) => {
    eventListeners[eventType] = handleStateChange
    element.addEventListener(eventType, handleStateChange)
  })

  return {
    // 获取当前状态
    getCurrentState: () => getElementState(element),

    // 注册状态变化回调
    onStateChange: (callback: StateCallback) => {
      stateCallbacks.push(callback)
    },

    // 清理资源
    destroy: () => {
      // 移除事件监听器
      EVENTS.forEach((eventType) => {
        element.removeEventListener(eventType, eventListeners[eventType])
      })
      // 清空回调数组
      stateCallbacks.length = 0
    }
  } as const
}

// 通过 typeof 推导状态管理器类型
export type StateManager = ReturnType<typeof createStateManager>

// 推导方法类型
export type GetCurrentState = StateManager['getCurrentState']
export type OnStateChange = StateManager['onStateChange']
export type DestroyManager = StateManager['destroy']

// 推导函数签名类型
export type StateManagerFactory = typeof createStateManager
export type StateManagerFactoryParams = Parameters<StateManagerFactory>
export type StateManagerElement = StateManagerFactoryParams[0] 