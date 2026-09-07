# DocOP Electron - Upload & Scan

Quick prototype Electron app that:
- lets users select/upload documents
- extracts text from common formats (PDF, DOCX, TXT)
- scans for the keyword "objectives" and records surrounding text
- links uploaded documents to a calendar date (upload date)

Requirements:
- Node.js 18+ recommended

Setup:
1. In the project folder run:

```bash
npm install
```

2. Copy the image you showed me into `assets/hero.jpg` (create `assets` folder) so the hero area shows it.

Run in production:

```bash
npm start
```

Run in development (hot-reload):

```bash
npm run dev
```

Notes and limitations:
- This prototype extracts text for PDF (using `pdf-parse`) and DOCX (using `mammoth`) and plain text files.
- OCR for images is not implemented yet. OCR (Optical Character Recognition) converts images of text into machine-readable text — useful for scans, photos, or screenshots. We can add OCR using Tesseract (native or `tesseract.js`) to extract text from images and PDFs containing images.
- The app stores upload metadata in the Electron `userData` folder in `uploads.json`.
- We will integrate Gemini later for semantic processing as requested.
