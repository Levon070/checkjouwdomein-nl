import { Metadata } from 'next';
import SearchHero from '@/components/search/SearchHero';
import ResultsGrid from '@/components/results/ResultsGrid';
import FaqSection from '@/components/sections/FaqSection';
import AdSenseUnit from '@/components/ads/AdSenseUnit';
import JsonLd from '@/components/seo/JsonLd';

interface Props {
  params: Promise<{ keyword: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { keyword } = await params;
  const kw = decodeURIComponent(keyword);
  const cap = kw.charAt(0).toUpperCase() + kw.slice(1);

  return {
    title: `${cap} domein beschikbaar? Check alle opties`,
    description: `Controleer welke domeinnamen met "${kw}" nog beschikbaar zijn. Vergelijk .nl, .com, .be en meer. Direct registreren via TransIP, Mijndomein en andere registrars.`,
    alternates: {
      canonical: `https://checkjouwdomein.nl/zoek/${keyword}`,
    },
    openGraph: {
      title: `${cap} domein beschikbaar? — CheckJouwDomein.nl`,
      description: `Vind de perfecte domeinnaam voor "${kw}". Bekijk alle beschikbare extensies en vergelijk registrars.`,
    },
  };
}

export function generateStaticParams() {
  const keywords = [
    'webshop', 'restaurant', 'freelancer', 'consultant', 'fotografie',
    'blog', 'portfolio', 'startup', 'app', 'coaching', 'advocaat',
    'tandarts', 'kapper', 'bakkerij', 'boekhouder', 'bv', 'architect',
    'schilder', 'loodgieter', 'elektricien',
  ];
  return keywords.map((keyword) => ({ keyword }));
}

export default async function ZoekPage({ params }: Props) {
  const { keyword } = await params;
  const kw = decodeURIComponent(keyword);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://checkjouwdomein.nl' },
      { '@type': 'ListItem', position: 2, name: `Domein check: ${kw}`, item: `https://checkjouwdomein.nl/zoek/${keyword}` },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <SearchHero initialKeyword={kw} />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <AdSenseUnit slot="SEARCH_TOP_SLOT" format="leaderboard" />

        <div className="my-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Domeinnamen voor{' '}
            <span className="text-blue-600">&ldquo;{kw}&rdquo;</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            We controleren de beschikbaarheid van alle suggesties. Beschikbare domeinen verschijnen bovenaan.
          </p>
        </div>

        <ResultsGrid keyword={kw} />

        <div className="mt-12">
          <AdSenseUnit slot="SEARCH_BOTTOM_SLOT" format="responsive" />
        </div>

        <FaqSection />
      </div>
    </>
  );
}
