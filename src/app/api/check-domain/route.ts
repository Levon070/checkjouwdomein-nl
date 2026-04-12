import { NextRequest, NextResponse } from 'next/server';
import { checkDomainAvailability } from '@/lib/rdap-checker';
import { TldKey } from '@/types';
import { ORDERED_TLDS } from '@/lib/tlds';

// In-memory rate limiting (per serverless invocation — resets on cold start)
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_MINUTE = 120;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count++;
  return entry.count > MAX_REQUESTS_PER_MINUTE;
}

/** Check DNS records via Cloudflare DoH — used to detect recently-dropped domains */
async function hasDnsRecords(domain: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=NS`,
      {
        headers: { Accept: 'application/dns-json' },
        signal: controller.signal,
      }
    );
    clearTimeout(timer);
    if (!res.ok) return false;
    const data = await res.json();
    // Status 0 = NOERROR with answers means active DNS
    return data.Status === 0 && Array.isArray(data.Answer) && data.Answer.length > 0;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Te veel verzoeken. Probeer later opnieuw.' },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const tld = searchParams.get('tld') as TldKey | null;

  if (!name || !tld) {
    return NextResponse.json({ error: 'name en tld zijn verplicht' }, { status: 400 });
  }

  if (!ORDERED_TLDS.includes(tld)) {
    return NextResponse.json({ error: 'Ongeldig TLD' }, { status: 400 });
  }

  if (!/^[a-z0-9-]{2,63}$/.test(name)) {
    return NextResponse.json({ error: 'Ongeldige domeinnaam' }, { status: 400 });
  }

  const result = await checkDomainAvailability(name, tld);

  // For available domains: check if it has DNS records (= recently dropped)
  let wasDropped = false;
  if (result.status === 'available') {
    wasDropped = await hasDnsRecords(`${name}${tld}`);
  }

  return NextResponse.json(
    { ...result, wasDropped },
    {
      headers: {
        'Cache-Control':
          result.status === 'available'
            ? 's-maxage=300, stale-while-revalidate=60'
            : 's-maxage=3600, stale-while-revalidate=600',
      },
    }
  );
}
