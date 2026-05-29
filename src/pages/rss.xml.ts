import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const esc = (s = '') =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://syydaniel.github.io');
  const posts = (await getCollection('blog'))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  const items = posts
    .map((p) => {
      const url = new URL(`/blog/${p.data.slug}`, base).href;
      const cats = p.data.tags.map((t) => `      <category>${esc(t)}</category>`).join('\n');
      return `    <item>
      <title>${esc(p.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${p.data.pubDate.toUTCString()}</pubDate>
      <description>${esc(p.data.description)}</description>
      <dc:language>${p.data.lang === 'zh' ? 'zh-CN' : 'en'}</dc:language>
${cats}
    </item>`;
    })
    .join('\n');

  const feedUrl = new URL('/rss.xml', base).href;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Yiyang Shen · Journal</title>
    <link>${base.href}</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <description>Field notes on water, microplastics, and photography by Yiyang Shen (沈亦旸).</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
};
