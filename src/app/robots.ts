import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://checkjouwdomein.nl/sitemap.xml',
    host: 'https://checkjouwdomein.nl',
  };
}
