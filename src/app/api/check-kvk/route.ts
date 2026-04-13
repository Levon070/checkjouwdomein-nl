import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

const rateMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count++;
  return entry.count > 20;
}

interface KvkResult {
  found: boolean | null; // null = no API key (link-only fallback)
  count: number | null;
  kvkUrl: string;
}

async function fetchKvkData(name: string): Promise<KvkResult> {
  const kvkSearchUrl = `https://www.kvk.nl/zoeken/?source=all&q=${encodeURIComponent(name)}`;

  if (!process.env.KVK_API_KEY) {
    return { found: null, count: null, kvkUrl: kvkSearchUrl };
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(
      `https://api.kvk.nl/api/v2/zoeken?handelsnaam=${encodeURIComponent(name)}&resultatenPerPagina=5`,
      {
        headers: { apikey: process.env.KVK_API_KEY },
        signal: controller.signal,
      }
    );
    clearTimeout(timer);

    if (!res.ok) {
      return { found: null, count: null, kvkUrl: kvkSearchUrl };
    }

    const data = await res.json();
    const count = data.data?.totaal ?? 0;
    return { found: count > 0, count, kvkUrl: kvkSearchUrl };
  } catch {
    return { found: null, count: null, kvkUrl: kvkSearchUrl };
  }
}

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for') ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Te veel verzoeken' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name')?.trim().toLowerCase() ?? '';

  if (!name || name.length < 2 || name.length > 60) {
    return NextResponse.json({ error: 'Ongeldige naam' }, { status: 400 });
  }

  const getCached = unstable_cache(
    () => fetchKvkData(name),
    ['check-kvk', name],
    { revalidate: 86400 }
  );

  const result = await getCached();
  return NextResponse.json(result);
}
