import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog-content';
import JsonLd from '@/components/seo/JsonLd';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const ogTitle = encodeURIComponent(post.title);
  const ogDesc = encodeURIComponent(post.description);

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://checkjouwdomein.nl/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [{ url: `/api/og?title=${ogTitle}&desc=${ogDesc}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [`/api/og?title=${ogTitle}&desc=${ogDesc}`],
    },
  };
}

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { '@type': 'Organization', name: 'CheckJouwDomein.nl' },
    publisher: {
      '@type': 'Organization',
      name: 'CheckJouwDomein.nl',
      url: 'https://checkjouwdomein.nl',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://checkjouwdomein.nl' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://checkjouwdomein.nl/blog' },
      { '@type': 'ListItem', position: 3, name: post.title },
    ],
  };

  // Convert markdown-like content to HTML with design system styling
  const htmlContent = post.content
    .split('\n')
    .map((line) => {
      if (line.startsWith('## ')) return `<h2 style="font-size:1.25rem;font-weight:700;color:var(--text);margin-top:2rem;margin-bottom:0.75rem;letter-spacing:-0.01em">${line.slice(3)}</h2>`;
      if (line.startsWith('**') && line.endsWith('**')) return `<p style="font-weight:600;color:var(--text)">${line.slice(2, -2)}</p>`;
      if (line.startsWith('- ')) return `<li style="margin-left:1.25rem;list-style-type:disc;color:var(--text-muted);line-height:1.7">${line.slice(2)}</li>`;
      if (line === '') return '<br/>';
      return `<p style="color:var(--text-muted);line-height:1.8;margin-bottom:0.5rem">${line}</p>`;
    })
    .join('\n');

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="container mx-auto px-5 py-12 max-w-2xl">
        {/* Breadcrumb */}
        <nav className="text-sm mb-8 flex items-center gap-2 flex-wrap" style={{ color: 'var(--text-subtle)' }}>
          <Link href="/" className="link-muted">Home</Link>
          <span>/</span>
          <Link href="/blog" className="link-muted">Blog</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-muted)' }} className="truncate">{post.title}</span>
        </nav>

        <div className="flex flex-wrap gap-2 mb-5">
          {post.tags.map((tag) => (
            <span key={tag} className="chip-ghost" style={{ fontSize: '0.75rem', padding: '3px 12px' }}>
              {tag}
            </span>
          ))}
        </div>

        <h1 className="type-heading mb-3" style={{ color: 'var(--text)', fontSize: 'clamp(1.75rem, 4vw, 2.25rem)' }}>
          {post.title}
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--text-subtle)' }}>
          Gepubliceerd: {post.publishedAt} · Bijgewerkt: {post.updatedAt}
        </p>

        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />

        {/* CTA */}
        <div className="section-alt mt-14 p-8 text-center">
          <p className="type-label mb-2">Aan de slag</p>
          <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Klaar om jouw domein te checken?
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Gebruik onze gratis checker en vind de perfecte domeinnaam in 30 seconden.
          </p>
          <Link href="/" className="btn-primary" style={{ display: 'inline-flex' }}>
            Start domein check →
          </Link>
        </div>
      </div>
    </>
  );
}
