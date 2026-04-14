'use client';

import { useState } from 'react';
import { ChevronRight, BarChart2, Bell, Zap, TrendingUp } from 'lucide-react';
import { ShinyButton } from '@/components/ui/ShinyButton';

const FEATURES = [
  { icon: BarChart2, label: 'Portfolio monitoring' },
  { icon: Bell,      label: 'E-mail alerts' },
  { icon: Zap,       label: 'Bulk RDAP checks' },
  { icon: TrendingUp, label: 'Domeinwaarde tracking' },
];

export default function CtaSection() {
  const [submitted, setSubmitted] = useState(false);

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
      className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
    >
      <div
        className="p-8 sm:p-12"
        style={{
          background: 'linear-gradient(135deg, rgba(79,70,229,0.04) 0%, rgba(6,182,212,0.04) 100%)',
          borderLeft: '4px solid var(--primary)',
        }}
      >
        <div className="max-w-2xl">
          {/* Badge */}
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
            style={{ background: 'rgba(79,70,229,0.08)', color: 'var(--primary)', border: '1px solid rgba(79,70,229,0.15)' }}
          >
            ✦ Binnenkort: CheckJouwDomein Pro
          </span>

          <h2
            className="text-2xl font-bold mb-3"
            style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
          >
            Nooit meer een domein missen
          </h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
            Met CheckJouwDomein Pro monitor je domeinen, vergelijk je bulk-pakketten
            en krijg je alerts zodra een naam vrijkomt.
          </p>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-3 mb-8">
            {FEATURES.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
                style={{
                  background: 'rgba(79,70,229,0.06)',
                  color: 'var(--text-muted)',
                  border: '1px solid rgba(79,70,229,0.10)',
                }}
              >
                <Icon size={12} style={{ color: 'var(--primary)' }} />
                {label}
              </span>
            ))}
          </div>

          {/* Form or success */}
          {submitted ? (
            <div className="flex items-center gap-3">
              <span
                className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
                style={{ background: 'rgba(5,150,105,0.1)', color: 'var(--available)' }}
              >
                ✓
              </span>
              <div>
                <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>Je staat op de lijst!</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  We sturen je een e-mail zodra Pro beschikbaar is.
                </p>
              </div>
            </div>
          ) : (
            <>
              <form
                name="pro-waitlist"
                method="POST"
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-2 max-w-sm"
              >
                <input type="hidden" name="form-name" value="pro-waitlist" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="jouw@email.nl"
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm outline-none"
                  style={{
                    border: '1.5px solid var(--border)',
                    color: 'var(--text)',
                    background: 'var(--bg)',
                  }}
                />
                <ShinyButton
                  type="submit"
                  className="inline-flex items-center gap-1.5 justify-center px-5 py-2.5 text-sm font-semibold whitespace-nowrap"
                >
                  Aanmelden
                  <ChevronRight size={14} />
                </ShinyButton>
              </form>
              <p className="text-xs mt-3" style={{ color: 'var(--text-subtle)' }}>
                Gratis · Geen spam · Uitschrijven wanneer je wilt
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
