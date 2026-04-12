import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Tips Domeinnaam Kiezen — 10 Regels voor de Perfecte Keuze',
  description:
    'Hoe kies je de beste domeinnaam? Onze 10 tips helpen je een korte, memorabele en SEO-vriendelijke domeinnaam te vinden.',
  alternates: { canonical: 'https://checkjouwdomein.nl/tips-domeinnaam' },
};

const TIPS = [
  {
    nr: 1,
    title: 'Houd het kort en krachtig',
    desc: 'Domeinnamen van maximaal 15 tekens zijn makkelijker te onthouden. Hoe korter, hoe beter. Denk aan bol.com, ah.nl, nu.nl.',
  },
  {
    nr: 2,
    title: 'Gebruik geen koppeltekens',
    desc: 'mijn-bakker.nl ziet er minder professioneel uit dan mijnbakker.nl. Mensen vergeten het koppelteken ook vaak bij het typen.',
  },
  {
    nr: 3,
    title: 'Vermijd cijfers',
    desc: 'Cijfers zorgen voor verwarring. Bedoel je "1" of "een"? Gebruik alleen cijfers als het absoluut bij je merk hoort (bijv. 123inkt.nl).',
  },
  {
    nr: 4,
    title: 'Kies .nl voor de Nederlandse markt',
    desc: 'Voor Nederlandse klanten is .nl de meest betrouwbare keuze. Google geeft .nl-domeinen ook voordeel in Nederlandse zoekresultaten.',
  },
  {
    nr: 5,
    title: 'Controleer de uitspraak',
    desc: 'Zeg de domeinnaam hardop. Is hij makkelijk te begrijpen en te spellen via de telefoon? Als je hem moet uitleggen, is hij te ingewikkeld.',
  },
  {
    nr: 6,
    title: 'Check social media beschikbaarheid',
    desc: 'Controleer of dezelfde naam beschikbaar is op Instagram, Facebook en LinkedIn. Consistentie in je naam bouwt herkenbaarheid.',
  },
  {
    nr: 7,
    title: 'Vermijd merknamen van anderen',
    desc: 'Gebruik nooit een bekende merknaam in jouw domein (bijv. nike-schoenen.nl). Dit kan leiden tot juridische problemen.',
  },
  {
    nr: 8,
    title: 'Denk aan de toekomst',
    desc: 'Kies een naam die ook over 5 jaar nog past. "webdesign2024.nl" klinkt over een jaar al gedateerd.',
  },
  {
    nr: 9,
    title: 'Registreer meerdere varianten',
    desc: 'Als je het kunt betalen, registreer dan zowel .nl als .com, en eventueel typfouten-varianten. Redirect alles naar jouw hoofddomein.',
  },
  {
    nr: 10,
    title: 'Gebruik onze score-indicator',
    desc: 'Onze domein checker geeft elke domeinnaam een score van 1–5 sterren op basis van lengte, TLD en keyword-match. Handig als hulpmiddel.',
  },
];

export default function TipsDomeinnaamPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: TIPS.map((tip) => ({
      '@type': 'Question',
      name: tip.title,
      acceptedAnswer: { '@type': 'Answer', text: tip.desc },
    })),
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <nav className="text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link> / Tips domeinnaam
        </nav>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
          10 Tips voor het Kiezen van de Perfecte Domeinnaam
        </h1>
        <p className="text-gray-500 mb-10">
          Een goede domeinnaam is de basis van je online succes. Volg deze regels en maak de juiste keuze.
        </p>

        <div className="space-y-4">
          {TIPS.map((tip) => (
            <div key={tip.nr} className="flex gap-4 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {tip.nr}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 mb-1">{tip.title}</h2>
                <p className="text-gray-500 text-sm leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Klaar om te zoeken?</h2>
          <p className="text-gray-500 text-sm mb-4">
            Gebruik onze gratis domein checker en vind jouw perfecte domeinnaam.
          </p>
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
