'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { scoreDomain } from '@/lib/domain-scorer';
import { TldKey } from '@/types';

interface GeneratedName { name: string; rationale: string }
type DomainStatus = 'idle' | 'available' | 'taken' | 'checking' | 'unknown';

interface NameResult extends GeneratedName {
  nlStatus:  DomainStatus;
  comStatus: DomainStatus;
  euStatus:  DomainStatus;
  score:     number;
}

const SECTORS = [
  'bakkerij', 'restaurant', 'kapper', 'tandarts', 'fysiotherapeut',
  'advocaat', 'accountant', 'makelaar', 'coach', 'webdesigner',
  'fotograaf', 'architect', 'loodgieter', 'elektricien', 'schilder',
  'personal trainer', 'yoga studio', 'dierenarts', 'bloemist', 'catering',
  'software bedrijf', 'marketing bureau', 'bouwbedrijf', 'schoonheidssalon', 'webshop',
];

const STYLES = [
  { value: 'professioneel',  label: 'Professioneel', desc: 'Zakelijk & vertrouwen' },
  { value: 'speels',         label: 'Speels',        desc: 'Vriendelijk & laagdrempelig' },
  { value: 'modern',         label: 'Modern',        desc: 'Tech-forward & strak' },
  { value: 'lokaal',         label: 'Lokaal',        desc: 'Herkenbaar & Nederlands' },
  { value: 'internationaal', label: 'Internationaal',desc: 'Werkt in meerdere talen' },
];

const REGISTRAR_URL = (name: string, tld: string) =>
  `https://www.transip.nl/domeinnamen/registreer/?domain=${encodeURIComponent(name + tld)}`;

async function checkDomain(name: string, tld: string): Promise<DomainStatus> {
  try {
    const res = await fetch(`/api/check-domain?name=${encodeURIComponent(name)}&tld=${encodeURIComponent(tld)}`);
    const data = await res.json();
    return data.status === 'available' ? 'available' : data.status === 'taken' ? 'taken' : 'unknown';
  } catch {
    return 'unknown';
  }
}

function StatusPill({ tld, status }: { tld: string; status: DomainStatus }) {
  if (status === 'checking') return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
      style={{ background: 'var(--bg)', color: 'var(--text-subtle)', border: '1px solid var(--border)' }}>
      <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--text-subtle)' }} />
      {tld}
    </span>
  );
  if (status === 'available') return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{ background: 'rgba(5,150,105,0.1)', color: 'var(--available)', border: '1px solid rgba(5,150,105,0.2)' }}>
      ✓ {tld}
    </span>
  );
  if (status === 'taken') return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
      style={{ background: 'rgba(220,38,38,0.06)', color: '#EF4444', border: '1px solid rgba(220,38,38,0.15)' }}>
      ✗ {tld}
    </span>
  );
  return null;
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? '#059669' : score >= 60 ? '#D97706' : 'var(--text-subtle)';
  const label = score >= 80 ? 'Uitstekend' : score >= 60 ? 'Goed' : 'Redelijk';
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{ background: `${color}18`, color }}>
      {label}
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }
  return (
    <button onClick={copy} title="Kopieer naam"
      className="text-xs px-2.5 py-1.5 rounded-lg transition-all"
      style={{ background: copied ? 'rgba(5,150,105,0.1)' : 'var(--bg)', color: copied ? 'var(--available)' : 'var(--text-subtle)', border: '1px solid var(--border)' }}>
      {copied ? '✓' : '⧉'}
    </button>
  );
}

export default function NaamGeneratorPage() {
  const [sector,   setSector]   = useState('');
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [style,    setStyle]    = useState('professioneel');
  const [maxLen,   setMaxLen]   = useState(12);
  const [onlyNlFree, setOnlyNlFree] = useState(false);
  const [generating,  setGenerating]  = useState(false);
  const [results,     setResults]     = useState<NameResult[]>([]);
  const [refineTarget, setRefineTarget] = useState<string | null>(null);
  const [error,       setError]        = useState('');

  async function handleGenerate(refineName?: string) {
    const s = refineName ? `variaties van "${refineName}" voor een ${sector}-bedrijf` : sector.trim();
    if (!s || s.length < 2) return;
    setGenerating(true);
    setResults([]);
    setError('');
    setRefineTarget(refineName ?? null);

    const params = new URLSearchParams({
      sector: s,
      style,
      maxLen: String(maxLen),
      ...(keywords ? { keywords } : {}),
      ...(location ? { location } : {}),
    });

    try {
      const res = await fetch(`/api/generate-names?${params}`);
      if (!res.ok) { setError('Genereren mislukt. Probeer het opnieuw.'); setGenerating(false); return; }
      const data = await res.json();
      const names: GeneratedName[] = data.names ?? [];

      const initial: NameResult[] = names.map(n => ({
        ...n,
        nlStatus:  'checking',
        comStatus: 'checking',
        euStatus:  'checking',
        score: scoreDomain(n.name, '.nl' as TldKey, refineName ?? sector.trim()).score,
      }));
      setResults(initial);
      setGenerating(false);

      // Check .nl, .com, .eu concurrently per name
      await Promise.all(
        names.map(async (n, i) => {
          const [nl, com, eu] = await Promise.all([
            checkDomain(n.name, '.nl'),
            checkDomain(n.name, '.com'),
            checkDomain(n.name, '.eu'),
          ]);
          setResults(prev => prev.map((r, idx) =>
            idx === i ? { ...r, nlStatus: nl, comStatus: com, euStatus: eu } : r
          ));
        })
      );
    } catch {
      setError('Er ging iets mis. Controleer je verbinding en probeer opnieuw.');
      setGenerating(false);
    }
  }

  // Sort: .nl available first, then by score
  const sorted = useMemo(() => {
    return [...results].sort((a, b) => {
      const aFree = a.nlStatus === 'available' ? 1 : 0;
      const bFree = b.nlStatus === 'available' ? 1 : 0;
      if (aFree !== bFree) return bFree - aFree;
      return b.score - a.score;
    });
  }, [results]);

  const displayed = onlyNlFree
    ? sorted.filter(r => r.nlStatus === 'available' || r.nlStatus === 'checking')
    : sorted;

  const nlFreeCount = results.filter(r => r.nlStatus === 'available').length;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Hero */}
      <div className="text-center px-4 pt-16 pb-10"
        style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.06) 0%, rgba(16,185,129,0.03) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
          style={{ background: 'rgba(79,70,229,0.08)', color: 'var(--primary)', border: '1px solid rgba(79,70,229,0.15)' }}>
          ✦ AI-aangedreven
        </div>
        <h1 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
          AI <span style={{ color: 'var(--primary)' }}>Naamgenerator</span>
        </h1>
        <p className="text-base max-w-xl mx-auto mb-8" style={{ color: 'var(--text-muted)' }}>
          Nog geen naam? Vertel ons je sector en stijl — wij genereren 15 merkwaardige namen en checken direct .nl, .com én .eu.
        </p>
        <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
          {[
            { icon: '⌨️', label: 'Omschrijf je bedrijf' },
            { icon: '✦',  label: 'AI genereert 15 namen' },
            { icon: '✓',  label: '.nl .com .eu gecheckt' },
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
        <div className="rounded-2xl p-6 mb-6 mt-8" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>

          {/* Sector */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text)' }}>
              Sector of type bedrijf <span style={{ color: '#EF4444' }}>*</span>
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
            <div className="flex flex-wrap gap-1.5 mt-2">
              {SECTORS.slice(0, 12).map(s => (
                <button key={s} onClick={() => setSector(s)}
                  className="text-xs px-2.5 py-1 rounded-full transition-colors"
                  style={{
                    background: sector === s ? 'var(--primary)' : 'var(--bg)',
                    color: sector === s ? '#fff' : 'var(--text-subtle)',
                    border: `1px solid ${sector === s ? 'var(--primary)' : 'var(--border)'}`,
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text)' }}>
              Kernwoorden / USP
              <span className="ml-2 text-xs font-normal" style={{ color: 'var(--text-subtle)' }}>optioneel</span>
            </label>
            <input
              type="text"
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              placeholder="bijv. ambachtelijk, biologisch, snel, luxe"
              className="w-full px-4 py-3 rounded-xl text-sm"
              style={{ border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', outline: 'none' }}
            />
          </div>

          {/* Location */}
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text)' }}>
              Locatie / regio
              <span className="ml-2 text-xs font-normal" style={{ color: 'var(--text-subtle)' }}>optioneel</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="bijv. Amsterdam, Utrecht, landelijk"
              className="w-full px-4 py-3 rounded-xl text-sm"
              style={{ border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', outline: 'none' }}
            />
          </div>

          {/* Style picker */}
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
              Stijl van het merk
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {STYLES.map(s => (
                <button key={s.value} onClick={() => setStyle(s.value)}
                  className="px-3 py-2.5 rounded-xl text-xs font-medium text-center transition-all"
                  style={{
                    background: style === s.value ? 'rgba(79,70,229,0.1)' : 'var(--bg)',
                    color: style === s.value ? 'var(--primary)' : 'var(--text-muted)',
                    border: `1.5px solid ${style === s.value ? 'var(--primary)' : 'var(--border)'}`,
                  }}>
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
            <input type="range" min={6} max={20} value={maxLen}
              onChange={e => setMaxLen(Number(e.target.value))}
              className="w-full" style={{ accentColor: 'var(--primary)' }} />
            <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-subtle)' }}>
              <span>6 (kort)</span><span>12 (ideaal)</span><span>20 (lang)</span>
            </div>
          </div>

          <button
            onClick={() => handleGenerate()}
            disabled={generating || !sector.trim()}
            className="w-full py-3 rounded-xl font-bold text-sm transition-opacity"
            style={{ background: 'var(--primary)', color: '#fff', opacity: generating || !sector.trim() ? 0.6 : 1 }}>
            {generating ? 'AI genereert namen…' : '✦ Genereer 15 merknamen →'}
          </button>
        </div>

        {error && (
          <div className="text-sm text-center mb-4" style={{ color: '#EF4444' }}>{error}</div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            {/* Header + filter */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                {refineTarget
                  ? `Variaties van "${refineTarget}"`
                  : `${results.length} namen voor "${sector}"`}
                {nlFreeCount > 0 && (
                  <span className="ml-2 font-normal text-xs" style={{ color: 'var(--available)' }}>
                    — {nlFreeCount}× .nl vrij
                  </span>
                )}
              </h2>
              <button
                onClick={() => setOnlyNlFree(v => !v)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                style={{
                  background: onlyNlFree ? 'rgba(5,150,105,0.12)' : 'var(--bg)',
                  color: onlyNlFree ? 'var(--available)' : 'var(--text-muted)',
                  border: `1.5px solid ${onlyNlFree ? 'rgba(5,150,105,0.3)' : 'var(--border)'}`,
                }}>
                {onlyNlFree ? '✓ Alleen .nl vrij' : 'Toon alleen .nl vrij'}
              </button>
            </div>

            {displayed.map((r) => {
              const nlFree  = r.nlStatus  === 'available';
              const comFree = r.comStatus === 'available';
              const euFree  = r.euStatus  === 'available';
              const anyFree = nlFree || comFree || euFree;
              return (
                <div key={r.name}
                  className="rounded-xl p-4"
                  style={{
                    background: nlFree ? 'rgba(5,150,105,0.03)' : 'var(--surface)',
                    border: `1px solid ${nlFree ? 'rgba(5,150,105,0.2)' : 'var(--border)'}`,
                  }}>
                  {/* Name row */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-base" style={{ color: 'var(--text)' }}>{r.name}</span>
                      <ScoreBadge score={r.score} />
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <CopyButton text={r.name} />
                      <button
                        onClick={() => handleGenerate(r.name)}
                        title="Genereer variaties op deze naam"
                        className="text-xs px-2.5 py-1.5 rounded-lg transition-all"
                        style={{ background: 'var(--bg)', color: 'var(--text-subtle)', border: '1px solid var(--border)' }}>
                        ↺ Verfijn
                      </button>
                    </div>
                  </div>

                  {/* Availability pills */}
                  <div className="flex items-center gap-1.5 flex-wrap mb-2">
                    <StatusPill tld=".nl"  status={r.nlStatus}  />
                    <StatusPill tld=".com" status={r.comStatus} />
                    <StatusPill tld=".eu"  status={r.euStatus}  />
                  </div>

                  {/* Rationale */}
                  <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>{r.rationale}</p>

                  {/* Action row */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {anyFree && (
                      <a href={REGISTRAR_URL(r.name, nlFree ? '.nl' : comFree ? '.com' : '.eu')}
                        target="_blank" rel="noopener noreferrer"
                        className="text-xs font-bold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                        style={{ background: 'var(--primary)', color: '#fff', textDecoration: 'none' }}>
                        Registreer {nlFree ? '.nl' : comFree ? '.com' : '.eu'} →
                      </a>
                    )}
                    <Link href={`/merk-check?name=${encodeURIComponent(r.name)}`}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                      style={{ background: 'rgba(79,70,229,0.08)', color: 'var(--primary)', border: '1px solid rgba(79,70,229,0.15)', textDecoration: 'none' }}>
                      Merkencheck →
                    </Link>
                    <Link href={`/?q=${encodeURIComponent(r.name)}`}
                      className="text-xs px-3 py-1.5 rounded-lg"
                      style={{ color: 'var(--text-subtle)', border: '1px solid var(--border)', textDecoration: 'none' }}>
                      Alle extensies →
                    </Link>
                  </div>
                </div>
              );
            })}

            {/* Regen / back buttons */}
            <div className="flex gap-3 pt-2">
              <button onClick={() => handleGenerate()}
                className="flex-1 text-sm font-medium py-2.5 rounded-lg transition-opacity hover:opacity-70"
                style={{ background: 'var(--bg)', color: 'var(--primary)', border: '1px solid var(--border)' }}>
                ↻ Genereer andere namen
              </button>
              {refineTarget && (
                <button onClick={() => handleGenerate()}
                  className="text-sm font-medium px-4 py-2.5 rounded-lg"
                  style={{ background: 'rgba(79,70,229,0.08)', color: 'var(--primary)', border: '1px solid rgba(79,70,229,0.2)' }}>
                  ← Terug naar {sector}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Example preview (idle) */}
        {results.length === 0 && !generating && (
          <div className="mt-8">
            <p className="text-xs font-semibold mb-3 text-center" style={{ color: 'var(--text-subtle)' }}>
              Voorbeeld resultaat voor &ldquo;bakkerij&rdquo;
            </p>
            <div className="space-y-2 opacity-50 pointer-events-none select-none">
              {[
                { name: 'BakWise',     nl: 'available', com: 'taken',     eu: 'available', score: 82 },
                { name: 'VerseCraft',  nl: 'available', com: 'available', eu: 'available', score: 78 },
                { name: 'Panenco',     nl: 'taken',     com: 'available', eu: 'taken',     score: 70 },
              ].map((r) => (
                <div key={r.name} className="rounded-xl px-4 py-3"
                  style={{ background: r.nl === 'available' ? 'rgba(5,150,105,0.03)' : 'var(--bg-card)', border: `1px solid ${r.nl === 'available' ? 'rgba(5,150,105,0.2)' : 'var(--border)'}` }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>{r.name}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: r.score >= 80 ? 'rgba(5,150,105,0.1)' : 'rgba(217,119,6,0.1)', color: r.score >= 80 ? '#059669' : '#D97706' }}>
                      {r.score >= 80 ? 'Uitstekend' : 'Goed'}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    {['.nl', '.com', '.eu'].map((tld, i) => {
                      const status = [r.nl, r.com, r.eu][i];
                      return (
                        <span key={tld} className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: status === 'available' ? 'rgba(5,150,105,0.1)' : 'rgba(220,38,38,0.06)', color: status === 'available' ? '#059669' : '#EF4444' }}>
                          {status === 'available' ? '✓' : '✗'} {tld}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nav links */}
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

        {/* Tips */}
        <div className="mt-12">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4 text-center" style={{ color: 'var(--text-subtle)' }}>
            Tips voor een sterke merknaam
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: '✂️', title: 'Houd het kort',         desc: 'Maximaal 12 tekens — makkelijker te onthouden en te typen.' },
              { icon: '🔤', title: 'Geen koppeltekens',     desc: 'Vermijd streepjes en cijfers; die zorgen voor verwarring bij mondeling doorgeven.' },
              { icon: '🌍', title: 'Registreer .nl én .com',desc: 'Registreer beide als ze beschikbaar zijn — voorkomt verwarring bij bezoekers.' },
              { icon: '™️', title: 'Check het merkenregister', desc: 'Zorg dat de naam niet als Europees merk geregistreerd is via de EUIPO-check.' },
            ].map(tip => (
              <div key={tip.title} className="flex gap-3 rounded-xl p-4"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
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
