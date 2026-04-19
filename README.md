# syydaniel.github.io

Personal site of Yiyang Shen (Daniel · 沈亦旸) — environmental researcher & photographer.

**Live**: https://syydaniel.github.io

## Stack

- [Astro 5](https://astro.build) — static site generator
- [Tailwind CSS](https://tailwindcss.com)
- [MapLibre GL JS](https://maplibre.org) — interactive maps (no API key required)
- [Three.js](https://threejs.org) — hero particle field
- [exifr](https://github.com/MikeKovarik/exifr) — EXIF extraction for photos

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

`npm run build` automatically runs `scripts/build-photo-manifest.mjs`, which reads `/photos/`,
extracts EXIF, and writes `src/data/photos.generated.json`. See [photos/README.md](photos/README.md)
for how to add your photos.

## Deploy

GitHub Actions workflow at [.github/workflows/deploy.yml](.github/workflows/deploy.yml) builds
and publishes to GitHub Pages on every push to `main`.

After the first push, enable Pages in repo settings → Pages → Source: **GitHub Actions**.

## Structure

```
src/
├── components/     # Nav, Footer, Hero, About, Journey, Photography, Contact
├── data/           # profile, journey, photos (seed + generated)
├── layouts/        # Base layout
├── pages/          # index.astro
└── styles/         # global.css
scripts/
└── build-photo-manifest.mjs   # EXIF → photos.generated.json
photos/             # your originals (gitignored if large)
public/             # favicon, copied photos
```
