import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Journal / blog posts. Each post lives in src/content/blog as a Markdown file.
// Write a post in one language and set `lang`. To pair an English and a Chinese
// version of the same post, give them the same `translationKey`; the site will
// cross-link them. URLs come from `slug` (keep it unique per post).
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updated: z.coerce.date().optional(),
    lang: z.enum(['en', 'zh', 'zh-Hant', 'nl', 'de']).default('en'),
    slug: z.string(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
    translationKey: z.string().optional()
  })
});

export const collections = { blog };
