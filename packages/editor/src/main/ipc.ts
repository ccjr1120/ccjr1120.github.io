import { ipcMain, app, dialog, BrowserWindow } from 'electron'
import { readdir, readFile, writeFile, stat, mkdir, rename, rm } from 'fs/promises'
import { join, extname, basename, resolve, relative, dirname } from 'path'
import { existsSync } from 'fs'

interface FileInfo {
  name: string
  path: string
  isDirectory: boolean
  children?: FileInfo[]
}

function getToday(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function splitFrontmatter(markdown: string): { frontmatter: string | null; body: string; newline: string } {
  const newline = markdown.includes('\r\n') ? '\r\n' : '\n'
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n)?/)
  if (!match) {
    return { frontmatter: null, body: markdown, newline }
  }
  return {
    frontmatter: match[1],
    body: markdown.slice(match[0].length),
    newline,
  }
}

function ensureFrontmatterDate(frontmatter: string | null, newline: string): string {
  const dateLine = `date: ${getToday()}`
  if (!frontmatter) return dateLine
  if (/^date\s*:/m.test(frontmatter)) return frontmatter
  return `${dateLine}${newline}${frontmatter}`
}

function mergeFrontmatter(frontmatter: string | null, body: string, newline = '\n'): string {
  const nextFrontmatter = ensureFrontmatterDate(frontmatter, newline)
  const nextBody = body.replace(/^\r?\n+/, '')
  return `---${newline}${nextFrontmatter}${newline}---${newline}${newline}${nextBody}`
}

async function readDirectory(dirPath: string): Promise<FileInfo[]> {
  const entries = await readdir(dirPath, { withFileTypes: true })
  const files: FileInfo[] = []

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue

    const fullPath = join(dirPath, entry.name)
    const info: FileInfo = {
      name: entry.name,
      path: fullPath,
      isDirectory: entry.isDirectory()
    }

    if (entry.isDirectory()) {
      info.children = await readDirectory(fullPath)
    }

    files.push(info)
  }

  return files.sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1
    if (!a.isDirectory && b.isDirectory) return 1
    return a.name.localeCompare(b.name)
  })
}

let contentDir: string = ''
let draftContentDir: string = ''

function getContentDir(): string {
  if (!contentDir) {
    const userDataDir = app.getPath('userData')
    const configPath = join(userDataDir, 'config.json')
    if (existsSync(configPath)) {
      try {
        const config = JSON.parse(require('fs').readFileSync(configPath, 'utf-8'))
        if (config.contentDir && existsSync(config.contentDir)) {
          contentDir = config.contentDir
          return contentDir
        }
      } catch {}
    }
    contentDir = join(app.getAppPath(), '../../blog/content')
  }
  return contentDir
}

function getDraftContentDir(): string {
  if (!draftContentDir) {
    const contentPath = getContentDir()
    draftContentDir = join(contentPath, '../draft-content')
  }
  return draftContentDir
}

export function setupFileIPC(): void {
  ipcMain.handle('get-content-dir', () => {
    return getContentDir()
  })

  ipcMain.handle('get-draft-content-dir', () => {
    return getDraftContentDir()
  })

  ipcMain.handle('set-content-dir', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      defaultPath: getContentDir()
    })
    if (!result.canceled && result.filePaths.length > 0) {
      contentDir = result.filePaths[0]
      draftContentDir = '' // Reset draft dir when content dir changes
      const userDataDir = app.getPath('userData')
      const configPath = join(userDataDir, 'config.json')
      require('fs').writeFileSync(configPath, JSON.stringify({ contentDir }))
      return contentDir
    }
    return null
  })

  ipcMain.handle('read-directory', async (_event, dirPath?: string) => {
    const targetDir = dirPath || getContentDir()
    if (!existsSync(targetDir)) {
      await mkdir(targetDir, { recursive: true })
    }
    return readDirectory(targetDir)
  })

  ipcMain.handle('read-draft-directory', async () => {
    const draftDir = getDraftContentDir()
    if (!existsSync(draftDir)) {
      await mkdir(draftDir, { recursive: true })
    }
    return readDirectory(draftDir)
  })

  ipcMain.handle('read-file', async (_event, filePath: string) => {
    const content = await readFile(filePath, 'utf-8')
    return splitFrontmatter(content).body
  })

  ipcMain.handle('save-file', async (_event, filePath: string, content: string) => {
    let frontmatter: string | null = null
    let newline = '\n'
    if (existsSync(filePath)) {
      const current = await readFile(filePath, 'utf-8')
      const parsed = splitFrontmatter(current)
      frontmatter = parsed.frontmatter
      newline = parsed.newline
    }
    await writeFile(filePath, mergeFrontmatter(frontmatter, content, newline), 'utf-8')
    return true
  })

  ipcMain.handle('create-file', async (_event, dirPath: string, fileName: string) => {
    // Always create new files in draft-content directory
    const draftDir = getDraftContentDir()
    const relativePath = relative(getContentDir(), dirPath)
    const targetDir = join(draftDir, relativePath)
    if (!existsSync(targetDir)) {
      await mkdir(targetDir, { recursive: true })
    }
    const filePath = join(targetDir, fileName)
    if (!existsSync(filePath)) {
      await writeFile(filePath, mergeFrontmatter(null, `# ${basename(fileName, extname(fileName))}\n`), 'utf-8')
    }
    return filePath
  })

  ipcMain.handle('delete-file', async (_event, filePath: string) => {
    const draftDir = getDraftContentDir()

    try {
      const stats = await stat(filePath)
      if (!stats.isFile()) {
        return { success: false, error: 'Only files can be deleted' }
      }

      await rm(filePath)

      const parentDir = dirname(filePath)
      if (filePath.startsWith(draftDir) && parentDir !== draftDir) {
        try {
          const entries = await readdir(parentDir)
          if (entries.length === 0) {
            await rm(parentDir, { recursive: true })
          }
        } catch {}
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Delete failed' }
    }
  })

  ipcMain.handle('publish-file', async (_event, filePath: string) => {
    const draftDir = getDraftContentDir()
    const contentPath = getContentDir()

    // Check if file is in draft directory
    if (!filePath.startsWith(draftDir)) {
      return { success: false, error: 'File is not in draft directory' }
    }

    // Calculate relative path and target path
    const relativePath = relative(draftDir, filePath)
    const targetPath = join(contentPath, relativePath)
    const targetDir = join(contentPath, dirname(relativePath))

    // Create target directory if needed
    if (!existsSync(targetDir)) {
      await mkdir(targetDir, { recursive: true })
    }

    // Check if target file already exists
    if (existsSync(targetPath)) {
      return { success: false, error: 'File already exists in content directory' }
    }

    // Move file from draft to content
    await rename(filePath, targetPath)

    // Clean up empty directories in draft
    const draftSubDir = dirname(filePath)
    if (draftSubDir !== draftDir) {
      try {
        const entries = await readdir(draftSubDir)
        if (entries.length === 0) {
          await rm(draftSubDir, { recursive: true })
        }
      } catch {}
    }

    return { success: true, newPath: targetPath }
  })

  ipcMain.handle('get-file-info', async (_event, filePath: string) => {
    const stats = await stat(filePath)
    return {
      name: basename(filePath),
      path: filePath,
      extension: extname(filePath),
      size: stats.size,
      modified: stats.mtime.toISOString()
    }
  })
}
