#!/usr/bin/env node
/**
 * Reads everything in /photos/, extracts EXIF (GPS + DateTimeOriginal + camera),
 * and writes src/data/photos.generated.json.
 *
 * Photos without GPS can be geo-tagged with a YAML-like sidecar `.meta.json`:
 *   photos/
 *     wageningen-canal.jpg
 *     wageningen-canal.meta.json   -> { "location": { "name": "Wageningen", "country": "Netherlands", "coords": [5.6645, 51.9692] }, "caption": "..." }
 *
 * Photos with GPS in EXIF: just drop the file in; the script reads coords automatically.
 *
 * Also generates reasonable thumbnails next to the original (not yet implemented — for now
 * the site serves originals as thumbs; add sharp() later if needed).
 */

import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, extname, basename, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import exifr from 'exifr';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PHOTOS_DIR = join(ROOT, 'photos');
const PUBLIC_DIR = join(ROOT, 'public');
const OUTPUT = join(ROOT, 'src', 'data', 'photos.generated.json');

const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir, out = []) {
  if (!(await exists(dir))) return out;
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) await walk(full, out);
    else if (SUPPORTED.has(extname(e.name).toLowerCase())) out.push(full);
  }
  return out;
}

async function readSidecar(photoPath) {
  const sidecar = photoPath.replace(extname(photoPath), '.meta.json');
  if (!(await exists(sidecar))) return null;
  try {
    return JSON.parse(await readFile(sidecar, 'utf8'));
  } catch (e) {
    console.warn(`⚠️  failed to parse ${sidecar}: ${e.message}`);
    return null;
  }
}

function slugify(p) {
  return basename(p, extname(p)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function main() {
  const photosDirExists = await exists(PHOTOS_DIR);
  if (!photosDirExists) {
    console.log('📷 /photos/ does not exist yet — skipping manifest (site will use seed).');
    await writeFile(OUTPUT, JSON.stringify([], null, 2));
    return;
  }

  const files = await walk(PHOTOS_DIR);
  if (files.length === 0) {
    console.log('📷 /photos/ is empty — skipping manifest (site will use seed).');
    await writeFile(OUTPUT, JSON.stringify([], null, 2));
    return;
  }

  // Copy photos to /public/photos/ so they're served
  const { cp, mkdir } = await import('node:fs/promises');
  const publicPhotos = join(PUBLIC_DIR, 'photos');
  await mkdir(publicPhotos, { recursive: true });

  const manifest = [];
  for (const file of files) {
    const rel = relative(PHOTOS_DIR, file);
    const dest = join(publicPhotos, rel);
    await mkdir(join(dest, '..'), { recursive: true });
    try {
      await cp(file, dest);
    } catch (e) {
      console.warn(`⚠️  failed to copy ${rel}: ${e.message}`);
      continue;
    }

    const sidecar = await readSidecar(file);
    let exif = {};
    try {
      exif = (await exifr.parse(file, { gps: true, tiff: true, exif: true })) || {};
    } catch {}

    const coords =
      sidecar?.location?.coords ??
      (typeof exif.longitude === 'number' && typeof exif.latitude === 'number'
        ? [exif.longitude, exif.latitude]
        : null);

    if (!coords) {
      console.warn(`⚠️  ${rel} has no GPS EXIF and no .meta.json — skipping. Add a sidecar to include it.`);
      continue;
    }

    const takenAt =
      sidecar?.takenAt ??
      (exif.DateTimeOriginal instanceof Date
        ? exif.DateTimeOriginal.toISOString()
        : exif.CreateDate instanceof Date
        ? exif.CreateDate.toISOString()
        : new Date(0).toISOString());

    const photo = {
      id: sidecar?.id ?? slugify(rel),
      src: '/photos/' + rel.split('\\').join('/'),
      thumb: '/photos/' + rel.split('\\').join('/'), // TODO: generate real thumbs
      width: exif.ExifImageWidth ?? exif.ImageWidth ?? 1600,
      height: exif.ExifImageHeight ?? exif.ImageHeight ?? 1067,
      takenAt,
      location: {
        name: sidecar?.location?.name ?? 'Unknown location',
        country: sidecar?.location?.country ?? 'Unknown',
        coords
      },
      caption: sidecar?.caption,
      camera: sidecar?.camera ?? (exif.Make ? `${exif.Make} ${exif.Model ?? ''}`.trim() : undefined),
      exposure:
        sidecar?.exposure ??
        (exif.FNumber || exif.ExposureTime || exif.ISO
          ? [
              exif.FocalLength ? `${exif.FocalLength}mm` : null,
              exif.FNumber ? `f/${exif.FNumber}` : null,
              exif.ExposureTime ? `${exif.ExposureTime >= 1 ? exif.ExposureTime : `1/${Math.round(1 / exif.ExposureTime)}`}s` : null,
              exif.ISO ? `ISO${exif.ISO}` : null
            ]
              .filter(Boolean)
              .join(' · ')
          : undefined)
    };

    manifest.push(photo);
  }

  // Sort newest first
  manifest.sort((a, b) => (a.takenAt < b.takenAt ? 1 : -1));

  await writeFile(OUTPUT, JSON.stringify(manifest, null, 2));
  console.log(`✅ Wrote ${manifest.length} photos → ${relative(ROOT, OUTPUT)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
