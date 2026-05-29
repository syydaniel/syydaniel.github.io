import { dict, type Lang, type UILang } from '../data/i18n';

const STORAGE_KEY = 'site-lang';
const SUPPORTED: UILang[] = ['en', 'zh', 'zh-Hant', 'nl', 'de', 'fi', 'ja', 'ko', 'fr', 'mars', 'cat'];

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
  mars: 'zh-CN',
  cat: 'zh-CN'
};

// ---------- Fun languages (derived from the Chinese text, so always "有参考") ----------

// 火星文: swap common Han characters for look-alike / variant forms.
const MARS_MAP: Record<string, string> = {
  我: '莪', 的: '菂', 是: '媞', 你: '沵', 好: '恏', 不: '卜', 们: '們', 这: '這', 个: '個', 么: '庅',
  什: '甚', 很: '哏', 在: '洅', 有: '冇', 和: '龢', 了: '孒', 爱: '愛', 也: '竾', 都: '嘟', 会: '會',
  来: '唻', 去: '厾', 想: '缃', 说: '説', 看: '瞰', 时: '溡', 间: '閒', 水: '氺', 与: '與', 为: '潙',
  全: '荃', 球: '毬', 变: '變', 化: '囮', 研: '妍', 究: '糾', 摄: '攝', 影: '暎', 学: '學', 硕: '碩',
  士: '仕', 毕: '畢', 业: '業', 师: '師', 庆: '慶', 历: '歷', 页: '頁', 联: '聯', 记: '記', 简: '簡',
  可: '岢', 以: '苡', 到: '菿', 地: '哋', 用: '甪', 镜: '鏡', 头: '頭',
  关: '関', 于: '扵', 系: '係', 笔: '筆', 自: '冄', 己: '巳', 绍: '紹'
};
function toMartian(s: string): string {
  if (!s) return s;
  let out = '';
  for (const ch of s) out += MARS_MAP[ch] ?? ch;
  return out;
}

// 猫猫语: keep the Chinese readable, weave in 喵.
function toCat(s: string): string {
  if (!s) return s;
  const hasEnder = /[。！？!?]/.test(s);
  let r = s.replace(/([。！？!?])/g, '喵$1');
  if (!hasEnder) r += '喵~';
  return r;
}

// Resolve an entry (dict row or inline JSON map) to text for the chosen UI lang.
function resolve(entry: Record<string, string>, lang: UILang): string {
  if (lang === 'mars') return toMartian(entry['zh'] ?? entry.en ?? '');
  if (lang === 'cat') return toCat(entry['zh'] ?? entry.en ?? '');
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

function apply(lang: UILang) {
  document.documentElement.lang = HTML_LANG[lang] ?? 'en';
  document.documentElement.dataset.lang = lang;

  // text nodes
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n!;
    const entry = dict[key];
    if (!entry) return;
    const value = resolve(entry, lang);
    el.textContent = value.replace(/\{year\}/g, String(new Date().getFullYear()));
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
