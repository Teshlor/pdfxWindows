# PDFx

**One file. Many documents. Still a PDF.**

PDFx is a Windows desktop application for bundling many documents into a single, backwards-compatible PDF file.

A `.pdfx` file remains a valid PDF: it opens normally in standard PDF viewers with all pages in sequence. Open it in PDFx to recover the original document groups. Plain PDFs are supported too.

Drag `.pdf` or `.pdfx` files into the application. Each document is shown as a horizontal strip of pages, documents stack vertically, and you can reorder or remove them before exporting a `.pdfx` collection.

## Windows x64

PDFx is developed, tested, and packaged for Windows x64 only.

```bash
yarn
yarn dev
yarn build:win
```

`yarn build:win` writes the NSIS installer to `dist/`.

## Format

See [SPEC.md](SPEC.md) for the small embedded-manifest format specification.

## License

MIT
