import { useState, useCallback } from 'react'
import { FileInfo } from '../../preload/index'

interface FileTreeProps {
  files: FileInfo[]
  draftFiles: FileInfo[]
  selectedFile: string | null
  contentDir: string
  onFileSelect: (filePath: string) => void
  onFileCreate: (fileName: string) => void
  onFileDelete: (filePath: string) => void
}

interface FileTreeItemProps {
  file: FileInfo
  level: number
  selectedFile: string | null
  onFileSelect: (filePath: string) => void
  onFileDelete: (filePath: string) => void
}

function FileTreeItem({ file, level, selectedFile, onFileSelect, onFileDelete }: FileTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const isSelected = selectedFile === file.path
  const isMarkdown = file.name.endsWith('.md')

  const handleClick = useCallback(() => {
    if (file.isDirectory) {
      setIsExpanded((v) => !v)
    } else if (isMarkdown) {
      onFileSelect(file.path)
    }
  }, [file, isMarkdown, onFileSelect])

  if (!file.isDirectory && !isMarkdown) return null

  return (
    <div>
      <div className={`file-row ${isSelected ? 'file-row--active' : ''}`}>
        <button
          type="button"
          onClick={handleClick}
          className="file-row__main"
          style={{ paddingLeft: `${level * 12 + 14}px` }}
        >
          {file.isDirectory ? (
            <span className="file-row__icon">{isExpanded ? '▾' : '▸'}</span>
          ) : (
            <span className="file-row__icon file-row__icon--doc">·</span>
          )}
          <span className="file-row__name">{file.name.replace(/\.md$/, '')}</span>
        </button>
        {!file.isDirectory && isMarkdown && (
          <button
            type="button"
            className="file-row__delete"
            onClick={(e) => {
              e.stopPropagation()
              onFileDelete(file.path)
            }}
            aria-label={`Delete ${file.name.replace(/\.md$/, '')}`}
            title="Delete"
          >
            <TrashIcon />
          </button>
        )}
      </div>
      {file.isDirectory && isExpanded && file.children && (
        <div>
          {file.children.map((child) => (
            <FileTreeItem
              key={child.path}
              file={child}
              level={level + 1}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
              onFileDelete={onFileDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function TrashIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  )
}

export default function FileTree({ files, draftFiles, selectedFile, onFileSelect, onFileCreate, onFileDelete }: FileTreeProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [newFileName, setNewFileName] = useState('')

  const handleCreate = useCallback(() => {
    const trimmed = newFileName.trim()
    if (!trimmed) {
      setIsCreating(false)
      return
    }
    const name = trimmed.endsWith('.md') ? trimmed : `${trimmed}.md`
    onFileCreate(name)
    setNewFileName('')
    setIsCreating(false)
  }, [newFileName, onFileCreate])

  return (
    <div className="filetree py-3">
      <div className="filetree__header px-4">
        <span className="filetree__title">DRAFT</span>
        <button
          type="button"
          className="filetree__new-btn"
          onClick={() => setIsCreating(true)}
          aria-label="New file"
          title="New file"
        >
          +
        </button>
      </div>
      {isCreating && (
        <div className="px-4 pb-2 pt-1">
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate()
              if (e.key === 'Escape') {
                setIsCreating(false)
                setNewFileName('')
              }
            }}
            onBlur={handleCreate}
            autoFocus
            placeholder="filename.md"
            className="filetree__input w-full px-2 py-1 text-xs"
          />
        </div>
      )}
      <div className="filetree__list">
        {draftFiles.length === 0 ? (
          <p className="filetree__empty px-4 py-3 text-xs">No drafts yet.</p>
        ) : (
          draftFiles.map((file) => (
            <FileTreeItem
              key={file.path}
              file={file}
              level={0}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
              onFileDelete={onFileDelete}
            />
          ))
        )}
      </div>

      <div className="filetree__header px-4 mt-4">
        <span className="filetree__title">CONTENT</span>
      </div>
      <div className="filetree__list">
        {files.length === 0 ? (
          <p className="filetree__empty px-4 py-3 text-xs">No posts yet.</p>
        ) : (
          files.map((file) => (
            <FileTreeItem
              key={file.path}
              file={file}
              level={0}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
              onFileDelete={onFileDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}
