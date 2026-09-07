# DocOP Electron

Quick prototype Electron app that:
- lets users select/upload documents
- extracts text from common formats (PDF, DOCX, TXT)
- scans for the keyword "objectives" and records surrounding text
- links uploaded documents to a calendar date (upload date)

Requirements:
- Node.js 18+ recommended
- Windows, macOS, or Linux with Electron support

Setup:
1. In the project folder run:

```bash
npm install
```

2. AI generation is optional. If you have your own credentials, copy `.env.example` to `.env` and fill in the values locally. Never share or commit `.env`.

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
- The app stores upload metadata, extracted text, generated study packs, and OSCE progress in the current OS user's Electron `userData` folder.
- The Account profile is local UI data only; it is not authentication and does not sync between users or devices.
- A clean install starts with no documents or saved progress. Local data does not travel with the project folder, but another person using the same OS account/profile can see that account's existing Electron data.
- Gemini and Cloudflare are optional. Without valid configuration, the app uses local document-derived fallbacks where available.
- Uploaded files are processed locally first and may be sent to configured AI providers when generation features are used. Do not upload confidential patient or personal data.
- The app accepts PDF, DOCX, TXT, and MD files up to 25 MB each. OCR for images is not implemented.
- There is currently no packaged installer or automated test suite. For a tester checkout, run `npm ci` followed by `npm start`.
