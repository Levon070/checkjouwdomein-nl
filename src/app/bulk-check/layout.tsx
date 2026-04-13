import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bulk Domeincheck — Check Meerdere Domeinen Tegelijk',
  description:
    'Controleer tientallen domeinnamen tegelijk op beschikbaarheid. Plak een lijst met keywords of domeinen en ontvang direct resultaten. Gratis.',
  alternates: { canonical: 'https://checkjouwdomein.nl/bulk-check' },
  openGraph: {
    title: 'Bulk Domeincheck — Meerdere Domeinen Tegelijk | CheckJouwDomein.nl',
    description: 'Controleer tientallen domeinnamen tegelijk op beschikbaarheid. Snel, gratis en zonder account.',
    images: [{ url: '/api/og?title=Bulk%20Domeincheck&desc=Controleer%20tientallen%20domeinnamen%20tegelijk%20op%20beschikbaarheid', width: 1200, height: 630 }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
