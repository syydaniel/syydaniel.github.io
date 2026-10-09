// Day ink, night ink. The page wears the day ink while the Sun is up where the
// reader is and the night ink once it has set (scripts/sky.ts); the system's
// colour scheme decides only where the sky cannot be worked out. The toggle in
// the navigation pins an ink, and the pin lasts until the sky next changes
// (the following sunrise or sunset), after which the page follows the sky
// again. Base.astro sets html[data-theme] before first paint from the same
// rule, so nothing flashes. Other layers (the ink fluid, the catchment, the
// globe, the maps) listen for `themechange` and read their colours from the
// tokens through `inkTokens()`.

export type Theme = 'light' | 'dark';

const root = document.documentElement;
const media = matchMedia('(prefers-color-scheme: dark)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const KEY = 'theme';
const UNTIL = 'theme-until'; // 'day' or 'night': the sky the pin was made under

export function currentTheme(): Theme {
  return root.dataset.theme === 'dark' ? 'dark' : root.dataset.theme === 'light' ? 'light' : media.matches ? 'dark' : 'light';
}
// What the sky over Wageningen asks for right now, if it is known.
function skyTheme(): Theme | null {
  const sky = (window as any).__sky as { night?: boolean } | undefined;
  if (!sky || typeof sky.night !== 'boolean') return null;
  return sky.night ? 'dark' : 'light';
}
const skyWord = () => (skyTheme() === 'dark' ? 'night' : skyTheme() === 'light' ? 'day' : null);
function stored(): Theme | null {
  try {
    const t = localStorage.getItem(KEY);
    if (t !== 'light' && t !== 'dark') return null;
    // A pin outlives its sky: the next sunrise or sunset lets it go.
    const until = localStorage.getItem(UNTIL);
    const now = skyWord();
    if (until && now && until !== now) { localStorage.removeItem(KEY); localStorage.removeItem(UNTIL); return null; }
    return t;
  } catch { return null; }
}
function remember(t: Theme | null) {
  try {
    if (t) { localStorage.setItem(KEY, t); const w = skyWord(); if (w) localStorage.setItem(UNTIL, w); else localStorage.removeItem(UNTIL); }
    else { localStorage.removeItem(KEY); localStorage.removeItem(UNTIL); }
  } catch {}
}
// The ink the page should wear: the pin, else the sky, else the system.
function preferred(): Theme {
  return stored() ?? skyTheme() ?? (media.matches ? 'dark' : 'light');
}

// Resolve tokens to concrete colours (light-dark() stays unresolved on the root).
// Chromium reports a color-mix() as color(srgb r g b); MapLibre and canvas want rgb().
function plainRgb(c: string): string {
  const m = c.match(/^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/);
  if (!m) return c;
  const [r, g, b] = [m[1], m[2], m[3]].map((v) => Math.round(Number(v) * 255));
  const a = m[4] === undefined ? 1 : Number(m[4]);
  return a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
}
const probe = document.createElement('i');
probe.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
export function inkTokens<T extends string>(names: readonly T[]): Record<T, string> {
  if (!probe.isConnected) document.body.appendChild(probe);
  const out = {} as Record<T, string>;
  for (const name of names) {
    probe.style.color = `var(--${name})`;
    out[name] = plainRgb(getComputedStyle(probe).color);
  }
  return out;
}
// Any CSS colour expression (a token, a color-mix of tokens) as the browser resolves it now.
export function resolveColor(expr: string): string {
  if (!probe.isConnected) document.body.appendChild(probe);
  probe.style.color = expr;
  return plainRgb(getComputedStyle(probe).color);
}
export function rgbOf(color: string): [number, number, number] {
  const m = color.match(/[\d.]+/g);
  if (!m || m.length < 3) return [0, 0, 0];
  return [Number(m[0]) / 255, Number(m[1]) / 255, Number(m[2]) / 255];
}

const labels = document.querySelectorAll<HTMLElement>('[data-theme-toggle]');
function paintLabels() {
  const t = (window as any).__t as ((k: string) => string) | undefined;
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  const text = t?.(`theme.${next}`) || (next === 'dark' ? 'Switch to night ink' : 'Switch to day ink');
  // The tooltip says why the page wears this ink and how long that lasts: the
  // page follows the sky over Wageningen until the next sunset or sunrise, and
  // a chosen ink is kept until then too.
  const sky = (window as any).__sky as { night?: boolean; mySunrise?: string | null; mySunset?: string | null } | undefined;
  let why = '';
  if (sky && typeof sky.night === 'boolean') {
    const at = sky.night ? sky.mySunrise : sky.mySunset;
    const zhAt = root.dataset.lang === 'zh';
    const event = (t?.(sky.night ? 'sky.sunrise' : 'sky.sunset') || (sky.night ? 'sunrise' : 'sunset')) + (at ? (zhAt ? `（约 ${at}）` : `, about ${at}`) : '');
    const pinned = (() => { try { return !!localStorage.getItem(KEY); } catch { return false; } })();
    const zh = root.dataset.lang === 'zh';
    why = ` · ${t?.(pinned ? 'theme.pinned' : 'theme.follows') || (pinned ? 'kept until' : 'follows the sky until')}${zh ? '' : ' '}${event}`;
  }
  labels.forEach(el => { el.setAttribute('aria-label', text); el.title = text + why; });
}
function paintMeta(theme: Theme) {
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach(m => { m.content = theme === 'dark' ? '#121516' : '#f3efe6'; });
}

let transition: ViewTransition | null = null;
export function applyTheme(theme: Theme, from?: { x: number; y: number }) {
  if (currentTheme() === theme && root.dataset.theme) return;
  const swap = () => {
    root.dataset.theme = theme;
    paintMeta(theme);
    paintLabels();
    dispatchEvent(new CustomEvent('themechange', { detail: theme }));
  };
  if (from && document.startViewTransition && !reduced.matches && !document.hidden) {
    transition?.skipTransition();
    const radius = Math.hypot(Math.max(from.x, innerWidth - from.x), Math.max(from.y, innerHeight - from.y));
    root.style.setProperty('--theme-x', `${from.x}px`);
    root.style.setProperty('--theme-y', `${from.y}px`);
    root.style.setProperty('--theme-radius', `${Math.ceil(radius)}px`);
    root.dataset.transition = 'theme';
    const vt = document.startViewTransition(swap);
    transition = vt;
    vt.ready.catch(() => {});
    const done = () => {
      if (transition !== vt) return;
      transition = null;
      if (root.dataset.transition === 'theme') delete root.dataset.transition;
      root.style.removeProperty('--theme-x');
      root.style.removeProperty('--theme-y');
      root.style.removeProperty('--theme-radius');
    };
    vt.finished.then(done, done);
  } else swap();
}

export function toggleTheme(from?: { x: number; y: number }) {
  const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
  const sky = skyTheme();
  // Choosing what the sky (or, failing that, the system) already gives is just following again.
  const follows = sky ? next === sky : next === (media.matches ? 'dark' : 'light');
  remember(follows ? null : next);
  applyTheme(next, from);
}

labels.forEach(el => {
  el.addEventListener('click', event => {
    const box = el.getBoundingClientRect();
    toggleTheme({ x: event.clientX || box.left + box.width / 2, y: event.clientY || box.top + box.height / 2 });
  });
});
paintLabels();
addEventListener('lang:change', paintLabels);
// The Sun set or rose while the page was open, or the system changed its mind:
// an unpinned page follows, with the ink wiped out from the middle of the page.
function follow() {
  const next = preferred();
  if (next === currentTheme()) return;
  // Before the first paint there is nothing to wipe: just wear the right ink.
  const settled = document.readyState === 'complete' && !document.hidden;
  applyTheme(next, settled ? { x: innerWidth / 2, y: innerHeight / 2 } : undefined);
}
addEventListener('skychange', () => { follow(); paintLabels(); });
media.addEventListener('change', follow);
// Another tab chose: keep the tabs in step.
addEventListener('storage', e => { if (e.key === KEY || e.key === UNTIL) applyTheme(preferred()); });
// Base.astro chose the first ink from the same rule; the sky, once read, confirms or corrects it.
addEventListener('load', follow);
(window as any).__theme = { current: currentTheme, toggle: toggleTheme, tokens: inkTokens };
