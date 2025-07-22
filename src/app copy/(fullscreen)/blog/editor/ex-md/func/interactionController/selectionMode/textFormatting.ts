// 处理选中文本的格式化
export function handleTextFormatting(el: HTMLElement, event: KeyboardEvent, range: Range) {
  // 快捷键组合
  if (event.ctrlKey || event.metaKey) {
    switch (event.key.toLowerCase()) {
      case 'b':
        event.preventDefault()
        toggleBold(range)
        break
      case 'i':
        event.preventDefault()
        toggleItalic(range)
        break
      case 'u':
        event.preventDefault()
        toggleUnderline(range)
        break
    }
  }
}

// 切换粗体
function toggleBold(range: Range) {
  const selectedText = range.toString()
  if (selectedText) {
    const strong = document.createElement('strong')
    strong.textContent = selectedText
    range.deleteContents()
    range.insertNode(strong)
  }
}

// 切换斜体
function toggleItalic(range: Range) {
  const selectedText = range.toString()
  if (selectedText) {
    const em = document.createElement('em')
    em.textContent = selectedText
    range.deleteContents()
    range.insertNode(em)
  }
}

// 切换下划线
function toggleUnderline(range: Range) {
  const selectedText = range.toString()
  if (selectedText) {
    const u = document.createElement('u')
    u.textContent = selectedText
    range.deleteContents()
    range.insertNode(u)
  }
} 