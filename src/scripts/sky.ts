// 天色: the sky over Wageningen, read into the page. The Sun's place is worked
// out here, no network needed; the weather comes from Open-Meteo when it can be
// reached and is remembered for a quarter of an hour. Everything downstream
// (the ink, the catchment's light, the globe's night side, the footer and the
// ticker) reads `window.__sky` and listens for `skychange`. Nothing waits on
// the network: the sun is published at once, the weather when it arrives.

export type Phase = 'night' | 'dawn' | 'day' | 'dusk';
export type Weather = {
  temp: number; // °C
  code: number; // WMO weather code
  wind: number; // km/h
  windDir: number; // degrees, where the wind comes from
  cloud: number; // 0..1
  rain: number; // 0..1, from the last hour's precipitation
  isDay: boolean;
  at: number; // ms since epoch, when it was fetched
};
export type Sky = {
  elevation: number; // of the Sun, degrees above the horizon
  azimuth: number; // degrees clockwise from north
  phase: Phase;
  daylight: number; // 0 at night … 1 in full day
  golden: number; // 1 with the Sun on the horizon, 0 when it is high or long gone
  night: boolean; // the Sun is below the horizon: the page wears its night ink
  sunrise: string | null; // "07:52", Wageningen time
  sunset: string | null;
  moon: Moon | null;
  weather: Weather | null;
};
export type Moon = { day: number; lit: number; waxing: boolean };

// ?sky=night and ?weather=storm on the URL stand in for the real thing, to see
// the page in a state the sky over Wageningen is not in right now.
const params = new URLSearchParams(location.search);
const FORCED_PHASE = params.get('sky') as Phase | null;
const FORCED_WEATHER = params.get('weather');
const CANNED: Record<string, Partial<Weather>> = {
  clear: { temp: 19, code: 0, wind: 6, windDir: 90, cloud: 0.05, rain: 0 },
  cloud: { temp: 12, code: 3, wind: 14, windDir: 240, cloud: 0.95, rain: 0 },
  fog: { temp: 7, code: 45, wind: 3, windDir: 180, cloud: 1, rain: 0 },
  rain: { temp: 9, code: 61, wind: 24, windDir: 230, cloud: 0.9, rain: 0.6 },
  snow: { temp: -2, code: 73, wind: 9, windDir: 20, cloud: 0.9, rain: 0.4 },
  storm: { temp: 17, code: 95, wind: 38, windDir: 200, cloud: 1, rain: 0.9 }
};

const LAT = 51.97, LON = 5.66;
const ZONE = 'Europe/Amsterdam';
const CACHE = 'sky-weather';
const rad = Math.PI / 180;
const root = document.documentElement;

// ---- the Sun (NOAA's low-precision ephemeris; a few arcminutes is plenty) ----
function sunAt(date: Date): { elevation: number; azimuth: number } {
  const d = date.getTime() / 86400000 - 10957.5; // days since J2000.0
  const L = (280.46 + 0.9856474 * d) % 360;
  const g = ((357.528 + 0.9856003 * d) % 360) * rad;
  const lambda = (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * rad;
  const eps = (23.439 - 0.0000004 * d) * rad;
  const ra = Math.atan2(Math.cos(eps) * Math.sin(lambda), Math.cos(lambda));
  const dec = Math.asin(Math.sin(eps) * Math.sin(lambda));
  const gmst = (((18.697374558 + 24.06570982441908 * d) % 24) + 24) % 24;
  const h = (gmst * 15 + LON) * rad - ra;
  const lat = LAT * rad;
  const elevation = Math.asin(Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(h));
  const azimuth = Math.atan2(Math.sin(h), Math.cos(h) * Math.sin(lat) - Math.tan(dec) * Math.cos(lat)) / rad + 180;
  return { elevation: elevation / rad, azimuth: ((azimuth % 360) + 360) % 360 };
}

// The subsolar point: where the Sun is overhead right now (for the globe's night side).
export function subsolar(date = new Date()): { lon: number; lat: number } {
  const d = date.getTime() / 86400000 - 10957.5;
  const L = (280.46 + 0.9856474 * d) % 360;
  const g = ((357.528 + 0.9856003 * d) % 360) * rad;
  const lambda = (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * rad;
  const eps = (23.439 - 0.0000004 * d) * rad;
  const ra = Math.atan2(Math.cos(eps) * Math.sin(lambda), Math.cos(lambda)) / rad;
  const dec = Math.asin(Math.sin(eps) * Math.sin(lambda)) / rad;
  const gmst = (((18.697374558 + 24.06570982441908 * d) % 24) + 24) % 24;
  let lon = ra - gmst * 15;
  lon = ((lon + 540) % 360) - 180;
  return { lon, lat: dec };
}

// Wageningen's clock: its UTC offset now, so a local minute of the day maps to a Date.
function zoneOffsetMinutes(date: Date): number {
  try {
    const local = new Date(date.toLocaleString('en-US', { timeZone: ZONE }));
    const utc = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    return Math.round((local.getTime() - utc.getTime()) / 60000);
  } catch { return 60; }
}
function localMidnight(date: Date): Date {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return new Date(Date.UTC(get('year'), get('month') - 1, get('day')) - zoneOffsetMinutes(date) * 60000);
}
const hhmm = (minute: number) => `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`;
function sunTimes(date: Date): { sunrise: string | null; sunset: string | null } {
  const midnight = localMidnight(date).getTime();
  let sunrise: string | null = null, sunset: string | null = null;
  let above = sunAt(new Date(midnight)).elevation > -0.833;
  for (let m = 1; m < 1440; m++) {
    const up = sunAt(new Date(midnight + m * 60000)).elevation > -0.833;
    if (up && !above) sunrise = hhmm(m);
    if (!up && above) sunset = hhmm(m);
    above = up;
  }
  return { sunrise, sunset };
}
const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// ---- the weather (Open-Meteo, free and keyless; a quarter-hour memory) ----
const LABELS: Record<number, [string, string, string]> = {
  // code: [kind, en, zh]
  0: ['clear', 'clear', '晴'], 1: ['clear', 'mostly clear', '晴'], 2: ['cloud', 'partly cloudy', '多云'], 3: ['cloud', 'overcast', '阴'],
  45: ['fog', 'fog', '雾'], 48: ['fog', 'rime fog', '雾凇'],
  51: ['rain', 'light drizzle', '毛毛雨'], 53: ['rain', 'drizzle', '毛毛雨'], 55: ['rain', 'heavy drizzle', '毛毛雨'], 56: ['rain', 'freezing drizzle', '冻雨'], 57: ['rain', 'freezing drizzle', '冻雨'],
  61: ['rain', 'light rain', '小雨'], 63: ['rain', 'rain', '中雨'], 65: ['rain', 'heavy rain', '大雨'], 66: ['rain', 'freezing rain', '冻雨'], 67: ['rain', 'freezing rain', '冻雨'],
  71: ['snow', 'light snow', '小雪'], 73: ['snow', 'snow', '中雪'], 75: ['snow', 'heavy snow', '大雪'], 77: ['snow', 'snow grains', '米雪'],
  80: ['rain', 'light showers', '阵雨'], 81: ['rain', 'showers', '阵雨'], 82: ['rain', 'heavy showers', '强阵雨'], 85: ['snow', 'snow showers', '阵雪'], 86: ['snow', 'snow showers', '阵雪'],
  95: ['storm', 'thunderstorm', '雷阵雨'], 96: ['storm', 'thunderstorm, hail', '雷雨冰雹'], 99: ['storm', 'thunderstorm, hail', '雷雨冰雹']
};
export const weatherLabel = (code: number, lang: string): string => (LABELS[code] ?? ['cloud', 'cloudy', '多云'])[lang === 'zh' ? 2 : 1];
export const weatherKind = (code: number): string => (LABELS[code] ?? ['cloud'])[0];

async function fetchWeather(): Promise<Weather | null> {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE) || 'null') as Weather | null;
    if (cached && Date.now() - cached.at < 15 * 60000) return cached;
  } catch {}
  const control = new AbortController();
  const timer = setTimeout(() => control.abort(), 6000);
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,cloud_cover,precipitation,is_day&timezone=${encodeURIComponent(ZONE)}&forecast_days=1`;
    const response = await fetch(url, { signal: control.signal });
    if (!response.ok) return null;
    const c = (await response.json()).current;
    if (!c || typeof c.temperature_2m !== 'number') return null;
    const weather: Weather = {
      temp: c.temperature_2m, code: Number(c.weather_code ?? 3), wind: Number(c.wind_speed_10m ?? 0), windDir: Number(c.wind_direction_10m ?? 0),
      cloud: Math.min(1, Math.max(0, Number(c.cloud_cover ?? 50) / 100)), rain: Math.min(1, Math.max(0, Number(c.precipitation ?? 0) / 2)), isDay: !!c.is_day, at: Date.now()
    };
    try { sessionStorage.setItem(CACHE, JSON.stringify(weather)); } catch {}
    return weather;
  } catch { return null; } finally { clearTimeout(timer); }
}

// ---- publish ----
const sky: Sky = { elevation: 0, azimuth: 180, phase: 'day', daylight: 1, golden: 0, night: false, sunrise: null, sunset: null, moon: null, weather: null };

// The Moon's age from the Chinese calendar the browser already keeps: day 1 is
// new, day 15 full. Enough for a glyph in the footer.
function moonPhase(date = new Date()): Moon | null {
  try {
    const parts = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', { day: 'numeric' }).formatToParts(date);
    const day = Number(parts.find((p) => p.type === 'day')?.value);
    if (!day) return null;
    const f = ((day - 1) / 29.53) % 1;
    return { day, lit: (1 - Math.cos(f * Math.PI * 2)) / 2, waxing: f < 0.5 };
  } catch { return null; }
}
// A small moon, lit from the right while waxing and from the left while waning.
function moonSvg(m: Moon): string {
  const r = 5.5, cx = 6, cy = 6;
  const k = Math.cos(((m.waxing ? 1 : -1) * Math.acos(1 - 2 * m.lit)));
  const rx = Math.abs(k) * r;
  const sweepOuter = m.waxing ? 1 : 0;
  const sweepInner = (k < 0) === m.waxing ? 1 : 0;
  const lit = `M ${cx} ${cy - r} A ${r} ${r} 0 0 ${sweepOuter} ${cx} ${cy + r} A ${rx.toFixed(2)} ${r} 0 0 ${sweepInner} ${cx} ${cy - r} Z`;
  return `<svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.55"/><path d="${lit}" fill="currentColor"/></svg>`;
}
const lang = () => root.dataset.lang ?? 'en';
let timesDay = '';

function readSun() {
  const now = new Date();
  const sun = sunAt(now);
  if (FORCED_PHASE && ['night', 'dawn', 'day', 'dusk'].includes(FORCED_PHASE)) {
    const el = { night: -20, dawn: 1, day: 35, dusk: 1 }[FORCED_PHASE]!;
    sun.elevation = el; sun.azimuth = { night: 350, dawn: 95, day: 190, dusk: 265 }[FORCED_PHASE]!;
  }
  sky.elevation = sun.elevation;
  sky.azimuth = sun.azimuth;
  sky.daylight = smooth(-6, 6, sun.elevation);
  sky.golden = (1 - smooth(0, 12, Math.abs(sun.elevation))) * smooth(-8, -2, sun.elevation);
  sky.night = sun.elevation < -1.2;
  const hour = Number(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: ZONE }).format(now)) % 24;
  sky.phase = FORCED_PHASE && ['night', 'dawn', 'day', 'dusk'].includes(FORCED_PHASE) ? FORCED_PHASE : sun.elevation < -6 ? 'night' : sun.elevation < 6 ? (hour < 12 ? 'dawn' : 'dusk') : 'day';
  const day = new Intl.DateTimeFormat('en-CA', { timeZone: ZONE }).format(now);
  if (day !== timesDay) { timesDay = day; Object.assign(sky, sunTimes(now)); sky.moon = moonPhase(now); }
}

function paint() {
  root.dataset.sky = sky.phase;
  root.style.setProperty('--sky-daylight', sky.daylight.toFixed(3));
  root.style.setProperty('--sky-golden', sky.golden.toFixed(3));
  root.dataset.night = sky.night ? '' : undefined as unknown as string;
  if (!sky.night) delete root.dataset.night;
  const w = sky.weather;
  // The light outside, for the stylesheet: where the Sun stands (east on the
  // left, west on the right), how much of its glow gets through the cloud, and
  // the veil of an overcast sky. At night the glow is the cool of the moon.
  const cloud = w ? w.cloud : 0.5;
  const kind = w ? weatherKind(w.code) : 'cloud';
  const through = 1 - cloud * (kind === 'fog' || kind === 'storm' ? 0.95 : 0.8);
  const glow = sky.night ? 0.35 * through : (0.3 + 0.7 * sky.golden) * through;
  const glowColor = sky.night ? '#5f7a99' : sky.phase === 'dawn' ? '#f0bc98' : sky.phase === 'dusk' ? '#e9a476' : '#f2d6a2';
  const veil = Math.min(1, cloud * 0.6 + (w ? w.rain * 0.5 : 0) + (kind === 'fog' ? 0.5 : 0) + (kind === 'storm' ? 0.4 : 0));
  const veilColor = kind === 'snow' ? '#aeb8c4' : kind === 'rain' || kind === 'storm' ? '#5a6a78' : '#6a7076';
  root.style.setProperty('--sky-x', Math.max(0, Math.min(1, (sky.azimuth - 70) / 220)).toFixed(3));
  root.style.setProperty('--sky-glow', glow.toFixed(3));
  root.style.setProperty('--sky-glow-color', glowColor);
  root.style.setProperty('--sky-veil', veil.toFixed(3));
  root.style.setProperty('--sky-veil-color', veilColor);
  root.style.setProperty('--sky-dot', sky.night ? 'var(--daiqing-2)' : kind === 'storm' ? 'var(--zhusha)' : kind === 'rain' || kind === 'snow' || kind === 'fog' ? 'var(--ink-4)' : kind === 'cloud' ? 'var(--moss)' : 'var(--ochre-2)');
  if (w) {
    root.dataset.weather = kind;
    root.style.setProperty('--sky-warmth', Math.max(-1, Math.min(1, (w.temp - 12) / 14)).toFixed(3));
    root.style.setProperty('--sky-cloud', w.cloud.toFixed(3));
    root.style.setProperty('--sky-rain', w.rain.toFixed(3));
    root.style.setProperty('--sky-wind', Math.min(1, w.wind / 40).toFixed(3));
  }
  if (sky.moon) document.querySelectorAll<HTMLElement>('[data-moon]').forEach((el) => { el.innerHTML = moonSvg(sky.moon!); el.title = `${lang() === 'zh' ? '农历' : 'Lunar day'} ${sky.moon!.day}`; });
  const sunText = sky.sunrise && sky.sunset ? `<span class="sky-mark">↑</span>${sky.sunrise}<span class="sky-mark">↓</span>${sky.sunset}` : '';
  document.querySelectorAll<HTMLElement>('[data-sky-sun]').forEach((el) => { el.innerHTML = sunText; el.closest<HTMLElement>('.ticker-item, .footer-clock')?.toggleAttribute('hidden', !sunText); });
  document.querySelectorAll<HTMLElement>('[data-sky-weather]').forEach((el) => {
    const row = el.closest<HTMLElement>('.ticker-item, .footer-clock');
    if (!w) { row?.setAttribute('hidden', ''); return; }
    const degrees = `${Math.round(w.temp)}°`;
    const wind = w.wind >= 20 ? ` · ${lang() === 'zh' ? '风' : 'wind'} ${Math.round(w.wind)} km/h` : '';
    el.innerHTML = `${degrees} <span lang="${lang() === 'zh' ? 'zh' : 'en'}">${weatherLabel(w.code, lang())}</span>${wind}`;
    row?.removeAttribute('hidden');
  });
  // One line in the hero: the weather and the light there, right now.
  document.querySelectorAll<HTMLElement>('[data-sky-live]').forEach((el) => {
    const row = el.closest<HTMLElement>('.hero-live');
    if (!w) { row?.setAttribute('hidden', ''); return; }
    const zh = lang() === 'zh';
    const next = sky.phase === 'night' || sky.phase === 'dawn' ? (zh ? `日出 ${sky.sunrise ?? ''}` : `sunrise ${sky.sunrise ?? ''}`) : (zh ? `日落 ${sky.sunset ?? ''}` : `sunset ${sky.sunset ?? ''}`);
    el.innerHTML = zh
      ? `<span lang="zh">此刻瓦赫宁根</span> · ${Math.round(w.temp)}° <span lang="zh">${weatherLabel(w.code, 'zh')}</span> · <span lang="zh">${next}</span>`
      : `Wageningen now · ${Math.round(w.temp)}° ${weatherLabel(w.code, 'en')} · ${next}`;
    row?.removeAttribute('hidden');
  });
  (window as any).__sky = sky;
  dispatchEvent(new CustomEvent('skychange', { detail: sky }));
}

// Nothing here may take the rest of the page down with it: an older browser
// without these Intl features simply gets no sky.
function safely(step: () => void) { try { step(); } catch {} }
safely(() => { readSun(); paint(); });
setInterval(() => safely(() => { readSun(); paint(); }), 60000);
addEventListener('lang:change', () => safely(paint));

async function refreshWeather() {
  if (FORCED_WEATHER && CANNED[FORCED_WEATHER]) {
    sky.weather = { temp: 12, code: 3, wind: 10, windDir: 200, cloud: 0.5, rain: 0, isDay: !sky.night, at: Date.now(), ...CANNED[FORCED_WEATHER] };
    safely(paint);
    return;
  }
  if (document.hidden || !navigator.onLine) return;
  const weather = await fetchWeather();
  if (!weather) return;
  sky.weather = weather;
  safely(paint);
}
refreshWeather();
setInterval(refreshWeather, 15 * 60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden && (!sky.weather || Date.now() - sky.weather.at > 15 * 60000)) refreshWeather(); });
