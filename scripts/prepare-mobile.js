const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'mobile-web');

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
fs.cpSync(path.join(root, 'renderer'), output, { recursive: true });
fs.cpSync(path.join(root, 'assests'), path.join(output, 'assests'), { recursive: true });
fs.mkdirSync(path.join(output, 'vendor'), { recursive: true });
fs.copyFileSync(path.join(root, 'node_modules', 'mammoth', 'mammoth.browser.min.js'), path.join(output, 'vendor', 'mammoth.browser.min.js'));
fs.copyFileSync(path.join(root, 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.mjs'), path.join(output, 'vendor', 'pdf.mjs'));
fs.copyFileSync(path.join(root, 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.mjs'), path.join(output, 'vendor', 'pdf.worker.mjs'));

for (const file of ['index.html', 'style.css']) {
  const target = path.join(output, file);
  const contents = fs.readFileSync(target, 'utf8').replaceAll('../assests/', 'assests/');
  fs.writeFileSync(target, contents, 'utf8');
}

console.log('Prepared mobile web assets in mobile-web.');
