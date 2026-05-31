// Nya script: the unified writing system, ONE cat-sigil per word.
//
// Every word is drawn as a single cat whose own anatomy encodes the word, so
// sound, meaning AND grammar live in one glyph:
//   ears      = onset (first consonant of the spoken Nya word)
//   eyes      = the word's first vowel (a i u e o)
//   whiskers  = syllable count (1-3)
//   forehead  = meaning, as semantic radicals shared with logogram.mjs
//   tail      = tense (up = present, curled = past, straight = future, flick = ongoing)
//   2nd kitten= plural ; raised paw = question ; collar = agent ; slash = negation
//   bold ink  = emphasis ; purring closed-eye cat = the particle "nya"
//
// Proper nouns / names are spelled in the cat-alphabet (NyaGlyph font) instead.

import { word as nyaWord, analyze } from './nyalang';
import { radicalsFor } from './nya-logogram';

const HEAD = '<path d="M50 21 C67 21 79 33 79 51 C79 66 70 77 59 82 C53 85 47 85 41 82 C30 77 21 66 21 51 C21 33 33 21 50 21 Z"/>';
const HEAD_BIG = '<path d="M50 13 C73 13 88 30 88 52 C88 71 76 86 60 90 C53 92 47 92 40 90 C24 86 12 71 12 52 C12 30 27 13 50 13 Z"/>';
const NOSE = '<path d="M47 59 L53 59 L50 63 Z" fill="currentColor" stroke="none"/>';
const MOUTH = '<path d="M50 63 q-4 5 -8 2 M50 63 q4 5 8 2"/>';

const rad = (a) => (a * Math.PI) / 180;

function ear(side, idx) {
  const cfg = [
    { h: 18, lean: -1, tuft: 0 }, { h: 22, lean: 0, tuft: 0 }, { h: 13, lean: -2, tuft: 0 }, { h: 17, lean: 3, tuft: 0 },
    { h: 15, lean: -1, tuft: 1 }, { h: 20, lean: 1, tuft: 0 }, { h: 12, lean: 0, tuft: 1 }, { h: 16, lean: 2, tuft: 1 }
  ][idx % 8];
  const bx = 50 + side * 18;
  const ox = bx - side * 9, oy = 33;
  const ix = bx + side * 7, iy = 34;
  const tx = bx + side * cfg.lean * 2, ty = 31 - cfg.h;
  let p = `<path d="M${ox} ${oy} L${tx.toFixed(1)} ${ty} L${ix} ${iy}"/>`;
  if (cfg.tuft) p += `<line x1="${tx.toFixed(1)}" y1="${ty + 3}" x2="${((tx + ix) / 2).toFixed(1)}" y2="${((ty + iy) / 2).toFixed(1)}"/>`;
  return p;
}
function onsetIdx(nya) {
  const c = ((nya.match(/^[^aeiou]*/) || [''])[0][0] || '').toLowerCase();
  return { '': 0, m: 1, n: 2, p: 3, r: 4, w: 5, y: 6 }[c] ?? 7;
}
function eye(x, v) {
  const y = 52;
  switch (v) {
    case 'a': return `<circle cx="${x}" cy="${y}" r="5"/><circle cx="${x}" cy="${y}" r="1.8" fill="currentColor" stroke="none"/>`;
    case 'e': return `<path d="M${x - 5} ${y + 1} q5 -6 10 0"/>`;
    case 'i': return `<ellipse cx="${x}" cy="${y}" rx="2" ry="5"/>`;
    case 'o': return `<circle cx="${x}" cy="${y}" r="6"/><circle cx="${x}" cy="${y}" r="2" fill="currentColor" stroke="none"/>`;
    case 'u': return `<circle cx="${x}" cy="${y}" r="2.6" fill="currentColor" stroke="none"/>`;
    default: return `<circle cx="${x}" cy="${y}" r="4"/>`;
  }
}
function whiskers(c) {
  let s = '';
  for (let j = 0; j < c; j++) {
    const dy = (j - (c - 1) / 2) * 5;
    s += `<line x1="31" y1="${(61 + dy * 0.4).toFixed(1)}" x2="11" y2="${(60 + dy).toFixed(1)}"/>`;
    s += `<line x1="69" y1="${(61 + dy * 0.4).toFixed(1)}" x2="89" y2="${(60 + dy).toFixed(1)}"/>`;
  }
  return s;
}

const MARK = {
  self: (x, y) => `<circle cx="${x}" cy="${y}" r="2.3" fill="currentColor" stroke="none"/>`,
  water: (x, y) => `<path d="M${x - 6} ${y} q3 -3.5 6 0 q3 3.5 6 0"/>`,
  flow: (x, y) => `<path d="M${x - 6} ${y} h9"/><path d="M${x + 1} ${y - 3} l4 3 l-4 3"/>`,
  small: (x, y) => `<circle cx="${x}" cy="${y}" r="3"/>`,
  see: (x, y) => `<path d="M${x - 6} ${y} q6 -5 12 0 q-6 5 -12 0z"/><circle cx="${x}" cy="${y}" r="1.5" fill="currentColor" stroke="none"/>`,
  light: (x, y) => `<circle cx="${x}" cy="${y}" r="1.8" fill="currentColor" stroke="none"/>` +
    [0, 90, 180, 270, 45, 135, 225, 315].map((a) => `<line x1="${(x + 3 * Math.cos(rad(a))).toFixed(1)}" y1="${(y - 3 * Math.sin(rad(a))).toFixed(1)}" x2="${(x + 6 * Math.cos(rad(a))).toFixed(1)}" y2="${(y - 6 * Math.sin(rad(a))).toFixed(1)}"/>`).join(''),
  made: (x, y) => `<rect x="${x - 4.5}" y="${y - 4.5}" width="9" height="9" rx="1"/>`,
  place: (x, y) => `<line x1="${x - 7}" y1="${y}" x2="${x + 7}" y2="${y}"/><line x1="${x - 7}" y1="${y}" x2="${x - 7}" y2="${y + 4}"/><line x1="${x + 7}" y1="${y}" x2="${x + 7}" y2="${y + 4}"/>`,
  life: (x, y) => `<path d="M${x} ${y + 5} v-9"/><path d="M${x} ${y - 2} q-5 -1 -6 -6 q5 0 6 5"/><path d="M${x} ${y - 1} q5 -1 6 -6 q-5 0 -6 5"/>`,
  change: (x, y) => `<path d="M${x + 4} ${y - 3} a5 5 0 1 1 -3 -3"/><path d="M${x + 4} ${y - 5} l1 3 l-3 0"/>`,
  many: (x, y) => `<line x1="${x - 5}" y1="${y - 3}" x2="${x - 5}" y2="${y + 3}"/><line x1="${x}" y1="${y - 4}" x2="${x}" y2="${y + 4}"/><line x1="${x + 5}" y1="${y - 3}" x2="${x + 5}" y2="${y + 3}"/>`,
  speak: (x, y) => `<path d="M${x - 1} ${y - 5} a5 5 0 0 1 0 10"/><path d="M${x - 4} ${y - 3} a3 3 0 0 1 0 6"/>`,
  feel: (x, y) => `<path d="M${x} ${y + 4} C ${x - 6} ${y - 3}, ${x - 3} ${y - 6}, ${x} ${y - 2} C ${x + 3} ${y - 6}, ${x + 6} ${y - 3}, ${x} ${y + 4} Z"/>`,
  being: (x, y) => `<circle cx="${x}" cy="${y}" r="2" fill="currentColor" stroke="none"/><circle cx="${x - 3.5}" cy="${y - 1}" r="1.1" fill="currentColor" stroke="none"/><circle cx="${x + 3.5}" cy="${y - 1}" r="1.1" fill="currentColor" stroke="none"/>`
};

function wrap(inner, label, sw = 2.4) {
  return `<svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${String(label).replace(/"/g, '')}" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${inner}</g></svg>`;
}

// ---------- whole-cat grammar: the body encodes inflection ----------
function tailMark(tense) {
  if (tense === 'past') return '<path d="M77 77 q16 3 11 19"/>';
  if (tense === 'future') return '<path d="M80 74 q11 -5 8 -23"/>';
  if (tense === 'ongoing') return '<path d="M77 76 q15 -1 11 -11 q-4 -9 9 -12"/>';
  return '<path d="M78 78 q15 -2 13 -15"/>';
}
function pluralKitten() {
  return '<g transform="translate(83 83) scale(0.3)"><path d="M-24 -6 l3 -15 l14 9z"/><path d="M24 -6 l-3 -15 l-14 9z"/><circle cx="0" cy="6" r="24" fill="none"/><circle cx="-9" cy="3" r="3" fill="currentColor" stroke="none"/><circle cx="9" cy="3" r="3" fill="currentColor" stroke="none"/></g>';
}
function questionPaw() {
  return '<g transform="translate(13 71)"><ellipse cx="0" cy="6" rx="6" ry="7"/><circle cx="-3" cy="-2" r="1.5"/><circle cx="0" cy="-3" r="1.5"/><circle cx="3" cy="-2" r="1.5"/></g>';
}
function agentCollar() {
  return '<path d="M38 73 q12 7 24 0"/><circle cx="50" cy="78" r="1.8" fill="currentColor" stroke="none"/>';
}

function purrCat(feat = {}) {
  let g = ear(-1, 0) + ear(1, 0) + HEAD;
  g += `<path d="M33 51 q5 5 10 0"/><path d="M57 51 q5 5 10 0"/>`;
  g += NOSE + `<path d="M50 63 q-5 6 -9 2 M50 63 q5 6 9 2"/>`;
  g += whiskers(2) + tailMark('present');
  g += `<path d="M72 28 q5 -2 5 -7"/><circle cx="77" cy="19" r="1.7" fill="currentColor" stroke="none"/>`;
  if (feat.question) g += questionPaw();
  return wrap(g, 'nya', feat.emphasis ? 3.3 : 2.4);
}

export function catSigil(nya, radicals, feat = {}) {
  if (nya === 'nya') return purrCat(feat);
  const v = (nya.match(/[aeiou]/) || ['a'])[0];
  const oi = onsetIdx(nya);
  const syl = Math.min(3, Math.max(1, (nya.match(/[aeiou]+/g) || ['a']).length));
  const big = radicals.includes('big');
  const not = radicals.includes('not') || feat.neg;
  const marks = radicals.filter((r) => r !== 'big' && r !== 'not' && MARK[r]).slice(0, 2);
  let g = ear(-1, oi) + ear(1, oi) + HEAD;
  if (big) g += HEAD_BIG;
  g += eye(38, v) + eye(62, v) + NOSE + MOUTH + whiskers(syl) + tailMark(feat.tense);
  if (marks.length === 1) g += MARK[marks[0]](50, 37);
  else if (marks.length === 2) g += MARK[marks[0]](42, 37) + MARK[marks[1]](58, 37);
  if (feat.plural) g += pluralKitten();
  if (feat.agent) g += agentCollar();
  if (feat.question) g += questionPaw();
  if (not) g += `<line x1="24" y1="80" x2="76" y2="24" stroke-width="2.6"/>`;
  return wrap(g, nya, feat.emphasis ? 3.3 : 2.4);
}

function numberCat(t) {
  const n = parseInt(t, 10) || 0;
  let g = ear(-1, 0) + ear(1, 0) + HEAD + eye(38, 'a') + eye(62, 'a') + NOSE + MOUTH + whiskers(2) + tailMark('present');
  const k = Math.min(n, 5);
  for (let j = 0; j < k; j++) { const x = 50 - (k - 1) * 3 + j * 6; g += `<line x1="${x}" y1="33" x2="${x}" y2="41"/>`; }
  if (n > 5) g += `<circle cx="50" cy="37" r="6"/>`;
  return wrap(g, t);
}

const cache = new Map();
function sigil(nya, radicals, feat) {
  const key = nya + '|' + radicals.join(',') + '|' + (feat ? JSON.stringify(feat) : '');
  let s = cache.get(key);
  if (s === undefined) { s = catSigil(nya, radicals, feat); cache.set(key, s); }
  return s;
}

// Render a whole string as a flowing row of cat-sigils (one per Nya word).
export function renderCatText(text, opts = {}) {
  const size = opts.size || 26;
  const toks = String(text).match(/[A-Za-z]+|[0-9]+|[.!?]+|[,;:]+/g) || [];
  const span = (svg, title) =>
    `<span class="nya-cat" title="${String(title).replace(/"/g, '')}" style="display:inline-block;width:${size}px;height:${size}px;vertical-align:middle;margin:0 1px">${svg}</span>`;
  let html = '';
  for (const t of toks) {
    if (/^[A-Za-z]+$/.test(t)) {
      const { nya, features } = analyze(t);
      if (!nya) continue;
      const f = { ...features };
      if (t.length > 1 && t === t.toUpperCase()) f.emphasis = true;
      html += span(sigil(nya, radicalsFor(t), f), nya);
    } else if (/^[0-9]+$/.test(t)) {
      html += span(numberCat(t), t);
    } else if (/[.!?]/.test(t)) {
      const f = t.includes('?') ? { question: true } : t.includes('!') ? { emphasis: true } : {};
      html += span(sigil('nya', [], f), 'nya ' + t);
    } else {
      html += `<span style="display:inline-block;width:${Math.round(size * 0.28)}px"></span>`;
    }
  }
  return html;
}

export default { catSigil, renderCatText };
