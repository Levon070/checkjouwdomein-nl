import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Favorieten — CheckJouwDomein.nl',
  description: 'Jouw opgeslagen domeinnamen.',
  robots: { index: false, follow: false },
};

export default function FavorietenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
