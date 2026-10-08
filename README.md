# syydaniel.github.io

Personal site of Yiyang Shen (Daniel, 沈亦旸): environmental researcher and photographer.

**Live**: https://syydaniel.github.io

## Stack

- [Astro 5](https://astro.build): static site generator
- [Tailwind CSS](https://tailwindcss.com)
- [MapLibre GL JS](https://maplibre.org): interactive maps (no API key, lazy loaded)
- [Three.js](https://threejs.org): interactive hero globe and a separate particle atmosphere
- Raw WebGL shader for the full-page atmosphere (no library)
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
for text, JetBrains Mono for metadata, and a three-glyph subset of Noto Serif SC for 沈亦旸.

- **Atmosphere** (`src/scripts/atmosphere.ts`, `Atmosphere.astro`): a raw WebGL fragment shader
  of domain-warped noise, lit by the pointer, rendered at ≤640 px wide and 30 fps. It stops in hidden
  tabs, draws one still frame for reduced motion, and leaves the CSS aurora in place where WebGL fails.
- **Opening** (`Intro.astro`): plays once per session (`sessionStorage`), decided before first paint
  by an inline script in `Base.astro`; click or any key skips it. Reduced motion never sees it.
- **Kinetics** (`src/scripts/kinetics.ts`, `src/styles/kinetics.css`): the hero name is split into
  letters that rise in sequence and respond to the pointer through the variable font's weight and
  softness axes; section titles rise out of masks phrase by phrase; chapter numbers float behind
  each section with a scroll-driven parallax (`animation-timeline: view()` where supported);
  `Marquee.astro` ribbons drift and lean with scroll velocity; buttons are magnetic; the hero stats
  count up; a cursor lamp follows the pointer; the navigation slips away while scrolling down and
  returns on the way up; the footer carries the name at display size and a live Wageningen clock.
  The hero tagline's accent carries a hand-drawn ink underline that draws itself, and
  `Statement.astro` sets a three-line typographic statement in alternating upright, italic and
  outlined Fraunces. Everything is skipped or static under `prefers-reduced-motion`, and the text
  is simply visible without JavaScript.
- **Chinese elements, kept quiet**: `Seal.astro` is a carved name seal, 沈亦旸印, that stamps in
  at the end of the opening, sits beside the alias in the hero and signs the footer (press it and
  it stamps again); the footer clock also names the current solar term, 节气, computed from the
  Sun's ecliptic longitude; chapter watermarks use the financial numerals 壹 贰 叁; fast pointer
  strokes leave an ink trail and buttons ripple with ink when pressed. The atmosphere warms at
  dawn and dusk in Wageningen and cools at night.

## Visual interactions

The hero retains the original interactive globe, visited-country colors, research locations,
and orbiting photo previews. The Places and Photography maps keep their existing controls.
`ParticleScene.astro` adds a separate decorative particle atmosphere behind the globe; its
Terrain / Orbit / Flow controls do not change the globe or either map.

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

The particle system interpolates its three forms in a shader. It initializes when visible,
shares the site's existing Three.js dependency, caps pixel density and particle count on small or lower-powered devices, suspends rendering
outside the viewport and in hidden tabs, and provides a pause control. Reduced-motion users
get a still composition by default; a static SVG remains available if this particle renderer
cannot initialize. These lifecycle controls apply to the new particle layer; the original
globe component is preserved.

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
├── components/     # Nav, Footer, Hero, About, Journey, Places, Photography, Films,
│                   # FilmPlayer, FilmPoster, Filmstrip, Contact, Globe, Arcade, ...
├── content/blog/   # unpublished journal posts (Markdown, EN + ZH)
├── content.config.ts
├── data/           # profile, journey, photos, films, travel, i18n
├── layouts/        # Base
├── pages/          # index.astro, nya-translator.astro, sitemap.xml.ts
└── styles/         # global.css, liquid-glass.css, kinetics.css
scripts/
├── build-photo-manifest.mjs   # EXIF -> photos.generated.json + copies to public/photos
├── build-og-image.mjs         # branded social share card
└── notify-bluesky.mjs         # new-post announcer (Journal is unpublished)
public/             # favicon, og-image.jpg, robots.txt, copied photos, CV/transcript PDFs
```
