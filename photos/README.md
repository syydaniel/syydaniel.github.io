# Photos

Drop your photo files directly into this folder. They can be nested in subfolders
(e.g. `photos/lapland/`, `photos/vancouver/`).

Supported: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`.

## Two ways to geo-tag a photo

### 1. EXIF GPS (easiest)

Most photos from phones and modern cameras already have GPS baked in. Just drop the file here.
The build script reads it automatically.

### 2. Sidecar `.meta.json` (for photos without GPS, or to override)

Next to `wageningen-canal.jpg`, create `wageningen-canal.meta.json`:

```json
{
  "location": {
    "name": "Wageningen Canal",
    "country": "Netherlands",
    "coords": [5.6645, 51.9692]
  },
  "takenAt": "2024-10-15T16:20:00Z",
  "caption": "Mist over the lowland canals.",
  "camera": "Fujifilm X-T5",
  "exposure": "35mm · f/2.8 · 1/125s · ISO400"
}
```

All fields are optional except `location.coords` (if the photo has no GPS EXIF).
**Coords are `[longitude, latitude]`** — MapLibre order, not Google Maps order.

## Rebuild the manifest

After adding photos:

```bash
npm run photos:manifest
```

This generates `src/data/photos.generated.json` and copies everything into `/public/photos/`.
`npm run build` does it automatically.

## Large galleries

If you have hundreds of photos, consider adding `sharp` to generate 400×267 thumbnails
into `/public/photos-thumb/`. The current script points `thumb` to the original — fine
for up to a few dozen photos.
