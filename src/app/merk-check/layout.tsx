import { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Merknaamcheck — Domein, Social, KVK & EUIPO in één overzicht',
  description: 'Check in één overzicht of jouw merknaam beschikbaar is als domeinnaam, social media handle, KVK-handelsnaam én Europees handelsmerk (EUIPO). Gratis.',
  alternates: {
    canonical: 'https://checkjouwdomein.nl/merk-check',
    languages: {
      'nl-NL': 'https://checkjouwdomein.nl/merk-check',
      'nl-BE': 'https://checkjouwdomein.nl/merk-check',
      'x-default': 'https://checkjouwdomein.nl/merk-check',
    },
  },
  openGraph: {
    title: 'Merknaamcheck — Alles in één overzicht | CheckJouwDomein.nl',
    description: 'Domein + Instagram + TikTok + KVK + EUIPO — check alles tegelijk. Gratis, geen account nodig.',
    images: [{ url: '/api/og?title=Merknaamcheck&desc=Domein%2C%20social%2C%20KVK%20%26%20EUIPO%20in%20%C3%A9%C3%A9n%20overzicht', width: 1200, height: 630 }],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://checkjouwdomein.nl' },
    { '@type': 'ListItem', position: 2, name: 'Merknaamcheck', item: 'https://checkjouwdomein.nl/merk-check' },
  ],
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Merknaamcheck — CheckJouwDomein.nl',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  url: 'https://checkjouwdomein.nl/merk-check',
  description: 'Gratis tool die in één overzicht toont of een merknaam beschikbaar is als domein (.nl/.com), op sociale media (Instagram, TikTok, X), als KVK-handelsnaam en als Europees merk (EUIPO).',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  inLanguage: 'nl-NL',
  provider: { '@type': 'Organization', name: 'CheckJouwDomein.nl', url: 'https://checkjouwdomein.nl' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Wat controleert de merknaamcheck?',
      acceptedAnswer: { '@type': 'Answer', text: 'De merknaamcheck van CheckJouwDomein.nl controleert in één keer: domeinnaamsbeschikbaarheid (.nl, .com, .be, .io), social media handles (Instagram, TikTok, X/Twitter), KVK-handelsnaamregistratie en het Europees handelsmerkenregister (EUIPO).' },
    },
    {
      '@type': 'Question',
      name: 'Hoe weet ik of mijn merknaam beschermd is?',
      acceptedAnswer: { '@type': 'Answer', text: 'Via de EUIPO-check in onze merknaamcheck zie je direct of jouw naam als Europees handelsmerk geregistreerd staat. Een geregistreerd merk geeft juridische bescherming in alle EU-lidstaten. Is de naam vrij? Dan kun je zelf een merkaanvraag indienen via euipo.europa.eu.' },
    },
    {
      '@type': 'Question',
      name: 'Wat betekent de merkscore?',
      acceptedAnswer: { '@type': 'Answer', text: 'De merkscore (0-100) geeft aan hoe sterk de merkpositie van de naam is. 100 betekent: domein (.nl én .com) beschikbaar, sociale media vrij, niet in KVK en geen EUIPO-match. Elke bezette positie verlaagt de score.' },
    },
    {
      '@type': 'Question',
      name: 'Is de merknaamcheck gratis?',
      acceptedAnswer: { '@type': 'Answer', text: 'Ja, volledig gratis. Geen account, geen betaalgegevens nodig. CheckJouwDomein.nl verdient via affiliate-commissies wanneer je een domein registreert via onze links.' },
    },
    {
      '@type': 'Question',
      name: 'Hoe weet ik of mijn merknaam beschermd is?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Via de EUIPO-check zie je direct of de naam als Europees handelsmerk staat geregistreerd. Is de naam vrij? Dan kun je zelf een aanvraag indienen via euipo.europa.eu. Een merkinschrijving geldt voor 10 jaar en is verlengbaar.',
      },
    },
    {
      '@type': 'Question',
      name: 'Wat als de naam al bezet is als domein maar vrij als merk?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Dan kun je de naam eventueel nog als merk beschermen, maar heb je een domeinprobleem. Overweeg dan een variatie of andere extensie. Gebruik onze domeinchecker voor alternatieven.',
      },
    },
    {
      '@type': 'Question',
      name: 'Hoe snel is de merknaamcheck klaar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'De merknaamcheck duurt 3-10 seconden. We bevragen tegelijkertijd het RDAP-protocol (domeinen), de social media platforms, het KVK-register en de EUIPO-database.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is de merknaamcheck 100% betrouwbaar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We gebruiken officiële databronnen (RDAP, EUIPO API). Social media beschikbaarheid is een benadering — platforms wijzigen soms handles. Voor juridische zekerheid raden we altijd aan een merkengemachtigde te raadplegen voordat je een merk inschrijft.',
      },
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={softwareSchema} />
      <JsonLd data={faqSchema} />
      {children}
    </>
  );
}
