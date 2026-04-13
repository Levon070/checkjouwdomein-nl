import { NextRequest, NextResponse } from 'next/server';

// Use Netlify Blobs when deployed; fall back to in-memory Map for local dev
let blobStore: import('@netlify/blobs').Store | null = null;

async function getStore() {
  if (blobStore) return blobStore;
  try {
    const { getStore: nb } = await import('@netlify/blobs');
    blobStore = nb({ name: 'watchlist', consistency: 'strong' });
    return blobStore;
  } catch {
    return null;
  }
}

// In-memory fallback for local development
const localStore = new Map<string, WatchSubscription>();

interface WatchSubscription {
  email: string;
  domains: string[];
  createdAt: string;
  lastCheckedAt?: string;
}

const rateMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count++;
  return entry.count > 10;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function validateDomain(domain: string): boolean {
  return /^[a-z0-9-]{2,63}\.[a-z]{2,10}$/.test(domain);
}

async function getSubscription(email: string): Promise<WatchSubscription | null> {
  const store = await getStore();
  if (store) {
    try {
      return (await store.get(email, { type: 'json' })) as WatchSubscription | null;
    } catch {
      return null;
    }
  }
  return localStore.get(email) ?? null;
}

async function saveSubscription(email: string, sub: WatchSubscription): Promise<void> {
  const store = await getStore();
  if (store) {
    await store.set(email, JSON.stringify(sub));
  } else {
    localStore.set(email, sub);
  }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  if (isRateLimited(ip)) return NextResponse.json({ error: 'Te veel verzoeken' }, { status: 429 });

  let email: string, domain: string;
  try {
    const body = await request.json();
    email = body.email?.trim().toLowerCase() ?? '';
    domain = body.domain?.trim().toLowerCase() ?? '';
  } catch {
    return NextResponse.json({ error: 'Ongeldig verzoek' }, { status: 400 });
  }

  if (!validateEmail(email)) return NextResponse.json({ error: 'Ongeldig e-mailadres' }, { status: 400 });
  if (!validateDomain(domain)) return NextResponse.json({ error: 'Ongeldig domein' }, { status: 400 });

  const existing = await getSubscription(email);
  const sub: WatchSubscription = existing ?? { email, domains: [], createdAt: new Date().toISOString() };

  if (!sub.domains.includes(domain)) {
    if (sub.domains.length >= 20) {
      return NextResponse.json({ error: 'Maximum van 20 domeinen per e-mailadres bereikt' }, { status: 400 });
    }
    sub.domains.push(domain);
  }

  await saveSubscription(email, sub);
  return NextResponse.json({ ok: true, domains: sub.domains });
}

export async function DELETE(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  if (isRateLimited(ip)) return NextResponse.json({ error: 'Te veel verzoeken' }, { status: 429 });

  let email: string, domain: string;
  try {
    const body = await request.json();
    email = body.email?.trim().toLowerCase() ?? '';
    domain = body.domain?.trim().toLowerCase() ?? '';
  } catch {
    return NextResponse.json({ error: 'Ongeldig verzoek' }, { status: 400 });
  }

  if (!validateEmail(email)) return NextResponse.json({ error: 'Ongeldig e-mailadres' }, { status: 400 });

  const existing = await getSubscription(email);
  if (!existing) return NextResponse.json({ ok: true, domains: [] });

  existing.domains = existing.domains.filter((d) => d !== domain);
  await saveSubscription(email, existing);
  return NextResponse.json({ ok: true, domains: existing.domains });
}
