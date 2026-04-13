'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getRegistrarsForTld } from '@/lib/registrars';
import { TldKey } from '@/types';
import { ORDERED_TLDS } from '@/lib/tlds';

type CheckStatus = 'idle' | 'checking' | 'done';
type DomainResult = { full: string; name: string; tld: TldKey; status: 'available' | 'taken' | 'error' };

function parseDomains(raw: string): { name: string; tld: TldKey }[] {
  return raw
    .split(/[\n,]+/)
    .map((line) => line.trim().toLowerCase())
    .filter(Boolean)
    .map((line) => {
      const tld = ORDERED_TLDS.find((t) => line.endsWith(t));
      if (!tld) return null;
      const name = line.slice(0, line.length - tld.length);
      if (!/^[a-z0-9-]{2,63}$/.test(name)) return null;
      return { name, tld };
    })
    .filter(Boolean) as { name: string; tld: TldKey }[];
}

export default function BulkCheckPage() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<DomainResult[]>([]);
  const [checkStatus, setCheckStatus] = useState<CheckStatus>('idle');
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  async function handleCheck() {
    const domains = parseDomains(input);
    if (domains.length === 0) return;
    if (domains.length > 50) {
      alert('Maximum 50 domeinen per keer.');
      return;
    }

    setCheckStatus('checking');
    setResults([]);
    setProgress({ done: 0, total: domains.length });

    const CONCURRENT = 8;
    const chunks: typeof domains[] = [];
    for (let i = 0; i < domains.length; i += CONCURRENT) {
      chunks.push(domains.slice(i, i + CONCURRENT));
    }

    const allResults: DomainResult[] = [];

    for (const chunk of chunks) {
      const chunkResults = await Promise.all(
        chunk.map(async ({ name, tld }) => {
          try {
            const res = await fetch(`/api/check-domain?name=${encodeURIComponent(name)}&tld=${encodeURIComponent(tld)}`);
            const data = await res.json();
            return { full: `${name}${tld}`, name, tld, status: data.status as DomainResult['status'] };
          } catch {
            return { full: `${name}${tld}`, name, tld, status: 'error' as const };
          }
        })
      );
      allResults.push(...chunkResults);
      setResults([...allResults]);
      setProgress((p) => ({ ...p, done: p.done + chunk.length }));
    }

    setCheckStatus('done');
  }

  const available = results.filter((r) => r.status === 'available');
  const taken = results.filter((r) => r.status === 'taken');

  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(160deg, #EEF2FF 0%, #F6F8FC 50%, #ECFEFF 100%)', borderBottom: '1px solid var(--border)', padding: '48px 0 40px' }}>
        <div className="container mx-auto px-5 max-w-3xl">
          <Link href="/" className="text-sm font-medium link-muted mb-5 inline-block">
            ← Terug naar zoeken
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <span style={{ fontSize: 32 }}>📋</span>
            <h1 className="type-heading" style={{ color: 'var(--text)' }}>Bulk domein check</h1>
          </div>
          <p className="text-sm mb-5" style={{ color: 'var(--text-muted)', maxWidth: 520 }}>
            Plak een lijst met volledige domeinnamen (één per regel of gescheiden door komma&apos;s). Wij controleren ze allemaal tegelijk.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Max 50 domeinen', '8 tegelijk gecheckt', 'Gratis & zonder account', 'Exporteer resultaten'].map(chip => (
              <span key={chip} className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: 'rgba(79,70,229,0.08)', color: 'var(--primary)', border: '1px solid rgba(79,70,229,0.12)' }}>
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

    <div className="container mx-auto px-5 max-w-3xl py-10">

      <div className="space-y-4">
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`bakker.nl\nbakker.com\nmijnbakker.nl\nbakkerijamsterdam.nl`}
            rows={8}
            className="w-full bg-white px-5 py-4 text-sm outline-none resize-none font-mono"
            style={{ color: 'var(--text)' }}
          />
        </div>

        <button
          onClick={handleCheck}
          disabled={checkStatus === 'checking' || !input.trim()}
          className="btn-primary px-8 py-3 text-sm rounded-xl"
          style={{ opacity: checkStatus === 'checking' || !input.trim() ? 0.6 : 1 }}
        >
          {checkStatus === 'checking'
            ? `Controleren… ${progress.done}/${progress.total}`
            : 'Controleer beschikbaarheid'}
        </button>

        {checkStatus === 'checking' && (
          <div
            className="w-full h-1.5 rounded-full overflow-hidden"
            style={{ background: 'rgba(0,0,0,0.07)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-300 progress-glow"
              style={{
                width: `${progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0}%`,
                background: 'linear-gradient(90deg, var(--primary), var(--accent))',
              }}
            />
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="mt-8 space-y-6">
          {/* Available */}
          {available.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold" style={{ color: 'var(--available)' }}>
                  Beschikbaar
                </span>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(5,150,105,0.08)', color: 'var(--available)' }}
                >
                  {available.length}
                </span>
              </div>
              <div className="space-y-2">
                {available.map((r) => {
                  const registrars = getRegistrarsForTld(r.tld);
                  return (
                    <div
                      key={r.full}
                      className="card p-4 available flex flex-wrap items-center justify-between gap-3"
                    >
                      <span className="domain-name font-bold text-sm" style={{ color: 'var(--text)' }}>
                        {r.name}<span style={{ color: 'var(--primary)' }}>{r.tld}</span>
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {registrars.slice(0, 3).map((reg) => (
                          <a
                            key={reg.id}
                            href={reg.affiliateUrl(r.full)}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            className="registrar-btn text-xs"
                          >
                            {reg.name} →
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Taken */}
          {taken.length > 0 && (
            <details>
              <summary className="cursor-pointer text-sm font-medium select-none w-fit" style={{ color: 'var(--text-muted)' }}>
                Toon bezette domeinen ({taken.length})
              </summary>
              <div className="space-y-2 mt-3">
                {taken.map((r) => (
                  <div
                    key={r.full}
                    className="card p-3 taken flex items-center justify-between gap-3"
                  >
                    <span className="domain-name text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                      {r.name}<span>{r.tld}</span>
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444' }}>
                      Bezet
                    </span>
                  </div>
                ))}
              </div>
            </details>
          )}

          {/* Export */}
          {checkStatus === 'done' && available.length > 0 && (
            <button
              onClick={() => navigator.clipboard.writeText(available.map((r) => r.full).join('\n'))}
              className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              style={{ background: 'rgba(79,70,229,0.08)', color: 'var(--primary)' }}
            >
              ⎘ Kopieer beschikbare domeinen
            </button>
          )}
        </div>
      )}

      {checkStatus === 'done' && results.length > 0 && (
        <div
          className="mt-6 flex flex-wrap gap-4 rounded-xl p-4"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 18 }}>✅</span>
            <span className="text-sm font-semibold" style={{ color: 'var(--available)' }}>{available.length} beschikbaar</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 18 }}>🔒</span>
            <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>{taken.length} bezet</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 18 }}>📊</span>
            <span className="text-sm" style={{ color: 'var(--text-subtle)' }}>{results.length} totaal gecontroleerd</span>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
