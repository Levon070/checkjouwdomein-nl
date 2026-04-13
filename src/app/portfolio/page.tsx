'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { REGISTRARS } from '@/lib/registrars';
import type { TldKey } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PortfolioDomain {
  id: string;
  full: string;
  name: string;
  tld: string;
  registrar: string;      // registrar id
  expiresAt: string;      // ISO date string
  annualCost: number;     // in euros
  addedAt: string;
}

const STORAGE_KEY = 'cjd_portfolio';

function readPortfolio(): PortfolioDomain[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writePortfolio(domains: PortfolioDomain[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(domains));
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function daysUntil(iso: string): number {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
}

function fmt(n: number): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n);
}

function urgencyColor(days: number): string {
  if (days <= 30) return '#EF4444';
  if (days <= 90) return '#D97706';
  return 'var(--text-muted)';
}

// ─── Savings suggestion ───────────────────────────────────────────────────────

function cheaperRenewal(d: PortfolioDomain): { name: string; price: number; save: number } | null {
  const current = REGISTRARS.find(r => r.id === d.registrar);
  const currentPrice = current?.detailedPrices[d.tld as TldKey]?.renewalRaw ?? d.annualCost;

  const cheaper = REGISTRARS
    .filter(r => r.id !== d.registrar && r.supportedTlds.includes(d.tld as TldKey))
    .map(r => ({ r, price: r.detailedPrices[d.tld as TldKey]?.renewalRaw ?? 999 }))
    .filter(x => x.price < currentPrice - 0.5)
    .sort((a, b) => a.price - b.price)[0];

  if (!cheaper) return null;
  return { name: cheaper.r.name, price: cheaper.price, save: currentPrice - cheaper.price };
}

// ─── Add domain form ──────────────────────────────────────────────────────────

function AddForm({ onAdd }: { onAdd: (d: PortfolioDomain) => void }) {
  const [full, setFull] = useState('');
  const [registrar, setRegistrar] = useState(REGISTRARS[0].id);
  const [expiresAt, setExpiresAt] = useState('');
  const [annualCost, setAnnualCost] = useState('');
  const [error, setError] = useState('');

  function handleAdd() {
    const cleaned = full.trim().toLowerCase();
    if (!cleaned.includes('.') || cleaned.length < 4) { setError('Voer een geldig domein in (bijv. mijnbedrijf.nl)'); return; }
    if (!expiresAt) { setError('Verloopdatum is verplicht'); return; }

    const dot = cleaned.indexOf('.');
    const name = cleaned.slice(0, dot);
    const tld = cleaned.slice(dot);

    onAdd({
      id: `${cleaned}-${Date.now()}`,
      full: cleaned,
      name,
      tld,
      registrar,
      expiresAt: new Date(expiresAt).toISOString(),
      annualCost: parseFloat(annualCost) || 0,
      addedAt: new Date().toISOString(),
    });

    setFull(''); setExpiresAt(''); setAnnualCost(''); setError('');
  }

  return (
    <div className="rounded-2xl p-5 mb-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <h2 className="text-sm font-bold mb-4" style={{ color: 'var(--text)' }}>+ Domein toevoegen</h2>
      {error && <p className="text-xs mb-3" style={{ color: '#EF4444' }}>{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Domeinnaam</label>
          <input
            type="text" value={full} onChange={e => setFull(e.target.value)}
            placeholder="mijnbedrijf.nl"
            className="w-full px-3 py-2 rounded-lg text-sm"
            style={{ border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', outline: 'none' }}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Registrar</label>
          <select
            value={registrar} onChange={e => setRegistrar(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm"
            style={{ border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', outline: 'none' }}
          >
            {REGISTRARS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            <option value="other">Andere registrar</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Verloopdatum</label>
          <input
            type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm"
            style={{ border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', outline: 'none' }}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Jaarlijkse kosten (€)</label>
          <input
            type="number" value={annualCost} onChange={e => setAnnualCost(e.target.value)}
            placeholder="3.99" step="0.01" min="0"
            className="w-full px-3 py-2 rounded-lg text-sm"
            style={{ border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', outline: 'none' }}
          />
        </div>
      </div>
      <button
        onClick={handleAdd}
        className="mt-4 px-5 py-2 rounded-lg text-sm font-bold transition-opacity hover:opacity-85"
        style={{ background: 'var(--primary)', color: '#fff' }}
      >
        Toevoegen →
      </button>
    </div>
  );
}

// ─── Expiry reminder form ─────────────────────────────────────────────────────

function ReminderForm({ domains }: { domains: PortfolioDomain[] }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const expiring = domains.filter(d => daysUntil(d.expiresAt) <= 90);

  if (domains.length === 0) return null;

  return (
    <div className="rounded-2xl p-5 mt-6" style={{ background: 'rgba(79,70,229,0.04)', border: '1px solid rgba(79,70,229,0.15)' }}>
      <h2 className="text-sm font-bold mb-1" style={{ color: 'var(--text)' }}>
        🔔 Verloopreminderservice
      </h2>
      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
        Ontvang 30 dagen voor verloopdatum een gratis herinnering per e-mail.
        {expiring.length > 0 && <> Je hebt <strong>{expiring.length} domein(en)</strong> die binnen 90 dagen verlopen.</>}
      </p>
      {submitted ? (
        <p className="text-sm font-medium" style={{ color: 'var(--available)' }}>✓ Aangemeld! Je ontvangt reminders 30 dagen voor verloopdatum.</p>
      ) : (
        <form
          name="portfolio-reminder"
          method="POST"
          data-netlify="true"
          action="/bedankt"
          onSubmit={() => setSubmitted(true)}
          className="flex gap-2"
        >
          <input type="hidden" name="form-name" value="portfolio-reminder" />
          <input type="hidden" name="domains" value={domains.map(d => d.full).join(', ')} />
          <input
            type="email" name="email" required
            value={email} onChange={e => setEmail(e.target.value)}
            placeholder="jouw@email.nl"
            className="flex-1 px-3 py-2 rounded-lg text-sm"
            style={{ border: '1.5px solid rgba(79,70,229,0.2)', background: 'var(--bg)', color: 'var(--text)', outline: 'none' }}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-sm font-bold transition-opacity hover:opacity-85"
            style={{ background: 'var(--primary)', color: '#fff' }}
          >
            Aanmelden →
          </button>
        </form>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PortfolioPage() {
  const [domains, setDomains] = useState<PortfolioDomain[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setDomains(readPortfolio());
    setLoaded(true);
  }, []);

  const addDomain = useCallback((d: PortfolioDomain) => {
    setDomains(prev => {
      if (prev.find(x => x.full === d.full)) return prev;
      const next = [d, ...prev];
      writePortfolio(next);
      return next;
    });
  }, []);

  const removeDomain = useCallback((id: string) => {
    setDomains(prev => {
      const next = prev.filter(d => d.id !== id);
      writePortfolio(next);
      return next;
    });
  }, []);

  const totalCost = domains.reduce((s, d) => s + d.annualCost, 0);
  const totalSavings = domains.reduce((s, d) => {
    const sug = cheaperRenewal(d);
    return s + (sug?.save ?? 0);
  }, 0);
  const expiringSoon = domains.filter(d => daysUntil(d.expiresAt) <= 30);
  const sorted = [...domains].sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime());

  if (!loaded) return null;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Hero */}
      <div className="text-center px-4 pt-14 pb-8">
        <h1 className="text-3xl sm:text-4xl font-black mb-2" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
          Mijn <span style={{ color: 'var(--primary)' }}>domeinportefeuille</span>
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Houd je domeinen bij — zonder account, volledig gratis
        </p>
      </div>

      <div className="container mx-auto px-4 max-w-3xl pb-20">
        {/* Stats row */}
        {domains.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Domeinen', value: String(domains.length), color: 'var(--text)' },
              { label: 'Jaarlijkse kosten', value: fmt(totalCost), color: 'var(--text)' },
              { label: 'Verlopen ≤ 30 dgn', value: String(expiringSoon.length), color: expiringSoon.length > 0 ? '#EF4444' : 'var(--available)' },
              { label: 'Potentiële besparing', value: totalSavings > 0 ? fmt(totalSavings) : '—', color: totalSavings > 0 ? 'var(--available)' : 'var(--text-subtle)' },
            ].map(stat => (
              <div key={stat.label} className="rounded-xl p-4 text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="text-lg font-black" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Expiry warnings */}
        {expiringSoon.length > 0 && (
          <div className="rounded-xl p-4 mb-5" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <p className="text-sm font-semibold" style={{ color: '#EF4444' }}>
              ⚠️ {expiringSoon.length} domein(en) verlopen binnen 30 dagen:
            </p>
            <ul className="mt-1 text-xs space-y-0.5" style={{ color: '#DC2626' }}>
              {expiringSoon.map(d => (
                <li key={d.id}>{d.full} — nog {daysUntil(d.expiresAt)} dagen</li>
              ))}
            </ul>
          </div>
        )}

        {/* Add form */}
        <AddForm onAdd={addDomain} />

        {/* Domain list */}
        {sorted.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
            <div className="text-4xl mb-3">🗂️</div>
            <p className="text-sm">Nog geen domeinen toegevoegd. Begin hierboven.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-sm font-bold" style={{ color: 'var(--text-subtle)' }}>
              {domains.length} domeinen — gesorteerd op verloopdatum
            </h2>
            {sorted.map(d => {
              const days = daysUntil(d.expiresAt);
              const saving = cheaperRenewal(d);
              const reg = REGISTRARS.find(r => r.id === d.registrar);

              return (
                <div key={d.id} className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-base" style={{ color: 'var(--text)' }}>{d.full}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg)', color: 'var(--text-subtle)', border: '1px solid var(--border)' }}>
                          {reg?.name ?? d.registrar}
                        </span>
                      </div>

                      <p className="text-xs mt-1" style={{ color: urgencyColor(days) }}>
                        {days <= 0
                          ? '⚠️ Verlopen!'
                          : days <= 30
                          ? `⚠️ Verloopt over ${days} dagen (${fmtDate(d.expiresAt)})`
                          : days <= 90
                          ? `⏰ Verloopt over ${days} dagen (${fmtDate(d.expiresAt)})`
                          : `Verloopt: ${fmtDate(d.expiresAt)}`}
                      </p>

                      {d.annualCost > 0 && (
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {fmt(d.annualCost)}/jaar
                          {saving && (
                            <span style={{ color: 'var(--available)' }}>
                              {' '}— bespaar {fmt(saving.save)}/jaar bij {saving.name} ({fmt(saving.price)}/jr)
                            </span>
                          )}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {reg && (
                        <a
                          href={reg.affiliateUrl(d.full)}
                          target="_blank" rel="noopener noreferrer sponsored"
                          className="text-xs px-3 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-80"
                          style={{ background: 'var(--primary)', color: '#fff', textDecoration: 'none' }}
                        >
                          Verleng →
                        </a>
                      )}
                      <button
                        onClick={() => removeDomain(d.id)}
                        className="text-xs px-2 py-1.5 rounded-lg transition-opacity hover:opacity-70"
                        style={{ background: 'var(--bg)', color: 'var(--text-subtle)', border: '1px solid var(--border)' }}
                        aria-label={`Verwijder ${d.full}`}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Reminder form */}
        <ReminderForm domains={domains} />

        <div className="text-center mt-10 text-xs" style={{ color: 'var(--text-subtle)' }}>
          <Link href="/" style={{ color: 'var(--primary)' }}>← Zoek nieuwe domeinen</Link>
          {' · '}
          <span>Alle data wordt alleen in jouw browser opgeslagen — geen account nodig</span>
        </div>
      </div>
    </div>
  );
}
