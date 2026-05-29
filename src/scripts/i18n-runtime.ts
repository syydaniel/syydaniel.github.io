import { dict, type Lang, type UILang } from '../data/i18n';
import { translate as nyaTranslate, mergeLexicon } from './nyalang';
import { renderCatText } from './nya-script';
import { toKlingon } from './klingon';

const STORAGE_KEY = 'site-lang';
const SUPPORTED: UILang[] = ['en', 'zh', 'zh-Hant', 'nl', 'de', 'fi', 'ja', 'ko', 'fr', 'cat', 'klingon'];
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

// Maps each UI language to the value for <html lang="...">. Fun languages are
// derived from Chinese, so they report a Chinese locale.
const HTML_LANG: Record<UILang, string> = {
  en: 'en',
  zh: 'zh-CN',
  'zh-Hant': 'zh-Hant',
  nl: 'nl',
  de: 'de',
  fi: 'fi',
  ja: 'ja',
  ko: 'ko',
  fr: 'fr',
  cat: 'art-x-cat',
  klingon: 'tlh'
};

// Playful display fonts for the constructed languages, loaded on demand so
// they cost nothing for everyone else.
const FONT_LINKS: Record<string, string> = {
  cat: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700&display=swap',
  klingon: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&display=swap'
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

// ---------- Constructed cat language + Klingon ----------

// 猫猫语 (Nya): a real constructed cat language with its own lexicon + grammar
// (src/scripts/nyalang.ts, mirrored from the standalone nyalang repo). Rendered
// in the hand-built NyaGlyph font, each letter becomes a little cat.
function toCatLang(s: string): string {
  if (!s) return s;
  return nyaTranslate(s) + ' 🐾';
}
// tlhIngan Hol: a real Klingon grammar engine (src/scripts/klingon.ts) with OVS
// word order, verb prefixes and noun suffixes over a curated common-word lexicon.

// Resolve an entry (dict row or inline JSON map) to text for the chosen UI lang.
function resolve(entry: Record<string, string>, lang: UILang): string {
  if (lang === 'cat') return toCatLang((entry.en ?? entry['zh'] ?? '').replace(/\{year\}/g, YEAR));
  if (lang === 'klingon') return toKlingon((entry.en ?? entry['zh'] ?? '').replace(/\{year\}/g, YEAR));
  return entry[lang] ?? entry.en ?? '';
}

function detectLang(): UILang {
  const saved = localStorage.getItem(STORAGE_KEY) as UILang | null;
  if (saved && SUPPORTED.includes(saved)) return saved;
  const nav = (navigator.language || '').toLowerCase();
  if (nav.startsWith('zh')) {
    if (nav.includes('hant') || nav.includes('tw') || nav.includes('hk') || nav.includes('mo')) return 'zh-Hant';
    return 'zh';
  }
  if (nav.startsWith('ja')) return 'ja';
  if (nav.startsWith('ko')) return 'ko';
  if (nav.startsWith('fr')) return 'fr';
  if (nav.startsWith('nl')) return 'nl';
  if (nav.startsWith('de')) return 'de';
  if (nav.startsWith('fi')) return 'fi';
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
(window as any).__getLang = () => (localStorage.getItem(STORAGE_KEY) as UILang | null) ?? detectLang();
(window as any).__setLang = (l: UILang) => {
  localStorage.setItem(STORAGE_KEY, l);
  apply(l);
  window.dispatchEvent(new CustomEvent('lang:change', { detail: { lang: l } }));
};
