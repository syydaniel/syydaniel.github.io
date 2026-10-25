// Fetches the list of films on my Bilibili space and writes it to
// src/data/bilibili.generated.json, so a film published there reaches the site
// without a line of data being written by hand (src/data/films.ts merges it in,
// with the title as posted until it is curated). Run by
// .github/workflows/sync-bilibili.yml on GitHub's machines, which Bilibili lets
// in; from a sandbox or behind a proxy it may not be reachable at all, in which
// case the file is left as it is.
//   node scripts/fetch-bilibili.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';

const MID = 437321627;
const OUT = new URL('../src/data/bilibili.generated.json', import.meta.url);
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const headers = { 'User-Agent': UA, Referer: `https://space.bilibili.com/${MID}/video`, Origin: 'https://space.bilibili.com', Accept: 'application/json, text/plain, */*' };

async function getJson(url, extra = {}) {
  const res = await fetch(url, { headers: { ...headers, ...extra }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

// A browser fingerprint cookie: without one Bilibili answers -352 (risk control).
async function cookie() {
  try {
    const j = await getJson('https://api.bilibili.com/x/frontend/finger/spi');
    if (j.code === 0 && j.data?.b_3) return `buvid3=${j.data.b_3}; buvid4=${j.data.b_4 ?? ''}`;
  } catch {}
  return '';
}

// The WBI signature Bilibili's own pages put on their requests.
const MIXIN = [46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34, 44, 52];
async function wbiSign(params, cookieHeader) {
  const nav = await getJson('https://api.bilibili.com/x/web-interface/nav', { Cookie: cookieHeader });
  const key = (u) => u.split('/').pop().split('.')[0];
  const raw = key(nav.data.wbi_img.img_url) + key(nav.data.wbi_img.sub_url);
  const mixin = MIXIN.map((i) => raw[i]).join('').slice(0, 32);
  const all = { ...params, wts: Math.floor(Date.now() / 1000) };
  const query = Object.keys(all).sort().map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(String(all[k]).replace(/[!'()*]/g, ''))}`).join('&');
  const w_rid = createHash('md5').update(query + mixin).digest('hex');
  return `${query}&w_rid=${w_rid}`;
}

const normalise = (a) => ({
  bvid: a.bvid,
  title: String(a.title ?? '').trim(),
  pubdate: Number(a.pubdate ?? a.created ?? 0),
  duration: typeof a.duration === 'number' ? a.duration : lengthToSeconds(a.length ?? a.duration_text ?? ''),
  pic: String(a.pic ?? a.cover ?? '').replace(/^http:/, 'https:').replace(/^\/\//, 'https://').replace(/@.*$/, ''),
  desc: String(a.desc ?? '').trim().slice(0, 400),
  view: Number(a.stat?.view ?? a.play ?? 0)
});
function lengthToSeconds(s) {
  const parts = String(s).split(':').map(Number);
  if (parts.some((n) => Number.isNaN(n))) return 0;
  return parts.reduce((t, n) => t * 60 + n, 0);
}

async function viaSeries(cookieHeader) {
  const out = [];
  for (let pn = 1; pn <= 5; pn++) {
    const j = await getJson(`https://api.bilibili.com/x/series/recArchivesByKeywords?mid=${MID}&keywords=&ps=50&pn=${pn}`, { Cookie: cookieHeader });
    if (j.code !== 0) throw new Error(`series: ${j.code} ${j.message}`);
    const list = j.data?.archives ?? [];
    out.push(...list.map(normalise));
    if (list.length < 50) break;
  }
  return out;
}
async function viaSearch(cookieHeader) {
  const out = [];
  for (let pn = 1; pn <= 5; pn++) {
    const q = await wbiSign({ mid: MID, ps: 50, pn, order: 'pubdate', platform: 'web', web_location: 1550101 }, cookieHeader);
    const j = await getJson(`https://api.bilibili.com/x/space/wbi/arc/search?${q}`, { Cookie: cookieHeader });
    if (j.code !== 0) throw new Error(`search: ${j.code} ${j.message}`);
    const list = j.data?.list?.vlist ?? [];
    out.push(...list.map(normalise));
    if (list.length < 50) break;
  }
  return out;
}

const cookieHeader = await cookie();
let archives = null;
for (const [name, fn] of [['series', viaSeries], ['search', viaSearch]]) {
  try {
    const list = await fn(cookieHeader);
    if (list.length) { archives = list; console.log(`${name}: ${list.length} archives`); break; }
    console.log(`${name}: empty`);
  } catch (e) { console.log(`${name}: ${e.message}`); }
}
if (!archives) { console.log('Bilibili could not be read; the list on file stays as it is.'); process.exit(0); }

const seen = new Set();
archives = archives.filter((a) => a.bvid && !seen.has(a.bvid) && seen.add(a.bvid)).sort((a, b) => b.pubdate - a.pubdate);

// The covers of the newest few films are kept on this origin (public/films/covers)
// at a stage size and a card size, so their cards do not depend on Bilibili
// letting the image through; `local` and `localSm` in the list say which have them.
const COVERS = new URL('../public/films/covers/', import.meta.url);
mkdirSync(COVERS, { recursive: true });
const sharp = (await import('sharp')).default;
for (const a of archives.slice(0, 3)) {
  const file = new URL(`${a.bvid}.jpg`, COVERS), small = new URL(`${a.bvid}-sm.jpg`, COVERS);
  if (!existsSync(file) && a.pic) {
    try {
      const res = await fetch(a.pic, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(20000) });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        await sharp(buf).resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(file);
        await sharp(buf).resize({ width: 640, withoutEnlargement: true }).jpeg({ quality: 78, mozjpeg: true }).toFile(small);
        console.log(`cover kept: ${a.bvid}`);
      }
    } catch (e) { console.log(`cover ${a.bvid}: ${e.message}`); }
  }
  if (existsSync(file)) a.local = `/films/covers/${a.bvid}.jpg`;
  if (existsSync(small)) a.localSm = `/films/covers/${a.bvid}-sm.jpg`;
}
let previous = { archives: [] };
try { previous = JSON.parse(readFileSync(OUT, 'utf8')); } catch {}
const same = JSON.stringify(previous.archives) === JSON.stringify(archives);
writeFileSync(OUT, JSON.stringify({ fetched: new Date().toISOString(), mid: MID, archives }, null, 2) + '\n');
console.log(same ? 'no new films' : `written: ${archives.length} archives, newest ${archives[0].bvid} ${archives[0].title}`);
