import 'server-only';

import puppeteer, { type Browser, type Page } from 'puppeteer';
import type { ExportRequest } from '@/types/certificate';

/** A4 landscape at 96 dpi, matching `certificate.css`. */
const CERTIFICATE_WIDTH = 1123;
const CERTIFICATE_HEIGHT = 794;

const PNG_SCALE = 3;
const MAX_CONCURRENT_RENDERS = 2;

// Containers have no setuid sandbox and a tiny /dev/shm.
const LAUNCH_ARGS = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
];

// Kept on globalThis so dev hot reloads reuse one Chrome instead of leaking more.
const exportGlobals = globalThis as typeof globalThis & {
  certificateBrowser?: Promise<Browser>;
};

/** The shared Chrome, launched once and relaunched only after it disconnects. */
export function getBrowser(): Promise<Browser> {
  if (!exportGlobals.certificateBrowser) {
    const launching = puppeteer.launch({ args: LAUNCH_ARGS });
    const forget = () => {
      if (exportGlobals.certificateBrowser === launching) {
        exportGlobals.certificateBrowser = undefined;
      }
    };
    exportGlobals.certificateBrowser = launching;
    launching.then((browser) => browser.on('disconnected', forget), forget);
  }
  return exportGlobals.certificateBrowser;
}

let activeRenders = 0;
const waitingRenders: (() => void)[] = [];

async function acquireRenderSlot() {
  if (activeRenders < MAX_CONCURRENT_RENDERS) {
    activeRenders++;
    return;
  }
  await new Promise<void>((resolve) => waitingRenders.push(resolve));
}

function releaseRenderSlot() {
  // Hand the slot straight to the next waiter, so the count stays the same.
  const next = waitingRenders.shift();
  if (next) next();
  else activeRenders--;
}

// Chrome always talks to this server directly, never to the request's Host.
function renderPageUrl() {
  return `http://localhost:${process.env.PORT ?? 3000}/render`;
}

async function withCertificatePage<T>(
  data: ExportRequest,
  deviceScaleFactor: number,
  render: (page: Page) => Promise<T>
): Promise<T> {
  await acquireRenderSlot();
  let page: Page | undefined;
  try {
    const browser = await getBrowser();
    page = await browser.newPage();
    await page.setViewport({
      width: CERTIFICATE_WIDTH,
      height: CERTIFICATE_HEIGHT,
      deviceScaleFactor,
    });
    await page.evaluateOnNewDocument((certificate) => {
      window.__CERTIFICATE__ = certificate;
    }, data);
    await page.goto(renderPageUrl(), { waitUntil: 'load' });
    await page.waitForSelector('[data-render-ready]');
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    // The Next.js dev indicator overlays the corner in `next dev`; absent in production.
    await page.addStyleTag({
      content: 'nextjs-portal { display: none !important; }',
    });
    return await render(page);
  } finally {
    // A crashed browser cannot close its pages; the render error is what matters.
    await page?.close().catch(() => {});
    releaseRenderSlot();
  }
}

export function renderCertificatePdf(data: ExportRequest) {
  return withCertificatePage(data, 1, (page) =>
    page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      // The sheet is ~0.5px wider than A4, which would spill onto a blank page 2.
      pageRanges: '1',
    })
  );
}

export function renderCertificatePng(data: ExportRequest) {
  return withCertificatePage(data, PNG_SCALE, async (page) => {
    const certificate = await page.$('.cert');
    if (!certificate) throw new Error('The render page has no certificate.');
    return certificate.screenshot({ type: 'png' });
  });
}
