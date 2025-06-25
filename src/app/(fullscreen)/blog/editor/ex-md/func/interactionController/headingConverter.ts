// 标题转换功能不再需要额外的textUtils导入

// 转换为标题
export function convertToHeading(el: HTMLElement, range: Range, level: number) {
  const selection = window.getSelection()
  if (!selection) return
  
  const startContainer = range.startContainer
  if (startContainer.nodeType !== Node.TEXT_NODE) return
  
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
  
  // 创建标题元素
  const heading = document.createElement(`h${level}`)
  heading.style.fontSize = getHeadingFontSize(level)
  heading.style.fontWeight = 'bold'
  heading.style.margin = '0.67em 0'
  heading.style.lineHeight = '1.2'
  heading.contentEditable = 'true'
  
  // 删除从行开始到当前光标位置的内容（包括 "#" 和空格）
  const deleteRange = document.createRange()
  deleteRange.setStart(textNode, lineStart)
  
  // 确保删除的结束位置不超过文本节点的长度
  const deleteEndOffset = Math.min(cursorOffset + 1, textContent.length)
  deleteRange.setEnd(textNode, deleteEndOffset)
  deleteRange.deleteContents()
  
  // 在删除的位置插入标题
  const insertRange = document.createRange()
  insertRange.setStart(textNode, lineStart)
  insertRange.insertNode(heading)
  
  // 确保标题内有一个文本节点用于输入
  const textNodeForInput = document.createTextNode('')
  heading.appendChild(textNodeForInput)
  
  // 多重策略确保光标正确定位
  const setCursor = () => {
    try {
      const newRange = document.createRange()
      newRange.setStart(textNodeForInput, 0)
      newRange.setEnd(textNodeForInput, 0)
      
      selection.removeAllRanges()
      selection.addRange(newRange)
      
      // 确保标题可以接收焦点
      heading.setAttribute('tabindex', '-1')
      heading.focus()
      
      console.log('光标已设置到标题:', heading)
    } catch (error) {
      console.error('设置光标失败:', error)
    }
  }
  
  // 尝试多种时机设置光标
  setCursor()
  setTimeout(setCursor, 0)
  requestAnimationFrame(setCursor)
}

// 获取标题字体大小
function getHeadingFontSize(level: number): string {
  const fontSizes = {
    1: '2em',
    2: '1.5em',
    3: '1.17em',
    4: '1em',
    5: '0.83em',
    6: '0.67em'
  }
  
  return fontSizes[level as keyof typeof fontSizes] || '1em'
} 