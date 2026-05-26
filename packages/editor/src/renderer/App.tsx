import { useState, useEffect, useCallback } from 'react'
import FileTree from './components/FileTree'
import Editor from './components/Editor'
import { FileInfo } from '../preload/index'

export default function App() {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [contentDir, setContentDir] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [content, setContent] = useState<string>('')
  const [isDirty, setIsDirty] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const loadFiles = useCallback(async () => {
    const dir = await window.electronAPI.getContentDir()
    setContentDir(dir)
    const fileList = await window.electronAPI.readDirectory()
    setFiles(fileList)
  }, [])

  useEffect(() => {
    loadFiles()
  }, [loadFiles])

  const handleFileSelect = useCallback(
    async (filePath: string) => {
      if (filePath === selectedFile) return
      if (isDirty && selectedFile) {
        const confirmed = window.confirm('当前文件已修改，是否保存？')
        if (confirmed) {
          await window.electronAPI.saveFile(selectedFile, content)
        }
      }

      const fileContent = await window.electronAPI.readFile(filePath)
      setSelectedFile(filePath)
      setContent(fileContent)
      setIsDirty(false)
    },
    [isDirty, selectedFile, content],
  )

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent)
    setIsDirty(true)
  }, [])

  const handleSave = useCallback(async () => {
    if (selectedFile) {
      await window.electronAPI.saveFile(selectedFile, content)
      setIsDirty(false)
    }
  }, [selectedFile, content])

  const handleFileCreate = useCallback(
    async (fileName: string) => {
      const filePath = await window.electronAPI.createFile(contentDir, fileName)
      await loadFiles()
      const fileContent = await window.electronAPI.readFile(filePath)
      setSelectedFile(filePath)
      setContent(fileContent)
      setIsDirty(false)
    },
    [contentDir, loadFiles],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key === 's') {
        e.preventDefault()
        handleSave()
      } else if (mod && (e.key === 'b' || e.key === '\\')) {
        e.preventDefault()
        setSidebarOpen((v) => !v)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSave])

  const dragStyle = { WebkitAppRegion: 'drag' } as React.CSSProperties
  const noDragStyle = { WebkitAppRegion: 'no-drag' } as React.CSSProperties

  return (
    <div className="app-shell flex h-screen flex-col">
      <div className="titlebar flex h-10 flex-shrink-0" style={dragStyle}>
        {sidebarOpen && <div className="titlebar__side w-60 flex-shrink-0" />}
        <div
          className={`titlebar__main flex flex-1 items-center justify-between pr-3 ${
            sidebarOpen ? 'pl-3' : 'pl-20'
          }`}
        >
          <button
            type="button"
            className="sidebar-toggle"
            onClick={() => setSidebarOpen((v) => !v)}
            style={noDragStyle}
            title={sidebarOpen ? 'Hide sidebar (⌘B)' : 'Show sidebar (⌘B)'}
            aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          >
            <SidebarIcon open={sidebarOpen} />
          </button>
          <span className={`titlebar__dirty ${isDirty ? 'is-on' : ''}`} aria-hidden />
        </div>
      </div>
      <div className="flex min-h-0 flex-1">
        {sidebarOpen && (
          <aside className="sidebar w-60 flex-shrink-0 overflow-y-auto">
            <FileTree
              files={files}
              selectedFile={selectedFile}
              contentDir={contentDir}
              onFileSelect={handleFileSelect}
              onFileCreate={handleFileCreate}
            />
          </aside>
        )}
        <main className="workspace flex min-w-0 flex-1 flex-col">
          {selectedFile ? (
            <Editor
              key={selectedFile}
              content={content}
              onChange={handleContentChange}
            />
          ) : (
            <div className="empty-state flex flex-1 flex-col items-center justify-center gap-2">
              <p className="text-sm">从左侧选择一篇文章开始编辑</p>
              <p className="text-xs opacity-60">⌘B 收起 / 展开侧边栏</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function SidebarIcon({ open }: { open: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect
        x="1.5"
        y="2.5"
        width="13"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <line
        x1="6"
        y1="3"
        x2="6"
        y2="13"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      {open && <rect x="2" y="3" width="4" height="10" fill="currentColor" opacity="0.35" />}
    </svg>
  )
}
