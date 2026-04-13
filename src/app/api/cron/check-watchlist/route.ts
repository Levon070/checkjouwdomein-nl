import { NextRequest, NextResponse } from 'next/server';
import { checkDomainAvailability } from '@/lib/rdap-checker';
import { domainAvailableEmail } from '@/lib/email-templates';

// This route is called by Netlify's scheduled functions (see netlify.toml)
// Also callable manually via GET for testing

async function getStore() {
  try {
    const { getStore: nb } = await import('@netlify/blobs');
    return nb({ name: 'watchlist', consistency: 'strong' });
  } catch {
    return null;
  }
}

async function sendEmail(to: string, domain: string) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { subject, html, text } = domainAvailableEmail(domain);
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'meldingen@checkjouwdomein.nl',
      to,
      subject,
      html,
      text,
    });
  } catch (err) {
    console.error('[watchlist-cron] Email error:', err);
  }
}

export async function GET(request: NextRequest) {
  // Simple secret check to prevent abuse when called manually
  const secret = request.headers.get('x-cron-secret') ?? request.nextUrl.searchParams.get('secret');
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const store = await getStore();
  if (!store) {
    return NextResponse.json({ ok: true, message: 'Geen store beschikbaar (lokale dev)' });
  }

  const { blobs } = await store.list();
  let checked = 0;
  let notified = 0;

  for (const blob of blobs) {
    try {
      const sub = await store.get(blob.key, { type: 'json' }) as {
        email: string;
        domains: string[];
        lastCheckedAt?: string;
      };

      if (!sub?.email || !Array.isArray(sub.domains)) continue;

      const stillTaken: string[] = [];
      for (const domain of sub.domains) {
        const [name, ...tldParts] = domain.split('.');
        const tld = '.' + tldParts.join('.');
        try {
          const result = await checkDomainAvailability(name, tld as import('@/types').TldKey);
          if (result.status === 'available') {
            await sendEmail(sub.email, domain);
            notified++;
          } else {
            stillTaken.push(domain);
          }
          checked++;
        } catch {
          stillTaken.push(domain);
        }
      }

      // Update subscription — remove notified domains
      sub.domains = stillTaken;
      sub.lastCheckedAt = new Date().toISOString();
      await store.set(blob.key, JSON.stringify(sub));
    } catch (err) {
      console.error('[watchlist-cron] Error processing blob:', blob.key, err);
    }
  }

  return NextResponse.json({ ok: true, checked, notified });
}
