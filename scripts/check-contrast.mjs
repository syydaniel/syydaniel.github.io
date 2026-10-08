// Contrast audit for the two inks in src/styles/theme.css: every text token is
// checked against the surfaces it sits on, in both colour schemes.
//   node scripts/check-contrast.mjs
import { readFileSync } from 'node:fs';
const css = readFileSync(new URL('../src/styles/theme.css', import.meta.url), 'utf8');
const tokens = {};
for (const m of css.matchAll(/--([\w-]+):\s*light-dark\((#[0-9a-f]{6}),\s*(#[0-9a-f]{6})\)/gi)) tokens[m[1]] = { light: m[2], dark: m[3] };
for (const m of css.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6});/gi)) tokens[m[1]] = { light: m[2], dark: m[2] };
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
// [text token, surface token, minimum]: 4.5 for body-size text, 3 for large display text or non-text marks.
const pairs = [
  ['ink', 'paper', 4.5], ['ink-2', 'paper', 4.5], ['ink-3', 'paper', 4.5], ['ink-4', 'paper', 4.5],
  ['ink', 'paper-hi', 4.5], ['ink-2', 'paper-hi', 4.5], ['ink-3', 'paper-hi', 4.5], ['ink-4', 'paper-hi', 4.5],
  ['ink-4', 'paper-3', 4.5], ['ink-3', 'paper-3', 4.5],
  ['daiqing', 'paper', 4.5], ['daiqing-2', 'paper', 3], ['zhusha', 'paper', 4.5], ['zhusha-2', 'paper', 3],
  ['ochre', 'paper', 4.5], ['ochre-2', 'paper', 3], ['moss', 'paper', 3],
  ['on-seal', 'seal', 4.5], ['on-seal', 'seal-2', 4.5], ['seal', 'paper', 3], ['paper', 'ink', 4.5], ['ink-5', 'paper', 1.5]
];
let failed = 0;
for (const scheme of ['light', 'dark']) {
  console.log(`\n${scheme}`);
  for (const [text, surface, min] of pairs) {
    const a = tokens[text]?.[scheme], b = tokens[surface]?.[scheme];
    if (!a || !b) { console.log(`  ?? ${text} on ${surface}: missing token`); failed++; continue; }
    const r = ratio(a, b);
    const ok = r >= min;
    if (!ok) failed++;
    console.log(`  ${ok ? 'ok ' : 'LOW'} ${text.padEnd(10)} on ${surface.padEnd(9)} ${r.toFixed(2).padStart(6)} (min ${min})  ${a} / ${b}`);
  }
}
if (failed) { console.log(`\n${failed} pair(s) below their minimum`); process.exit(1); }
console.log('\nall pairs pass');
