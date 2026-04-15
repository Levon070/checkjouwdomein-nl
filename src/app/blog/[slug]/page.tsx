import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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
    url: `https://checkjouwdomein.nl/blog/${slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://checkjouwdomein.nl/blog/${slug}`,
    },
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { '@type': 'Person', name: post.author ?? 'Redactie CheckJouwDomein.nl', url: 'https://checkjouwdomein.nl/over-ons' },
    ...(post.image ? { image: post.image } : {}),
    publisher: {
      '@type': 'Organization',
      name: 'CheckJouwDomein.nl',
      url: 'https://checkjouwdomein.nl',
      logo: {
        '@type': 'ImageObject',
        url: 'https://checkjouwdomein.nl/favicon.svg',
        width: 512,
        height: 512,
      },
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

  const faqLines = post.content.split('\n');
  const faqItems: Array<{ question: string; answer: string }> = [];
  for (let i = 0; i < faqLines.length; i++) {
    const line = faqLines[i];
    if (line.startsWith('## ') && line.includes('?')) {
      const question = line.slice(3).trim();
      const answerParts: string[] = [];
      for (let j = i + 1; j < faqLines.length && !faqLines[j].startsWith('## '); j++) {
        const al = faqLines[j].trim();
        if (al && !al.startsWith('**')) answerParts.push(al.replace(/^- /, ''));
      }
      const answer = answerParts.slice(0, 3).join(' ').trim();
      if (answer.length > 20) faqItems.push({ question, answer });
    }
  }

  const faqSchema = faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  } : null;

  const related = BLOG_POSTS
    .filter(p => p.slug !== post.slug && p.tags.some(t => post.tags.includes(t)))
    .slice(0, 3)
    .concat(
      BLOG_POSTS.filter(p => p.slug !== post.slug && !post.tags.some(t => p.tags.includes(t)))
    )
    .slice(0, 3);

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
      {faqSchema && <JsonLd data={faqSchema} />}

      <div className="container mx-auto px-5 py-12 max-w-2xl">
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

        <p className="text-sm mb-2" style={{ color: 'var(--text-subtle)' }}>
          Door {post.author ?? 'Redactie CheckJouwDomein.nl'}
        </p>

        <h1 className="type-heading mb-3" style={{ color: 'var(--text)', fontSize: 'clamp(1.75rem, 4vw, 2.25rem)' }}>
          {post.title}
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--text-subtle)' }}>
          Gepubliceerd: {post.publishedAt} · Bijgewerkt: {post.updatedAt}
        </p>

        {post.image && (
          <Image
            src={post.image}
            alt={post.title}
            width={800}
            height={400}
            priority
            className="rounded-xl w-full object-cover mb-8"
            style={{ aspectRatio: '2/1' }}
          />
        )}

        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-base font-bold mb-4" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>
              Lees ook
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {related.map(r => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="section-alt p-4 rounded-xl flex items-center justify-between gap-3 group"
                  style={{ textDecoration: 'none' }}
                >
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{r.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-subtle)' }}>{r.description.slice(0, 80)}…</p>
                  </div>
                  <span style={{ color: 'var(--primary)', flexShrink: 0 }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        )}

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
