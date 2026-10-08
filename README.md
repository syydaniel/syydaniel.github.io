# syydaniel.github.io

Personal site of Yiyang Shen (Daniel, 沈亦旸): environmental researcher and photographer.

**Live**: https://syydaniel.github.io

## Stack

- [Astro 5](https://astro.build): static site generator
- [Tailwind CSS](https://tailwindcss.com)
- [MapLibre GL JS](https://maplibre.org): interactive maps (no API key, lazy loaded)
- [Three.js](https://threejs.org): the catchment terrain in the hero and the interactive globe in Places
- Raw WebGL for the full-page ink fluid simulation (no library)
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

## Visual layer (2026 redesign)

Type: [Fraunces](https://fonts.google.com/specimen/Fraunces) with its full variable axes
(`opsz`, `wght`, `SOFT`, `WONK`) for display, [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans)
for text, JetBrains Mono for metadata, and a 15-glyph subset of Noto Serif SC for 沈亦旸, the
seals and the chapter numerals. The fonts are self-hosted (`npm run fonts` →
`scripts/fetch-fonts.mjs` → `public/fonts`, `src/styles/fonts.css`), so they load without a third
party and where Google Fonts is unreachable. The Chinese interface adds the full Noto Serif SC
from Google on demand for its headings.

- **The catchment, 流域** (`Catchment.astro`, `src/scripts/catchment.ts`): the hero is a living
  3D ink-wash height field drawn as contour lines, a five-density wash (墨分五色), a hillshade and
  one vermilion shoreline. The pointer is a rain cloud: each drop lands on the terrain and runs
  downhill along the gradient, the way runoff is routed in a hydrological model, until it reaches
  the water in the valley, pools and seeps into the ink of the page background. Hold to pour.
  The camera lands from above after the opening and climbs away as the page scrolls. Three.js
  loads only when the hero is on screen; reduced motion gets one still frame.
- **Ink** (`Atmosphere.astro`, `src/scripts/ink.ts`): a real-time fluid simulation (velocity
  advected, curled and projected on a small grid, dye on a larger one) behind the whole site, in
  月白, mist grey and 黛青 with one drop in twenty of 朱砂. The pointer drags it, scrolling stirs
  it, a drop lands on its own now and then, a pressed seal and the catchment's pooled water pour
  into it, and the opening ends with one drop blooming in the middle. Where half-float render
  targets are missing, `src/scripts/atmosphere.ts` draws a noise atmosphere instead.
- **Opening** (`Intro.astro`): once per session, decided before first paint by an inline script.
  The name rises letter by letter in the display face, a counter runs, the seal stamps beside the
  name, the curtain lifts. Click or any key skips it.
- **Typography in motion** (`src/scripts/kinetics.ts`, `src/styles/kinetics.css`): the hero name
  is split into letters that respond to the pointer through the font's weight and softness axes;
  a vertical signature column (题款 + 印) beside it; a hand-drawn ink underline under the tagline's
  accent; section titles rising out of masks; `Statement.astro`, whose softness and weight follow
  its place on screen; outlined `Marquee.astro` ribbons that lean with scroll velocity; the footer
  name at display size over 远山, ridges in mist.
- **Chinese elements, kept quiet**: `Seal.astro` is a carved name seal, 沈亦旸印 (白文), and a
  leisure seal 水土 (朱文); press one and it stamps again. The clocks show the time in
  Wageningen, the current solar term 节气 from the Sun's ecliptic longitude, and the lunar date
  农历 from the browser's Chinese calendar. Chapters are numbered 壹 贰 叁 on 题签 slips.
- **Mechanics**: `Ticker.astro`, an instrument readout along the hero's foot; inertial wheel
  scrolling on desktop (`src/scripts/inertia.ts`, never over maps, the globe, the gallery or
  anything that scrolls on its own); a cursor badge that names what a frame does; magnetic buttons
  with an ink ripple; an ink trail behind fast pointer strokes; counting numbers; a navigation bar
  that slips away while reading. Everything is skipped or static under `prefers-reduced-motion`,
  and the text is simply visible without JavaScript.

## Visual interactions

The interactive globe (visited-country colors, research locations, orbiting photo previews)
now opens the Places section. The Places and Photography maps keep their existing controls.

The Liquid Glass inspired control surfaces use transparent fills, moving edge reflections,
and shared spring-animated selection capsules. Navigation and particle controls also use a
shallow SVG backdrop lens in Blink; Safari/WebKit and other engines retain the blur and
reflection material. SVG filters never distort foreground text or change hit targets. The
native cursor stays visible, menus support Escape and report their open state, and content
remains readable without JavaScript.

Same-page chapter links use the native View Transition API for a photographic aperture
reveal. Only the scroll position and URL hash change, so the globe and maps retain their
DOM, state and event handlers. Native cross-document transitions handle the translator
page. Unsupported browsers and reduced-motion users keep normal anchor navigation.
Photography and text have separate entrance treatments; map surfaces only fade. The
existing photo lightboxes gain a soft opening animation without changing their controls.


## Spatial photography exhibition

`/gallery/` presents a 12-frame edit of the existing photo library in a curved CSS 3D
wall. Open it from the hero or the invitation beside the photography section. Drag,
swipe, scroll over a frame or use the arrow keys to browse. A photograph expands from
its frame into a native dialog with its original location, date and camera metadata.

The finite particle development loads its renderer on demand, stops after the image
forms and cancels when off screen or in a hidden tab. Reduced-motion users get the
photo directly; WebGL failure leaves the photo wall and viewer usable. Without
JavaScript, the page is a normal photo grid with links to the original images.
Edit `src/data/gallery.ts` to change the selection. The existing globe, Places and
Photography components and their map controls are preserved.

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
├── components/     # Nav, Footer, Hero, Catchment, Ticker, Intro, Seal, Statement, Marquee,
│                   # About, Journey, Places, Globe, Photography, Films, Contact, ...
├── content/blog/   # unpublished journal posts (Markdown, EN + ZH)
├── content.config.ts
├── data/           # profile, journey, photos, films, travel, i18n
├── layouts/        # Base
├── pages/          # index.astro, nya-translator.astro, sitemap.xml.ts
└── styles/         # global.css, liquid-glass.css, kinetics.css
scripts/
├── fetch-fonts.mjs            # self-hosted web fonts -> public/fonts + src/styles/fonts.css
├── build-photo-manifest.mjs   # EXIF -> photos.generated.json + copies to public/photos
├── build-og-image.mjs         # branded social share card
└── notify-bluesky.mjs         # new-post announcer (Journal is unpublished)
public/             # favicon, og-image.jpg, robots.txt, copied photos, CV/transcript PDFs
```
