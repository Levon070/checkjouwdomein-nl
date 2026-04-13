'use client';

import { useState } from 'react';
import Link from 'next/link';

interface GeneratedName { name: string; rationale: string }
type DomainStatus = 'idle' | 'available' | 'taken' | 'checking' | 'unknown';

interface NameResult extends GeneratedName {
  nlStatus: DomainStatus;
  comStatus: DomainStatus;
}

const SECTORS = [
  'bakkerij', 'restaurant', 'kapper', 'tandarts', 'fysiotherapeut',
  'advocaat', 'accountant', 'makelaar', 'coach', 'webdesigner',
  'fotograaf', 'architect', 'loodgieter', 'elektricien', 'schilder',
  'personal trainer', 'yoga studio', 'dierenarts', 'bloemist', 'catering',
  'software bedrijf', 'marketing bureau', 'bouwbedrijf', 'schoonheidssalon', 'webshop',
];

const STYLES = [
  { value: 'professioneel', label: 'Professioneel', desc: 'Zakelijk & vertrouwen' },
  { value: 'speels',        label: 'Speels',        desc: 'Vriendelijk & laagdrempelig' },
  { value: 'modern',        label: 'Modern',        desc: 'Tech-forward & strak' },
  { value: 'lokaal',        label: 'Lokaal',        desc: 'Herkenbaar & Nederlands' },
  { value: 'internationaal',label: 'Internationaal',desc: 'Werkt in meerdere talen' },
];

async function checkDomain(name: string, tld: string): Promise<DomainStatus> {
  try {
    const res = await fetch(`/api/check-domain?name=${encodeURIComponent(name)}&tld=${encodeURIComponent(tld)}`);
    const data = await res.json();
    return data.status === 'available' ? 'available' : data.status === 'taken' ? 'taken' : 'unknown';
  } catch {
    return 'unknown';
  }
}

function StatusBadge({ status }: { status: DomainStatus }) {
  if (status === 'idle' || status === 'checking') {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg)', color: 'var(--text-subtle)', border: '1px solid var(--border)' }}>
        {status === 'checking' ? '…' : '—'}
      </span>
    );
  }
  const cfg = {
    available: { bg: 'rgba(5,150,105,0.08)', color: 'var(--available)', border: 'rgba(5,150,105,0.2)', label: '✓ Vrij' },
    taken:     { bg: 'rgba(220,38,38,0.07)', color: '#EF4444',          border: 'rgba(220,38,38,0.18)',  label: '✗ Bezet' },
    unknown:   { bg: 'rgba(0,0,0,0.04)',     color: 'var(--text-subtle)', border: 'var(--border)',       label: '?' },
  }[status];
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
      {cfg.label}
    </span>
  );
}

export default function NaamGeneratorPage() {
  const [sector, setSector] = useState('');
  const [style, setStyle] = useState('professioneel');
  const [maxLen, setMaxLen] = useState(12);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<NameResult[]>([]);
  const [error, setError] = useState('');

  async function handleGenerate() {
    const s = sector.trim();
    if (!s || s.length < 2) return;
    setGenerating(true);
    setResults([]);
    setError('');

    try {
      const res = await fetch(`/api/generate-names?sector=${encodeURIComponent(s)}&style=${style}&maxLen=${maxLen}`);
      if (!res.ok) { setError('Genereren mislukt. Probeer het opnieuw.'); setGenerating(false); return; }
      const data = await res.json();
      const names: GeneratedName[] = data.names ?? [];

      // Show names immediately, check domains in background
      const initial: NameResult[] = names.map(n => ({ ...n, nlStatus: 'checking', comStatus: 'checking' }));
      setResults(initial);
      setGenerating(false);

      // Check .nl and .com for each name concurrently
      await Promise.all(
        names.map(async (n, i) => {
          const [nl, com] = await Promise.all([
            checkDomain(n.name, '.nl'),
            checkDomain(n.name, '.com'),
          ]);
          setResults(prev => prev.map((r, idx) => idx === i ? { ...r, nlStatus: nl, comStatus: com } : r));
        })
      );
    } catch {
      setError('Er ging iets mis. Controleer je verbinding en probeer opnieuw.');
      setGenerating(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Hero */}
      <div className="text-center px-4 pt-16 pb-10" style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.06) 0%, rgba(16,185,129,0.03) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
          style={{ background: 'rgba(79,70,229,0.08)', color: 'var(--primary)', border: '1px solid rgba(79,70,229,0.15)' }}>
          ✦ AI-aangedreven
        </div>
        <h1 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
          AI <span style={{ color: 'var(--primary)' }}>Naamgenerator</span>
        </h1>
        <p className="text-base max-w-xl mx-auto mb-8" style={{ color: 'var(--text-muted)' }}>
          Nog geen naam? Vertel ons je sector en stijl — wij genereren 12 merknamen en checken direct de beschikbaarheid.
        </p>
        {/* How it works strip */}
        <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
          {[
            { icon: '⌨️', label: 'Voer sector in' },
            { icon: '✦',  label: 'AI genereert 12 namen' },
            { icon: '✓',  label: 'Domeinen direct gecheckt' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(79,70,229,0.15)', backdropFilter: 'blur(8px)' }}>
              <span>{s.icon}</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-2xl pb-20">
        {/* Generator form */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          {/* Sector input */}
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
              Jouw sector of type bedrijf
            </label>
            <input
              type="text"
              value={sector}
              onChange={e => setSector(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleGenerate(); }}
              placeholder="bijv. bakkerij, webshop, coaching"
              className="w-full px-4 py-3 rounded-xl text-sm"
              style={{ border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', outline: 'none' }}
            />
            {/* Quick sector pills */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {SECTORS.slice(0, 10).map(s => (
                <button
                  key={s}
                  onClick={() => setSector(s)}
                  className="text-xs px-2.5 py-1 rounded-full transition-colors"
                  style={{
                    background: sector === s ? 'var(--primary)' : 'var(--bg)',
                    color: sector === s ? '#fff' : 'var(--text-subtle)',
                    border: `1px solid ${sector === s ? 'var(--primary)' : 'var(--border)'}`,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Style picker */}
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
              Stijl van het merk
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {STYLES.map(s => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  className="px-3 py-2.5 rounded-xl text-xs font-medium text-center transition-all"
                  style={{
                    background: style === s.value ? 'rgba(79,70,229,0.1)' : 'var(--bg)',
                    color: style === s.value ? 'var(--primary)' : 'var(--text-muted)',
                    border: `1.5px solid ${style === s.value ? 'var(--primary)' : 'var(--border)'}`,
                  }}
                >
                  <div className="font-semibold">{s.label}</div>
                  <div className="text-xs mt-0.5 opacity-70">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Max length slider */}
          <div className="mb-6">
            <label className="flex items-center justify-between text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
              <span>Maximale naamlengte</span>
              <span style={{ color: 'var(--primary)' }}>{maxLen} tekens</span>
            </label>
            <input
              type="range" min={6} max={20} value={maxLen}
              onChange={e => setMaxLen(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: 'var(--primary)' }}
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-subtle)' }}>
              <span>6 (kort)</span><span>13 (ideaal)</span><span>20 (lang)</span>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating || !sector.trim()}
            className="w-full py-3 rounded-xl font-bold text-sm transition-opacity"
            style={{ background: 'var(--primary)', color: '#fff', opacity: generating || !sector.trim() ? 0.6 : 1 }}
          >
            {generating ? 'AI genereert namen…' : '✦ Genereer 12 merknamen →'}
          </button>
        </div>

        {error && (
          <div className="text-sm text-center mb-4" style={{ color: '#EF4444' }}>{error}</div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold" style={{ color: 'var(--text-subtle)' }}>
              12 gegenereerde namen voor &ldquo;{sector}&rdquo;
            </h2>
            {results.map((r) => (
              <div
                key={r.name}
                className="rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-base" style={{ color: 'var(--text)' }}>{r.name}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>.nl</span>
                      <StatusBadge status={r.nlStatus} />
                      <span className="text-xs ml-1" style={{ color: 'var(--text-subtle)' }}>.com</span>
                      <StatusBadge status={r.comStatus} />
                    </div>
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{r.rationale}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link
                    href={`/merk-check?name=${encodeURIComponent(r.name)}`}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                    style={{ background: 'rgba(79,70,229,0.08)', color: 'var(--primary)', border: '1px solid rgba(79,70,229,0.15)', textDecoration: 'none' }}
                  >
                    Volledige merkencheck →
                  </Link>
                </div>
              </div>
            ))}

            <div className="text-center pt-4">
              <button
                onClick={handleGenerate}
                className="text-sm font-medium px-4 py-2 rounded-lg transition-opacity hover:opacity-70"
                style={{ background: 'var(--bg)', color: 'var(--primary)', border: '1px solid var(--border)' }}
              >
                ↻ Genereer andere namen
              </button>
            </div>
          </div>
        )}

        {/* Example preview (only when idle and no results) */}
        {results.length === 0 && !generating && (
          <div className="mt-8">
            <p className="text-xs font-semibold mb-3 text-center" style={{ color: 'var(--text-subtle)' }}>
              Voorbeeld resultaat voor &ldquo;bakkerij&rdquo;
            </p>
            <div className="space-y-2 opacity-60 pointer-events-none select-none">
              {[
                { name: 'BakkersBram', nl: 'available', com: 'taken' },
                { name: 'VerseBollen',  nl: 'available', com: 'available' },
                { name: 'BakShop',      nl: 'taken',     com: 'available' },
              ].map((r) => (
                <div key={r.name} className="rounded-xl px-4 py-3 flex items-center justify-between"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>{r.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>.nl</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: r.nl === 'available' ? 'rgba(5,150,105,0.08)' : 'rgba(220,38,38,0.07)', color: r.nl === 'available' ? '#059669' : '#EF4444' }}>
                      {r.nl === 'available' ? '✓ Vrij' : '✗ Bezet'}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>.com</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: r.com === 'available' ? 'rgba(5,150,105,0.08)' : 'rgba(220,38,38,0.07)', color: r.com === 'available' ? '#059669' : '#EF4444' }}>
                      {r.com === 'available' ? '✓ Vrij' : '✗ Bezet'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 grid grid-cols-2 gap-3">
          <Link href="/" className="text-center text-sm font-semibold py-3 rounded-xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)', textDecoration: 'none' }}>
            ← Domeincheck
          </Link>
          <Link href="/merk-check" className="text-center text-sm font-semibold py-3 rounded-xl"
            style={{ background: 'rgba(79,70,229,0.06)', border: '1px solid rgba(79,70,229,0.15)', color: 'var(--primary)', textDecoration: 'none' }}>
            Merkencheck →
          </Link>
        </div>

        {/* Tips section */}
        <div className="mt-12">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4 text-center" style={{ color: 'var(--text-subtle)' }}>
            Tips voor een sterke merknaam
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: '✂️', title: 'Houd het kort', desc: 'Maximaal 12 tekens — makkelijker te onthouden en te typen.' },
              { icon: '🔤', title: 'Geen koppeltekens', desc: 'Vermijd streepjes en cijfers; die zorgen voor verwarring bij mondeling doorgeven.' },
              { icon: '🌍', title: 'Controleer de .nl én .com', desc: 'Registreer beide als ze beschikbaar zijn — voorkomt verwarring bij bezoekers.' },
              { icon: '™️', title: 'Check het merkenregister', desc: 'Zorg dat de naam niet al als Europees merk geregistreerd is via de EUIPO-check.' },
            ].map(tip => (
              <div key={tip.title} className="flex gap-3 rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <span className="text-xl shrink-0">{tip.icon}</span>
                <div>
                  <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text)' }}>{tip.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{tip.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
