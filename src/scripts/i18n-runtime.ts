import { dict, type Lang, type UILang } from '../data/i18n';
import { translate as nyaTranslate, mergeLexicon } from './nyalang';
import { renderCatText } from './nya-script';

const STORAGE_KEY = 'site-lang';
const SUPPORTED: UILang[] = ['en', 'zh', 'cat'];
const YEAR = String(new Date().getFullYear());

// 猫语 (Nya): the unified cat-sigil script. Every element's text becomes a row of
// cat-sigils (one cat per word, its anatomy encoding sound + meaning), sized by
// the element's role. One system across the whole site, headings to body.
function catSize(el: HTMLElement): number {
  if (el.classList.contains('section-eyebrow')) return 22;
  if (el.classList.contains('section-title') || el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3') return 40;
  return 25;
}
function catHTML(text: string, el: HTMLElement): string {
  return renderCatText(text, { size: catSize(el) });
}

// Maps each UI language to the value for <html lang="...">.
const HTML_LANG: Record<UILang, string> = {
  en: 'en',
  zh: 'zh-CN',
  cat: 'art-x-cat'
};

// Playful display font for the cat language, loaded on demand so it costs
// nothing for everyone else.
const FONT_LINKS: Record<string, string> = {
  cat: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700&display=swap'
};
function ensureFont(lang: UILang) {
  const href = FONT_LINKS[lang];
  if (!href || document.querySelector(`link[data-fontfor="${lang}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.setAttribute('data-fontfor', lang);
  document.head.appendChild(link);
}

// ---------- Constructed cat language ----------

// 猫猫语 (Nya): a real constructed cat language with its own lexicon + grammar
// (src/scripts/nyalang.ts, mirrored from the standalone nyalang repo). Rendered
// in the hand-built NyaGlyph font, each letter becomes a little cat.
function toCatLang(s: string): string {
  if (!s) return s;
  return nyaTranslate(s) + ' 🐾';
}

// Resolve an entry (dict row or inline JSON map) to text for the chosen UI lang.
function resolve(entry: Record<string, string>, lang: UILang): string {
  if (lang === 'cat') return toCatLang((entry.en ?? entry['zh'] ?? '').replace(/\{year\}/g, YEAR));
  return entry[lang] ?? entry.en ?? '';
}

// A saved choice wins; otherwise Chinese browsers get 中文 and everyone else
// English. Old saved values from removed languages fall through to this too.
function detectLang(): UILang {
  const saved = localStorage.getItem(STORAGE_KEY) as UILang | null;
  if (saved && SUPPORTED.includes(saved)) return saved;
  const nav = (navigator.language || '').toLowerCase();
  if (nav.startsWith('zh')) return 'zh';
  return 'en';
}

// The full 3000-word Nya dictionary lives in /nya-lexicon.json and is fetched
// only the first time 猫语 mode is used, then merged into the core lexicon and
// re-rendered. Costs nothing for any other language.
let nyaLexState = 0;
function ensureNyaLexicon() {
  if (nyaLexState) return;
  nyaLexState = 1;
  fetch('/nya-lexicon.json', { cache: 'force-cache' })
    .then((r) => (r.ok ? r.json() : null))
    .then((m) => {
      if (m) {
        mergeLexicon(m);
        if (document.documentElement.dataset.lang === 'cat') apply('cat');
      }
    })
    .catch(() => {});
}

function apply(lang: UILang) {
  document.documentElement.lang = HTML_LANG[lang] ?? 'en';
  document.documentElement.dataset.lang = lang;
  ensureFont(lang);
  if (lang === 'cat') ensureNyaLexicon();

  // text nodes
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n!;
    const entry = dict[key];
    if (!entry) return;
    // 猫语: every word becomes a cat-sigil (the unified Nya script).
    if (lang === 'cat') { el.innerHTML = catHTML(entry.en, el); return; }
    const value = resolve(entry, lang);
    el.textContent = value.replace(/\{year\}/g, YEAR);
  });

  // attribute translation (placeholders, aria-labels, etc.)
  document.querySelectorAll<HTMLElement>('[data-i18n-attr]').forEach((el) => {
    try {
      const map = JSON.parse(el.dataset.i18nAttr!);
      for (const [attr, key] of Object.entries(map)) {
        const entry = dict[key as string];
        if (!entry) continue;
        el.setAttribute(attr, resolve(entry, lang));
      }
    } catch {}
  });

  // inline per-element translations (co-located JSON, used by Journey cards)
  document.querySelectorAll<HTMLElement>('[data-i18n-self]').forEach((el) => {
    try {
      const map = JSON.parse(el.dataset.i18nSelf!);
      if (lang === 'cat') { el.innerHTML = catHTML(map.en || '', el); return; }
      const value = resolve(map, lang);
      if (typeof value === 'string') el.textContent = value;
    } catch {}
  });

  // update switcher UI (highlight the active option)
  document.querySelectorAll<HTMLButtonElement>('.lang-opt').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

// Wire up
const initial = detectLang();
apply(initial);

// React to changes (event delegation: any .lang-opt with a data-lang)
document.addEventListener('click', (e) => {
  const target = (e.target as HTMLElement)?.closest<HTMLElement>('.lang-opt');
  if (!target) return;
  const next = (target.dataset.lang as UILang) || 'en';
  localStorage.setItem(STORAGE_KEY, next);
  apply(next);
  window.dispatchEvent(new CustomEvent('lang:change', { detail: { lang: next } }));
});

// expose for other components if needed
(window as any).__getLang = () => detectLang();
(window as any).__setLang = (l: UILang) => {
  localStorage.setItem(STORAGE_KEY, l);
  apply(l);
  window.dispatchEvent(new CustomEvent('lang:change', { detail: { lang: l } }));
};
// Helpers for JS-driven text (hero name morph, photo count, arcade messages):
// __t(key) returns the translated string for the current language; __nyaCat
// returns the cat-sigil HTML so dynamic strings can also render in 猫语 mode.
(window as any).__t = (key: string): string => {
  const e = dict[key];
  const l = ((window as any).__getLang() as UILang) || 'en';
  return e ? (e[l as Lang] ?? e.en ?? '') : '';
};
(window as any).__nyaCat = (text: string, size?: number): string => renderCatText(text, { size: size || 26 });
// Re-translate the page after dynamically injected DOM (e.g. the photo timeline).
(window as any).__applyI18n = () => apply(((window as any).__getLang() as UILang) || 'en');
