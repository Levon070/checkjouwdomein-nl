import { Metadata } from 'next';
import SearchHero from '@/components/search/SearchHero';
import ResultsGrid from '@/components/results/ResultsGrid';
import FaqSection from '@/components/sections/FaqSection';
import AdSenseUnit from '@/components/ads/AdSenseUnit';
import JsonLd from '@/components/seo/JsonLd';
import ProWaitlist from '@/components/ui/ProWaitlist';
import { checkDomainAvailability } from '@/lib/rdap-checker';

export const revalidate = 86400;

interface Props {
  params: Promise<{ keyword: string }>;
  searchParams: Promise<{ loc?: string; ind?: string }>;
}

function parseKeyword(raw: string): { kw: string; city: string | null; display: string } {
  // Detect "bakkerij-amsterdam" pattern
  const cityList = [
    'amsterdam', 'rotterdam', 'den-haag', 'utrecht', 'eindhoven',
    'groningen', 'tilburg', 'almere', 'breda', 'nijmegen',
    'antwerpen', 'gent', 'brussel',
  ];
  for (const city of cityList) {
    if (raw.endsWith(`-${city}`)) {
      const kw = raw.slice(0, -(city.length + 1));
      const cityDisplay = city.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      return { kw, city: cityDisplay, display: `${kw} ${cityDisplay}` };
    }
  }
  return { kw: raw, city: null, display: raw };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { keyword } = await params;
  const raw = decodeURIComponent(keyword);
  const { kw, city, display } = parseKeyword(raw);
  const cap = display.charAt(0).toUpperCase() + display.slice(1);

  const title = city
    ? `${cap} domeinnaam — Check beschikbaarheid voor jouw ${kw} in ${city}`
    : `${cap} domein beschikbaar? Check alle opties`;

  const description = city
    ? `Op zoek naar een domeinnaam voor je ${kw} in ${city}? Controleer ${kw}${city.toLowerCase().replace(' ', '')}.nl en meer. Direct registreren, gratis check.`
    : `Controleer welke domeinnamen met "${kw}" nog beschikbaar zijn. Vergelijk .nl, .com, .be en meer. Direct registreren via TransIP, Mijndomein en andere registrars.`;

  return {
    title,
    description,
    alternates: { canonical: `https://checkjouwdomein.nl/zoek/${keyword}` },
    openGraph: {
      title: `${cap} domein — CheckJouwDomein.nl`,
      description,
    },
  };
}

export function generateStaticParams() {
  const baseKeywords = [
    'webshop', 'restaurant', 'freelancer', 'consultant', 'fotografie',
    'blog', 'portfolio', 'startup', 'app', 'coaching', 'advocaat',
    'tandarts', 'kapper', 'bakkerij', 'boekhouder', 'bv', 'architect',
    'schilder', 'loodgieter', 'elektricien',
    'fysiotherapeut', 'huisarts', 'psycholoog', 'dierenarts', 'masseur',
    'personal-trainer', 'yoga', 'coach',
    'catering', 'snackbar', 'lunchroom', 'sushi',
    'bezorging', 'accountant', 'notaris', 'recruiter', 'makelaar',
    'vastgoed', 'aannemer', 'timmerman', 'dakdekker', 'glazenwasser',
    'bloemist', 'kledingwinkel', 'boekenwinkel', 'cadeauwinkel', 'schoenenwinkel',
    'webdesigner', 'copywriter', 'developer', 'ict', 'podcast',
    'grafisch-ontwerper', 'vertaler',
  ];

  // Stad × keyword combinaties — targets long-tail zoekverkeer
  const cities = [
    'amsterdam', 'rotterdam', 'den-haag', 'utrecht', 'eindhoven',
    'groningen', 'tilburg', 'almere', 'breda', 'nijmegen',
    // België
    'antwerpen', 'gent', 'brussel',
  ];
  const cityKeywords = [
    'bakkerij', 'restaurant', 'kapper', 'tandarts', 'fysiotherapeut',
    'webdesigner', 'accountant', 'makelaar', 'coach', 'advocaat',
  ];

  const cityParams = cities.flatMap((city) =>
    cityKeywords.map((kw) => ({ keyword: `${kw}-${city}` }))
  );

  return [
    ...baseKeywords.map((keyword) => ({ keyword })),
    ...cityParams,
  ];
}

export default async function ZoekPage({ params, searchParams }: Props) {
  const { keyword } = await params;
  const { loc, ind } = await searchParams;
  const raw = decodeURIComponent(keyword);
  const { kw, city } = parseKeyword(raw);

  // Server-side RDAP pre-check — always in HTML for Google indexing
  // Use the full slug as the domain name (e.g. "bakkerij-amsterdam")
  const domainName = raw.replace(/\s+/g, '-').toLowerCase();
  const [nlResult, comResult] = await Promise.allSettled([
    checkDomainAvailability(domainName, '.nl'),
    checkDomainAvailability(domainName, '.com'),
  ]);

  const nlStatus = nlResult.status === 'fulfilled' ? nlResult.value.status : null;
  const comStatus = comResult.status === 'fulfilled' ? comResult.value.status : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://checkjouwdomein.nl' },
      { '@type': 'ListItem', position: 2, name: `Domein check: ${kw}`, item: `https://checkjouwdomein.nl/zoek/${keyword}` },
    ],
  };

  function statusColor(s: string | null) {
    if (s === 'available') return 'var(--available)';
    if (s === 'taken') return 'var(--taken)';
    return 'var(--text-subtle)';
  }

  function statusLabel(s: string | null) {
    if (s === 'available') return 'Beschikbaar';
    if (s === 'taken') return 'Bezet';
    return 'Onbekend';
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <SearchHero initialKeyword={kw} />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <AdSenseUnit slot="SEARCH_TOP_SLOT" format="leaderboard" />

        <div className="my-6">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
            Domeinnamen voor{' '}
            <span style={{ color: 'var(--primary)' }}>&ldquo;{kw}{city ? ` ${city}` : ''}&rdquo;</span>
          </h1>

          {/* Server-rendered availability pills */}
          {(nlStatus || comStatus) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {nlStatus && (
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{
                    background: nlStatus === 'available' ? 'rgba(5,150,105,0.08)' : 'rgba(220,38,38,0.07)',
                    color: statusColor(nlStatus),
                    border: `1px solid ${nlStatus === 'available' ? 'rgba(5,150,105,0.2)' : 'rgba(220,38,38,0.18)'}`,
                  }}
                >
                  {kw}.nl — {statusLabel(nlStatus)}
                </span>
              )}
              {comStatus && (
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{
                    background: comStatus === 'available' ? 'rgba(5,150,105,0.08)' : 'rgba(220,38,38,0.07)',
                    color: statusColor(comStatus),
                    border: `1px solid ${comStatus === 'available' ? 'rgba(5,150,105,0.2)' : 'rgba(220,38,38,0.18)'}`,
                  }}
                >
                  {kw}.com — {statusLabel(comStatus)}
                </span>
              )}
            </div>
          )}

          {/* Static SEO paragraph */}
          <p className="text-sm mt-3" style={{ color: 'var(--text-muted)' }}>
            Op zoek naar een domeinnaam voor je <strong>{kw}</strong>
            {city && <> in <strong>{city}</strong></>}? Wij controleren real-time alle beschikbare opties voor{' '}
            <strong>{domainName}.nl</strong>, <strong>{domainName}.com</strong> en meer extensies.
            Vergelijk prijzen bij TransIP, Mijndomein, Hostnet en andere Nederlandse registrars — direct registreren zonder account.
          </p>
        </div>

        {/* Intent banner — only shown when AI extracted location/industry from a sentence */}
        {(loc || ind) && (
          <div
            className="rounded-xl p-4 mb-6 flex items-center justify-between gap-4 flex-wrap"
            style={{ background: 'rgba(79,70,229,0.05)', border: '1px solid rgba(79,70,229,0.15)' }}
          >
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
                ✦ AI herkende{ind ? ` sector: ${ind}` : ''}{loc ? ` · locatie: ${loc}` : ''}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Wil je ook een creatieve merknaam laten bedenken?
              </p>
            </div>
            <a
              href={`/naam-generator?sector=${encodeURIComponent(ind ?? kw)}&location=${encodeURIComponent(loc ?? '')}`}
              className="text-xs font-bold px-4 py-2 rounded-lg whitespace-nowrap"
              style={{ background: 'var(--primary)', color: '#fff', textDecoration: 'none' }}
            >
              AI Naamgenerator →
            </a>
          </div>
        )}

        <ResultsGrid keyword={city ? raw : kw} />

        <div className="mt-12">
          <AdSenseUnit slot="SEARCH_BOTTOM_SLOT" format="responsive" />
        </div>

        <div className="mt-12 mb-8">
          <ProWaitlist context="search" />
        </div>

        <FaqSection />
      </div>
    </>
  );
}
