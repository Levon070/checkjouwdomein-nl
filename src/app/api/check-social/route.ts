import { NextRequest, NextResponse } from 'next/server';

/**
 * Check if a social media handle is available on Instagram and X/Twitter.
 * We use a lightweight HEAD request to the public profile URL.
 * 404 = available, 200/redirect = taken.
 *
 * NOTE: Social platforms may block server-side requests or return 200 even for
 * non-existent profiles (login walls). Results are best-effort — users should
 * verify manually via the provided links.
 */

const requestCounts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count++;
  return entry.count > 30;
}

async function checkHandle(url: string): Promise<'available' | 'taken' | 'unknown'> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DomainChecker/1.0)',
      },
      redirect: 'follow',
    });
    clearTimeout(timer);
    if (res.status === 404) return 'available';
    if (res.status === 200) return 'taken';
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Rate limited' }, { status: 429 });
  }

  const handle = request.nextUrl.searchParams.get('handle');
  if (!handle || !/^[a-z0-9_.-]{1,30}$/.test(handle)) {
    return NextResponse.json({ error: 'Ongeldig handle' }, { status: 400 });
  }

  const [instagram, twitter] = await Promise.all([
    checkHandle(`https://www.instagram.com/${handle}/`),
    checkHandle(`https://x.com/${handle}`),
  ]);

  return NextResponse.json(
    {
      handle,
      instagram,
      twitter,
      instagramUrl: `https://www.instagram.com/${handle}/`,
      twitterUrl: `https://x.com/${handle}`,
    },
    {
      headers: { 'Cache-Control': 's-maxage=3600' },
    }
  );
}
