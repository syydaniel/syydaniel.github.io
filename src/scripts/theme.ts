// Day ink, night ink. The page follows the system's colour scheme until the
// reader fixes one with the toggle in the navigation; choosing the scheme the
// system already uses lets the page follow the system again. The choice is
// remembered per browser. Base.astro sets html[data-theme] before first paint
// from the same rule, so nothing flashes. Other layers (the ink fluid, the
// catchment, the globe, the maps) listen for `themechange` and read their
// colours from the tokens through `inkTokens()`.

export type Theme = 'light' | 'dark';

const root = document.documentElement;
const media = matchMedia('(prefers-color-scheme: dark)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const KEY = 'theme';

export function currentTheme(): Theme {
  return root.dataset.theme === 'dark' ? 'dark' : root.dataset.theme === 'light' ? 'light' : media.matches ? 'dark' : 'light';
}
function stored(): Theme | null {
  try { const t = localStorage.getItem(KEY); return t === 'light' || t === 'dark' ? t : null; } catch { return null; }
}
function remember(t: Theme | null) {
  try { if (t) localStorage.setItem(KEY, t); else localStorage.removeItem(KEY); } catch {}
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
  labels.forEach(el => { el.setAttribute('aria-label', text); el.title = text; });
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
  const system: Theme = media.matches ? 'dark' : 'light';
  remember(next === system ? null : next);
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
// The system changed its mind and nothing is pinned: follow it.
media.addEventListener('change', () => { if (!stored()) applyTheme(media.matches ? 'dark' : 'light'); });
// Another tab chose: keep the tabs in step.
addEventListener('storage', e => { if (e.key === KEY) applyTheme(stored() ?? (media.matches ? 'dark' : 'light')); });
(window as any).__theme = { current: currentTheme, toggle: toggleTheme, tokens: inkTokens };
