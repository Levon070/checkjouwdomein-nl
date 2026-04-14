'use client';

import { TldKey } from '@/types';
import { getRegistrarsForTld } from '@/lib/registrars';
import { trackClientEvent } from '@/lib/analytics-client';

interface Props {
  domain: string;
  tld: TldKey;
}

const TOP_N = 3;

export default function RegistrarButtons({ domain, tld }: Props) {
  const all = getRegistrarsForTld(tld);

  // Sorteer op verlengingsprijs (wat iemand elk jaar betaalt na jaar 1)
  const sorted = [...all].sort((a, b) => {
    const aPrice = a.detailedPrices[tld]?.renewalRaw ?? 999;
    const bPrice = b.detailedPrices[tld]?.renewalRaw ?? 999;
    return aPrice - bPrice;
  });

  const top = sorted.slice(0, TOP_N);
  const rest = sorted.slice(TOP_N);

  return (
    <div className="mt-3 space-y-2">
      {/* Top 3 goedkoopste — prominente buttons */}
      <div className="flex flex-nowrap overflow-x-auto gap-1.5 pb-1 -mb-1 scrollbar-hide">
        {top.map((r, i) => {
          const price = r.prices[tld];
          const isAffiliate = !!r.sponsored;
          return (
            <a
              key={r.id}
              href={r.affiliateUrl(domain)}
              target="_blank"
              rel={isAffiliate ? 'noopener noreferrer sponsored' : 'noopener noreferrer'}
              title={`Registreer ${domain} bij ${r.name}${price ? ` — ${price}` : ''}`}
              className="registrar-btn flex items-center gap-1"
              onClick={() => trackClientEvent('clicks', r.id)}
            >
              {i === 0 && (
                <span style={{ fontSize: '0.6rem', fontWeight: 700, opacity: 0.7 }}>★</span>
              )}
              <span>{r.name}</span>
              {price && (
                <span className="text-xs opacity-60 font-normal" style={{ fontSize: '0.68rem' }}>
                  {price}
                </span>
              )}
              <span>→</span>
            </a>
          );
        })}
      </div>

      {/* Rest — klein en grijs */}
      {rest.length > 0 && (
        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
          {rest.map((r) => {
            const price = r.prices[tld];
            return (
              <span
                key={r.id}
                className="text-xs"
                style={{ color: 'var(--text-subtle)' }}
              >
                {r.name}{price ? ` ${price}` : ''}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
