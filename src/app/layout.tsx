import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JsonLd from '@/components/seo/JsonLd';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://checkjouwdomein.nl'),
  title: {
    default: 'Domein Check — Controleer Domeinnaam Beschikbaarheid | CheckJouwDomein.nl',
    template: '%s | CheckJouwDomein.nl',
  },
  description:
    'Controleer gratis of jouw domeinnaam beschikbaar is. Bekijk .nl, .com, .be en meer. Vergelijk prijzen bij TransIP, Mijndomein en andere registrars.',
  keywords: ['domein check', 'domeinnaam beschikbaar', 'domein registreren', 'domeinnaam zoeken', 'domein checker'],
  alternates: { canonical: 'https://checkjouwdomein.nl' },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    siteName: 'CheckJouwDomein.nl',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'CheckJouwDomein.nl — Gratis domeinnaam checker' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/api/og'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
};

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'CheckJouwDomein.nl',
  url: 'https://checkjouwdomein.nl',
  description: 'Gratis domein beschikbaarheid checker voor .nl, .com en meer',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  inLanguage: 'nl-NL',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" dir="ltr">
      <head>
        <link rel="alternate" hrefLang="nl" href="https://checkjouwdomein.nl" />
        <link rel="alternate" hrefLang="x-default" href="https://checkjouwdomein.nl" />
        <JsonLd data={webAppSchema} />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <Script
          id="adsense"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8874800268655239"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
