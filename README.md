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
  one vermilion shoreline. The pointer carries the light: the hillshade turns to follow it, and
  the ground gives a little under it, so the contours bend around the hand like paper under a
  finger. The camera lands from above after the opening and climbs away as the page scrolls.
  Three.js loads only when the hero is on screen; reduced motion gets one still frame.
- **Ink** (`Atmosphere.astro`, `src/scripts/ink.ts`): a real-time fluid simulation (velocity
  advected, curled and projected on a small grid, dye on a larger one) behind the whole site, in
  月白, mist grey and 黛青 with one drop in twenty of 朱砂. The pointer drags it (its path is
  resampled into an even trail of splats, so a fast stroke is one filament, not a row of blobs),
  scrolling stirs it, a drop lands on its own now and then, and a pressed seal pours
  into it, and the opening ends with one drop blooming in the middle. Where half-float render
  targets are missing, `src/scripts/atmosphere.ts` draws a noise atmosphere instead.
- **The sky, 天色** (`src/scripts/sky.ts`): two skies. The sky over the reader decides the page's
  light: which ink it wears (day ink while their Sun is up, night ink after; a pin lasts until
  their sky next changes), the glow on the paper, the lamp, the Moon in the toggle. It is worked
  out from their clock and time zone, no network and no location asked: the longitude from the
  clock's offset, a temperate latitude for the hemisphere. The sky over Wageningen is the page's
  weather and its readouts: the Sun's height and bearing there, today's sunrise and sunset, and
  the weather from Open-Meteo when it can be reached, remembered for a quarter of an hour. The
  night's own effects belong to the night ink, so a page kept light after dark stays a lit room. The paper warms
  while the Sun is low and cools and dims once it has set; the catchment is lit from where the Sun
  stands, flatter under cloud; rain there lands as drops in the ink here and a wind there is a slow
  drift; the globe shows the real day-night line; the footer and the ticker read it all out, with
  the Moon's phase beside the lunar date. The page wears its day ink while the Sun is up there and
  its night ink after; the toggle pins an ink until the next sunrise or sunset. Real rain lifts the
  water in the catchment and stirs it, snow lies on its heights, fog closes the mist in, a storm
  lights the paper now and then, and the wind moves the marquee ribbons. A sheet of 天光 lies over
  the paper (`.skylight`): the Sun's glow comes in from the left at dawn and the right at dusk,
  less of it under cloud, and an overcast or rainy sky lays a grey veil over the top; the cursor
  lamp is cool daylight, warmer and smaller after dark, broad and dim under cloud; the dot beside
  the hero's weather line takes the colour of the light. All of it is registered CSS properties,
  so a change in the weather eases in over a couple of seconds, and the WebGL layers ease too (the
  water rises, the snow settles, the paper tints) rather than snapping when the forecast arrives.
  The paper itself takes the weather's cast in the ink shader: amber at the golden hours, cooler
  at night, greyer and flatter under cloud, blue-grey in rain, colder and whiter in snow; rain
  lands as denser, heavier drops and a storm flashes every few seconds. A chip in the navigation
  shows the sky's glyph (tonight's Moon on a clear night) and the temperature, and opens a card
  with the weather, the Sun's times, the Moon, which ink the page wears until when, and the note.
  The theme toggle's tooltip says why the page wears its ink and until when, and at night its moon
  shows tonight's phase. The weather reaches further down the page too: under the Photography lede
  a line says whether it is golden hour in Wageningen right now, when the next one comes, or that
  the sky is closed today; the Places columns are lit from where the Sun stands, flatter under
  cloud; the Nya translator's sentence is today's weather until someone types; the Contact card
  gives the time and weather where the mail lands; rain makes the chapter watermarks run and fog
  fades them; snow lies on the footer's near ridge, fog softens the hills, a storm darkens them;
  and the browser's own bar (meta theme-color) takes the paper's cast. The card also gives the
  day's length and how it compares with yesterday, what the air feels like and its humidity; the
  hero's live line opens the same card, so a phone has it too; the Contact line opens with the
  hour's word; the footer's hills take the season's colour (moss in spring, blue-green in summer,
  ochre in autumn, grey in winter); the Nya translator offers a way back to today's weather once
  someone has typed; a print stylesheet leaves the text and cards on white paper without the sky
  or the controls; and `404.astro` is the page for a path that is not on any of the maps. The hero's live line opens with the hour's word (morning, afternoon,
  evening, night, in Wageningen's own time), a strong wind shows an arrow pointing where it blows,
  and the footer's note says what the sky is doing to the page right now (raining in the ink, snow
  on the heights, a storm lighting the paper, fog closing in, or the night ink until sunrise). To see a state the sky is not in, add `?sky=night`
  (or `dawn`, `day`, `dusk`) and `?weather=rain` (or `clear`, `cloud`, `fog`, `snow`, `storm`)
  to the address.
- **Each chapter has a colour** (`src/styles/kinetics.css`, `--chapter-hue`): a mineral from the
  painter's box for each chapter (黛青 for About, 石青 for Journey, 石绿 for Places, a golden
  ochre for Photography, cinnabar for Contact…). It tints the chapter's number and watermark, a
  brush-edged wash behind its head (an SVG ellipse roughened with turbulence, faded in as the
  chapter enters), the shadow its cards lift with, and, as the reader arrives, the ambient light
  of the page (`--chapter-tint` on the skylight, eased over two seconds). The ink carries the
  same minerals: now and then a drop of azurite, malachite, ochre or gamboge, and where the dye
  lies thick its colour deepens like a glaze.
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
- **Wayfinding**: every chapter opens the same way (number and name, title, one paragraph, the
  work) just under the navigation; a chapter rail on the left (书签) shows where you are, fills
  with the scroll and jumps on click; a "Next" cue closes every chapter; one accent, 朱砂, marks
  the thing to look at. Blocks settle onto the page in depth as they arrive, posters and the film
  stage tilt under the pointer, and the seals press in perspective.
- **Mechanics**: `Ticker.astro`, an instrument readout along the hero's foot; inertial wheel
  scrolling on desktop (`src/scripts/inertia.ts`, never over maps, the globe, the gallery or
  anything that scrolls on its own); a cursor badge that names what a frame does; magnetic buttons
  with an ink ripple; an ink trail behind fast pointer strokes; counting numbers; a navigation bar
  that slips away while reading. Everything is skipped or static under `prefers-reduced-motion`,
  and the text is simply visible without JavaScript.

## Two inks (light and dark)

The page follows the system colour scheme and can be pinned from the toggle in the navigation
(choosing the scheme the system already uses lets the page follow the system again; the choice
is remembered per browser). Every colour on the site is a token in `src/styles/theme.css`, a
`light-dark()` pair: 纸上墨, ink on 宣纸 by day, and 夜里墨, the same ink on lamp-black at night.
Transparencies are `color-mix()`es of those tokens and the Tailwind palette reads them too, so
every utility and `/opacity` modifier follows the theme. The toggle wipes the new ink out from
the button with a View Transition. The fluid ink, the catchment and the globe carry a theme
uniform and repaint on `themechange`; the maps repaint their layers. Text tokens are checked
against the surfaces they sit on in both schemes by `node scripts/check-contrast.mjs` (AA for
body-size text). The seal paste and the primary button keep the deep cinnabar in both inks.

## The atlas and the globe

The three maps share one ink-wash base (`src/scripts/atlas.ts`): Natural Earth 1:50m country
shapes, simplified and kept as TopoJSON (`npm run atlas` → `scripts/build-atlas.mjs` →
`public/atlas/countries.json`, ~350 KB, ~105 KB gzipped), decoded in the browser into paper
land on a washed sea, a hairline coast, dashed borders and a 10° graticule, in the page's two
inks. Beyond zoom 5 the Photography map fades a desaturated raster base (Esri light or dark
grey, by theme) in under the lines for street-level detail; the other maps never zoom that far.
The Places map is a pitched table: the 10 km squares of the GPS tracks rise as columns by time
spent (summed into 1° squares at world zoom, the squares themselves close up), and the country
list, the map and the globe stay in step through one focus.

`Globe.astro` is a paper 浑仪: a sphere shaded with ink at the limb, continents stippled in
ink, the countries walked in 黛青 with the GPS footprints in 朱砂, the research cities joined by
dashed arcs, and three hairline rings turning on their own axes around it. The beads on the
outer ring are photographs (hover for the frame, press to open). Drag to turn, and it keeps
turning for a moment; the scroll turns it too; pressing a footprint focuses that country on the
map below.

## Visual interactions

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
