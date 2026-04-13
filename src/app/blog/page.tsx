import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { BLOG_POSTS } from '@/lib/blog-content';

export const metadata: Metadata = {
  title: 'Blog — Domeinnaam Tips & Advies',
  description:
    'Lees onze artikelen over domeinnamen kiezen, .nl vs .com, registrars vergelijken en meer.',
  alternates: { canonical: 'https://checkjouwdomein.nl/blog' },
  openGraph: {
    title: 'Blog — Domeinnaam Tips & Advies | CheckJouwDomein.nl',
    description: 'Praktische tips, vergelijkingen en guides over domeinnamen voor Nederlandse ondernemers.',
    images: [{ url: '/api/og?title=Blog&desc=Tips%20en%20advies%20over%20domeinnamen', width: 1200, height: 630 }],
  },
};

const COVER_IMAGES: Record<string, string> = {
  'beste-domeinnaam-kiezen':           'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&auto=format&fit=crop&q=80',
  'nl-vs-com-domein':                  'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80',
  'domeinnaam-tips-2026':              'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800&auto=format&fit=crop&q=80',
  'wat-is-een-domein':                 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
  'goedkoopste-domeinnaam-registreren':'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=80',
  'domeinnaam-voor-webshop':           'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=80',
  'domeinnaam-verhuizen':              'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80',
  'subdomeinen-uitgelegd':             'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
  'domeinnaam-ideeën-genereren':       'https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=800&auto=format&fit=crop&q=80',
  'ssl-certificaat-domeinnaam':        'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
  'domeinnaam-parkeren':               'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop&q=80',
  'domein-extensies-vergelijken':      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
  'domeinnaam-verkopen':               'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
  'domeinnaam-en-hosting-verschil':    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
};

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  'domeinnaam':    { bg: 'rgba(79,70,229,0.08)',  color: '#4F46E5' },
  'tips':          { bg: 'rgba(16,185,129,0.08)', color: '#059669' },
  'beginners':     { bg: 'rgba(6,182,212,0.08)',  color: '#0891B2' },
  '.nl':           { bg: 'rgba(245,158,11,0.10)', color: '#D97706' },
  '.com':          { bg: 'rgba(245,158,11,0.10)', color: '#D97706' },
  'extensies':     { bg: 'rgba(99,102,241,0.08)', color: '#6366F1' },
  '2026':          { bg: 'rgba(79,70,229,0.08)',  color: '#4F46E5' },
  'strategie':     { bg: 'rgba(16,185,129,0.08)', color: '#059669' },
  'SEO':           { bg: 'rgba(220,38,38,0.07)',  color: '#DC2626' },
  'uitleg':        { bg: 'rgba(6,182,212,0.08)',  color: '#0891B2' },
  'basis':         { bg: 'rgba(99,102,241,0.08)', color: '#6366F1' },
  'registrar':     { bg: 'rgba(16,185,129,0.08)', color: '#059669' },
  'prijs':         { bg: 'rgba(245,158,11,0.10)', color: '#D97706' },
  'vergelijking':  { bg: 'rgba(99,102,241,0.08)', color: '#6366F1' },
  'webshop':       { bg: 'rgba(79,70,229,0.08)',  color: '#4F46E5' },
  'e-commerce':    { bg: 'rgba(16,185,129,0.08)', color: '#059669' },
  'verhuizen':     { bg: 'rgba(6,182,212,0.08)',  color: '#0891B2' },
  'handleiding':   { bg: 'rgba(99,102,241,0.08)', color: '#6366F1' },
  'subdomein':     { bg: 'rgba(245,158,11,0.10)', color: '#D97706' },
  'creativiteit':  { bg: 'rgba(220,38,38,0.07)',  color: '#DC2626' },
  'naamgenerator': { bg: 'rgba(79,70,229,0.08)',  color: '#4F46E5' },
  'SSL':           { bg: 'rgba(16,185,129,0.08)', color: '#059669' },
  'beveiliging':   { bg: 'rgba(220,38,38,0.07)',  color: '#DC2626' },
  'parkeren':      { bg: 'rgba(6,182,212,0.08)',  color: '#0891B2' },
  'TLD':           { bg: 'rgba(99,102,241,0.08)', color: '#6366F1' },
  'verkopen':      { bg: 'rgba(16,185,129,0.08)', color: '#059669' },
  'domeinwaarde':  { bg: 'rgba(245,158,11,0.10)', color: '#D97706' },
  'investering':   { bg: 'rgba(79,70,229,0.08)',  color: '#4F46E5' },
  'hosting':       { bg: 'rgba(6,182,212,0.08)',  color: '#0891B2' },
};

function TagChip({ tag }: { tag: string }) {
  const style = TAG_COLORS[tag] ?? { bg: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)' };
  return (
    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: style.bg, color: style.color }}>
      {tag}
    </span>
  );
}

export default function BlogPage() {
  const [featured, ...rest] = BLOG_POSTS;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Hero */}
      <div
        className="text-center px-5 py-16"
        style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.05) 0%, rgba(6,182,212,0.03) 100%)', borderBottom: '1px solid var(--border)' }}
      >
        <p className="type-label mb-2">Kennis & Advies</p>
        <h1 className="type-heading mb-3" style={{ color: 'var(--text)' }}>Alles over domeinnamen</h1>
        <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>
          Praktische tips, vergelijkingen en guides voor Nederlandse ondernemers.
        </p>
      </div>

      <div className="container mx-auto px-5 max-w-5xl py-12">

        {/* Featured post */}
        <Link href={`/blog/${featured.slug}`} className="block mb-12" style={{ textDecoration: 'none' }}>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
          >
            <div className="md:grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ minHeight: 260, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)' }}>
                <Image
                  src={COVER_IMAGES[featured.slug] ?? 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&auto=format&fit=crop&q=80'}
                  alt={featured.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(79,70,229,0.25) 0%, transparent 60%)' }} />
                <div className="text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(79,70,229,0.9)', color: 'white', backdropFilter: 'blur(8px)' }}>
                  ★ Uitgelicht
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex flex-wrap gap-2 mb-4">
                  {featured.tags.map(tag => <TagChip key={tag} tag={tag} />)}
                </div>
                <h2 className="font-bold mb-3" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                  {featured.title}
                </h2>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
                  {featured.description}
                </p>
                <div className="flex items-center justify-between">
                  <time className="text-xs" style={{ color: 'var(--text-subtle)' }}>{featured.publishedAt}</time>
                  <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>Lees artikel →</span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Rest of posts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block" style={{ textDecoration: 'none' }}>
              <article className="rounded-2xl overflow-hidden h-full flex flex-col"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ height: 180, position: 'relative', overflow: 'hidden' }}>
                  <Image
                    src={COVER_IMAGES[post.slug] ?? 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=400&auto=format&fit=crop&q=80'}
                    alt={post.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.08) 100%)' }} />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.map(tag => <TagChip key={tag} tag={tag} />)}
                  </div>
                  <h2 className="font-bold mb-2 flex-1" style={{ fontSize: '1rem', color: 'var(--text)', letterSpacing: '-0.01em', lineHeight: 1.35 }}>
                    {post.title}
                  </h2>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                    <time className="text-xs" style={{ color: 'var(--text-subtle)' }}>{post.publishedAt}</time>
                    <span className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>Lees meer →</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 p-8 sm:p-12 rounded-2xl text-center"
          style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.06) 0%, rgba(6,182,212,0.04) 100%)', border: '1px solid rgba(79,70,229,0.12)' }}>
          <p className="type-label mb-2">Klaar om te starten?</p>
          <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Check direct jouw domeinnaam
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Gebruik onze gratis checker — real-time, geen account nodig.
          </p>
          <Link href="/" className="btn-primary" style={{ display: 'inline-flex' }}>
            Start domein check →
          </Link>
        </div>
      </div>
    </div>
  );
}
