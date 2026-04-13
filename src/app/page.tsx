import Image from 'next/image';
import SearchHero from '@/components/search/SearchHero';
import TrustBar from '@/components/ui/TrustBar';
import ProWaitlist from '@/components/ui/ProWaitlist';
import FaqSection from '@/components/sections/FaqSection';
import AdSenseUnit from '@/components/ads/AdSenseUnit';
import { TLD_CONFIG, ORDERED_TLDS } from '@/lib/tlds';
import { BLOG_POSTS } from '@/lib/blog-content';
import JsonLd from '@/components/seo/JsonLd';
import Link from 'next/link';

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'CheckJouwDomein.nl',
  url: 'https://checkjouwdomein.nl',
  description: 'Gratis domeinnaam beschikbaarheidscheck met RDAP, EUIPO merkencheck, AI naamgenerator en registrar-vergelijker.',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: 'https://checkjouwdomein.nl/zoek/{search_term_string}' },
    'query-input': 'required name=search_term_string',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Hoe controleer ik of een domeinnaam beschikbaar is?',
      acceptedAnswer: { '@type': 'Answer', text: 'Voer je gewenste keyword in de zoekbalk in. CheckJouwDomein.nl controleert automatisch de beschikbaarheid van tientallen domeinnamen met jouw keywords via het RDAP-protocol, de officiële standaard voor domeinregistraties.' },
    },
    {
      '@type': 'Question',
      name: 'Wat is het verschil tussen .nl en .com?',
      acceptedAnswer: { '@type': 'Answer', text: '.nl is de Nederlandse landcode-extensie en geeft vertrouwen aan Nederlandse bezoekers. .com is de meest bekende internationale extensie. Voor een Nederlands bedrijf dat zich richt op de Nederlandse markt raden wij .nl aan. Wil je internationaal? Kies .com.' },
    },
    {
      '@type': 'Question',
      name: 'Wat kost een domeinnaam registreren?',
      acceptedAnswer: { '@type': 'Answer', text: 'Een .nl domein kost gemiddeld € 6–10 per jaar. Een .com domein kost € 10–15 per jaar. Prijzen verschillen per registrar. Via onze vergelijkingsknoppen zie je direct waar je het goedkoopst terecht kunt.' },
    },
    {
      '@type': 'Question',
      name: 'Kan ik een domein direct registreren via deze website?',
      acceptedAnswer: { '@type': 'Answer', text: 'Nee, CheckJouwDomein.nl is een gratis checker. Wanneer je op een registrar-knop klikt, word je doorgestuurd naar die registrar om het domein te registreren. Wij ontvangen hiervoor een kleine affiliate-vergoeding, zonder extra kosten voor jou.' },
    },
    {
      '@type': 'Question',
      name: 'Wat is een goede domeinnaam?',
      acceptedAnswer: { '@type': 'Answer', text: 'Een goede domeinnaam is kort (maximaal 15 tekens), makkelijk te onthouden, bevat geen koppeltekens of cijfers, en eindigt bij voorkeur op .nl of .com. Onze score-indicator helpt je de beste keuze te maken.' },
    },
    {
      '@type': 'Question',
      name: 'Hoe snel is de beschikbaarheidscheck?',
      acceptedAnswer: { '@type': 'Answer', text: 'De check duurt gemiddeld 10–30 seconden afhankelijk van het aantal suggesties en de snelheid van de domeinregisters. Beschikbare domeinen verschijnen bovenaan zodra ze gevonden worden.' },
    },
  ],
};

const POPULAR_KEYWORDS = [
  'webshop', 'restaurant', 'freelancer', 'portfolio', 'blog',
  'consultant', 'fotografie', 'coaching', 'advocaat', 'bakkerij',
];

const BLOG_COVER_IMAGES: Record<string, string> = {
  'beste-domeinnaam-kiezen': 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=600&auto=format&fit=crop&q=80',
  'nl-vs-com-domein':        'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&auto=format&fit=crop&q=80',
  'domeinnaam-tips-2026':    'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=600&auto=format&fit=crop&q=80',
  'wat-is-een-domein':       'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
};

export default function HomePage() {
  const blogPreview = BLOG_POSTS.slice(0, 3);

  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={faqSchema} />
      <SearchHero />
      <TrustBar />

      {/* ── Stats banner ─────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)', padding: '28px 20px' }}>
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {[
              { num: '12.000+', label: 'domeinen gecheckt' },
              { num: '50+',     label: 'extensies beschikbaar' },
              { num: '5',       label: 'registrars vergeleken' },
              { num: '100%',    label: 'gratis & open' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-black" style={{ letterSpacing: '-0.04em' }}>{s.num}</div>
                <div className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.75)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-5 max-w-6xl space-y-16 pb-20 pt-12">

        {/* AdSense */}
        <AdSenseUnit slot="HOMEPAGE_TOP_SLOT" format="leaderboard" />

        {/* Popular keywords */}
        <section>
          <p className="type-label mb-4">Populaire zoekopdrachten</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_KEYWORDS.map((kw) => (
              <Link key={kw} href={`/zoek/${kw}`} className="chip-ghost">
                {kw}
              </Link>
            ))}
          </div>
        </section>

        {/* TLD grid */}
        <section>
          <p className="type-label mb-4">Beschikbare extensies</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ORDERED_TLDS.map((tld) => {
              const config = TLD_CONFIG[tld];
              return (
                <div key={tld} className="card p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black" style={{ color: 'var(--primary)', letterSpacing: '-0.02em' }}>
                      {tld}
                    </span>
                    {config.flag && <span className="text-lg" aria-hidden="true">{config.flag}</span>}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{config.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-subtle)' }}>{config.averagePrice}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <section className="section-alt p-8 sm:p-12">
          <p className="type-label text-center mb-2">Hoe het werkt</p>
          <h2 className="type-heading text-center mb-10" style={{ color: 'var(--text)' }}>
            In drie stappen naar jouw domein
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                color: 'rgba(79,70,229,0.10)',
                iconColor: '#4F46E5',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                ),
                title: 'Voer keywords in',
                desc: 'Typ de naam van je bedrijf, merk of project — of een hele zin. Wij extraheren het juiste trefwoord.',
              },
              {
                num: '02',
                color: 'rgba(245,158,11,0.10)',
                iconColor: '#D97706',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
                    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                ),
                title: 'Wij checken alles',
                desc: 'Real-time RDAP-check op .nl, .com, .be en meer — plus AI-suggesties, sociale handles en merkencheck.',
              },
              {
                num: '03',
                color: 'rgba(5,150,105,0.10)',
                iconColor: '#059669',
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                ),
                title: 'Registreer direct',
                desc: 'Vergelijk prijzen bij alle Nederlandse registrars en registreer direct bij de goedkoopste.',
              },
            ].map((item) => (
              <div key={item.num} className="card p-6 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.iconColor, flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <span className="text-3xl font-black" style={{ color: 'rgba(0,0,0,0.06)', letterSpacing: '-0.04em', lineHeight: 1 }}>
                    {item.num}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1.5" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features showcase */}
        <section>
          <p className="type-label text-center mb-2">Waarom CheckJouwDomein.nl</p>
          <h2 className="type-heading text-center mb-10" style={{ color: 'var(--text)' }}>
            Meer dan een domeincheck
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '🌐', title: 'Real-time RDAP', desc: 'Directe beschikbaarheidscheck via officiële SIDN-, Verisign- en DNS.be-registers. Geen verouderde data.', accent: 'rgba(79,70,229,0.06)', iconBg: 'rgba(79,70,229,0.10)', border: 'rgba(79,70,229,0.12)' },
              { icon: '🏛️', title: 'EUIPO Merkencheck', desc: 'Uniek in Nederland: controleer of jouw merknaam al geregistreerd is als Europees handelsmerk.', accent: 'rgba(245,158,11,0.06)', iconBg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.15)' },
              { icon: '🛒', title: 'Domeinwinkelmand', desc: 'Selecteer meerdere domeinen tegelijk en zie direct bij welke registrar je het goedkoopst uitbent.', accent: 'rgba(5,150,105,0.06)', iconBg: 'rgba(5,150,105,0.10)', border: 'rgba(5,150,105,0.12)' },
              { icon: '✦', title: 'AI Naamgenerator', desc: 'Nog geen naam? Onze AI genereert 12 merknamen op basis van je sector en stijl — en checkt direct de beschikbaarheid.', accent: 'rgba(99,102,241,0.06)', iconBg: 'rgba(99,102,241,0.10)', border: 'rgba(99,102,241,0.12)' },
              { icon: '💼', title: 'KVK Handelsnaam', desc: 'Check of je bedrijfsnaam al in gebruik is bij de Kamer van Koophandel — in één klik, naast de domeincheck.', accent: 'rgba(6,182,212,0.06)', iconBg: 'rgba(6,182,212,0.10)', border: 'rgba(6,182,212,0.12)' },
              { icon: '📊', title: 'Domeinportefeuille', desc: 'Houd al je domeinen bij op één plek. Zie wanneer ze verlopen, vergelijk verlengingsprijzen en bespaar geld.', accent: 'rgba(16,185,129,0.06)', iconBg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.12)' },
            ].map((f) => (
              <div key={f.title} className="feature-card" style={{ background: f.accent, borderColor: f.border }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: f.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: 14 }}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--text)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Over ons strip */}
        <section
          className="rounded-2xl overflow-hidden"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Photo side — CSS background avoids next/image fill positioning edge-cases */}
            <div
              style={{
                minHeight: 300,
                background: `linear-gradient(135deg, rgba(79,70,229,0.4) 0%, rgba(6,182,212,0.2) 100%), url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80') center/cover no-repeat`,
                display: 'flex',
                alignItems: 'flex-end',
                padding: '24px',
              }}
            >
              <div className="text-white">
                <div className="text-4xl font-black" style={{ letterSpacing: '-0.04em' }}>🇳🇱</div>
                <div className="text-sm font-semibold mt-1" style={{ color: 'rgba(255,255,255,0.9)' }}>Gemaakt voor Nederland & België</div>
              </div>
            </div>

            {/* Content side */}
            <div className="p-8 flex flex-col justify-center">
              <p className="type-label mb-2">Over ons</p>
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
                Gebouwd door ondernemers, voor ondernemers
              </h2>
              <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
                CheckJouwDomein.nl begon als frustratie: bestaande tools waren traag, vaag of vol met advertenties.
                Wij bouwden de tool die wij zelf wilden — transparant, snel en gratis.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-5">
                {[
                  { num: '12K+', label: 'checks gedaan' },
                  { num: '5',    label: 'registrars' },
                  { num: '50+',  label: 'extensies' },
                  { num: '100%', label: 'gratis' },
                ].map((s) => (
                  <div key={s.label} className="text-center p-3 rounded-xl" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                    <div className="text-xl font-black" style={{ color: 'var(--primary)', letterSpacing: '-0.03em' }}>{s.num}</div>
                    <div className="text-xs" style={{ color: 'var(--text-subtle)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <Link href="/" className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
                Start gratis check →
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section-alt p-8 sm:p-12">
          <p className="type-label text-center mb-2">Ervaringen</p>
          <h2 className="type-heading text-center mb-10" style={{ color: 'var(--text)' }}>
            Wat ondernemers zeggen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&crop=face&q=80',
                name: 'Lisa van den Berg',
                role: 'Eigenaar · BakkerijOnline.nl',
                quote: 'In twee minuten had ik mijn .nl én .com geregistreerd. De EUIPO-check gaf me ook gelijk zekerheid over mijn merknaam.',
                tld: '.nl',
              },
              {
                photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&crop=face&q=80',
                name: 'Daan Visser',
                role: 'Freelance developer',
                quote: 'De AI naamgenerator gaf me 12 ideeën die ik zelf nooit had bedacht. Binnen 10 minuten had ik een domein geboekt.',
                tld: '.io',
              },
              {
                photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&crop=face&q=80',
                name: 'Sophie Martens',
                role: 'Life coach · Antwerpen',
                quote: 'Eindelijk een tool die ook .be checkt én laat zien of mijn naam al op Instagram vrij is. Absoluut aanrader!',
                tld: '.be',
              },
            ].map((t) => (
              <div key={t.name} className="card p-6 flex flex-col gap-4">
                <div style={{ fontSize: '1.25rem', color: '#F59E0B', letterSpacing: '0.05em' }}>★★★★★</div>
                <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-muted)' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                  <Image
                    src={t.photo}
                    alt={t.name}
                    width={44}
                    height={44}
                    style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid var(--border)' }}
                  />
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{t.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-subtle)' }}>{t.role}</div>
                  </div>
                  <div className="ml-auto text-xs font-mono font-semibold px-2 py-1 rounded-md" style={{ background: 'var(--available-bg)', color: 'var(--available)' }}>
                    {t.tld}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Blog preview */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="type-label mb-1">Van ons blog</p>
              <h2 className="type-heading" style={{ color: 'var(--text)' }}>Tips & advies</h2>
            </div>
            <Link href="/blog" className="text-sm font-semibold hidden sm:block" style={{ color: 'var(--primary)' }}>
              Alle artikelen →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {blogPreview.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block" style={{ textDecoration: 'none' }}>
                <article
                  className="rounded-2xl overflow-hidden h-full flex flex-col"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
                >
                  <div style={{ height: 160, position: 'relative', overflow: 'hidden' }}>
                    <Image
                      src={BLOG_COVER_IMAGES[post.slug] ?? 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=600&auto=format&fit=crop&q=80'}
                      alt={post.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.08) 100%)' }} />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {post.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-bold text-sm mb-2 flex-1" style={{ color: 'var(--text)', letterSpacing: '-0.01em', lineHeight: 1.4 }}>
                      {post.title}
                    </h3>
                    <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                      <time className="text-xs" style={{ color: 'var(--text-subtle)' }}>{post.publishedAt}</time>
                      <span className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>Lees →</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
          <div className="text-center mt-5 sm:hidden">
            <Link href="/blog" className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
              Alle artikelen →
            </Link>
          </div>
        </section>

        {/* AdSense mid */}
        <AdSenseUnit slot="HOMEPAGE_MID_SLOT" format="responsive" />

        {/* FAQ */}
        <FaqSection />

        {/* Pro waitlist */}
        <ProWaitlist />

      </div>
    </>
  );
}
