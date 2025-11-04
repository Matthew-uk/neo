// /app/api/scrape-qea/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

/* sanitizeHref unchanged - keep your function */
function sanitizeHref(raw?: string | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (/^https?:\/\//i.test(trimmed) || /^\/\//.test(trimmed)) return null;
  if (trimmed.includes('..')) return null;
  if (!/^[A-Za-z0-9\-_.\/]+$/.test(trimmed)) return null;
  const normalized = trimmed.replace(/^\/+/, '');
  if (normalized.length === 0 || normalized.length > 200) return null;
  return normalized;
}

/** Look for common chrome/chromium executable paths on linux/mac/windows (synchronous) */
function findChromeExecutable(): string | null {
  const candidates = [
    // common Linux
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/snap/bin/chromium',
    // common Debian pkg path
    '/usr/local/bin/chromium',
    // macOS
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    // Windows (WSL / path style)
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ];

  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return p;
    } catch (e) {
      // ignore errors checking paths
    }
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const hrefParam = searchParams.get('href');
    const safeHref = sanitizeHref(hrefParam);

    if (!safeHref) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing href parameter' },
        { status: 400 },
      );
    }

    const target = `https://connect.pierapps.com/${safeHref}`;

    // Launch options common for containerized environments
    const baseLaunchOptions: Parameters<typeof puppeteer.launch>[0] = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
      // dev: set product if needed: product: 'chrome' or 'firefox'
    };

    let browser;
    let launchError: any = null;

    // First attempt: normal launch (this will use whatever chromium puppeteer manages)
    try {
      browser = await puppeteer.launch({ ...baseLaunchOptions });
    } catch (err) {
      launchError = err;
    }

    // If first attempt failed, try to find a system chrome and relaunch with executablePath
    if (!browser) {
      const envPath = process.env.CHROME_PATH || process.env.CHROMIUM_PATH;
      const candidate = envPath || findChromeExecutable();
      if (candidate) {
        try {
          browser = await puppeteer.launch({
            ...baseLaunchOptions,
            executablePath: candidate,
          });
        } catch (err) {
          launchError = err;
        }
      }
    }

    // If still no browser, respond with a helpful error pointing to remediation steps
    if (!browser) {
      console.error('Puppeteer launch failed:', launchError);
      const details = [
        'Puppeteer could not find a Chromium/Chrome binary to run.',
        'If you are running locally, run: `npx puppeteer browsers install chrome` or reinstall node_modules.',
        'If you are in Docker/CI, install chromium in your image and set the CHROME_PATH env var to the binary path.',
        'If you are on serverless (Vercel/Lambda) you should use puppeteer-core + a compatible chromium build (e.g. chrome-aws-lambda) or Playwright and follow their deployment guides.',
        `Error message: ${
          (launchError && launchError.message) || String(launchError)
        }`,
      ].join(' ');
      return NextResponse.json(
        { success: false, error: 'Scraping failed', details },
        { status: 500 },
      );
    }

    let page;
    try {
      page = await browser.newPage();
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      );
      await page.setViewport({ width: 1366, height: 768 });

      await page.goto(target, { waitUntil: 'networkidle2', timeout: 30_000 });

      const data = await page.evaluate(() => {
        const nodes = Array.from(document.querySelectorAll('body *'));
        return nodes
          .map((el) => el.textContent?.trim())
          .filter((t) => t && t.length > 40);
      });

      return NextResponse.json({ success: true, count: data.length, data });
    } finally {
      try {
        if (page && !page.isClosed()) await page.close();
      } catch (e) {}
      try {
        if (browser) await browser.close();
      } catch (e) {}
    }
  } catch (error) {
    console.error('Scrape API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Scraping failed',
        details: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
