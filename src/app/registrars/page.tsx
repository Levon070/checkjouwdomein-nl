import { Metadata } from 'next';
import Link from 'next/link';
import { REGISTRARS } from '@/lib/registrars';
import { TldKey } from '@/types';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Beste Domein Registrar Nederland 2026 — Vergelijk Prijzen & Reviews',
  description:
    'Vergelijk alle Nederlandse domein registrars: TransIP, Mijndomein, Antagonist, Hostnet, GoDaddy en Namecheap. Prijzen, features, klantenservice en eerlijke reviews.',
  alternates: { canonical: 'https://checkjouwdomein.nl/registrars' },
  openGraph: {
    title: 'Beste Domein Registrar 2026 — Eerlijke Vergelijking',
    description: 'Welke registrar is het goedkoopst voor jouw .nl, .com of .be domein? Wij vergelijken prijzen, verlengingskosten en features.',
  },
};

const TLDS_TO_SHOW: TldKey[] = ['.nl', '.com', '.be', '.net', '.io'];

const REGISTRAR_PROS_CONS: Record<string, { pros: string[]; cons: string[] }> = {
  transip: {
    pros: [
      'Meest populaire registrar in Nederland',
      'Gratis WHOIS-privacy op alle domeinen',
      'Krachtige API voor ontwikkelaars',
      'Betrouwbare klantenservice in het Nederlands',
      'Duidelijk controlepaneel',
    ],
    cons: [
      'Niet de allerhoogste introductiekorting',
      'Geen telefonische support (alleen chat/mail)',
    ],
  },
  mijndomein: {
    pros: [
      'Laagste .nl-prijs in Nederland (±€2,99/jr)',
      'Simpel en overzichtelijk paneel',
      'Snel opgezet',
    ],
    cons: [
      'Geen WHOIS-privacy inbegrepen',
      'Geen 2FA op account',
      'Geen API-toegang',
      'Beperkte klantenservice',
    ],
  },
  antagonist: {
    pros: [
      'Beste klantenservice: telefoon, chat én mail',
      'Gratis WHOIS-privacy',
      'DirectAdmin controlepaneel',
      'Transparante pricing zonder verrassingen',
    ],
    cons: [
      'Kleinere registrar, minder naamsbekendheid',
      'Minder TLD-keuze dan grote partijen',
    ],
  },
  namecheap: {
    pros: [
      'Goedkoopste .com wereldwijd',
      'Gratis WHOIS-privacy (WhoisGuard)',
      'Uitstekende API',
      'Groot internationaal platform',
    ],
    cons: [
      'Engelstalig paneel',
      'Verlengingsprijs significant hoger dan eerste jaar',
      'Support in het Engels',
    ],
  },
  godaddy: {
    pros: [
      'Laagste introductieprijs (.nl soms €1,99)',
      'Groot platform, veel opties',
      'Nederlandse klantenservice beschikbaar',
    ],
    cons: [
      'Verlengingsprijs tot 6× hoger dan introprijs ⚠️',
      'WHOIS-privacy is betaald',
      'Geen gratis SSL',
      'Agressieve upsell',
    ],
  },
  hostnet: {
    pros: [
      'Betrouwbaar Nederlands bedrijf',
      'Gratis WHOIS-privacy',
      'Telefonische support',
      'Stабiele prijzen zonder verrassingen',
    ],
    cons: [
      'Duurste registrar in de vergelijking',
      'Geen 2FA',
      'Geen API',
    ],
  },
};

const BEST_FOR: Record<string, string> = {
  transip: 'Beste alles-in-één voor Nederlandse bedrijven',
  mijndomein: 'Beste voor goedkoopste .nl registratie',
  antagonist: 'Beste klantenservice',
  namecheap: 'Beste voor internationale .com domeinen',
  godaddy: 'Beste introductieprijs (let op verlenging!)',
  hostnet: 'Beste voor wie zekerheid boven prijs stelt',
};

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span style={{ color: '#F59E0B' }}>
      {'★'.repeat(full)}{'☆'.repeat(5 - full)}
    </span>
  );
}

export default function RegistrarsPage() {
  const schemaFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Welke domein registrar is het goedkoopst in Nederland?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Mijndomein.nl biedt de laagste prijs voor .nl domeinen (±€2,99/jaar). Voor .com is Namecheap vaak het goedkoopst. Let altijd op de verlengingsprijs, want GoDaddy biedt soms lage introprijzen maar hoge verlengingskosten.',
        },
      },
      {
        '@type': 'Question',
        name: 'Wat is de beste registrar voor Nederlandse bedrijven?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'TransIP is de meest populaire en aanbevolen registrar voor Nederlandse bedrijven. Ze bieden gratis WHOIS-privacy, een krachtige API, en Nederlandstalige ondersteuning. Antagonist is een uitstekend alternatief als je telefonische support belangrijk vindt.',
        },
      },
      {
        '@type': 'Question',
        name: 'Kan ik mijn domein overzetten naar een andere registrar?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ja, je kunt een domein altijd overdragen (transferen) naar een andere registrar. Dit duurt meestal 5-7 dagen voor .com domeinen en is gratis of kost een kleine vergoeding. Voor .nl domeinen gaat dit via de SIDN en duurt het doorgaans 1-3 dagen.',
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={schemaFaq} />

      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(160deg, #EEF2FF 0%, #F6F8FC 50%, #ECFEFF 100%)',
          paddingTop: 64,
          paddingBottom: 56,
        }}
      >
        <div className="container mx-auto px-5 max-w-4xl text-center">
          <span
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full mb-5"
            style={{ background: 'rgba(79,70,229,0.08)', color: 'var(--primary)', border: '1px solid rgba(79,70,229,0.15)' }}
          >
            Bijgewerkt {new Date().getFullYear()}
          </span>
          <h1 className="type-display mb-4" style={{ color: 'var(--text)' }}>
            Beste domein registrar{' '}
            <span className="gradient-text">
              Nederland &amp; België
            </span>
          </h1>
          <p className="type-lead mx-auto max-w-2xl">
            Eerlijke vergelijking van alle grote registrars — prijzen, features, klantenservice en de verborgen verlengingskosten.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-5 max-w-5xl py-12 space-y-16">

        {/* Quick verdict cards */}
        <section>
          <p className="type-label mb-6">Onze aanbevelingen</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'transip', badge: '🏆 Beste algeheel', color: 'var(--primary)' },
              { id: 'mijndomein', badge: '💸 Goedkoopste .nl', color: 'var(--available)' },
              { id: 'antagonist', badge: '🎧 Beste service', color: '#D97706' },
            ].map(({ id, badge, color }) => {
              const r = REGISTRARS.find((reg) => reg.id === id)!;
              const nlPrice = r.detailedPrices['.nl'];
              return (
                <div
                  key={id}
                  className="card p-5"
                  style={{ border: `2px solid ${color}20` }}
                >
                  <span
                    className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3"
                    style={{ background: `${color}15`, color }}
                  >
                    {badge}
                  </span>
                  <h3 className="font-bold text-base mb-1" style={{ color: 'var(--text)' }}>{r.name}</h3>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Stars rating={r.rating} />
                    <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>{r.rating}/5</span>
                  </div>
                  {nlPrice && (
                    <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                      .nl: <strong>{nlPrice.firstYear}</strong>/jr · verlenging {nlPrice.renewal}
                    </p>
                  )}
                  <a
                    href={r.affiliateUrl('jouwdomein.nl')}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    style={{ background: `${color}12`, color, textDecoration: 'none' }}
                  >
                    Bezoek {r.name} →
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        {/* Price comparison table */}
        <section>
          <p className="type-label mb-2">Prijsvergelijking per TLD</p>
          <h2 className="type-heading mb-6" style={{ color: 'var(--text)' }}>
            Eerste jaar vs. verlengingsprijs
          </h2>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse" style={{ minWidth: 700 }}>
                <thead>
                  <tr style={{ background: 'rgba(79,70,229,0.06)' }}>
                    <th className="text-left px-5 py-3 font-semibold" style={{ color: 'var(--text-muted)', width: 140 }}>Registrar</th>
                    {TLDS_TO_SHOW.map((tld) => (
                      <th key={tld} className="px-3 py-3 font-semibold text-center" style={{ color: 'var(--text)' }}>
                        {tld}
                      </th>
                    ))}
                    <th className="px-3 py-3 font-semibold text-center" style={{ color: 'var(--text)' }}>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {REGISTRARS.map((r, i) => (
                    <tr
                      key={r.id}
                      style={{ background: i % 2 === 0 ? 'white' : 'rgba(79,70,229,0.02)', borderTop: '1px solid var(--border)' }}
                    >
                      <td className="px-5 py-3">
                        <div className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{r.name}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--text-subtle)' }}>{r.panelLanguage.toUpperCase()}</div>
                      </td>
                      {TLDS_TO_SHOW.map((tld) => {
                        const p = r.detailedPrices[tld];
                        const warn = p && p.renewalRaw && p.firstYearRaw && p.renewalRaw > p.firstYearRaw * 1.4;
                        return (
                          <td key={tld} className="px-3 py-3 text-center">
                            {p ? (
                              <div>
                                <div className="font-bold text-sm" style={{ color: 'var(--primary)' }}>{p.firstYear}</div>
                                <div
                                  className="text-xs mt-0.5"
                                  style={{ color: warn ? '#D97706' : 'var(--text-subtle)' }}
                                >
                                  ↻ {p.renewal}{warn ? ' ⚠️' : ''}
                                </div>
                              </div>
                            ) : (
                              <span style={{ color: 'var(--text-subtle)' }}>—</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-3 py-3 text-center">
                        <Stars rating={r.rating} />
                        <div className="text-xs mt-0.5" style={{ color: 'var(--text-subtle)' }}>{r.rating}/5</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              className="px-5 py-3 text-xs"
              style={{ background: 'rgba(245,158,11,0.06)', borderTop: '1px solid rgba(245,158,11,0.15)', color: '#D97706' }}
            >
              ⚠️ ↻ = verlengingsprijs. Let op: sommige registrars hanteren een lage introprijs maar een veel hogere verlengingsprijs.
            </div>
          </div>
        </section>

        {/* Individual registrar reviews */}
        <section>
          <p className="type-label mb-2">Uitgebreide reviews</p>
          <h2 className="type-heading mb-8" style={{ color: 'var(--text)' }}>
            Per registrar beoordeeld
          </h2>
          <div className="space-y-8">
            {REGISTRARS.map((r) => {
              const pc = REGISTRAR_PROS_CONS[r.id];
              const bestFor = BEST_FOR[r.id];
              return (
                <div
                  key={r.id}
                  id={r.id}
                  className="card p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-black" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
                          {r.name}
                        </h3>
                        <Stars rating={r.rating} />
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
                          {r.rating}/5
                        </span>
                        <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>
                          ({r.reviewCount?.toLocaleString('nl-NL')} reviews)
                        </span>
                      </div>
                      {bestFor && (
                        <span
                          className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: 'rgba(79,70,229,0.08)', color: 'var(--primary)' }}
                        >
                          {bestFor}
                        </span>
                      )}
                    </div>
                    <a
                      href={r.affiliateUrl('jouwdomein.nl')}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
                      style={{ background: 'var(--primary)', color: 'white', textDecoration: 'none', whiteSpace: 'nowrap' }}
                    >
                      Naar {r.name} →
                    </a>
                  </div>

                  {/* Pricing highlight */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {TLDS_TO_SHOW.filter((tld) => r.detailedPrices[tld]).map((tld) => {
                      const p = r.detailedPrices[tld]!;
                      const warn = p.renewalRaw && p.firstYearRaw && p.renewalRaw > p.firstYearRaw * 1.4;
                      return (
                        <div
                          key={tld}
                          className="px-3 py-2 rounded-lg text-center"
                          style={{ background: 'rgba(79,70,229,0.05)', border: '1px solid rgba(79,70,229,0.1)' }}
                        >
                          <div className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-muted)' }}>{tld}</div>
                          <div className="font-bold text-sm" style={{ color: 'var(--primary)' }}>{p.firstYear}</div>
                          <div className="text-xs" style={{ color: warn ? '#D97706' : 'var(--text-subtle)' }}>
                            ↻ {p.renewal}{warn ? ' ⚠️' : ''}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pros / Cons */}
                  {pc && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                      <div>
                        <p className="text-xs font-semibold mb-2" style={{ color: 'var(--available)' }}>✓ Voordelen</p>
                        <ul className="space-y-1.5">
                          {pc.pros.map((pro) => (
                            <li key={pro} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                              <span style={{ color: 'var(--available)', flexShrink: 0, marginTop: 1 }}>✓</span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold mb-2" style={{ color: 'var(--taken)' }}>✗ Nadelen</p>
                        <ul className="space-y-1.5">
                          {pc.cons.map((con) => (
                            <li key={con} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                              <span style={{ color: 'var(--taken)', flexShrink: 0, marginTop: 1 }}>✗</span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Feature badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {r.features.map((f) => (
                      <span
                        key={f.key}
                        title={f.tooltip}
                        className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md"
                        style={{
                          background: f.value === true ? 'rgba(5,150,105,0.07)' : f.value === 'paid' ? 'rgba(245,158,11,0.07)' : 'rgba(0,0,0,0.04)',
                          color: f.value === true ? 'var(--available)' : f.value === 'paid' ? '#D97706' : 'var(--text-subtle)',
                          border: `1px solid ${f.value === true ? 'rgba(5,150,105,0.15)' : f.value === 'paid' ? 'rgba(245,158,11,0.2)' : 'rgba(0,0,0,0.07)'}`,
                        }}
                      >
                        {f.value === true ? '✓' : f.value === false ? '✗' : '~'} {f.label}
                        {typeof f.value === 'string' && f.value !== 'paid' ? `: ${f.value}` : ''}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <p className="type-label mb-2">Veelgestelde vragen</p>
          <h2 className="type-heading mb-6" style={{ color: 'var(--text)' }}>Over domein registrars</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Welke registrar is het goedkoopst voor .nl?',
                a: 'Mijndomein.nl biedt momenteel de laagste prijs voor .nl domeinen (±€2,99/jaar). TransIP zit op ±€3,99/jaar maar biedt meer features, waaronder gratis WHOIS-privacy. Let altijd op de verlengingsprijs — die kan hoger zijn dan het eerste jaar.',
              },
              {
                q: 'Wat is WHOIS-privacy en heb ik het nodig?',
                a: 'WHOIS-privacy verbergt je naam, adres en contactgegevens in het publieke WHOIS-register. Zonder dit zijn je gegevens voor iedereen zichtbaar, wat kan leiden tot spam en privacy-problemen. TransIP, Antagonist en Namecheap bieden dit gratis aan. GoDaddy rekent er extra voor.',
              },
              {
                q: 'Kan ik mijn domein overzetten naar een andere registrar?',
                a: 'Ja. Een domaintransfer kost doorgaans niets of een kleine vergoeding en duurt 5-7 dagen voor .com en 1-3 dagen voor .nl. Je verliest geen data of hosting. Na de transfer ben je meteen een jaar verlengd bij de nieuwe registrar.',
              },
              {
                q: 'Wat is het verschil tussen een registrar en een hosting provider?',
                a: 'Een registrar registreert je domeinnaam. Een hosting provider host je website (de bestanden en database). Veel partijen zoals TransIP doen beide, maar je hoeft je hosting niet bij dezelfde partij af te nemen als je domein.',
              },
              {
                q: 'Waarom is GoDaddy goedkoop maar toch niet aanbevolen?',
                a: 'GoDaddy biedt vaak lage introductiekorting (soms €1,99 voor het eerste jaar), maar de verlengingsprijs kan 4-6× hoger zijn. Daarnaast kost WHOIS-privacy extra en is er geen gratis SSL. Voor Nederlanders is TransIP of Antagonist vaak een betere keuze.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="card p-5">
                <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text)' }}>{q}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* VPN tip */}
        <section
          className="rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5"
          style={{
            background: 'linear-gradient(135deg, rgba(6,182,212,0.05) 0%, rgba(79,70,229,0.04) 100%)',
            border: '1px solid rgba(6,182,212,0.15)',
          }}
        >
          <div className="text-3xl shrink-0">🔒</div>
          <div className="flex-1 text-center sm:text-left">
            <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>
              Bescherm je online privacy — ook na registratie
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              WHOIS-privacy verbergt je gegevens in het register, maar je internetverbinding zelf is nog steeds zichtbaar.
              Met een VPN surf je anoniemer en veiliger, ook als je je domein beheert op openbare wifi.
            </p>
          </div>
          <a
            href="https://partner.vpnnederland.nl/c?c=38742&m=2378194&a=508642&r=&u="
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl whitespace-nowrap transition-colors"
            style={{ background: 'rgba(6,182,212,0.1)', color: '#0891B2', border: '1px solid rgba(6,182,212,0.2)', textDecoration: 'none' }}
          >
            VPNnederland.nl →
          </a>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="type-heading mb-3" style={{ color: 'var(--text)' }}>Klaar om te registreren?</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Controleer eerst of jouw domeinnaam beschikbaar is — dan zie je direct de goedkoopste registrar.
          </p>
          <Link
            href="/"
            className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold"
          >
            Check domeinnaam beschikbaarheid →
          </Link>
        </section>

      </div>
    </>
  );
}
