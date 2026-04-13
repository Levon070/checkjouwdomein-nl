import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Naamgenerator — Genereer Unieke Merknamen',
  description:
    'Laat AI 12 unieke merknamen genereren op basis van jouw sector en stijl. Inclusief directe domeincheck op .nl en .com. Gratis, geen account nodig.',
  alternates: { canonical: 'https://checkjouwdomein.nl/naam-generator' },
  openGraph: {
    title: 'AI Naamgenerator — Genereer Unieke Merknamen | CheckJouwDomein.nl',
    description: 'Laat AI 12 unieke merknamen genereren. Inclusief directe .nl en .com beschikbaarheidscheck.',
    images: [{ url: '/api/og?title=AI%20Naamgenerator&desc=Genereer%2012%20unieke%20merknamen%20met%20AI%20en%20check%20direct%20de%20beschikbaarheid', width: 1200, height: 630 }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
