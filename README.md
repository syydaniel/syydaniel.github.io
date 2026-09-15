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

## Journal (unpublished)

The Journal (`/blog`, RSS, post pages) was taken off the site in September 2026. The Markdown
posts are still in `src/content/blog`; to bring the Journal back, revert the commit that removed
`src/pages/blog`. `.github/workflows/notify-social.yml` only ran for Journal posts and is inert
without its Bluesky secrets.

- **Sitemap** at `/sitemap.xml` plus `public/robots.txt` for search engines.

## Films

`src/components/Films.astro` embeds Yiyang's Bilibili uploads (`src/data/films.ts`). Any element
with `data-film="<bvid>"` opens the shared player in `FilmPlayer.astro`, so films can be linked
from any section.

## Places (footprint map)

The Places section is built from my GPX tracks (exported from the StepOfMyWorld app):

```bash
npm run travel -- path/to/backUpData-all.gpx
```

`scripts/build-travel.mjs` snaps every point to a ~10 km grid cell, drops in-flight fixes and tiny
isolated clusters (GPS glitches, under 30 points), and
looks up countries and cities with Natural Earth. Only the binned output is committed
(`public/travel.json`, `src/data/travel.generated.json`); raw `*.gpx` files are gitignored.
Countries only crossed by plane go in `EXCLUDE_COUNTRIES` at the top of the script.

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
├── components/     # Nav, Footer, Hero, About, Journey, Places, Photography, Films,
│                   # FilmPlayer, FilmPoster, Filmstrip, Contact, Globe, Arcade, ...
├── content/blog/   # unpublished journal posts (Markdown, EN + ZH)
├── content.config.ts
├── data/           # profile, journey, photos, films, travel, i18n
├── layouts/        # Base
├── pages/          # index.astro, nya-translator.astro, sitemap.xml.ts
└── styles/         # global.css
scripts/
├── build-photo-manifest.mjs   # EXIF -> photos.generated.json + copies to public/photos
├── build-og-image.mjs         # branded social share card
└── notify-bluesky.mjs         # new-post announcer (Journal is unpublished)
public/             # favicon, og-image.jpg, robots.txt, copied photos, CV/transcript PDFs
```
