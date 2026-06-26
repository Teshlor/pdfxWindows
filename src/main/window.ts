import { shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { readFiles } from './file-intake'

let mainWindow: BrowserWindow | null = null
let rendererReady = false

export function getMainWindow(): BrowserWindow | null {
  return mainWindow
}

export function getRendererReady(): boolean {
  return rendererReady
}

export function setRendererReady(value: boolean): void {
  rendererReady = value
}

export function toggleDevTools(): void {
  const wc = mainWindow?.webContents
  if (!wc) return

  if (wc.isDevToolsOpened()) wc.closeDevTools()
  else wc.openDevTools({ mode: 'detach' })
}

export async function sendOpenPaths(paths: string[]): Promise<void> {
  if (!mainWindow || paths.length === 0) return

  mainWindow.webContents.send('pdfx:files-opened', await readFiles(paths))
}

export function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1320,
    height: 860,
    minWidth: 720,
    minHeight: 480,
    show: false,
    autoHideMenuBar: true,

    // Allows the frosted renderer layer and Windows backdrop to show through.
    transparent: true,
    backgroundColor: '#00000000',

    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true
    }
  })

  // Windows 11 glass backdrop. Falls back to standard transparency if unavailable.
  if (process.platform === 'win32') {
    try {
      mainWindow.setBackgroundMaterial('acrylic')
    } catch {
      // Older Windows versions may not support this material.
    }
  }

  mainWindow.on('ready-to-show', () => mainWindow?.show())

  mainWindow.on('closed', () => {
    mainWindow = null
    rendererReady = false
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    let protocol = ''

    try {
      protocol = new URL(details.url).protocol
    } catch {
      protocol = ''
    }

    if (protocol === 'https:' || protocol === 'http:' || protocol === 'mailto:') {
      shell.openExternal(details.url)
    }

    return { action: 'deny' }
  })

  mainWindow.webContents.on('will-navigate', (event, url) => {
    const devUrl = process.env['ELECTRON_RENDERER_URL']

    if (is.dev && devUrl && url.startsWith(devUrl)) return

    event.preventDefault()
  })

  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type !== 'keyDown' || input.code !== 'KeyI') return

    if (input.control && (input.shift || input.alt)) {
      event.preventDefault()
      toggleDevTools()
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
