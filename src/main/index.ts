import { app } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { collectFileArgs } from './file-intake'
import { createWindow, getMainWindow, sendOpenPaths } from './window'
import { buildMenu } from './menu'
import { registerIpc } from './register-ipc'

app.setName('PDFx')

if (process.env.PDFX_USER_DATA) {
  app.setPath('userData', process.env.PDFX_USER_DATA)
}

let pendingOpenPaths: string[] = []

const gotLock = app.requestSingleInstanceLock()
if (!gotLock) {
  app.quit()
} else {
  app.on('second-instance', (_event, argv) => {
    const mainWindow = getMainWindow()
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
    void sendOpenPaths(collectFileArgs(argv.slice(1)))
  })

  app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.pdfx.app')

    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window, { zoom: true })
    })

    pendingOpenPaths.push(...collectFileArgs(process.argv.slice(1)))

    registerIpc(
      () => pendingOpenPaths,
      () => {
        pendingOpenPaths = []
      }
    )

    buildMenu()
    createWindow()
  })
}

app.on('window-all-closed', () => {
  app.quit()
})
