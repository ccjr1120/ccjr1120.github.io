import { ipcMain, app, dialog, BrowserWindow } from 'electron'
import { readdir, readFile, writeFile, stat, mkdir } from 'fs/promises'
import { join, extname, basename, resolve } from 'path'
import { existsSync } from 'fs'

interface FileInfo {
  name: string
  path: string
  isDirectory: boolean
  children?: FileInfo[]
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

export function setupFileIPC(): void {
  ipcMain.handle('get-content-dir', () => {
    return getContentDir()
  })

  ipcMain.handle('set-content-dir', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      defaultPath: getContentDir()
    })
    if (!result.canceled && result.filePaths.length > 0) {
      contentDir = result.filePaths[0]
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

  ipcMain.handle('read-file', async (_event, filePath: string) => {
    const content = await readFile(filePath, 'utf-8')
    return content
  })

  ipcMain.handle('save-file', async (_event, filePath: string, content: string) => {
    await writeFile(filePath, content, 'utf-8')
    return true
  })

  ipcMain.handle('create-file', async (_event, dirPath: string, fileName: string) => {
    const filePath = join(dirPath, fileName)
    if (!existsSync(filePath)) {
      await writeFile(filePath, '', 'utf-8')
    }
    return filePath
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
