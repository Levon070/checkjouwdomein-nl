import SearchHero from '@/components/search/SearchHero';
import FaqSection from '@/components/sections/FaqSection';
import AdSenseUnit from '@/components/ads/AdSenseUnit';
import { TLD_CONFIG, ORDERED_TLDS } from '@/lib/tlds';
import Link from 'next/link';

const POPULAR_KEYWORDS = [
  'webshop', 'restaurant', 'freelancer', 'portfolio', 'blog',
  'consultant', 'fotografie', 'coaching', 'advocaat', 'bakkerij',
];

export default function HomePage() {
  return (
    <>
      <SearchHero />

      <div className="container mx-auto px-5 max-w-5xl space-y-16 pb-20 pt-12">

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

        {/* TLD grid — verbeterde opmaak */}
        <section>
          <p className="type-label mb-4">Beschikbare extensies</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ORDERED_TLDS.map((tld) => {
              const config = TLD_CONFIG[tld];
              return (
                <div
                  key={tld}
                  className="card p-4 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xl font-black"
                      style={{
                        color: 'var(--primary)',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {tld}
                    </span>
                    {config.flag && (
                      <span className="text-lg" aria-hidden="true">{config.flag}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                      {config.label}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-subtle)' }}>
                      {config.averagePrice}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <section>
          <p className="type-label text-center mb-2">Hoe het werkt</p>
          <h2
            className="type-heading text-center mb-10"
            style={{ color: 'var(--text)' }}
          >
            In drie stappen naar jouw domein
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                title: 'Voer keywords in',
                desc: 'Typ de naam van je bedrijf, merk of project in de zoekbalk.',
              },
              {
                num: '02',
                title: 'Wij checken alles',
                desc: 'We genereren automatisch suggesties en controleren beschikbaarheid via RDAP.',
              },
              {
                num: '03',
                title: 'Registreer direct',
                desc: 'Kies de beste naam en registreer bij de registrar van jouw keuze.',
              },
            ].map((item) => (
              <div
                key={item.num}
                className="card p-6"
              >
                <div
                  className="text-3xl font-black mb-3"
                  style={{
                    color: 'var(--primary-light)',
                    WebkitTextStroke: '2px var(--primary)',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {item.num}
                </div>
                <h3
                  className="font-semibold text-base mb-2"
                  style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}
                >
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* AdSense mid */}
        <AdSenseUnit slot="HOMEPAGE_MID_SLOT" format="responsive" />

        {/* FAQ */}
        <FaqSection />

      </div>
    </>
  );
}
