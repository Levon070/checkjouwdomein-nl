import { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'AI Naamgenerator — Genereer Unieke Merknamen',
  description: 'Laat AI 12 unieke merknamen genereren op basis van jouw sector en stijl. Inclusief directe domeincheck op .nl en .com. Gratis, geen account nodig.',
  alternates: { canonical: 'https://checkjouwdomein.nl/naam-generator' },
  openGraph: {
    title: 'AI Naamgenerator — Genereer Unieke Merknamen | CheckJouwDomein.nl',
    description: 'Laat AI 12 unieke merknamen genereren. Inclusief directe .nl en .com beschikbaarheidscheck.',
    images: [{ url: '/api/og?title=AI%20Naamgenerator&desc=Genereer%2012%20unieke%20merknamen%20met%20AI%20en%20check%20direct%20de%20beschikbaarheid', width: 1200, height: 630 }],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://checkjouwdomein.nl' },
    { '@type': 'ListItem', position: 2, name: 'AI Naamgenerator', item: 'https://checkjouwdomein.nl/naam-generator' },
  ],
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AI Merknaam Generator',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  url: 'https://checkjouwdomein.nl/naam-generator',
  description: 'Gratis AI-tool die 12 unieke merknamen genereert op basis van sector en stijl, inclusief directe beschikbaarheidscheck op .nl, .com en .eu.',
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
      name: 'Hoe werkt de AI naamgenerator?',
      acceptedAnswer: { '@type': 'Answer', text: 'De AI naamgenerator analyseert jouw sector, kernwoorden en gewenste stijl en genereert vervolgens 12 unieke merknamen. Voor elke naam wordt direct de beschikbaarheid gecheckt op .nl, .com en .eu via het RDAP-protocol.' },
    },
    {
      '@type': 'Question',
      name: 'Is de AI naamgenerator gratis?',
      acceptedAnswer: { '@type': 'Answer', text: 'Ja, de AI naamgenerator van CheckJouwDomein.nl is volledig gratis. Je hebt geen account of betaalgegevens nodig.' },
    },
    {
      '@type': 'Question',
      name: 'Wat is een goede merknaam?',
      acceptedAnswer: { '@type': 'Answer', text: 'Een goede merknaam is kort (maximaal 12 tekens), uniek, makkelijk uit te spreken en te spellen, bevat geen koppeltekens of cijfers, en is beschikbaar als domein én op sociale media. Controleer ook of de naam niet als Europees handelsmerk geregistreerd is.' },
    },
    {
      '@type': 'Question',
      name: 'Kan ik de gegenereerde naam direct registreren?',
      acceptedAnswer: { '@type': 'Answer', text: 'Ja. Bij elke beschikbare naam zie je directe links naar registrars zoals TransIP om het domein meteen vast te leggen. Wacht niet te lang — beschikbare domeinen kunnen snel bezet raken.' },
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
