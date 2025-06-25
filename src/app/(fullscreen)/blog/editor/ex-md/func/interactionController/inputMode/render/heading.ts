// 渲染标题元素
export function renderHeading(
  startContainer: Node,
  caretOffset: number,
  headingLevel: number
) {
  // 如果不是文本节点，无法处理
  if (startContainer.nodeType !== Node.TEXT_NODE) return

  const textNode = startContainer as Text
  const textContent = textNode.textContent || ''

  // 找到行的开始位置
  let lineStart = 0
  for (let i = caretOffset - 1; i >= 0; i--) {
    if (textContent[i] === '\n') {
      lineStart = i + 1
      break
    }
  }

  // 删除#符号和空格
  const deleteRange = document.createRange()
  deleteRange.setStart(startContainer, lineStart)
  deleteRange.setEnd(startContainer, caretOffset + 1) // +1 删除空格
  deleteRange.deleteContents()

  // 创建标题元素
  const heading = document.createElement(`h${headingLevel}`)
  heading.style.fontSize = getHeadingFontSize(headingLevel)
  heading.style.fontWeight = 'bold'
  heading.style.margin = '0.67em 0'
  heading.style.lineHeight = '1.2'
  heading.contentEditable = 'true'
  heading.textContent = '' // 开始时为空，让用户输入

  // 插入标题元素
  const insertRange = document.createRange()
  insertRange.setStart(startContainer, lineStart)
  insertRange.insertNode(heading)

  // 将光标移动到标题内部
  const selection = window.getSelection()
  if (selection) {
    const newRange = document.createRange()
    newRange.setStart(heading, 0)
    newRange.collapse(true)
    selection.removeAllRanges()
    selection.addRange(newRange)
  }
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
