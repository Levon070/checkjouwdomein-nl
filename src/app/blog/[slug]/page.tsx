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

  // Convert markdown-like content to basic HTML
  const htmlContent = post.content
    .split('\n')
    .map((line) => {
      if (line.startsWith('## ')) return `<h2 class="text-xl font-bold text-gray-900 mt-8 mb-3">${line.slice(3)}</h2>`;
      if (line.startsWith('**') && line.endsWith('**')) return `<p class="font-semibold text-gray-800">${line.slice(2, -2)}</p>`;
      if (line.startsWith('- ')) return `<li class="ml-4 list-disc text-gray-600">${line.slice(2)}</li>`;
      if (line === '') return '<br/>';
      return `<p class="text-gray-600 leading-relaxed">${line}</p>`;
    })
    .join('\n');

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-blue-600">Blog</Link>
          <span>/</span>
          <span className="text-gray-600 truncate">{post.title}</span>
        </nav>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">{post.title}</h1>
        <p className="text-gray-400 text-sm mb-8">
          Gepubliceerd: {post.publishedAt} · Bijgewerkt: {post.updatedAt}
        </p>

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* CTA */}
        <div className="mt-12 bg-blue-50 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Klaar om jouw domein te checken?</h2>
          <p className="text-gray-500 text-sm mb-4">
            Gebruik onze gratis checker en vind de perfecte domeinnaam.
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start domein check →
          </Link>
        </div>
      </div>
    </>
  );
}
