import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Over ons — Het verhaal achter CheckJouwDomein.nl',
  description: 'Ontdek waarom CheckJouwDomein.nl is gebouwd en wie er achter zit.',
  alternates: { canonical: 'https://checkjouwdomein.nl/over-ons' },
  openGraph: {
    title: 'Over ons — Het verhaal achter CheckJouwDomein.nl',
    description: 'Ontdek waarom CheckJouwDomein.nl is gebouwd en wie er achter zit.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'CheckJouwDomein.nl',
  url: 'https://checkjouwdomein.nl',
  description: 'Gratis, onafhankelijke domeinnaam checker voor de Nederlandse markt',
  email: 'info@checkjouwdomein.nl',
  foundingDate: '2026',
  inLanguage: 'nl-NL',
  areaServed: 'NL',
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://checkjouwdomein.nl' },
    { '@type': 'ListItem', position: 2, name: 'Over ons', item: 'https://checkjouwdomein.nl/over-ons' },
  ],
};

export default function OverOnsPage() {
  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="container mx-auto px-5 py-12 max-w-2xl">
        <nav className="text-sm mb-8 flex items-center gap-2 flex-wrap" style={{ color: 'var(--text-subtle)' }}>
          <Link href="/" className="link-muted">Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-muted)' }}>Over ons</span>
        </nav>

        <h1 className="type-heading mb-6" style={{ color: 'var(--text)', fontSize: 'clamp(1.75rem, 4vw, 2.25rem)' }}>
          Over CheckJouwDomein.nl
        </h1>

        <section className="mb-10">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
            Waarom zijn we dit begonnen?
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
            Je kent het probleem: je hebt een geweldig idee voor een bedrijfsnaam of project, zoekt de bijpassende domeinnaam op — en die is al bezet. Dan begint het handmatige gezoek. Je probeert een koppelteken hier, een andere extensie daar, een extra woord eraan vast. Variant na variant, één voor één.
          </p>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
            Wij bouwden CheckJouwDomein.nl omdat we zelf ook steeds tegen hetzelfde probleem aanliepen: je wilt een domeinnaam registreren, je ziet dat die al bezet is, en dan begin je eindeloos varianten te proberen. Dat moet slimmer kunnen.
          </p>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
            Dus bouwden we een tool die dat zware werk overneemt. Voer je gewenste naam in, en je ziet direct de beste beschikbare alternatieven — zo dicht mogelijk bij jouw oorspronkelijke idee.
          </p>
        </section>

        <section className="mb-10">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
            Wat doen we?
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
            CheckJouwDomein.nl is een gratis domeinnaam checker voor .nl, .com, .be en meer dan 50 andere extensies. Dit is wat je bij ons vindt:
          </p>
          <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
            {[
              'Realtime beschikbaarheidscontrole via het RDAP-protocol',
              'Prijsvergelijking bij 9 registrars naast elkaar',
              'AI-naamgenerator voor inspiratie op maat',
              'Merkcheck via het EUIPO-merkenregister',
              'Meer dan 50 domeinnaamextensies doorzoekbaar',
            ].map((item) => (
              <li key={item} style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '0.4rem', listStyleType: 'disc' }}>
                {item}
              </li>
            ))}
          </ul>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
            Alles op één plek, zonder dat je meerdere registrar-websites hoeft te bezoeken.
          </p>
        </section>

        <section className="mb-10">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
            Onze belofte
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
            CheckJouwDomein.nl is volledig onafhankelijk. We werken niet in opdracht van registrars en accepteren geen betaalde voorkeursposities. Alle vergelijkingen zijn gebaseerd op echte, actuele prijzen.
          </p>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
            Onze enige prioriteit is dat jij snel de juiste domeinnaam vindt, tegen de eerlijkste prijs.
          </p>
        </section>

        <div className="section-alt mt-14 p-8 text-center">
          <p className="type-label mb-2">Probeer het zelf</p>
          <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Klaar om jouw domeinnaam te vinden?
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Gratis, onafhankelijk en direct resultaat. Geen registratie vereist.
          </p>
          <Link href="/" className="btn-primary" style={{ display: 'inline-flex' }}>
            Zoek een domeinnaam →
          </Link>
        </div>
      </div>
    </>
  );
}
