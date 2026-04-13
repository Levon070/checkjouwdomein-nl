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
  return entry.count > 15;
}

interface EuipoMatch {
  trademark: string;
  status: string;
  owner: string;
}

interface EuipoResult {
  hasMatch: boolean;
  matches: EuipoMatch[];
  detailUrl: string;
}

async function fetchEuipoData(name: string): Promise<EuipoResult> {
  const detailUrl = `https://euipo.europa.eu/eSearch/#basic/1+1+1+1/${encodeURIComponent(name)}`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(
      `https://euipo.europa.eu/eSearch/rest/trademarks?text=${encodeURIComponent(name)}&pageSize=5&pageNumber=1&basicSearchFilter=TM_WORD_MARK`,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'CheckJouwDomein.nl/1.0',
        },
        signal: controller.signal,
      }
    );
    clearTimeout(timer);

    if (!res.ok) {
      return { hasMatch: false, matches: [], detailUrl };
    }

    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const list: any[] = data?.trademarks?.trademarkSummaryList ?? data?.results?.trademarkSummaryList ?? [];

    if (!list.length) {
      return { hasMatch: false, matches: [], detailUrl };
    }

    const matches: EuipoMatch[] = list.slice(0, 3).map((item) => ({
      trademark: item.wordMark ?? item.trademarkName ?? name,
      status: item.markCurrentStatusCode ?? item.status ?? 'Onbekend',
      owner:
        item.applicantList?.[0]?.name ??
        item.holderList?.[0]?.name ??
        'Onbekend',
    }));

    return { hasMatch: true, matches, detailUrl };
  } catch {
    return { hasMatch: false, matches: [], detailUrl };
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
    () => fetchEuipoData(name),
    ['check-euipo', name],
    { revalidate: 86400 }
  );

  const result = await getCached();
  return NextResponse.json(result);
}
