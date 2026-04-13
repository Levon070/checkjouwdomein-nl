import Link from 'next/link';
import WatchlistButton from '@/components/ui/WatchlistButton';
import FavoritesButton from '@/components/ui/FavoritesButton';

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(250, 251, 255, 0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(79, 70, 229, 0.08)',
        boxShadow: '0 1px 24px rgba(79, 70, 229, 0.06), 0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {/* Gradient accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #4F46E5 0%, #818cf8 45%, #06B6D4 100%)',
        }}
      />

      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div
            style={{
              width: 34,
              height: 34,
              background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
              borderRadius: 9,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 10px rgba(79, 70, 229, 0.35)',
              flexShrink: 0,
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0A0C14' }}>
            Check
            <span style={{ background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Jouw
            </span>
            Domein
            <span style={{ color: '#9BA4B5', fontWeight: 600 }}>.nl</span>
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-0.5">
          <NavLink href="/" icon={<HomeIcon />} label="Home" iconOnly />
          <NavLink href="/naam-generator" icon={<StarIcon />} label="Naamgenerator" badge="NEW" />
          <NavLink href="/merk-check" icon={<ShieldIcon />} label="Merkencheck" />
          <NavLink href="/portfolio" icon={<BriefcaseIcon />} label="Portfolio" />
          <NavLink href="/registrars" icon={<GridIcon />} label="Registrars" />
          <NavLink href="/bulk-check" icon={<ListIcon />} label="Bulk" />
          <NavLink href="/blog" icon={<BookIcon />} label="Blog" />

          <div style={{ width: 1, height: 20, background: 'rgba(0,0,0,0.08)', margin: '0 6px', flexShrink: 0 }} />

          <FavoritesButton />
          <WatchlistButton />
        </nav>

        {/* Nav mobile */}
        <nav className="flex md:hidden items-center gap-0.5">
          <NavLink href="/" icon={<HomeIcon />} label="Home" iconOnly />
          <NavLink href="/naam-generator" icon={<StarIcon />} label="✦" iconOnly />
          <NavLink href="/merk-check" icon={<ShieldIcon />} label="Merk" />
          <NavLink href="/blog" icon={<BookIcon />} label="Blog" />
          <FavoritesButton />
          <WatchlistButton />
        </nav>
      </div>
    </header>
  );
}

// ── Nav link helper ───────────────────────────────────────────────────────────

function NavLink({
  href,
  icon,
  label,
  badge,
  iconOnly = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  iconOnly?: boolean;
}) {
  if (iconOnly) {
    return (
      <Link
        href={href}
        aria-label={label}
        className="link-nav"
        style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
      >
        {icon}
      </Link>
    );
  }

  return (
    <Link href={href} className="link-nav" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      {icon}
      {label}
      {badge && (
        <span style={{
          fontSize: 9,
          fontWeight: 700,
          padding: '1px 5px',
          borderRadius: 99,
          background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
          color: 'white',
          letterSpacing: '0.03em',
          lineHeight: 1.6,
        }}>
          {badge}
        </span>
      )}
    </Link>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="8" height="8" rx="1" />
      <rect x="14" y="2" width="8" height="8" rx="1" />
      <rect x="2" y="14" width="8" height="8" rx="1" />
      <rect x="14" y="14" width="8" height="8" rx="1" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  );
}
