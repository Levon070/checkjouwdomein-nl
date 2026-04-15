import { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Bulk Domein Check — Controleer 50 Domeinen Tegelijk',
  description: 'Controleer tientallen domeinnamen tegelijk op beschikbaarheid. Plak een lijst met keywords of domeinen en ontvang direct resultaten. Gratis, export als CSV.',
  alternates: { canonical: 'https://checkjouwdomein.nl/bulk-check' },
  openGraph: {
    title: 'Bulk Domein Check — 50 Domeinen Tegelijk | CheckJouwDomein.nl',
    description: 'Controleer tot 50 domeinen tegelijk via RDAP. Gratis, geen account nodig, exporteer als CSV.',
    images: [{ url: '/api/og?title=Bulk%20Domein%20Check&desc=Controleer%2050%20domeinen%20tegelijk%20op%20beschikbaarheid', width: 1200, height: 630 }],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://checkjouwdomein.nl' },
    { '@type': 'ListItem', position: 2, name: 'Bulk Domein Check', item: 'https://checkjouwdomein.nl/bulk-check' },
  ],
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Bulk Domein Check — CheckJouwDomein.nl',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  url: 'https://checkjouwdomein.nl/bulk-check',
  description: 'Gratis tool voor het tegelijkertijd controleren van maximaal 50 domeinnamen op beschikbaarheid via het RDAP-protocol. Export resultaten als CSV.',
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
      name: 'Hoeveel domeinen kan ik tegelijk controleren?',
      acceptedAnswer: { '@type': 'Answer', text: 'Met de bulk domein check van CheckJouwDomein.nl kun je maximaal 50 domeinen per keer controleren. De tool controleert 8 domeinen gelijktijdig via het RDAP-protocol, zodat een volledige lijst van 50 domeinen in 15-30 seconden klaar is.' },
    },
    {
      '@type': 'Question',
      name: 'Hoe voer ik een lijst met domeinen in?',
      acceptedAnswer: { '@type': 'Answer', text: 'Plak je domeinen in het tekstvak — één domein per regel of gescheiden door komma\'s. Vergeet de extensie niet: typ bakker.nl in plaats van alleen bakker. Domeinen zonder geldige extensie worden overgeslagen.' },
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
