import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Merknaam Checker — Domein + Sociaal + KVK + EUIPO',
  description:
    'Check in één overzicht of jouw merknaam beschikbaar is als domeinnaam, social media handle, KVK-handelsnaam én Europees handelsmerk (EUIPO). Gratis.',
  alternates: { canonical: 'https://checkjouwdomein.nl/merk-check' },
  openGraph: {
    title: 'Merknaam Checker — Domein, Social, KVK & EUIPO | CheckJouwDomein.nl',
    description: 'Complete merknaam check: domein, sociale media, KVK en Europees handelsmerk in één overzicht.',
    images: [{ url: '/api/og?title=Merknaam%20Checker&desc=Domein%20%2B%20Social%20%2B%20KVK%20%2B%20EUIPO%20in%20%C3%A9%C3%A9n%20overzicht', width: 1200, height: 630 }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
