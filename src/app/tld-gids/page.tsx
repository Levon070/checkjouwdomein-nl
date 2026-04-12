import { Metadata } from 'next';
import Link from 'next/link';
import { TLD_CONFIG, ORDERED_TLDS } from '@/lib/tlds';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'TLD Gids — Welke domeinextensie past bij jou?',
  description:
    'Alles over .nl, .com, .be, .net, .org, .io, .shop en .online. Welke extensie is het beste voor jouw website? Onze gids helpt je kiezen.',
  alternates: { canonical: 'https://checkjouwdomein.nl/tld-gids' },
};

export default function TldGidsPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ORDERED_TLDS.map((tld) => ({
      '@type': 'Question',
      name: `Wanneer kies ik voor ${tld}?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: TLD_CONFIG[tld].description,
      },
    })),
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <nav className="text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link> / TLD Gids
        </nav>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">TLD Gids</h1>
        <p className="text-gray-500 mb-10">
          Een TLD (Top-Level Domain) is de extensie achter jouw domeinnaam. Kies de juiste extensie
          voor de beste resultaten.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ORDERED_TLDS.map((tld) => {
            const config = TLD_CONFIG[tld];
            return (
              <div key={tld} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  {config.flag && <span className="text-3xl">{config.flag}</span>}
                  <div>
                    <span className="font-bold text-2xl text-blue-600 font-mono">{tld}</span>
                    <span className="ml-2 text-sm text-gray-500">{config.label}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">{config.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Gemiddeld: {config.averagePrice}</span>
                  <Link
                    href={`/zoek/website?tld=${tld}`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Check beschikbaarheid →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-blue-50 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Wil je weten welke domeinen beschikbaar zijn?</h2>
          <p className="text-gray-500 text-sm mb-4">Voer jouw keyword in en check alle extensies tegelijk.</p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start domein check →
          </Link>
        </div>
      </div>
    </>
  );
}
