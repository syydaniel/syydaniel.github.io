# syydaniel.github.io

Personal site of Yiyang Shen (Daniel, 沈亦旸): environmental researcher and photographer.

**Live**: https://syydaniel.github.io

## Stack

- [Astro 5](https://astro.build): static site generator
- [Tailwind CSS](https://tailwindcss.com)
- [MapLibre GL JS](https://maplibre.org): interactive maps (no API key, lazy loaded)
- [Three.js](https://threejs.org): hero globe
- [exifr](https://github.com/MikeKovarik/exifr): EXIF extraction for photos
- [sharp](https://sharp.pixelplumbing.com): builds the social share card

## Develop

```bash
npm install
npm run dev     # http://localhost:4321
```

## Build

```bash
npm run build   # outputs /dist
npm run preview # serve /dist locally
```

`npm run build` runs `scripts/build-photo-manifest.mjs`, which reads `/photos/`, extracts EXIF,
copies frames into `public/photos/`, and writes `src/data/photos.generated.json`.
See [photos/README.md](photos/README.md) for adding photos.

## Journal (blog)

Posts live in `src/content/blog` as Markdown. Front matter schema is in
[src/content.config.ts](src/content.config.ts):

```md
---
title: "Post title"
description: "One sentence shown in lists, RSS, and link previews."
pubDate: 2026-05-29
lang: en            # 'en', 'zh', 'zh-Hant', 'nl', or 'de'
slug: my-post       # the URL becomes /blog/my-post (keep it unique)
tags: ["water"]
cover: /photos/wildlife/DSC_0057.jpg   # optional, used as the card + share image
draft: false        # true hides it everywhere and from RSS
translationKey: my-post   # optional: give an EN and a ZH post the SAME key to link them
---

Body in Markdown.
```

- The blog index at `/blog` filters to the visitor's current language, and falls back to
  showing everything if there are none in that language.
- Two posts that share a `translationKey` cross-link with a "Read in English / 阅读中文版" button.
- Reading time is estimated automatically.

To add a post: drop a new `.md` file in `src/content/blog`, commit, and push. The deploy and
the RSS feed update on their own.

## Auto-push when a post goes live

- **RSS** at [`/rss.xml`](https://syydaniel.github.io/rss.xml) regenerates on every build, so
  anyone subscribed sees new posts immediately. Linked from every page's `<head>`.
- **Sitemap** at `/sitemap.xml` plus `public/robots.txt` for search engines.
- **Bluesky (optional, off by default)**: `.github/workflows/notify-social.yml` runs
  `scripts/notify-bluesky.mjs` to announce newly added posts. It stays inert until you add two
  repo secrets (Settings, Secrets and variables, Actions):
  - `BLUESKY_HANDLE` (e.g. `yiyang.bsky.social`)
  - `BLUESKY_APP_PASSWORD` (Bluesky Settings, App Passwords)

## Comments and reactions

- **Per-post like**: a cross-visitor counter (the free, no-auth Abacus API, the same one the
  graduation ribbon uses). Works out of the box, no setup.
- **Comments via Giscus** (GitHub Discussions, free, no backend). Off until you configure
  [src/data/giscus.ts](src/data/giscus.ts): enable Discussions on the repo, install the
  [giscus app](https://github.com/apps/giscus), then paste the repo and category IDs from
  [giscus.app](https://giscus.app) and set `enabled: true`. Until then, posts show a small
  "comments coming soon" note.

## Social share image

`public/og-image.jpg` (1200x630) is the link-preview card, referenced by Open Graph and Twitter
meta in [Base.astro](src/layouts/Base.astro). Regenerate it (for example after changing the
tagline or source photo) with:

```bash
npm run og:image   # scripts/build-og-image.mjs
```

Per-post previews use the post's `cover` automatically.

## Performance note

MapLibre (~800 KB) is loaded lazily with a dynamic `import()` triggered only when a map scrolls
near the viewport, so it is not part of the first paint.

## Deploy

GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) builds and
publishes to GitHub Pages on every push to `main`. After the first push, enable Pages in repo
settings, Pages, Source: **GitHub Actions**.

## Structure

```
src/
├── components/     # Nav, Footer, Hero, About, Journey, Photography, Contact,
│                   # Comments, PostReactions, PostCard, Globe, Arcade, ...
├── content/blog/   # journal posts (Markdown, EN + ZH)
├── content.config.ts
├── data/           # profile, journey, photos, i18n, giscus, reading-time
├── layouts/        # Base, PostLayout
├── pages/          # index.astro, blog/, rss.xml.ts, sitemap.xml.ts
└── styles/         # global.css
scripts/
├── build-photo-manifest.mjs   # EXIF -> photos.generated.json + copies to public/photos
├── build-og-image.mjs         # branded social share card
└── notify-bluesky.mjs         # optional new-post announcer
public/             # favicon, og-image.jpg, robots.txt, copied photos, CV/transcript PDFs
```
