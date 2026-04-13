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

/** Check DNS NS records via Cloudflare DoH — used to detect recently-dropped domains */
async function hasDnsRecords(domain: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=NS`,
      { headers: { Accept: 'application/dns-json' }, signal: controller.signal }
    );
    clearTimeout(timer);
    if (!res.ok) return false;
    const data = await res.json();
    return data.Status === 0 && Array.isArray(data.Answer) && data.Answer.length > 0;
  } catch {
    return false;
  }
}

/** Check A/AAAA records — if a domain resolves, it's definitely in use */
async function hasARecords(domain: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const [resA, resAAAA] = await Promise.all([
      fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=A`,
        { headers: { Accept: 'application/dns-json' }, signal: controller.signal }),
      fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=AAAA`,
        { headers: { Accept: 'application/dns-json' }, signal: controller.signal }),
    ]);
    clearTimeout(timer);
    const [dataA, dataAAAA] = await Promise.all([resA.json(), resAAAA.json()]);
    return (
      (dataA.Status === 0 && Array.isArray(dataA.Answer) && dataA.Answer.length > 0) ||
      (dataAAAA.Status === 0 && Array.isArray(dataAAAA.Answer) && dataAAAA.Answer.length > 0)
    );
  } catch {
    return false;
  }
}

/** Check MX records — proxy for "actively used as email" */
async function hasMxRecords(domain: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`,
      { headers: { Accept: 'application/dns-json' }, signal: controller.signal }
    );
    clearTimeout(timer);
    if (!res.ok) return false;
    const data = await res.json();
    return data.Status === 0 && Array.isArray(data.Answer) && data.Answer.length > 0;
  } catch {
    return false;
  }
}

/** Fetch Wayback Machine archive info for dropped domains */
async function fetchWayback(domain: string): Promise<{
  snapshots: number;
  firstYear: number;
  oldestUrl: string;
} | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(
      `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(domain)}&output=json&limit=100&fl=timestamp&fastLatest=true`,
      { signal: controller.signal }
    );
    clearTimeout(timer);
    if (!res.ok) return null;
    const rows = await res.json() as string[][];
    // First row is the header ["timestamp"]
    const dataRows = rows.slice(1);
    if (dataRows.length === 0) return null;
    const snapshots = dataRows.length;
    const oldest = dataRows[dataRows.length - 1]?.[0] ?? '';
    const firstYear = oldest.length >= 4 ? parseInt(oldest.slice(0, 4), 10) : new Date().getFullYear();
    const oldestUrl = `https://web.archive.org/web/${oldest}/${domain}`;
    return { snapshots, firstYear, oldestUrl };
  } catch {
    return null;
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

  const domain = `${name}${tld}`;
  const result = await checkDomainAvailability(name, tld);

  let wasDropped = false;
  let hasMx: boolean | undefined;
  let wayback: { snapshots: number; firstYear: number; oldestUrl: string } | undefined;

  if (result.status === 'available') {
    // Check DNS — if the domain has A/NS records it's still in use despite RDAP 404
    const [hasNs, hasA] = await Promise.all([hasDnsRecords(domain), hasARecords(domain)]);

    if (hasA) {
      // Active website — treat as taken regardless of RDAP
      result.status = 'taken';
      hasMx = await hasMxRecords(domain);
    } else if (hasNs) {
      // Has nameservers but no A record — recently dropped, flag it
      wasDropped = true;
      wayback = (await fetchWayback(domain)) ?? undefined;
    }
  } else if (result.status === 'taken') {
    // For taken domains: check MX records to detect parked domains
    hasMx = await hasMxRecords(domain);
  }

  return NextResponse.json(
    { ...result, wasDropped, hasMx, wayback },
    {
      headers: {
        'Cache-Control':
          result.status === 'available'
            ? 's-maxage=60, stale-while-revalidate=30'
            : 's-maxage=3600, stale-while-revalidate=600',
      },
    }
  );
}
