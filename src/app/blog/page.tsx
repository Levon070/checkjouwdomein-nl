import { Metadata } from 'next';
import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blog-content';

export const metadata: Metadata = {
  title: 'Blog — Domeinnaam Tips & Advies',
  description:
    'Lees onze artikelen over domeinnamen kiezen, .nl vs .com, registrars vergelijken en meer.',
  alternates: { canonical: 'https://checkjouwdomein.nl/blog' },
};

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog</h1>
      <p className="text-gray-500 mb-10">Tips, uitleg en advies over domeinnamen</p>

      <div className="space-y-6">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.slug}
            className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex flex-wrap gap-2 mb-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                {post.title}
              </Link>
            </h2>
            <p className="text-gray-500 text-sm mb-4">{post.description}</p>
            <div className="flex items-center justify-between">
              <time className="text-xs text-gray-400">{post.publishedAt}</time>
              <Link
                href={`/blog/${post.slug}`}
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Lees meer →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
