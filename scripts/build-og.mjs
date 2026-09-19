// Renders og/og.html to public/og.png at 1200x630 — the card LinkedIn, X and
// Slack show when the site is shared. Run with `npm run og`.
//
// Served over http for the same reason the CV is: Chromium refuses
// cross-origin font loads from file://, and a social card in a fallback serif
// defeats the point. Fonts and the portrait are staged from the repo, so the
// render needs no network.

import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { mkdir, copyFile, readFile, rm, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const ogDir = join(root, 'og');
const outPng = join(root, 'public', 'og.png');

const STAGED = [
  ['node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2', 'fonts/newsreader-latin-wght-normal.woff2'],
  ['node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2', 'fonts/ibm-plex-mono-latin-400-normal.woff2'],
  ['node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2', 'fonts/ibm-plex-mono-latin-500-normal.woff2'],
  ['src/assets/portrait.png', 'portrait.png'],
];

const BROWSERS = [
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  process.env.CHROME_PATH,
].filter(Boolean);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
};

async function stage() {
  await mkdir(join(ogDir, 'fonts'), { recursive: true });
  for (const [from, to] of STAGED) {
    const src = join(root, from);
    if (!existsSync(src)) throw new Error(`missing ${from} — run npm install first`);
    await copyFile(src, join(ogDir, to));
  }
}

function serve() {
  const server = createServer(async (req, res) => {
    const path = decodeURIComponent((req.url ?? '/').split('?')[0]);
    // Confine every request to og/ regardless of what the URL asks for.
    const file = resolve(join(ogDir, path === '/' ? 'og.html' : path));
    if (!file.startsWith(ogDir)) return void res.writeHead(403).end();
    try {
      res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
      res.end(await readFile(file));
    } catch {
      res.writeHead(404).end();
    }
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok(server)));
}

function shoot(browser, url) {
  return new Promise((ok, fail) => {
    const child = spawn(browser, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--window-size=1200,630',
      '--virtual-time-budget=10000',
      `--screenshot=${outPng}`,
      url,
    ]);
    child.on('error', fail);
    child.on('exit', (code) => (code === 0 ? ok() : fail(new Error(`${browser} exited ${code}`))));
  });
}

const browser = BROWSERS.find((b) => existsSync(b));
if (!browser) {
  console.error('No Chromium-based browser found. Install Edge or Chrome, or set CHROME_PATH.');
  process.exit(1);
}

await stage();
await mkdir(join(root, 'public'), { recursive: true });
const server = await serve();

try {
  await shoot(browser, `http://127.0.0.1:${server.address().port}/og.html`);
} finally {
  server.close();
  await rm(join(ogDir, 'fonts'), { recursive: true, force: true });
  await rm(join(ogDir, 'portrait.png'), { force: true });
}

const { size } = await stat(outPng);
console.log(`og → public/og.png (1200x630, ${(size / 1024).toFixed(0)} kB)`);
