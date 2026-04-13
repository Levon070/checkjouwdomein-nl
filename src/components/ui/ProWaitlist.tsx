'use client';

import { useState } from 'react';

interface Props {
  compact?: boolean;
  context?: 'domain-saved' | 'search' | 'default';
}

const COPY: Record<NonNullable<Props['context']>, { headline: string; sub: string }> = {
  'domain-saved': {
    headline: 'Wil je een alert als dit domein vrijkomt?',
    sub: 'Pro geeft je dagelijkse RDAP-checks + e-mail notificaties voor domeinen op je watchlist.',
  },
  'search': {
    headline: 'Nooit meer een domein missen',
    sub: 'Met CheckJouwDomein Pro monitor je domeinen, vergelijk je bulk-pakketten en krijg je alerts zodra een naam vrijkomt.',
  },
  'default': {
    headline: 'Wil je vroeg toegang tot Pro?',
    sub: 'Portfolio-monitoring, bulk-RDAP, e-mail alerts en meer — meld je aan voor de wachtlijst.',
  },
};

export default function ProWaitlist({ compact = false, context = 'default' }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const copy = COPY[context];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      setSubmitted(true);
    } catch {
      form.submit();
    }
  }

  return (
    <section
      className={`rounded-2xl text-center ${compact ? 'p-5' : 'p-8 sm:p-12'}`}
      style={{
        background: 'linear-gradient(135deg, rgba(79,70,229,0.05) 0%, rgba(6,182,212,0.05) 100%)',
        border: '1px solid rgba(79,70,229,0.12)',
      }}
    >
      <span
        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-4"
        style={{ background: 'rgba(79,70,229,0.08)', color: 'var(--primary)', border: '1px solid rgba(79,70,229,0.15)' }}
      >
        ✦ Binnenkort: CheckJouwDomein Pro
      </span>

      {submitted ? (
        <div className="py-4">
          <p className="text-2xl mb-2">✓</p>
          <p className="font-bold" style={{ color: 'var(--text)' }}>Je staat op de lijst!</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            We sturen je een e-mail zodra Pro beschikbaar is.
          </p>
        </div>
      ) : (
        <>
          <h2
            className={`font-bold mb-2 ${compact ? 'text-base' : 'text-xl'}`}
            style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
          >
            {copy.headline}
          </h2>
          <p
            className={`mb-6 mx-auto max-w-md ${compact ? 'text-xs' : 'text-sm'}`}
            style={{ color: 'var(--text-muted)' }}
          >
            {copy.sub}
          </p>

          {!compact && (
            <div className="flex flex-wrap justify-center gap-4 mb-6 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span>📊 Portfolio monitoring</span>
              <span>📬 E-mail alerts</span>
              <span>⚡ Bulk RDAP checks</span>
              <span>📈 Domeinwaarde tracking</span>
            </div>
          )}

          <form
            name="pro-waitlist"
            method="POST"
            data-netlify="true"
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto"
          >
            <input type="hidden" name="form-name" value="pro-waitlist" />
            <input
              type="email"
              name="email"
              required
              placeholder="jouw@email.nl"
              className="flex-1 px-4 py-2.5 rounded-lg text-sm outline-none"
              style={{ border: '1.5px solid var(--border)', color: 'var(--text)', background: 'white' }}
            />
            <button type="submit" className="btn-primary px-5 py-2.5 text-sm rounded-lg whitespace-nowrap">
              Aanmelden →
            </button>
          </form>
          <p className="text-xs mt-3" style={{ color: 'var(--text-subtle)' }}>
            Gratis · Geen spam · Uitschrijven wanneer je wilt
          </p>
        </>
      )}
    </section>
  );
}
