// 渲染标题元素
export function renderHeading(
  startContainer: Node,
  caretOffset: number,
  headingLevel: number
) {
  // 如果不是文本节点，无法处理
  if (startContainer.nodeType !== Node.TEXT_NODE) return

  // 检查当前是否已经在heading元素中
  if (isInHeadingElement(startContainer)) {
    return // 如果已经在heading元素中，不执行任何操作
  }

  // 获取当前行的完整内容并删除
  const lineRange = getCurrentLineRange(startContainer, caretOffset)
  if (!lineRange) return

  // 创建h1元素

  const heading = document.createElement(`h${headingLevel}`)
  heading.classList.add(`ex-md-heading__h${headingLevel}`)

  // 删除当前行的所有内容并插入h1
  lineRange.deleteContents()
  lineRange.insertNode(heading)

  // 将光标移动到h1内部
  const selection = window.getSelection()
  if (selection) {
    const range = document.createRange()
    range.selectNodeContents(heading)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
    heading.focus()
  }
}

// 检查节点是否在heading元素中
function isInHeadingElement(node: Node): boolean {
  let currentNode: Node | null = node

  // 向上遍历DOM树，检查是否有heading元素
  while (currentNode) {
    if (currentNode.nodeType === Node.ELEMENT_NODE) {
      const element = currentNode as Element
      const tagName = element.tagName
      if (
        tagName === 'H1' ||
        tagName === 'H2' ||
        tagName === 'H3' ||
        tagName === 'H4' ||
        tagName === 'H5' ||
        tagName === 'H6'
      ) {
        return true
      }
    }
    currentNode = currentNode.parentNode
  }

  return false
}

// 获取当前行的范围，包括所有空格和文本内容
function getCurrentLineRange(
  textNode: Node,
  caretOffset: number
): Range | null {
  const range = document.createRange()

  // 从光标位置开始，向前查找行开始位置
  let startContainer = textNode
  let startOffset = 0

  // 检查当前文本节点的开头到光标位置
  if (textNode.nodeType === Node.TEXT_NODE) {
    const textContent = textNode.textContent || ''
    // 向前查找换行符或到达文本开头
    for (let i = caretOffset - 1; i >= 0; i--) {
      if (textContent[i] === '\n') {
        startOffset = i + 1
        break
      }
    }
  }

  // 向前遍历兄弟节点查找行开始
  let currentNode = textNode
  while (currentNode.previousSibling) {
    const prevSibling = currentNode.previousSibling
    if (prevSibling.nodeType === Node.ELEMENT_NODE) {
      const element = prevSibling as Element
      if (
        element.tagName === 'BR' ||
        element.tagName === 'DIV' ||
        element.tagName === 'P'
      ) {
        break
      }
    }
    if (prevSibling.nodeType === Node.TEXT_NODE) {
      const textContent = prevSibling.textContent || ''
      const newlineIndex = textContent.lastIndexOf('\n')
      if (newlineIndex !== -1) {
        startContainer = prevSibling
        startOffset = newlineIndex + 1
        break
      }
    }
    startContainer = prevSibling
    startOffset = 0
    currentNode = prevSibling
  }

  // 从光标位置开始，向后查找行结束位置
  let endContainer = textNode
  let endOffset = textNode.textContent?.length || 0

  // 检查当前文本节点从光标位置到结尾
  if (textNode.nodeType === Node.TEXT_NODE) {
    const textContent = textNode.textContent || ''
    for (let i = caretOffset; i < textContent.length; i++) {
      if (textContent[i] === '\n') {
        endOffset = i
        break
      }
    }
  }

  // 向后遍历兄弟节点查找行结束
  currentNode = textNode
  while (currentNode.nextSibling) {
    const nextSibling = currentNode.nextSibling
    if (nextSibling.nodeType === Node.ELEMENT_NODE) {
      const element = nextSibling as Element
      if (
        element.tagName === 'BR' ||
        element.tagName === 'DIV' ||
        element.tagName === 'P'
      ) {
        break
      }
    }
    if (nextSibling.nodeType === Node.TEXT_NODE) {
      const textContent = nextSibling.textContent || ''
      const newlineIndex = textContent.indexOf('\n')
      if (newlineIndex !== -1) {
        endContainer = nextSibling
        endOffset = newlineIndex
        break
      }
    }
    endContainer = nextSibling
    endOffset = nextSibling.textContent?.length || 0
    currentNode = nextSibling
  }

  try {
    range.setStart(startContainer, startOffset)
    range.setEnd(endContainer, endOffset)
    return range
  } catch (error) {
    console.warn('Failed to create range:', error)
    return null
  }
}
