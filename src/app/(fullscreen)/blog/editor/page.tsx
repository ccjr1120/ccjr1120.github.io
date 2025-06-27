'use client'

import { useRef, useEffect, useState } from 'react'
import ExMd, { type ExMdState } from './ex-md'

// localStorage 键名
const EDITOR_CONTENT_KEY = 'blog-editor-content'

export default function Editor() {
  const editorRef = useRef<HTMLDivElement>(null)
  const [editorState, setEditorState] = useState<ExMdState | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // 保存HTML内容到 localStorage
  const saveContent = (htmlContent: string) => {
    try {
      localStorage.setItem(EDITOR_CONTENT_KEY, htmlContent)
    } catch (error) {
      console.error('保存编辑器内容失败:', error)
    }
  }

  // 从 localStorage 加载HTML内容
  const loadContent = (): string => {
    try {
      return localStorage.getItem(EDITOR_CONTENT_KEY) || ''
    } catch (error) {
      console.error('加载编辑器内容失败:', error)
      return ''
    }
  }

  useEffect(() => {
    if (editorRef.current && !isLoaded) {
      // 加载保存的HTML内容
      const savedContent = loadContent()
      if (savedContent) {
        editorRef.current.innerHTML = savedContent
      }

      const editor = ExMd({ el: editorRef.current })

      // 监听状态变化
      editor.onStateChange((state) => {
        setEditorState(state)
        // 自动保存HTML内容（包含所有标签格式）
        if (editorRef.current) {
          saveContent(editorRef.current.innerHTML)
        }
      })

      setIsLoaded(true)
    }
  }, [isLoaded])

  return (
    <div className="mx-auto flex h-screen w-[680px] gap-4">
      <div className="flex-1">
        <div
          ref={editorRef}
          className="mt-2 h-full overflow-auto rounded border border-t-0 border-b-0 border-gray-300 px-4 py-4 outline-none"
        ></div>
      </div>

      {/* 状态显示面板 */}
      <div className="hidden w-80 rounded p-4">
        <h3 className="mb-4 font-bold">编辑器状态</h3>
        {editorState ? (
          <div className="space-y-2 text-sm">
            <div>
              <strong>文字数量:</strong> {editorState.textLength}
            </div>
            <div>
              <strong>行数:</strong> {editorState.lineCount}
            </div>
            <div>
              <strong>当前行:</strong> {editorState.currentLine}
            </div>
            <div>
              <strong>当前列:</strong> {editorState.currentColumn}
            </div>
            <div>
              <strong>光标位置:</strong> {editorState.cursorPosition}
            </div>
            <div>
              <strong>选中状态:</strong>{' '}
              {editorState.hasSelection ? '有选中' : '无选中'}
            </div>
            {editorState.hasSelection && (
              <>
                <div>
                  <strong>选中开始:</strong> {editorState.selectionStart}
                </div>
                <div>
                  <strong>选中结束:</strong> {editorState.selectionEnd}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-gray-500">等待编辑器初始化...</div>
        )}
      </div>
    </div>
  )
}
