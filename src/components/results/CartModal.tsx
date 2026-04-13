'use client';

import { useEffect } from 'react';
import type { CartItem } from '@/types';
import { REGISTRARS } from '@/lib/registrars';

interface Props {
  items: CartItem[];
  onClose: () => void;
  onRemove: (full: string) => void;
  onClear: () => void;
}

interface RegistrarOption {
  registrar: (typeof REGISTRARS)[number];
  total: number;
  coversAll: boolean;
  breakdown: Array<{ full: string; price: string; raw: number }>;
}

function buildOptions(items: CartItem[]): RegistrarOption[] {
  return REGISTRARS.map((registrar) => {
    const coversAll = items.every((item) => registrar.supportedTlds.includes(item.tld));
    const breakdown = items.map((item) => {
      const pricing = registrar.detailedPrices[item.tld];
      return {
        full: item.full,
        price: pricing?.firstYear ?? '—',
        raw: pricing?.firstYearRaw ?? 0,
      };
    });
    const total = breakdown.reduce((sum, b) => sum + b.raw, 0);
    return { registrar, total, coversAll, breakdown };
  }).sort((a, b) => {
    if (a.coversAll && !b.coversAll) return -1;
    if (!a.coversAll && b.coversAll) return 1;
    return a.total - b.total;
  });
}

function fmt(n: number) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n);
}

export default function CartModal({ items, onClose, onRemove, onClear }: Props) {
  const options = buildOptions(items);

  // Escape key close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Body scroll lock
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 sticky top-0"
          style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
        >
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>
              Domeinwinkelmand
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {items.length} {items.length === 1 ? 'domein' : 'domeinen'} geselecteerd
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-full text-lg"
            style={{ minWidth: 36, minHeight: 36, color: 'var(--text-subtle)', background: 'var(--bg)' }}
            aria-label="Sluiten"
          >
            ✕
          </button>
        </div>

        {/* Selected domains */}
        <div className="px-5 py-3 flex flex-wrap gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
          {items.map((item) => (
            <span
              key={item.full}
              className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: 'var(--primary-subtle)', color: 'var(--primary)', border: '1px solid var(--primary-border)' }}
            >
              {item.full}
              <button
                onClick={() => onRemove(item.full)}
                className="ml-0.5 hover:opacity-70"
                aria-label={`Verwijder ${item.full}`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>

        {/* Registrar options */}
        <div className="px-5 py-4 flex flex-col gap-3">
          <p className="text-xs font-medium" style={{ color: 'var(--text-subtle)' }}>
            Vergelijk totaalprijs per registrar (eerste jaar)
          </p>

          {options.map(({ registrar, total, coversAll, breakdown }) => (
            <div
              key={registrar.id}
              className="rounded-xl p-4"
              style={{
                border: '1px solid var(--border)',
                background: coversAll ? 'var(--bg)' : 'transparent',
                opacity: coversAll ? 1 : 0.5,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
                    {registrar.name}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    ★ {registrar.rating.toFixed(1)}
                  </span>
                  {!coversAll && (
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(220,38,38,0.08)', color: '#DC2626' }}>
                      Niet alle TLDs
                    </span>
                  )}
                </div>
                <span className="font-bold text-sm" style={{ color: coversAll ? 'var(--primary)' : 'var(--text-subtle)' }}>
                  {coversAll ? fmt(total) : '—'}
                </span>
              </div>

              {/* Price breakdown */}
              <div className="flex flex-col gap-0.5 mb-3">
                {breakdown.map((b) => (
                  <div key={b.full} className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>{b.full}</span>
                    <span>{b.price}</span>
                  </div>
                ))}
              </div>

              {coversAll && (
                <div className="flex flex-col gap-2">
                  <a
                    href={registrar.affiliateUrl(items[0].full)}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="block text-center text-xs font-semibold py-2 px-4 rounded-lg transition-opacity hover:opacity-85"
                    style={{ background: 'var(--primary)', color: '#fff' }}
                  >
                    Registreer bij {registrar.name} →
                  </a>
                  {items.length > 1 && (
                    <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                      Voeg na registratie ook toe:{' '}
                      <span style={{ color: 'var(--text)' }}>
                        {items.slice(1).map((i) => i.full).join(', ')}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="px-5 py-3 flex justify-end sticky bottom-0"
          style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}
        >
          <button
            onClick={onClear}
            className="text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-70"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          >
            Winkelmand legen
          </button>
        </div>
      </div>
    </div>
  );
}
