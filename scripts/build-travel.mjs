#!/usr/bin/env node
// Turns raw GPX tracks into the privacy-safe "Places" data the site shows.
//
//   npm run travel -- path/to/track.gpx [more.gpx ...]
//
// Raw GPS never reaches the repo. Every point is snapped to a ~10 km grid
// cell (0.1 degree), so the map shows regions I've been, not routes, home or
// daily patterns. Countries and cities come from Natural Earth (public domain),
// downloaded once into node_modules/.cache/travel.
//
// Writes:
//   public/travel.json                cells + visited-country outlines (fetched lazily by the map)
//   src/data/travel.generated.json    stats + country / city lists (rendered at build time)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = path.join(root, 'node_modules/.cache/travel');
const NE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/';
const CELL = 0.1; // grid size in degrees (~11 km north-south)
const CITY_RADIUS_KM = 8;
const CITY_MIN_POP = 10000;
// Countries only crossed in the air. Their fixes sit at airliner altitude with
// bogus speeds, so the speed filter can't catch them (Russia: Feb 2025 and
// Feb 2026 flights between China and Europe). Check the per-country altitude
// printed at the end when adding new tracks.
const EXCLUDE_COUNTRIES = new Set(['RUS']);

const files = process.argv.slice(2);
if (!files.length) {
  console.error('Usage: npm run travel -- path/to/track.gpx [more.gpx ...]');
  process.exit(1);
}

async function naturalEarth(name) {
  fs.mkdirSync(CACHE, { recursive: true });
  const file = path.join(CACHE, name);
  if (!fs.existsSync(file)) {
    console.log(`Downloading ${name} ...`);
    const res = await fetch(NE + name);
    if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

// ---------- parse ----------
const PT = /<(trkpt|rtept|wpt)\b([^>]*?)(\/>|>([\s\S]*?)<\/\1>)/g;
const points = []; // [lng, lat, epochMs | NaN]
for (const f of files) {
  const xml = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = PT.exec(xml))) {
    const lat = parseFloat((m[2].match(/\blat\s*=\s*["']([^"']+)/) || [])[1]);
    const lon = parseFloat((m[2].match(/\blon\s*=\s*["']([^"']+)/) || [])[1]);
    if (!isFinite(lat) || !isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) continue;
    if (lat === 0 && lon === 0) continue;
    const t = m[4] ? Date.parse((m[4].match(/<time>([^<]+)<\/time>/) || [])[1] ?? '') : NaN;
    // Phones keep logging in the air: a fix above ~250 km/h is a flight, not a visit.
    const speed = m[4] ? parseFloat((m[4].match(/<speed>([^<]+)<\/speed>/) || [])[1]) : NaN;
    if (speed > 70) continue;
    const ele = m[4] ? parseFloat((m[4].match(/<ele>([^<]+)<\/ele>/) || [])[1]) : NaN;
    points.push([lon, lat, t, ele]);
  }
}
if (!points.length) {
  console.error('No track points found.');
  process.exit(1);
}
console.log(`${points.length.toLocaleString()} points from ${files.length} file(s)`);

// ---------- distance + time span ----------
const R = 6371;
const rad = (d) => (d * Math.PI) / 180;
function km(a, b) {
  const dLat = rad(b[1] - a[1]);
  const dLon = rad(b[0] - a[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[1])) * Math.cos(rad(b[1])) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
let distance = 0;
for (let i = 1; i < points.length; i++) {
  const a = points[i - 1];
  const b = points[i];
  const d = km(a, b);
  // Skip jumps between separate recordings (flights, gaps in logging).
  const gapH = isFinite(a[2]) && isFinite(b[2]) ? Math.abs(b[2] - a[2]) / 3.6e6 : 0;
  if (d < 30 && gapH < 2) distance += d;
}
const times = points.map((p) => p[2]).filter(isFinite).sort((a, b) => a - b);
const days = new Set(times.map((t) => new Date(t).toISOString().slice(0, 10))).size;

// Unique points at ~1 km resolution, used for country + city lookups.
// Each also keeps one altitude and date sample for the diagnostics below.
const fine = new Map();
for (const [lng, lat, t, ele] of points) {
  const k = `${lng.toFixed(2)},${lat.toFixed(2)}`;
  const e = fine.get(k);
  if (e) e.n++;
  else fine.set(k, { n: 1, ele, day: isFinite(t) ? new Date(t).toISOString().slice(0, 10) : '' });
}
const finePts = [...fine.entries()].map(([k, e]) => [...k.split(',').map(Number), e.n, e.ele, e.day]);

// ---------- countries ----------
function ringContains(ring, x, y) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function polyContains(poly, x, y) {
  if (!ringContains(poly[0], x, y)) return false;
  for (let h = 1; h < poly.length; h++) if (ringContains(poly[h], x, y)) return false;
  return true;
}
function bboxOf(geom) {
  let [x0, y0, x1, y1] = [180, 90, -180, -90];
  const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;
  for (const p of polys) for (const [x, y] of p[0]) {
    if (x < x0) x0 = x;
    if (y < y0) y0 = y;
    if (x > x1) x1 = x;
    if (y > y1) y1 = y;
  }
  return [x0, y0, x1, y1];
}

// Everyday short names where Natural Earth's are formal.
const EN_SHORT = { CHN: 'China', PRK: 'North Korea', KOR: 'South Korea', TWN: 'Taiwan' };
const ZH_SHORT = { CHN: '中国', PRK: '朝鲜', KOR: '韩国', TWN: '台湾', HKG: '香港', MAC: '澳门' };
const ne50 = await naturalEarth('ne_50m_admin_0_countries.geojson');
const countryShapes = ne50.features
  .filter((f) => f.geometry)
  .map((f) => ({
    a3: f.properties.ADM0_A3,
    a2: f.properties.ISO_A2_EH && f.properties.ISO_A2_EH !== '-99' ? f.properties.ISO_A2_EH : f.properties.ISO_A2,
    en: EN_SHORT[f.properties.ADM0_A3] || f.properties.NAME_EN || f.properties.NAME,
    zh: ZH_SHORT[f.properties.ADM0_A3] || f.properties.NAME_ZH || f.properties.NAME,
    polys: f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates,
    bbox: bboxOf(f.geometry)
  }));

// Small islands and coastlines are missing or simplified at 50m, so a point
// that lands in no polygon goes to the nearest country border within 25 km.
const NEAR_KM = 25;
function countryAt(x, y) {
  for (const c of countryShapes) {
    const [x0, y0, x1, y1] = c.bbox;
    if (x < x0 || x > x1 || y < y0 || y > y1) continue;
    if (c.polys.some((p) => polyContains(p, x, y))) return c;
  }
  let best = null;
  let bestKm = NEAR_KM;
  const pad = 0.5;
  for (const c of countryShapes) {
    const [x0, y0, x1, y1] = c.bbox;
    if (x < x0 - pad || x > x1 + pad || y < y0 - pad || y > y1 + pad) continue;
    for (const p of c.polys) for (const v of p[0]) {
      if (Math.abs(v[1] - y) > 0.3) continue;
      const d = km([x, y], v);
      if (d < bestKm) {
        bestKm = d;
        best = c;
      }
    }
  }
  return best;
}

const byCountry = new Map();
const fineCountry = new Map(); // ~1 km key -> ADM0_A3 (absent = open sea)
for (const [x, y, n, ele, day] of finePts) {
  const c = countryAt(x, y);
  if (!c) continue;
  fineCountry.set(`${x.toFixed(2)},${y.toFixed(2)}`, c.a3);
  const e = byCountry.get(c.a3) || { c, spots: 0, n: 0, eles: [], days: new Set() };
  e.spots++;
  e.n += n;
  if (isFinite(ele)) e.eles.push(ele);
  if (day) e.days.add(day);
  byCountry.set(c.a3, e);
}
// A couple of stray fixes near a border are GPS noise, not a visit.
const visited = [...byCountry.values()]
  .filter((e) => e.spots >= 3 && !EXCLUDE_COUNTRIES.has(e.c.a3))
  .sort((a, b) => b.n - a.n);
const visitedA3 = new Set(visited.map((e) => e.c.a3));

// ---------- grid cells ----------
// Only points in visited countries (or at sea, e.g. ferries) light up a cell,
// so flight fixes over excluded or stray countries stay off the map too.
const cells = new Map();
for (const [lng, lat] of points) {
  const a3 = fineCountry.get(`${lng.toFixed(2)},${lat.toFixed(2)}`);
  if (a3 && !visitedA3.has(a3)) continue;
  const k = `${Math.floor(lng / CELL)},${Math.floor(lat / CELL)}`;
  cells.set(k, (cells.get(k) || 0) + 1);
}
const cellList = [...cells.entries()].map(([k, n]) => {
  const [cx, cy] = k.split(',').map(Number);
  return [+((cx + 0.5) * CELL).toFixed(2), +((cy + 0.5) * CELL).toFixed(2), n];
});

// ---------- cities ----------
const places = await naturalEarth('ne_10m_populated_places.geojson');
const cityGrid = new Map();
for (const f of places.features) {
  const p = f.properties;
  if ((p.POP_MAX || 0) < CITY_MIN_POP && !/capital/i.test(p.FEATURECLA || '')) continue;
  const [x, y] = f.geometry.coordinates;
  const k = `${Math.floor(x)},${Math.floor(y)}`;
  if (!cityGrid.has(k)) cityGrid.set(k, []);
  cityGrid.get(k).push({ x, y, en: p.NAME_EN || p.NAME, zh: p.NAME_ZH || p.NAME_EN || p.NAME, a3: p.ADM0_A3, pop: p.POP_MAX || 0 });
}
const cityHits = new Map();
for (const [x, y, n] of finePts) {
  const gx = Math.floor(x);
  const gy = Math.floor(y);
  for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
    for (const c of cityGrid.get(`${gx + dx},${gy + dy}`) || []) {
      if (km([x, y], [c.x, c.y]) > CITY_RADIUS_KM) continue;
      const key = `${c.en}|${c.a3}`;
      const e = cityHits.get(key) || { c, n: 0, spots: 0 };
      e.n += n;
      e.spots++;
      cityHits.set(key, e);
    }
  }
}
// One stray fix (GPS glitch) is not a visit: need at least two separate ~1 km spots.
const cityList = [...cityHits.values()]
  .filter((e) => e.spots >= 2 && visitedA3.has(e.c.a3))
  .sort((a, b) => b.n - a.n || b.c.pop - a.c.pop);

// ---------- outlines (coarse 110m shapes keep the file small) ----------
const ne110 = await naturalEarth('ne_110m_admin_0_countries.geojson');
const round = (v) => (Array.isArray(v) ? v.map(round) : +v.toFixed(2));
const outlines = {
  type: 'FeatureCollection',
  features: ne110.features
    .filter((f) => visitedA3.has(f.properties.ADM0_A3) && f.geometry)
    .map((f) => ({ type: 'Feature', properties: { a3: f.properties.ADM0_A3 }, geometry: { type: f.geometry.type, coordinates: round(f.geometry.coordinates) } }))
};

// ---------- write ----------
const flag = (a2) => (a2 && /^[A-Z]{2}$/.test(a2) ? String.fromCodePoint(...[...a2].map((ch) => 0x1f1a5 + ch.charCodeAt(0))) : '🏳️');
const summary = {
  generatedAt: new Date().toISOString().slice(0, 10),
  stats: {
    countries: visited.length,
    cities: cityList.length,
    km: Math.round(distance),
    days,
    firstYear: times.length ? new Date(times[0]).getUTCFullYear() : null,
    lastYear: times.length ? new Date(times[times.length - 1]).getUTCFullYear() : null
  },
  countries: visited.map((e) => ({
    a3: e.c.a3,
    flag: flag(e.c.a2),
    en: e.c.en,
    zh: e.c.zh,
    cities: cityList.filter((x) => x.c.a3 === e.c.a3).map((x) => ({ en: x.c.en, zh: x.c.zh }))
  }))
};

fs.writeFileSync(path.join(root, 'public/travel.json'), JSON.stringify({ cells: cellList, outlines }));
fs.writeFileSync(path.join(root, 'src/data/travel.generated.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(`${cellList.length} cells, ${visited.length} countries, ${cityList.length} cities, ${Math.round(distance)} km`);
// Diagnostics: a country seen on only a day or two at high median altitude is
// probably a flight path. Add it to EXCLUDE_COUNTRIES.
const median = (a) => (a.length ? [...a].sort((p, q) => p - q)[a.length >> 1] : NaN);
for (const e of [...byCountry.values()].sort((a, b) => b.n - a.n)) {
  const tag = EXCLUDE_COUNTRIES.has(e.c.a3) ? '  [excluded]' : e.spots < 3 ? '  [too few spots]' : '';
  console.log(`${flag(e.c.a2)} ${e.c.en.padEnd(22)} ${String(e.spots).padStart(6)} spots ${String(e.days.size).padStart(5)} days  median ${Math.round(median(e.eles))} m${tag}`);
}
