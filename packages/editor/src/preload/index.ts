import { contextBridge, ipcRenderer } from 'electron'

export interface FileInfo {
  name: string
  path: string
  isDirectory: boolean
  children?: FileInfo[]
}

const electronAPI = {
  getContentDir: (): Promise<string> => {
    return ipcRenderer.invoke('get-content-dir')
  },
  setContentDir: (): Promise<string | null> => {
    return ipcRenderer.invoke('set-content-dir')
  },
  readDirectory: (dirPath?: string): Promise<FileInfo[]> => {
    return ipcRenderer.invoke('read-directory', dirPath)
  },
  readFile: (filePath: string): Promise<string> => {
    return ipcRenderer.invoke('read-file', filePath)
  },
  saveFile: (filePath: string, content: string): Promise<boolean> => {
    return ipcRenderer.invoke('save-file', filePath, content)
  },
  createFile: (dirPath: string, fileName: string): Promise<string> => {
    return ipcRenderer.invoke('create-file', dirPath, fileName)
  },
  getFileInfo: (filePath: string): Promise<{
    name: string
    path: string
    extension: string
    size: number
    modified: string
  }> => {
    return ipcRenderer.invoke('get-file-info', filePath)
  }
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

export type ElectronAPI = typeof electronAPI
