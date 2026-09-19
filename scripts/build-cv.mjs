// Renders cv/cv.html to public/destiny-erhabor-cv.pdf, which is what every
// Resume control on the site points at. Run with `npm run cv`.
//
// The page is served over http rather than opened as a file:// URL, because
// Chromium refuses cross-origin font loads from file://, and a CV that silently
// falls back to Times is worse than no CV. Fonts are copied out of node_modules
// so the render needs no network and no Google Fonts.
//
// Exits non-zero if the result is not exactly two pages. That limit is the
// point — trim the CV, do not raise it.

import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { mkdir, copyFile, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const cvDir = join(root, 'cv');
const fontDir = join(cvDir, 'fonts');
// `npm run cv` builds the public CV into public/, where the site links it.
// Anything else builds into cv/out/, which is gitignored — variants and letters
// are aimed at one application each and have no business on the website.
//
//   npm run cv                      cv/cv.html               -> public/
//   npm run cv -- oss               cv/cv-oss.html           -> cv/out/
//   npm run cv -- letter-riverlane  cv/letter-riverlane.html -> cv/out/
const variant = process.argv[2]?.replace(/[^a-z0-9-]/gi, '');
const isLetter = Boolean(variant?.startsWith('letter-'));

// A CV may run to two pages. A cover letter that runs to two is not a cover
// letter, so the limit tightens rather than the page count growing.
const MAX_PAGES = isLetter ? 1 : 2;

const source = !variant ? 'cv.html' : isLetter ? `${variant}.html` : `cv-${variant}.html`;
const outPdf = !variant
  ? join(root, 'public', 'destiny-erhabor-cv.pdf')
  : join(cvDir, 'out', `destiny-erhabor-${isLetter ? variant : `cv-${variant}`}.pdf`);

const FONTS = [
  ['@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2', 'newsreader-latin-wght-normal.woff2'],
  ['@fontsource-variable/newsreader/files/newsreader-latin-wght-italic.woff2', 'newsreader-latin-wght-italic.woff2'],
  ['@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2', 'ibm-plex-mono-latin-400-normal.woff2'],
  ['@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2', 'ibm-plex-mono-latin-500-normal.woff2'],
];

const BROWSERS = [
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  process.env.CHROME_PATH,
].filter(Boolean);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.woff2': 'font/woff2',
};

async function stageFonts() {
  await mkdir(fontDir, { recursive: true });
  for (const [from, to] of FONTS) {
    const src = join(root, 'node_modules', from);
    if (!existsSync(src)) throw new Error(`missing font ${from} — run npm install`);
    await copyFile(src, join(fontDir, to));
  }
}

function serve() {
  const server = createServer(async (req, res) => {
    const path = decodeURIComponent((req.url ?? '/').split('?')[0]);
    // Confine every request to cv/ regardless of what the URL asks for.
    const file = resolve(join(cvDir, path === '/' ? source : path));
    if (!file.startsWith(cvDir)) {
      res.writeHead(403).end();
      return;
    }
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok(server)));
}

function render(browser, url) {
  return new Promise((ok, fail) => {
    const child = spawn(browser, [
      '--headless=new',
      '--disable-gpu',
      '--no-pdf-header-footer',
      '--virtual-time-budget=10000',
      `--print-to-pdf=${outPdf}`,
      url,
    ]);
    child.on('error', fail);
    child.on('exit', (code) => (code === 0 ? ok() : fail(new Error(`${browser} exited ${code}`))));
  });
}

/** Chromium writes one uncompressed `/Type /Page` object per page. */
async function pageCount(path) {
  const pdf = await readFile(path, 'latin1');
  return (pdf.match(/\/Type\s*\/Page[^s]/g) ?? []).length;
}

const browser = BROWSERS.find((b) => existsSync(b));
if (!browser) {
  console.error('No Chromium-based browser found. Install Edge or Chrome, or set CHROME_PATH.');
  process.exit(1);
}

await stageFonts();
if (!existsSync(join(cvDir, source))) {
  console.error(`No such CV source: cv/${source}`);
  process.exit(1);
}
await mkdir(dirname(outPdf), { recursive: true });
const server = await serve();
const { port } = server.address();

try {
  await render(browser, `http://127.0.0.1:${port}/${source}`);
} finally {
  server.close();
  await rm(fontDir, { recursive: true, force: true });
}

const pages = await pageCount(outPdf);
const size = (await readFile(outPdf)).length;
console.log(`${source} → ${outPdf.replace(root + '/', '')} (${pages} pages, ${(size / 1024).toFixed(0)} kB)`);

if (pages > MAX_PAGES) {
  console.error(`\nToo long: ${pages} pages, limit is ${MAX_PAGES}. Trim cv/${source}.`);
  process.exit(1);
}
