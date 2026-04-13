import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Domeinportefeuille — Beheer Al Je Domeinen',
  description:
    'Houd al je domeinnamen bij op één plek. Zie wanneer ze verlopen, vergelijk verlengingsprijzen bij registrars en bespaar geld. Gratis, geen account nodig.',
  alternates: { canonical: 'https://checkjouwdomein.nl/portfolio' },
  openGraph: {
    title: 'Domeinportefeuille — Beheer Al Je Domeinen | CheckJouwDomein.nl',
    description: 'Houd je domeinen bij, zie verloopdata en vergelijk verlengingsprijzen. Gratis en zonder account.',
    images: [{ url: '/api/og?title=Domeinportefeuille&desc=Beheer%20al%20je%20domeinen%2C%20verloopdata%20en%20vergelijk%20verlengingsprijzen', width: 1200, height: 630 }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
