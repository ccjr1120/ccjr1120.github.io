// 获取当前行的文本内容
export function getCurrentLineText(el: HTMLElement, range: Range): string {
  const startContainer = range.startContainer
  
  // 如果光标在文本节点中
  if (startContainer.nodeType === Node.TEXT_NODE) {
    const textNode = startContainer as Text
    const textContent = textNode.textContent || ''
    const cursorOffset = range.startOffset
    
    // 找到行的开始位置
    let lineStart = 0
    for (let i = cursorOffset - 1; i >= 0; i--) {
      if (textContent[i] === '\n') {
        lineStart = i + 1
        break
      }
    }
    
    // 返回从行开始到光标位置的文本
    return textContent.substring(lineStart, cursorOffset)
  }
  
  // 如果光标在元素节点中，需要遍历找到当前行
  return getCurrentLineFromElement(el, range)
}

// 从元素中获取当前行文本
function getCurrentLineFromElement(el: HTMLElement, range: Range): string {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null)
  
  let currentText = ''
  let node: Text | null
  
  // 遍历所有文本节点，找到光标所在的行
  while ((node = walker.nextNode() as Text)) {
    if (
      node === range.startContainer ||
      node.parentNode === range.startContainer
    ) {
      const text = node.textContent || ''
      const offset =
        node === range.startContainer ? range.startOffset : text.length
      
      // 找到行的开始
      let lineStart = 0
      for (let i = offset - 1; i >= 0; i--) {
        if (text[i] === '\n') {
          lineStart = i + 1
          break
        }
      }
      
      currentText = text.substring(lineStart, offset)
      break
    }
  }
  
  return currentText
}

// 删除当前行的前缀字符
export function removeCurrentLinePrefix(
  el: HTMLElement,
  range: Range,
  prefix: string
) {
  const startContainer = range.startContainer
  
  if (startContainer.nodeType === Node.TEXT_NODE) {
    const textNode = startContainer as Text
    const textContent = textNode.textContent || ''
    const cursorOffset = range.startOffset
    
    // 找到行的开始位置
    let lineStart = 0
    for (let i = cursorOffset - 1; i >= 0; i--) {
      if (textContent[i] === '\n') {
        lineStart = i + 1
        break
      }
    }
    
    // 检查并删除前缀
    const lineText = textContent.substring(lineStart, cursorOffset)
    if (lineText === prefix) {
      const newTextContent =
        textContent.substring(0, lineStart) +
        textContent.substring(cursorOffset)
      textNode.textContent = newTextContent
      
      // 更新光标位置
      range.setStart(textNode, lineStart)
      range.setEnd(textNode, lineStart)
    }
  }
}

// 获取当前行的元素
export function getCurrentLineElement(el: HTMLElement, range: Range): Element | null {
  let node = range.startContainer
  
  // 如果是文本节点，获取其父元素
  if (node.nodeType === Node.TEXT_NODE) {
    node = node.parentNode!
  }
  
  // 查找最近的块级元素
  while (node && node !== el) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element
      const tagName = element.tagName.toLowerCase()
      if (['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
        return element
      }
    }
    node = node.parentNode!
  }
  
  return null
} 