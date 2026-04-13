import Link from 'next/link';
import WatchlistButton from '@/components/ui/WatchlistButton';
import CartButton from '@/components/ui/CartButton';
import FavoritesButton from '@/components/ui/FavoritesButton';

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(246, 248, 252, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="container mx-auto px-5 h-16 flex items-center justify-between max-w-6xl">
        <Link href="/" className="flex items-center gap-1.5">
          <span
            className="text-lg font-black tracking-tight"
            style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
          >
            Check
            <span style={{ color: 'var(--primary)' }}>Jouw</span>
            Domein
            <span style={{ color: 'var(--text-subtle)' }}>.nl</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          <Link href="/" className="link-nav" aria-label="Home">🏠</Link>
          <Link href="/naam-generator" className="link-nav">Naamgenerator ✦</Link>
          <Link href="/merk-check" className="link-nav">Merkencheck</Link>
          <Link href="/portfolio" className="link-nav">Portfolio</Link>
          <Link href="/registrars" className="link-nav">Registrars</Link>
          <Link href="/bulk-check" className="link-nav">Bulk</Link>
          <Link href="/blog" className="link-nav">Blog</Link>
          <FavoritesButton />
          <WatchlistButton />
          <CartButton />
        </nav>

        <nav className="flex md:hidden items-center gap-1">
          <Link href="/" className="link-nav" aria-label="Home">🏠</Link>
          <Link href="/naam-generator" className="link-nav">✦</Link>
          <Link href="/merk-check" className="link-nav">Merk</Link>
          <Link href="/blog" className="link-nav">Blog</Link>
          <FavoritesButton />
          <WatchlistButton />
          <CartButton />
        </nav>
      </div>
    </header>
  );
}
