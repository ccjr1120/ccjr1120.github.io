'use client'

import { useRef, useEffect, useState } from 'react'
import ExMd, { type ExMdState } from './ex-md'

export default function Editor() {
  const editorRef = useRef<HTMLDivElement>(null)
  const [editorState, setEditorState] = useState<ExMdState | null>(null)

  useEffect(() => {
    if (editorRef.current) {
      const editor = ExMd({ el: editorRef.current })

      // 监听状态变化
      editor.onStateChange((state) => {
        setEditorState(state)
      })
    }
  }, [])

  return (
    <div className="flex h-screen gap-4 p-[4rem]">
      <div className="flex-1">
        <div
          ref={editorRef}
          className="h-full overflow-auto rounded border border-gray-300 p-4"
        ></div>
      </div>

      {/* 状态显示面板 */}
      <div className="w-80 rounded bg-gray-50 p-4">
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
