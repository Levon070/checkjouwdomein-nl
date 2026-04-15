import { MetadataRoute } from 'next';
import { BLOG_POSTS } from '@/lib/blog-content';

const POPULAR_KEYWORDS = [
  'webshop', 'restaurant', 'freelancer', 'consultant', 'fotografie',
  'blog', 'portfolio', 'startup', 'app', 'coaching', 'advocaat',
  'tandarts', 'kapper', 'bakkerij', 'boekhouder', 'bv', 'architect',
  'schilder', 'loodgieter', 'elektricien',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://checkjouwdomein.nl';
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/naam-generator`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/merk-check`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/tld-gids`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/tips-domeinnaam`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/registrars`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/bulk-check`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/portfolio`, lastModified: now, changeFrequency: 'weekly', priority: 0.70 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ];

  const keywordPages: MetadataRoute.Sitemap = POPULAR_KEYWORDS.map((kw) => ({
    url: `${base}/zoek/${kw}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...keywordPages, ...blogPages];
}
