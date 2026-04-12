import { MetadataRoute } from 'next';

const POPULAR_KEYWORDS = [
  'webshop', 'restaurant', 'freelancer', 'consultant', 'fotografie',
  'blog', 'portfolio', 'startup', 'app', 'coaching', 'advocaat',
  'tandarts', 'kapper', 'bakkerij', 'boekhouder', 'bv', 'architect',
  'schilder', 'loodgieter', 'elektricien',
];

const BLOG_SLUGS = [
  'beste-domeinnaam-kiezen',
  'nl-vs-com-domein',
  'domeinnaam-tips-2025',
  'wat-is-een-domein',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://checkjouwdomein.nl';
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/tld-gids`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/tips-domeinnaam`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ];

  const keywordPages: MetadataRoute.Sitemap = POPULAR_KEYWORDS.map((kw) => ({
    url: `${base}/zoek/${kw}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const blogPages: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...keywordPages, ...blogPages];
}
