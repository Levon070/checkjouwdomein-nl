import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      className="mt-20"
      style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-surface)',
      }}
    >
      <div className="container mx-auto px-5 py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div
              className="text-base font-black mb-3"
              style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
            >
              Check<span style={{ color: 'var(--primary)' }}>Jouw</span>Domein
              <span style={{ color: 'var(--text-subtle)' }}>.nl</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Gratis domein beschikbaarheid checker. Vind de perfecte domeinnaam voor jouw
              bedrijf of project.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>
              Populaire zoekopdrachten
            </h3>
            <ul className="space-y-2.5">
              {['webshop', 'restaurant', 'freelancer', 'portfolio', 'blog'].map((kw) => (
                <li key={kw}>
                  <Link href={`/zoek/${kw}`} className="link-muted">
                    Domein check: {kw}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>
              Informatie
            </h3>
            <ul className="space-y-2.5">
              <li><Link href="/tld-gids" className="link-muted">TLD Gids</Link></li>
              <li><Link href="/tips-domeinnaam" className="link-muted">Tips domeinnaam kiezen</Link></li>
              <li><Link href="/blog" className="link-muted">Blog</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
            © {new Date().getFullYear()} CheckJouwDomein.nl — Gratis domein checker voor Nederland en België.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
            <strong style={{ color: 'var(--text-muted)' }}>Affiliate disclosure:</strong>{' '}
            Sommige links zijn affiliate-links. Wij ontvangen een kleine vergoeding wanneer je via onze
            link een domein registreert, zonder extra kosten voor jou.
          </p>
        </div>
      </div>
    </footer>
  );
}
