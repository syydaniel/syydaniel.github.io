import { dict } from '../data/i18n';

type Lang = 'en' | 'zh';
const STORAGE_KEY = 'site-lang';

function detectLang(): Lang {
  const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
  if (saved === 'en' || saved === 'zh') return saved;
  const nav = (navigator.language || '').toLowerCase();
  if (nav.startsWith('zh')) return 'zh';
  return 'en';
}

function apply(lang: Lang) {
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.documentElement.dataset.lang = lang;

  // text nodes
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n!;
    const entry = dict[key];
    if (!entry) return;
    const value = entry[lang] ?? entry.en;
    // support {year} token
    const rendered = value.replace(/\{year\}/g, String(new Date().getFullYear()));
    el.textContent = rendered;
  });

  // attribute translation (placeholders, aria-labels, etc.)
  document.querySelectorAll<HTMLElement>('[data-i18n-attr]').forEach((el) => {
    try {
      const map = JSON.parse(el.dataset.i18nAttr!);
      for (const [attr, key] of Object.entries(map)) {
        const entry = dict[key as string];
        if (!entry) continue;
        const value = entry[lang] ?? entry.en;
        el.setAttribute(attr, value);
      }
    } catch {}
  });

  // update switcher UI
  document.querySelectorAll<HTMLButtonElement>('.lang-opt').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

// Wire up
const initial = detectLang();
apply(initial);

// React to changes
document.addEventListener('click', (e) => {
  const target = (e.target as HTMLElement)?.closest<HTMLElement>('.lang-opt');
  if (!target) return;
  const next = (target.dataset.lang as Lang) || 'en';
  localStorage.setItem(STORAGE_KEY, next);
  apply(next);
  window.dispatchEvent(new CustomEvent('lang:change', { detail: { lang: next } }));
});

// expose for other components if needed
(window as any).__getLang = () => (localStorage.getItem(STORAGE_KEY) as Lang | null) ?? detectLang();
(window as any).__setLang = (l: Lang) => {
  localStorage.setItem(STORAGE_KEY, l);
  apply(l);
  window.dispatchEvent(new CustomEvent('lang:change', { detail: { lang: l } }));
};
