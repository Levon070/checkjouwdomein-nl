import { TldKey } from '@/types';
import { getRegistrarsForTld } from '@/lib/registrars';

interface Props {
  domain: string;
  tld: TldKey;
}

export default function RegistrarButtons({ domain, tld }: Props) {
  const registrars = getRegistrarsForTld(tld);

  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {registrars.map((r) => (
        <a
          key={r.id}
          href={r.affiliateUrl(domain)}
          target="_blank"
          rel="noopener noreferrer sponsored"
          title={`Registreer ${domain} bij ${r.name}`}
          className="registrar-btn"
        >
          {r.name} →
        </a>
      ))}
    </div>
  );
}
