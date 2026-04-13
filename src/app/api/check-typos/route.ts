import { NextRequest, NextResponse } from 'next/server';
import { generateTypos } from '@/lib/typo-generator';
import { checkDomainAvailability } from '@/lib/rdap-checker';

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

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for') ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Te veel verzoeken' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword') ?? '';

  if (!keyword || keyword.length < 2 || keyword.length > 63) {
    return NextResponse.json({ error: 'Ongeldig trefwoord' }, { status: 400 });
  }

  const typos = generateTypos(keyword);
  const tlds = ['.nl', '.com'] as const;

  // Fan out RDAP checks for all typo×tld combos concurrently
  const checks = typos.flatMap((name) =>
    tlds.map(async (tld) => {
      try {
        const result = await checkDomainAvailability(name, tld);
        return { domain: `${name}${tld}`, status: result.status };
      } catch {
        return { domain: `${name}${tld}`, status: 'error' as const };
      }
    })
  );

  const results = await Promise.all(checks);

  const taken    = results.filter((r) => r.status === 'taken').map((r) => r.domain);
  const available = results.filter((r) => r.status === 'available').map((r) => r.domain);

  return NextResponse.json(
    { taken, available },
    { headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=600' } }
  );
}
