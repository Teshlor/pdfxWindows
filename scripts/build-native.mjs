if (process.platform !== 'win32') {
  console.error('PDFx is supported on Windows only.')
  process.exit(1)
}
