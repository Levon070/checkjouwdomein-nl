'use client';

import { TldKey } from '@/types';
import { getRegistrarsForTld } from '@/lib/registrars';
import { trackClientEvent } from '@/lib/analytics-client';

interface Props {
  domain: string;
  tld: TldKey;
}

export default function RegistrarButtons({ domain, tld }: Props) {
  const registrars = getRegistrarsForTld(tld);

  return (
    <div className="flex flex-nowrap overflow-x-auto gap-1.5 mt-3 pb-1 -mb-1 scrollbar-hide">
      {registrars.map((r) => {
        const price = r.prices[tld];
        return (
          <a
            key={r.id}
            href={r.affiliateUrl(domain)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            title={`Registreer ${domain} bij ${r.name}${price ? ` — ${price}` : ''}`}
            className="registrar-btn flex items-center gap-1"
            onClick={() => trackClientEvent('clicks', r.id)}
          >
            <span>{r.name}</span>
            {price && (
              <span
                className="text-xs opacity-60 font-normal"
                style={{ fontSize: '0.68rem' }}
              >
                {price}
              </span>
            )}
            <span>→</span>
          </a>
        );
      })}
    </div>
  );
}
