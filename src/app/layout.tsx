import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JsonLd from '@/components/seo/JsonLd';
import CookieBanner from '@/components/ui/CookieBanner';
import AnalyticsProvider from '@/components/analytics/AnalyticsProvider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  preload: false,
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
  alternates: {
    canonical: 'https://checkjouwdomein.nl',
    languages: {
      'nl-NL': 'https://checkjouwdomein.nl',
      'nl-BE': 'https://checkjouwdomein.nl',
      'x-default': 'https://checkjouwdomein.nl',
    },
  },
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

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'CheckJouwDomein.nl',
  url: 'https://checkjouwdomein.nl',
  logo: 'https://checkjouwdomein.nl/favicon.svg',
  description: 'Gratis, onafhankelijke domeinnaam checker voor de Nederlandse en Belgische markt',
  email: 'info@checkjouwdomein.nl',
  foundingDate: '2026',
  founder: { '@type': 'Person', name: 'Lars Meijer', url: 'https://checkjouwdomein.nl/over-ons' },
  areaServed: ['NL', 'BE'],
  inLanguage: 'nl-NL',
  sameAs: [],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" dir="ltr">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <meta name="google-adsense-account" content="ca-pub-8874800268655239" />
        <meta name="google-site-verification" content="1WSyANqeH-UJ4CcE14u5c--GGgFtTUkfIhg4csRB6hI" />
        <JsonLd data={organizationSchema} />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <CookieBanner />
        <AnalyticsProvider />
        <Toaster />
        <Script
          id="adsense"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8874800268655239"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
