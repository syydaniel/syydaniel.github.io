import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://syydaniel.github.io');
  const posts = (await getCollection('blog')).filter((p) => !p.data.draft);

  type Entry = { loc: string; lastmod?: string; priority: string };
  const entries: Entry[] = [
    { loc: new URL('/', base).href, priority: '1.0' },
    { loc: new URL('/blog', base).href, priority: '0.8' },
    ...posts.map((p) => ({
      loc: new URL(`/blog/${p.data.slug}`, base).href,
      lastmod: (p.data.updated ?? p.data.pubDate).toISOString().slice(0, 10),
      priority: '0.7'
    }))
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) =>
      `  <url><loc>${e.loc}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}<priority>${e.priority}</priority></url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
};
