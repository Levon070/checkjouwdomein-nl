'use client';

import { useEffect, useRef, useState } from 'react';
import { TldKey } from '@/types';
import { getRegistrarsForTld, REGISTRARS } from '@/lib/registrars';

interface Props {
  domain: string;   // full domain, e.g. "bakkerij.nl"
  name: string;     // e.g. "bakkerij"
  tld: TldKey;
  onClose: () => void;
}

type SortKey = 'firstYear' | 'renewal' | 'rating';

const FEATURE_KEYS = [
  'whoisPrivacy',
  'freeSsl',
  'emailForwarding',
  'dnsManagement',
  'autoRenew',
  'transferLock',
  'twoFactor',
  'support',
  'apiAccess',
  'controlPanel',
];

function FeatureIcon({ value }: { value: true | false | 'paid' | string }) {
  if (value === true)
    return <span style={{ color: 'var(--available)', fontWeight: 700 }}>✓</span>;
  if (value === false)
    return <span style={{ color: 'var(--taken)', fontWeight: 700 }}>✗</span>;
  if (value === 'paid')
    return (
      <span style={{ color: '#D97706', fontSize: '0.7rem', fontWeight: 600 }}>
        betaald
      </span>
    );
  return <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{value}</span>;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ color: '#F59E0B', letterSpacing: '-1px', fontSize: '0.8rem' }}>
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
    </span>
  );
}

export default function PriceCompareModal({ domain, name, tld, onClose }: Props) {
  const [sortBy, setSortBy] = useState<SortKey>('firstYear');
  const overlayRef = useRef<HTMLDivElement>(null);

  const registrars = getRegistrarsForTld(tld);

  const sorted = [...registrars].sort((a, b) => {
    const pa = a.detailedPrices[tld];
    const pb = b.detailedPrices[tld];
    if (sortBy === 'firstYear') {
      return (pa?.firstYearRaw ?? 999) - (pb?.firstYearRaw ?? 999);
    }
    if (sortBy === 'renewal') {
      return (pa?.renewalRaw ?? 999) - (pb?.renewalRaw ?? 999);
    }
    return b.rating - a.rating;
  });

  // cheapest renewal raw
  // Close on overlay click
  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Feature labels for lookup
  const featureLabels: Record<string, string> = {};
  const featureTooltips: Record<string, string | undefined> = {};
  (REGISTRARS[0]?.features ?? []).forEach((f) => {
    featureLabels[f.key] = f.label;
    featureTooltips[f.key] = f.tooltip;
  });

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl flex flex-col"
        style={{ background: 'var(--bg)', boxShadow: 'var(--shadow-xl, 0 25px 60px rgba(0,0,0,0.25))' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--border)', background: 'white' }}
        >
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>
              Registreer{' '}
              <span style={{ color: 'var(--primary)' }}>{name}</span>
              <span style={{ color: 'var(--text-muted)' }}>{tld}</span>
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Vergelijk {registrars.length} registrars — klik op &ldquo;Registreer&rdquo; om direct over te gaan
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort tabs */}
            <div
              className="hidden sm:flex rounded-lg overflow-hidden text-xs font-medium"
              style={{ border: '1px solid var(--border)' }}
            >
              {([['firstYear', 'Eerste jaar'], ['renewal', 'Verlenging'], ['rating', 'Beoordeling']] as const).map(
                ([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSortBy(key)}
                    className="px-3 py-1.5 transition-colors"
                    style={{
                      background: sortBy === key ? 'var(--primary)' : 'transparent',
                      color: sortBy === key ? 'white' : 'var(--text-muted)',
                    }}
                  >
                    {label}
                  </button>
                )
              )}
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-lg transition-colors"
              style={{ background: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}
              aria-label="Sluiten"
            >
              ×
            </button>
          </div>
        </div>

        {/* Renewal warning toggle */}
        <div
          className="flex items-center gap-2 px-6 py-2 text-xs shrink-0"
          style={{ background: 'rgba(245,158,11,0.06)', borderBottom: '1px solid rgba(245,158,11,0.15)' }}
        >
          <span style={{ color: '#D97706' }}>⚠️</span>
          <span style={{ color: '#D97706', fontWeight: 500 }}>
            Let op introductiekorting — de verlengingsprijs kan sterk afwijken.
          </span>
          <button
            onClick={() => setSortBy('renewal')}
            className="ml-auto text-xs font-medium underline"
            style={{ color: '#D97706', background: 'none', border: 'none', cursor: 'pointer', textUnderlineOffset: '3px' }}
          >
            Sorteer op verlenging →
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1">

          {/* Registrar cards */}
          <div className="p-4 space-y-3">
            {sorted.map((r, i) => {
              const pricing = r.detailedPrices[tld];
              const renewalHigher = pricing && pricing.renewalRaw && pricing.firstYearRaw &&
                pricing.renewalRaw > pricing.firstYearRaw * 1.3;

              return (
                <div
                  key={r.id}
                  className="rounded-xl p-4"
                  style={{
                    background: 'white',
                    border: i === 0 && sortBy !== 'rating'
                      ? '2px solid var(--primary)'
                      : '1px solid var(--border)',
                    position: 'relative',
                  }}
                >
                  {/* Best badge */}
                  {i === 0 && sortBy === 'firstYear' && (
                    <span
                      className="absolute -top-2.5 left-4 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={{ background: 'var(--primary)', color: 'white' }}
                    >
                      Goedkoopste eerste jaar
                    </span>
                  )}
                  {i === 0 && sortBy === 'renewal' && (
                    <span
                      className="absolute -top-2.5 left-4 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={{ background: 'var(--available)', color: 'white' }}
                    >
                      Goedkoopste verlenging
                    </span>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Left: name + rating + highlight */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>
                          {r.name}
                        </span>
                        <Stars rating={r.rating} />
                        <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>
                          {r.rating}/5 ({r.reviewCount?.toLocaleString('nl-NL')} reviews)
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: 'rgba(79,70,229,0.07)', color: 'var(--primary)' }}
                        >
                          {r.highlight}
                        </span>
                      </div>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                        Panel: {r.panelLanguage.toUpperCase()}
                        {' · '}
                        {r.features.find(f => f.key === 'support')?.value}
                      </p>
                    </div>

                    {/* Center: pricing */}
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="text-center">
                        <p className="text-xs mb-0.5" style={{ color: 'var(--text-subtle)' }}>1e jaar</p>
                        <p className="text-lg font-black" style={{ color: 'var(--primary)', letterSpacing: '-0.02em' }}>
                          {pricing?.firstYear ?? '—'}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs mb-0.5" style={{ color: 'var(--text-subtle)' }}>Verlenging</p>
                        <p
                          className="text-base font-bold"
                          style={{
                            color: renewalHigher ? '#D97706' : 'var(--text)',
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {pricing?.renewal ?? '—'}
                          {renewalHigher && (
                            <span className="ml-1 text-xs font-normal">⚠️</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Right: CTA */}
                    <div className="shrink-0">
                      <a
                        href={r.affiliateUrl(domain)}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150"
                        style={{
                          background: i === 0 && sortBy !== 'rating'
                            ? 'var(--primary)'
                            : 'rgba(79,70,229,0.08)',
                          color: i === 0 && sortBy !== 'rating' ? 'white' : 'var(--primary)',
                          textDecoration: 'none',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Registreer bij {r.name} →
                      </a>
                    </div>
                  </div>

                  {/* Feature chips */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {r.features.filter(f =>
                      ['whoisPrivacy', 'freeSsl', 'emailForwarding', 'twoFactor', 'apiAccess'].includes(f.key)
                    ).map((f) => (
                      <span
                        key={f.key}
                        title={f.tooltip}
                        className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md"
                        style={{
                          background: f.value === true
                            ? 'rgba(5,150,105,0.07)'
                            : f.value === 'paid'
                            ? 'rgba(245,158,11,0.07)'
                            : 'rgba(0,0,0,0.04)',
                          color: f.value === true
                            ? 'var(--available)'
                            : f.value === 'paid'
                            ? '#D97706'
                            : 'var(--text-subtle)',
                          border: `1px solid ${f.value === true
                            ? 'rgba(5,150,105,0.15)'
                            : f.value === 'paid'
                            ? 'rgba(245,158,11,0.2)'
                            : 'rgba(0,0,0,0.07)'}`,
                        }}
                      >
                        <FeatureIcon value={f.value} />
                        {f.label}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full feature comparison table */}
          <div className="px-4 pb-6">
            <p className="text-xs font-semibold mb-3 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Volledige vergelijking
            </p>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse" style={{ minWidth: 600 }}>
                  <thead>
                    <tr style={{ background: 'rgba(79,70,229,0.05)' }}>
                      <th className="text-left px-4 py-2.5 font-semibold" style={{ color: 'var(--text-muted)', width: 160 }}>
                        Kenmerk
                      </th>
                      {sorted.map((r) => (
                        <th key={r.id} className="px-3 py-2.5 font-semibold text-center" style={{ color: 'var(--text)' }}>
                          {r.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Pricing rows */}
                    <tr style={{ background: 'rgba(79,70,229,0.03)' }}>
                      <td className="px-4 py-2 font-medium" style={{ color: 'var(--text-muted)' }}>
                        Prijs 1e jaar
                      </td>
                      {sorted.map((r) => (
                        <td key={r.id} className="px-3 py-2 text-center font-bold" style={{ color: 'var(--primary)' }}>
                          {r.detailedPrices[tld]?.firstYear ?? '—'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium" style={{ color: 'var(--text-muted)' }}>
                        Verlengingsprijs
                      </td>
                      {sorted.map((r) => {
                        const p = r.detailedPrices[tld];
                        const warn = p && p.renewalRaw && p.firstYearRaw && p.renewalRaw > p.firstYearRaw * 1.3;
                        return (
                          <td
                            key={r.id}
                            className="px-3 py-2 text-center font-semibold"
                            style={{ color: warn ? '#D97706' : 'var(--text)' }}
                          >
                            {p?.renewal ?? '—'}
                            {warn && ' ⚠️'}
                          </td>
                        );
                      })}
                    </tr>
                    <tr style={{ background: 'rgba(79,70,229,0.03)' }}>
                      <td className="px-4 py-2 font-medium" style={{ color: 'var(--text-muted)' }}>
                        Beoordeling
                      </td>
                      {sorted.map((r) => (
                        <td key={r.id} className="px-3 py-2 text-center" style={{ color: 'var(--text)' }}>
                          <Stars rating={r.rating} />
                          <span className="block text-xs" style={{ color: 'var(--text-subtle)' }}>{r.rating}/5</span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium" style={{ color: 'var(--text-muted)' }}>
                        Taal panel
                      </td>
                      {sorted.map((r) => (
                        <td key={r.id} className="px-3 py-2 text-center" style={{ color: 'var(--text)' }}>
                          {r.panelLanguage.toUpperCase()}
                        </td>
                      ))}
                    </tr>

                    {/* Feature rows */}
                    {FEATURE_KEYS.map((key, idx) => (
                      <tr key={key} style={{ background: idx % 2 === 0 ? 'rgba(79,70,229,0.03)' : undefined }}>
                        <td
                          className="px-4 py-2 font-medium"
                          style={{ color: 'var(--text-muted)' }}
                          title={featureTooltips[key]}
                        >
                          {featureLabels[key] ?? key}
                          {featureTooltips[key] && (
                            <span className="ml-1 opacity-50 cursor-help" title={featureTooltips[key]}>ⓘ</span>
                          )}
                        </td>
                        {sorted.map((r) => {
                          const feat = r.features.find((f) => f.key === key);
                          return (
                            <td key={r.id} className="px-3 py-2 text-center">
                              {feat ? <FeatureIcon value={feat.value} /> : <span style={{ color: 'var(--text-subtle)' }}>—</span>}
                            </td>
                          );
                        })}
                      </tr>
                    ))}

                    {/* CTA row */}
                    <tr style={{ background: 'rgba(79,70,229,0.04)' }}>
                      <td className="px-4 py-3 font-semibold text-xs" style={{ color: 'var(--text-muted)' }}>
                        Registreren
                      </td>
                      {sorted.map((r, i) => (
                        <td key={r.id} className="px-3 py-3 text-center">
                          <a
                            href={r.affiliateUrl(domain)}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg font-semibold text-xs transition-all"
                            style={{
                              background: i === 0 && sortBy !== 'rating' ? 'var(--primary)' : 'rgba(79,70,229,0.08)',
                              color: i === 0 && sortBy !== 'rating' ? 'white' : 'var(--primary)',
                              textDecoration: 'none',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Kies {r.name} →
                          </a>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-xs mt-3" style={{ color: 'var(--text-subtle)' }}>
              * Prijzen zijn indicatief en kunnen afwijken. Controleer altijd de actuele prijs bij de registrar.
              CheckJouwDomein.nl ontvangt een kleine vergoeding bij registratie via onze links.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
