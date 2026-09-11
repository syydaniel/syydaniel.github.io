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

import { createHash } from 'node:crypto';
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
let points = []; // [lng, lat, epochMs | NaN, ele | NaN]
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

// ---------- outlier clusters ----------
// GPS glitches and stray in-flight fixes show up as tiny islands far from
// everything else. Cells within ~1 degree of each other form one cluster; a
// cluster with fewer than MIN_CLUSTER_POINTS fixes is dropped before anything
// else is computed. (Real short visits, e.g. a day in Lisbon, have 100+.)
const MIN_CLUSTER_POINTS = 30;
{
  const cellKey = (lng, lat) => `${Math.floor(lng / CELL)},${Math.floor(lat / CELL)}`;
  const counts = new Map();
  for (const [lng, lat] of points) {
    const k = cellKey(lng, lat);
    counts.set(k, (counts.get(k) || 0) + 1);
  }
  const LINK = Math.round(1 / CELL);
  const cluster = new Map(); // cell key -> shared member list
  for (const start of counts.keys()) {
    if (cluster.has(start)) continue;
    const members = [start];
    cluster.set(start, members);
    for (let i = 0; i < members.length; i++) {
      const [cx, cy] = members[i].split(',').map(Number);
      for (let dx = -LINK; dx <= LINK; dx++) for (let dy = -LINK; dy <= LINK; dy++) {
        const k = `${cx + dx},${cy + dy}`;
        if (counts.has(k) && !cluster.has(k)) {
          cluster.set(k, members);
          members.push(k);
        }
      }
    }
  }
  const drop = new Set();
  for (const members of new Set(cluster.values())) {
    const n = members.reduce((s, k) => s + counts.get(k), 0);
    if (n >= MIN_CLUSTER_POINTS) continue;
    members.forEach((k) => drop.add(k));
    const [cx, cy] = members[0].split(',').map(Number);
    console.log(`  dropped outlier: ${n} point(s) near ${((cy + 0.5) * CELL).toFixed(2)}, ${((cx + 0.5) * CELL).toFixed(2)}`);
  }
  points = points.filter(([lng, lat]) => !drop.has(cellKey(lng, lat)));
}

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
function bboxOf(polys) {
  let [x0, y0, x1, y1] = [180, 90, -180, -90];
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
// Borders follow Natural Earth's China point of view (ADM0_A3_CN), so Taiwan is
// drawn and counted as part of China.
const a3Of = (p) => (p.ADM0_A3_CN && p.ADM0_A3_CN !== '-99' ? p.ADM0_A3_CN : p.ADM0_A3);
const polysOf = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates);
function mergeByA3(features) {
  const out = new Map(); // a3 -> { p: properties of the country itself, polys }
  for (const f of features) {
    if (!f.geometry) continue;
    const a3 = a3Of(f.properties);
    const e = out.get(a3) || { p: f.properties, polys: [] };
    if (f.properties.ADM0_A3 === a3) e.p = f.properties;
    e.polys.push(...polysOf(f.geometry));
    out.set(a3, e);
  }
  return out;
}
const remapA3 = new Map(ne50.features.map((f) => [f.properties.ADM0_A3, a3Of(f.properties)]));
const countryShapes = [...mergeByA3(ne50.features)].map(([a3, { p, polys }]) => ({
  a3,
  a2: p.ISO_A2_EH && p.ISO_A2_EH !== '-99' ? p.ISO_A2_EH : p.ISO_A2,
  en: EN_SHORT[a3] || p.NAME_EN || p.NAME,
  zh: ZH_SHORT[a3] || p.NAME_ZH || p.NAME,
  polys,
  bbox: bboxOf(polys)
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
  cityGrid.get(k).push({ x, y, en: p.NAME_EN || p.NAME, zh: p.NAME_ZH || p.NAME_EN || p.NAME, a3: remapA3.get(p.ADM0_A3) ?? p.ADM0_A3, pop: p.POP_MAX || 0 });
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
const coarse = mergeByA3(ne110.features);
const outlines = {
  type: 'FeatureCollection',
  features: [...visitedA3].map((a3) => {
    // Small islands (Faroe, Cape Verde) are missing at 110m: fall back to 50m.
    const polys = coarse.get(a3)?.polys ?? countryShapes.find((c) => c.a3 === a3).polys;
    return { type: 'Feature', properties: { a3 }, geometry: { type: 'MultiPolygon', coordinates: round(polys) } };
  })
};

// ---------- rotating-globe data (hero) ----------
// One color per visited country, shared by the hero globe and the Places list.
// No teal: that is the globe's color for everywhere else.
const PALETTE = ['#ff5a5f', '#ffb000', '#5aa9ff', '#9ef01a', '#b388ff', '#ff6ec7', '#fff275', '#ff7f11', '#f72585', '#a0c4ff', '#d4a373', '#c0ff8c', '#ffadad', '#e0e0ff', '#bdb2ff'];

// Footprint spots on a coarse 0.5 degree grid: the globe is small.
const GLOBE_CELL = 0.5;
const spotsBy = new Map(); // a3 -> Set of "lng,lat"
for (const [lng, lat] of points) {
  const a3 = fineCountry.get(`${lng.toFixed(2)},${lat.toFixed(2)}`);
  if (!a3 || !visitedA3.has(a3)) continue;
  const k = `${((Math.floor(lng / GLOBE_CELL) + 0.5) * GLOBE_CELL).toFixed(2)},${((Math.floor(lat / GLOBE_CELL) + 0.5) * GLOBE_CELL).toFixed(2)}`;
  if (!spotsBy.has(a3)) spotsBy.set(a3, new Set());
  spotsBy.get(a3).add(k);
}

// Neighbours must not look alike: each country (most visited first) takes the
// unused palette color that differs most from those of countries within 2500 km.
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const colorDist = (a, b) => Math.hypot(...rgb(a).map((v, i) => v - rgb(b)[i]));
function centroid(a3) {
  const s = [...(spotsBy.get(a3) || [])].map((k) => k.split(',').map(Number));
  return s.length ? [s.reduce((t, p) => t + p[0], 0) / s.length, s.reduce((t, p) => t + p[1], 0) / s.length] : null;
}
const colorBy = new Map(); // a3 -> color
for (const e of visited) {
  const here = centroid(e.c.a3);
  const near = [...colorBy].filter(([a3]) => {
    const there = centroid(a3);
    return here && there && km(here, there) < 2500;
  }).map(([, col]) => col);
  const used = new Set(colorBy.values());
  const pool = PALETTE.filter((c) => !used.has(c));
  const choices = pool.length ? pool : PALETTE;
  let best = choices[0];
  let bestScore = -1;
  for (const c of choices) {
    const score = near.length ? Math.min(...near.map((n) => colorDist(c, n))) : Infinity;
    if (score > bestScore) {
      best = c;
      bestScore = score;
    }
  }
  colorBy.set(e.c.a3, best);
}

// The globe draws land as a golden-angle spiral of GLOBE_DOTS points. Record
// which spiral indices fall inside each visited country so those get tinted.
const GLOBE_DOTS = 32000; // keep in sync with CANDIDATES in src/components/Globe.astro
const golden = Math.PI * (3 - Math.sqrt(5));
const visitedShapes = countryShapes.filter((c) => visitedA3.has(c.a3));
const dotsBy = new Map(); // a3 -> spiral indices
for (let i = 0; i < GLOBE_DOTS; i++) {
  const y = 1 - (i / (GLOBE_DOTS - 1)) * 2;
  const rr = Math.sqrt(Math.max(0, 1 - y * y));
  const x = Math.cos(golden * i) * rr;
  const z = Math.sin(golden * i) * rr;
  let th = Math.atan2(z, -x);
  if (th < 0) th += Math.PI * 2;
  const lon = (th / (Math.PI * 2)) * 360 - 180;
  const lat = 90 - (Math.acos(Math.min(1, Math.max(-1, y))) * 180) / Math.PI;
  for (const c of visitedShapes) {
    const [x0, y0, x1, y1] = c.bbox;
    if (lon < x0 || lon > x1 || lat < y0 || lat > y1) continue;
    if (!c.polys.some((p) => polyContains(p, lon, lat))) continue;
    if (!dotsBy.has(c.a3)) dotsBy.set(c.a3, []);
    dotsBy.get(c.a3).push(i);
    break;
  }
}

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
  countries: visited.map((e, i) => ({
    a3: e.c.a3,
    flag: flag(e.c.a2),
    en: e.c.en,
    zh: e.c.zh,
    color: colorBy.get(e.c.a3),
    cities: cityList.filter((x) => x.c.a3 === e.c.a3).map((x) => ({ en: x.c.en, zh: x.c.zh })),
    dots: dotsBy.get(e.c.a3) || [],
    spots: [...(spotsBy.get(e.c.a3) || [])].map((k) => k.split(',').map(Number))
  }))
};

const travelJson = JSON.stringify({ cells: cellList, outlines });
// The page fetches /travel.json?v=<hash>, so fresh data is never hidden behind
// a browser's cached copy (GitHub Pages lets browsers cache it for 10 minutes).
summary.version = createHash('sha1').update(travelJson).digest('hex').slice(0, 10);
fs.writeFileSync(path.join(root, 'public/travel.json'), travelJson);
fs.writeFileSync(path.join(root, 'src/data/travel.generated.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(`${cellList.length} cells, ${visited.length} countries, ${cityList.length} cities, ${Math.round(distance)} km`);
// Diagnostics: a country seen on only a day or two at high median altitude is
// probably a flight path. Add it to EXCLUDE_COUNTRIES.
const median = (a) => (a.length ? [...a].sort((p, q) => p - q)[a.length >> 1] : NaN);
for (const e of [...byCountry.values()].sort((a, b) => b.n - a.n)) {
  const tag = EXCLUDE_COUNTRIES.has(e.c.a3) ? '  [excluded]' : e.spots < 3 ? '  [too few spots]' : '';
  console.log(`${flag(e.c.a2)} ${e.c.en.padEnd(22)} ${String(e.spots).padStart(6)} spots ${String(e.days.size).padStart(5)} days  median ${Math.round(median(e.eles))} m${tag}`);
}
