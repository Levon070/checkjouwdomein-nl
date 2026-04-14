import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Over ons — Het verhaal achter CheckJouwDomein.nl',
  description:
    'Lees wie er achter CheckJouwDomein.nl zit, waarom we de tool hebben gebouwd en hoe we onze onafhankelijkheid waarborgen. Gratis domeinnaam checker voor .nl, .com, .be en 50+ extensies.',
  alternates: { canonical: 'https://checkjouwdomein.nl/over-ons' },
  openGraph: {
    title: 'Over ons — Het verhaal achter CheckJouwDomein.nl',
    description:
      'Lees wie er achter CheckJouwDomein.nl zit, waarom we de tool hebben gebouwd en hoe we onze onafhankelijkheid waarborgen.',
    type: 'website',
    url: 'https://checkjouwdomein.nl/over-ons',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Over ons — CheckJouwDomein.nl',
    description:
      'Gratis, onafhankelijke domeinnaam checker voor de Nederlandse en Belgische markt.',
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
  areaServed: ['NL', 'BE'],
  founder: {
    '@type': 'Person',
    name: 'Lars Meijer',
    jobTitle: 'Oprichter & Directeur',
    url: 'https://checkjouwdomein.nl/over-ons',
  },
  sameAs: [],
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Lars Meijer',
  jobTitle: 'Oprichter & Directeur',
  worksFor: {
    '@type': 'Organization',
    name: 'CheckJouwDomein.nl',
    url: 'https://checkjouwdomein.nl',
  },
  url: 'https://checkjouwdomein.nl/over-ons',
  description:
    'Lars Meijer is de oprichter van CheckJouwDomein.nl, een gratis domeinnaam checker voor de Nederlandse en Belgische markt.',
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://checkjouwdomein.nl' },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Over ons',
      item: 'https://checkjouwdomein.nl/over-ons',
    },
  ],
};

export default function OverOnsPage() {
  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={personSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="container mx-auto px-5 py-12 max-w-2xl">
        {/* Breadcrumb */}
        <nav
          className="text-sm mb-8 flex items-center gap-2 flex-wrap"
          aria-label="Breadcrumb"
          style={{ color: 'var(--text-subtle)' }}
        >
          <Link href="/" className="link-muted">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span style={{ color: 'var(--text-muted)' }}>Over ons</span>
        </nav>

        {/* Badge */}
        <div className="mb-4">
          <span className="chip-ghost">Opgericht 2026</span>
        </div>

        {/* H1 */}
        <h1
          className="type-heading mb-6"
          style={{ color: 'var(--text)', fontSize: 'clamp(1.75rem, 4vw, 2.25rem)' }}
        >
          Over CheckJouwDomein.nl
        </h1>

        <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2.5rem' }}>
          CheckJouwDomein.nl is een gratis, onafhankelijke domeinnaam checker voor de Nederlandse en
          Belgische markt. Wij helpen ondernemers, freelancers en makers om in enkele seconden te
          zien of hun gewenste domeinnaam beschikbaar is — en zo niet, welke alternatieven er wél
          vrij zijn. Op deze pagina lees je wie we zijn, waarom we dit hebben gebouwd en hoe we
          werken.
        </p>

        {/* Sectie 1: Waarom we dit begonnen */}
        <section className="mb-10">
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: '0.75rem',
              letterSpacing: '-0.01em',
            }}
          >
            Waarom we dit begonnen
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
            Het idee voor CheckJouwDomein.nl ontstond uit pure frustratie. Lars Meijer, de
            initiatiefnemer achter dit platform, is al jaren actief als ondernemer en heeft in die
            tijd tientallen bedrijfsnamen en projecten bedacht. Telkens opnieuw herhaalde zich
            hetzelfde patroon: je hebt een naam, je gaat naar een registrar-website, typt de naam
            in, en krijgt te horen dat het domein al bezet is. Dan begin je handmatig te variëren.
            Je probeert een koppelteken. Je voegt &ldquo;online&rdquo; of &ldquo;nl&rdquo; toe aan
            het einde. Je schakelt over van .nl naar .com. Je probeert een synoniem. Variant na
            variant, tab na tab, totdat je ofwel iets vindt dat nét acceptabel is — of helemaal
            ontmoedigd afhaakt.
          </p>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
            Na de zoveelste keer dat dit patroon zich herhaalde, besloot Lars het anders te doen.
            De vraag was simpel: waarom bestaat er geen tool die dit proces automatiseert? Eén plek
            waar je je gewenste naam invoert, direct ziet of die beschikbaar is, en meteen een
            lijst krijgt van de beste alternatieven — gesorteerd op relevantie, niet op wie het
            meeste betaalt? In 2026 zette hij zijn plan om in een werkend product en lanceerde hij
            CheckJouwDomein.nl.
          </p>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
            Wij zijn een klein, gedreven team dat gelooft dat het vinden van een goede domeinnaam
            niet ingewikkeld hoeft te zijn. De technologie om dit probleem op te lossen bestaat al
            — het RDAP-protocol geeft realtime beschikbaarheidsdata terug, moderne AI-modellen
            kunnen in seconden honderden naamvarianten genereren, en openbare merkregisters zoals
            het EUIPO zijn vrij toegankelijk. We hebben al die losse stukken samengevoegd in één
            overzichtelijke interface, en die interface is voor iedereen gratis beschikbaar.
          </p>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
            We bouwen verder. We luisteren naar gebruikers die feedback geven via
            info@checkjouwdomein.nl en voegen regelmatig nieuwe extensies en functies toe. Ons doel
            blijft onveranderd: zo min mogelijk drempel tussen jouw idee en jouw domeinnaam.
          </p>
        </section>

        {/* Sectie 2: Ons team */}
        <section className="mb-10">
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: '0.75rem',
              letterSpacing: '-0.01em',
            }}
          >
            Ons team
          </h2>

          <div
            className="card"
            style={{ padding: '1.25rem 1.5rem', marginBottom: '1.25rem' }}
          >
            <p
              style={{
                fontWeight: 700,
                color: 'var(--text)',
                marginBottom: '0.25rem',
                fontSize: '1rem',
              }}
            >
              Lars Meijer — Oprichter &amp; Directeur
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, margin: 0 }}>
              Lars is de initiatiefnemer en eindverantwoordelijke van CheckJouwDomein.nl. Hij houdt
              toezicht op de productontwikkeling, de technische infrastructuur en de redactionele
              koers van het platform. CheckJouwDomein.nl is ingeschreven bij de Kamer van
              Koophandel.
            </p>
          </div>

          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
            Naast Lars werken wij samen met een kleine groep onafhankelijke domein-experts die de
            blogcontent schrijven. Zij hebben een achtergrond in webhosting, online marketing of
            juridische aspecten van domeinnamen en merken. We publiceren geen nepbiografieën of
            fictieve namen — elk artikel vermeldt transparant wie de auteur is of dat het door de
            redactie is samengesteld op basis van openbare bronnen.
          </p>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
            Onze redactie opereert volledig autonoom van commerciële partners. Registrars die in
            onze vergelijking staan, hebben geen invloed op wat wij schrijven of hoe wij hun
            diensten beoordelen.
          </p>
        </section>

        {/* Sectie 3: Wat wij doen */}
        <section className="mb-10">
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: '0.75rem',
              letterSpacing: '-0.01em',
            }}
          >
            Wat wij doen
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
            CheckJouwDomein.nl is een gratis domeinnaam checker voor .nl, .com, .be en meer dan 50
            andere extensies. Dit is wat je bij ons vindt:
          </p>
          <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.25rem' }}>
            {[
              'Realtime beschikbaarheidscontrole via het RDAP-protocol',
              'Prijsvergelijking bij 9 registrars naast elkaar',
              'AI-naamgenerator voor inspiratie op maat',
              'Merkcheck via het EUIPO-merkenregister',
              'Meer dan 50 domeinnaamextensies doorzoekbaar',
            ].map((item) => (
              <li
                key={item}
                style={{
                  color: 'var(--text-muted)',
                  lineHeight: 1.7,
                  marginBottom: '0.4rem',
                  listStyleType: 'disc',
                }}
              >
                {item}
              </li>
            ))}
          </ul>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
            Elke feature is bewust gebouwd vanuit een concreet gebruikersprobleem. De RDAP-check
            bestaat omdat WHOIS-data steeds vaker verouderd of onvolledig is — RDAP is het moderne
            standaardprotocol dat registrars verplicht realtime statusdata beschikbaar stellen. De
            prijsvergelijking bij negen registrars bestaat omdat de verschillen groter zijn dan de
            meeste mensen verwachten: voor exact dezelfde .nl-domeinnaam kun je afhankelijk van de
            registrar een heel andere jaarprijs betalen, met grote variaties in de verlengingskosten.
            Wij zetten alles naast elkaar zodat jij een weloverwogen keuze kunt maken zonder zelf
            alle websites af te gaan.
          </p>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
            De AI-naamgenerator lost het brainstormpobleem op: als je gewenste naam bezet is,
            genereert de tool op basis van jouw invoer tientallen alternatieven die qua klank,
            betekenis of structuur dicht bij jouw originele idee liggen. De EUIPO-merkcheck is
            toegevoegd omdat een vrije domeinnaam niet automatisch betekent dat je de naam ook
            commercieel mag gebruiken — een snelle check in het Europese merkenregister kan je
            later veel juridische hoofdpijn besparen. Al deze functies zijn gratis en vereisen geen
            account of registratie.
          </p>
        </section>

        {/* Sectie 4: Onze onafhankelijkheid */}
        <section className="mb-10">
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: '0.75rem',
              letterSpacing: '-0.01em',
            }}
          >
            Onze onafhankelijkheid
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
            CheckJouwDomein.nl is gratis te gebruiken. Om de hosting, ontwikkeling en het
            onderhoud te bekostigen, maken wij gebruik van affiliate-links. Dat werkt als volgt:
            wanneer je via een knop op onze site doorklinkt naar een registrar en daar een
            domeinnaam registreert, ontvangen wij een kleine vergoeding van die registrar. Voor jou
            verandert er niets aan de prijs — je betaalt hetzelfde als wanneer je direct naar de
            registrar zou gaan.
          </p>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
            Wij vinden het belangrijk om hier volledig transparant over te zijn. De volgorde waarin
            registrars worden getoond, wordt niet bepaald door de hoogte van de affiliate-vergoeding.
            Wij sorteren standaard op prijs, zodat je altijd de goedkoopste optie als eerste ziet.
            Geen enkele registrar kan een betere positie inkopen.
          </p>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
            Onze redactie schrijft en publiceert artikelen op basis van eigen onderzoek en openbare
            bronnen. Commerciële partners hebben geen inzage in conceptteksten en geen
            goedkeuringsrecht over gepubliceerde content. Als wij een registrar bekritiseren in een
            artikel, doen wij dat ongeacht of diezelfde registrar een affiliate-partner is.
          </p>
        </section>

        {/* Sectie 5: Betrouwbaarheid */}
        <section className="mb-10">
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: '0.75rem',
              letterSpacing: '-0.01em',
            }}
          >
            Betrouwbaarheid
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
            De beschikbaarheidsdata die wij tonen, is realtime en wordt opgehaald via het
            RDAP-protocol — de internationale standaard voor domeinregistratie-informatie. Voor
            .nl-domeinen maken wij gebruik van data afkomstig van SIDN, de beheerder van het
            .nl-domeinregister. SIDN is de gezaghebbende bron voor de status van alle .nl-adressen
            en wij raadplegen dit register direct, zonder tussenliggende cache die verouderde
            resultaten kan opleveren.
          </p>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
            Voor merkcontroles koppelen wij aan het EUIPO — het Europese bureau voor intellectuele
            eigendom. Dat is de officiële instantie voor Europese merkregistraties en de betrouwbare
            bron voor iedereen die wil controleren of een naam al als merk is vastgelegd.
          </p>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
            Onze website draait volledig over HTTPS. Alle verbindingen zijn versleuteld. Wij hebben
            een{' '}
            <Link href="/privacybeleid" className="link-muted">
              privacybeleid
            </Link>{' '}
            dat beschrijft welke gegevens wij verzamelen, hoe wij die gebruiken en hoe lang wij die
            bewaren. CheckJouwDomein.nl is ingeschreven bij de Kamer van Koophandel.
          </p>
        </section>

        {/* Sectie 6: Ons beleid */}
        <section className="mb-10">
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: '0.75rem',
              letterSpacing: '-0.01em',
            }}
          >
            Ons beleid
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
            Wij geloven in een internet waarbij jij de controle houdt over je eigen gegevens. Dat
            vertaalt zich in een aantal concrete keuzes:
          </p>
          <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.25rem' }}>
            {[
              'Geen tracking zonder toestemming — wij plaatsen geen marketing- of trackingcookies zonder dat je daar expliciet mee hebt ingestemd.',
              'Geen verkoop van gebruikersdata — wij verkopen, verhuren of delen jouw gegevens niet met derden voor commerciële doeleinden.',
              'Transparant cookiebeleid — je kunt je cookievoorkeuren op elk moment aanpassen via onze cookiebanner.',
              'Minimale dataverzameling — wij verzamelen alleen wat nodig is om de dienst te laten werken en te verbeteren.',
            ].map((item) => (
              <li
                key={item}
                style={{
                  color: 'var(--text-muted)',
                  lineHeight: 1.7,
                  marginBottom: '0.5rem',
                  listStyleType: 'disc',
                }}
              >
                {item}
              </li>
            ))}
          </ul>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
            Meer details vind je in ons{' '}
            <Link href="/privacybeleid" className="link-muted">
              privacybeleid
            </Link>
            . Heb je vragen of opmerkingen over hoe wij omgaan met jouw gegevens, neem dan contact
            met ons op.
          </p>
        </section>

        {/* Sectie 7: Contact */}
        <section className="mb-10">
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: '0.75rem',
              letterSpacing: '-0.01em',
            }}
          >
            Contact
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
            Heb je een vraag, opmerking of suggestie? Wij horen het graag. Je kunt ons bereiken via
            e-mail:{' '}
            <a
              href="mailto:info@checkjouwdomein.nl"
              className="link-muted"
              style={{ fontWeight: 600 }}
            >
              info@checkjouwdomein.nl
            </a>
            . Wij streven ernaar binnen 2 werkdagen te reageren.
          </p>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
            Voor technische meldingen, onjuiste domeindata of vragen over onze affiliate-aanpak
            kun je eveneens dit adres gebruiken. Wij lezen alles en reageren altijd persoonlijk —
            geen geautomatiseerde antwoorden.
          </p>
        </section>

        {/* CTA box */}
        <div className="section-alt mt-14 p-8 text-center">
          <p className="type-label mb-2">Probeer het zelf</p>
          <h2
            className="text-xl font-bold mb-3"
            style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
          >
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
