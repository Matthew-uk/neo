// /app/api/scrape-qea/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import puppeteer from 'puppeteer';

/**
 * Simple sanitizer for the `href` fragment that will be appended to:
 *  https://connect.pierapps.com/${href}
 *
 * Allowed characters: letters, digits, -, _, / .
 * Reject if contains protocol, host, backreferences, or suspicious patterns.
 */
function sanitizeHref(raw?: string | null): string | null {
  if (!raw) return null;

  const trimmed = raw.trim();

  // Disallow absolute URLs, protocol, or leading double slashes
  if (/^https?:\/\//i.test(trimmed) || /^\/\//.test(trimmed)) return null;

  // Disallow parent-traversal segments
  if (trimmed.includes('..')) return null;

  // Only allow a safe subset of characters commonly found in path segments
  // and require at least one non-empty segment
  if (!/^[A-Za-z0-9\-_.\/]+$/.test(trimmed)) return null;

  // Prevent starting with a slash to keep behavior predictable; allow if user included it
  const normalized = trimmed.replace(/^\/+/, '');

  // limit length to prevent abuse
  if (normalized.length === 0 || normalized.length > 200) return null;

  return normalized;
}

export async function GET(req: NextRequest) {
  try {
    // Read href from query param ?href=widgets/agencies/982
    const { searchParams } = new URL(req.url);
    const hrefParam = searchParams.get('href');

    // Optional: if you decide to change route to a catch-all route,
    // you could read the path segments instead. For now we use query param.
    const safeHref = sanitizeHref(hrefParam);

    if (!safeHref) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing href parameter' },
        { status: 400 },
      );
    }

    const target = `https://connect.pierapps.com/${safeHref}`;

    // Launch puppeteer - add common args for linux/container environments.
    // If deploying to serverless you may need chrome-aws-lambda or a remote browser instead.
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      // Uncomment and set executablePath if you need a specific chrome binary:
      // executablePath: process.env.CHROME_PATH || undefined,
    });

    let page;
    try {
      page = await browser.newPage();

      // Optional: set user agent & viewport to mimic a desktop browser
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      );
      await page.setViewport({ width: 1366, height: 768 });

      // Navigate with a sensible timeout and waitUntil strategy
      await page.goto(target, { waitUntil: 'networkidle2', timeout: 30_000 });

      // Example extraction: gather visible text nodes with length > 40 (same as your original)
      const data = await page.evaluate(() => {
        // Find visible text in the document
        const nodes = Array.from(document.querySelectorAll('body *'));
        return nodes
          .map((el) => el.textContent?.trim())
          .filter((t) => t && t.length > 40);
      });

      return NextResponse.json({ success: true, count: data.length, data });
    } finally {
      // ensure page/browser closed in every scenario
      try {
        if (page && !page.isClosed()) await page.close();
      } catch (e) {
        // ignore
      }
      try {
        if (browser) await browser.close();
      } catch (e) {
        // ignore
      }
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
