import { Menu } from 'electron'
import { getMainWindow } from './window'

export function buildMenu(): void {
  const sendZoom = (action: 'in' | 'out' | 'reset') => (): void => {
    getMainWindow()?.webContents.send('pdfx:zoom', action)
  }
  const sendMenu = (action: string) => (): void => {
    getMainWindow()?.webContents.send('pdfx:menu', action)
  }

  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: 'File',
        submenu: [
          { label: 'Open…', accelerator: 'Ctrl+O', click: sendMenu('open') },
          { type: 'separator' },
          { label: 'Export .pdfx…', accelerator: 'Ctrl+E', click: sendMenu('export-pdfx') },
          { label: 'Export Single PDF…', click: sendMenu('export-pdf') },
          { label: 'Export All as ZIP…', click: sendMenu('export-zip') },
          { type: 'separator' },
          { role: 'quit' }
        ]
      },
      { role: 'editMenu' },
      {
        label: 'View',
        submenu: [
          { label: 'Zoom In', accelerator: 'Ctrl+=', click: sendZoom('in') },
          { label: 'Zoom Out', accelerator: 'Ctrl+-', click: sendZoom('out') },
          { label: 'Actual Size', accelerator: 'Ctrl+0', click: sendZoom('reset') }
        ]
      },
      { role: 'windowMenu' }
    ])
  )
}
