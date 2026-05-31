// Nya logograms — an Arrival-inspired, compositional writing system.
//
// Idea (and the key to decipherability): meaning is NOT phonetic. Each concept
// is a circular logogram built from a small set of ~16 semantic RADICALS
// (atomic ideas: self, water, see, big, small, made, flow, place, life...).
// Complex concepts are transparent compositions of radicals, so a reader who
// learns the ~16 marks can reverse-engineer most words by pure logic:
//
//   water = ~        river = water + flow        world = big + place
//   see = eye        research = see + many        university = place + see
//   plastic = made + not + life     microplastic = small + plastic
//
// Grammar is shown by the ring itself: a plural gets a second outer ring, a
// question opens a gap, emphasis thickens the stroke. The layout is holistic
// (marks sit around one ring at fixed clock positions), not linear, echoing the
// non-linear logograms of the film.
//
// renderGlyph(conceptId, opts) -> standalone <svg> string.
// glyphFor(englishWord)        -> {concept, radicals, svg} (with phonetic
//                                 fallback so any word still renders).

const C = 50, R = 34;            // ring centre + radius (viewBox 0..100)
const deg = (d) => (d * Math.PI) / 180;
const at = (angle, rad = R) => [C + rad * Math.cos(deg(angle)), C - rad * Math.sin(deg(angle))];

// ---------- radicals: gloss + a small stroke mark drawn at (x,y) ----------
// Each draw(x,y) returns SVG markup centred on the anchor point.
const RADICALS = {
  self:   { gloss: 'self / I',        anchor: 'center', draw: (x, y) => `<circle cx="${x}" cy="${y}" r="3.4" fill="currentColor" stroke="none"/>` },
  water:  { gloss: 'water',           anchor: 215,      draw: (x, y) => `<path d="M${x - 9} ${y} q4.5 -5 9 0 q4.5 5 9 0"/>` },
  flow:   { gloss: 'flow / move',     anchor: 'center', draw: (x, y) => `<path d="M${x - 11} ${y + 8} q11 -16 22 0"/><path d="M${x + 7} ${y - 6} l4 2 l-4 3"/>` },
  big:    { gloss: 'big / great',     anchor: 'ring',   draw: () => `<circle cx="${C}" cy="${C}" r="${R + 8}"/>` },
  small:  { gloss: 'small',           anchor: 'center', draw: (x, y) => `<circle cx="${x}" cy="${y}" r="7"/>` },
  see:    { gloss: 'see / know',      anchor: 90,       draw: (x, y) => `<path d="M${x - 9} ${y} q9 -8 18 0 q-9 8 -18 0z"/><circle cx="${x}" cy="${y}" r="2.4" fill="currentColor" stroke="none"/>` },
  light:  { gloss: 'light',           anchor: 55,       draw: (x, y) => `<circle cx="${x}" cy="${y}" r="2.6" fill="currentColor" stroke="none"/>${[0, 60, 120, 180, 240, 300].map(a => `<line x1="${x + 4 * Math.cos(deg(a))}" y1="${y - 4 * Math.sin(deg(a))}" x2="${x + 9 * Math.cos(deg(a))}" y2="${y - 9 * Math.sin(deg(a))}"/>`).join('')}` },
  made:   { gloss: 'made / artifact', anchor: 0,        draw: (x, y) => `<rect x="${x - 6}" y="${y - 6}" width="12" height="12" rx="1.5"/>` },
  not:    { gloss: 'not / negate',    anchor: 'ring',   draw: () => `<line x1="${C - R + 4}" y1="${C + R - 4}" x2="${C + R - 4}" y2="${C - R + 4}"/>` },
  place:  { gloss: 'place / ground',  anchor: 270,      draw: (x, y) => `<line x1="${x - 12}" y1="${y}" x2="${x + 12}" y2="${y}"/><line x1="${x - 7}" y1="${y}" x2="${x - 7}" y2="${y + 5}"/><line x1="${x + 7}" y1="${y}" x2="${x + 7}" y2="${y + 5}"/>` },
  life:   { gloss: 'life / plant',    anchor: 315,      draw: (x, y) => `<path d="M${x} ${y + 7} l0 -12"/><path d="M${x} ${y - 3} q-7 -2 -8 -8 q7 0 8 7"/><path d="M${x} ${y - 1} q7 -2 8 -8 q-7 0 -8 7"/>` },
  change: { gloss: 'change / time',   anchor: 'center', draw: (x, y) => `<path d="M${x} ${y - 8} a8 8 0 1 1 -7 4 a4.5 4.5 0 1 0 4 -2.5"/>` },
  many:   { gloss: 'many / plural',   anchor: 135,      draw: (x, y) => `<line x1="${x - 5}" y1="${y - 4}" x2="${x - 5}" y2="${y + 4}"/><line x1="${x}" y1="${y - 5}" x2="${x}" y2="${y + 5}"/><line x1="${x + 5}" y1="${y - 4}" x2="${x + 5}" y2="${y + 4}"/>` },
  speak:  { gloss: 'speak / sound',   anchor: 180,      draw: (x, y) => `<path d="M${x} ${y - 7} a7 7 0 0 0 0 14"/><path d="M${x - 4} ${y - 4} a4 4 0 0 0 0 8"/>` },
  feel:   { gloss: 'heart / feel',    anchor: 110,      draw: (x, y) => `<path d="M${x} ${y + 6} C ${x - 9} ${y - 3}, ${x - 4} ${y - 9}, ${x} ${y - 4} C ${x + 4} ${y - 9}, ${x + 9} ${y - 3}, ${x} ${y + 6} Z"/>` },
  being:  { gloss: 'being / cat',     anchor: 'ears',   draw: () => { const [lx, ly] = at(115); const [rx, ry] = at(65); return `<path d="M${lx - 4} ${ly + 3} l1 -9 l6 5z"/><path d="M${rx + 4} ${ry + 3} l-1 -9 l-6 5z"/>`; } }
};

export const RADICAL_GLOSSES = Object.fromEntries(Object.entries(RADICALS).map(([k, v]) => [k, v.gloss]));

// ---------- concepts: meaning -> radical composition (the dictionary) ----------
export const CONCEPTS = {
  self: ['self'], i: ['self'], me: ['self'], my: ['self'], we: ['self', 'many'], you: ['self', 'speak'],
  water: ['water'], river: ['water', 'flow'], sea: ['water', 'big'], rain: ['water', 'light'],
  big: ['big'], small: ['small'], micro: ['small'], many: ['many'], all: ['big', 'many'], one: ['self'],
  see: ['see'], know: ['see'], study: ['see', 'self'], research: ['see', 'many'], think: ['see', 'change'],
  light: ['light'], photo: ['light', 'made'], photograph: ['light', 'made'], photography: ['light', 'made', 'many'],
  made: ['made'], build: ['made', 'self'], plastic: ['made', 'not', 'life'], microplastic: ['small', 'made', 'not', 'life'],
  place: ['place'], home: ['place', 'feel'], city: ['place', 'many'], country: ['place', 'big'], world: ['big', 'place'],
  university: ['place', 'see'], field: ['place', 'life'], map: ['place', 'see', 'small'],
  life: ['life'], forest: ['life', 'many'], plant: ['life'], cat: ['being'], animal: ['being'],
  flow: ['flow'], journey: ['flow', 'self'], change: ['change'], time: ['change'], year: ['change', 'big'],
  speak: ['speak'], talk: ['speak', 'self'], contact: ['speak', 'flow'], hello: ['speak', 'feel'],
  comment: ['speak', 'made'], note: ['speak', 'small'], journal: ['speak', 'many'],
  feel: ['feel'], love: ['feel', 'big'], like: ['feel'], good: ['feel'],
  master: ['see', 'big'], graduate: ['see', 'big', 'change'], education: ['see', 'place'],
  question: ['speak', 'change'], system: ['flow', 'many'], global: ['big'], landscape: ['place', 'big'],
  pressure: ['big', 'flow'], not: ['not'], no: ['not'],

  // --- expanded common vocabulary: meaning -> radical composition ---
  // people & beings
  person: ['being'], people: ['being', 'many'], human: ['being'], man: ['being'], woman: ['being'],
  child: ['being', 'small'], baby: ['being', 'small'], kid: ['being', 'small'], friend: ['being', 'feel'],
  family: ['being', 'many', 'feel'], mother: ['being', 'feel'], father: ['being', 'big'], parent: ['being', 'big'],
  teacher: ['being', 'speak'], student: ['being', 'see'], they: ['being', 'many'], he: ['being'], she: ['being'],
  // nature
  sun: ['light', 'big'], moon: ['light', 'change'], star: ['light', 'small'], sky: ['big', 'light'],
  cloud: ['water', 'light'], snow: ['water', 'small'], wind: ['flow', 'big'], storm: ['water', 'flow', 'big'],
  fire: ['light', 'change'], earth: ['place', 'big'], ground: ['place'], land: ['place'], soil: ['place', 'life'],
  mountain: ['place', 'big'], hill: ['place'], rock: ['place', 'small'], stone: ['place', 'small'],
  tree: ['life', 'big'], flower: ['life', 'feel'], grass: ['life', 'small'], leaf: ['life', 'small'],
  root: ['life', 'place'], seed: ['life', 'small'], wood: ['life', 'made'], lake: ['water', 'place'],
  stream: ['water', 'flow', 'small'], ocean: ['water', 'big'], wave: ['water', 'flow'], island: ['place', 'water'],
  desert: ['place', 'not', 'water'], sand: ['place', 'small', 'many'], beach: ['place', 'water'], valley: ['place', 'small'],
  // animals (all beings)
  bird: ['being', 'flow'], fish: ['being', 'water'], dog: ['being'], horse: ['being', 'big'], cow: ['being', 'big'],
  bug: ['being', 'small'], insect: ['being', 'small'], snake: ['being', 'flow'], lion: ['being', 'big'],
  bear: ['being', 'big'], mouse: ['being', 'small'], wolf: ['being'], kitten: ['being', 'small'],
  // body
  body: ['self', 'made'], head: ['self', 'big'], eye: ['see'], ear: ['speak'], nose: ['self', 'small'],
  mouth: ['speak'], hand: ['self', 'made'], arm: ['self'], leg: ['self', 'flow'], foot: ['flow', 'place'],
  heart: ['feel'], mind: ['see', 'self'], brain: ['see', 'self'], hair: ['self', 'small', 'many'],
  skin: ['self', 'made'], blood: ['water', 'life'], bone: ['self', 'made'], face: ['self', 'see'], voice: ['speak'],
  // food & drink
  food: ['life', 'made'], drink: ['water', 'self'], eat: ['life', 'self'], bread: ['life', 'made'],
  rice: ['life', 'small', 'many'], meat: ['being', 'life'], milk: ['water', 'life'], egg: ['life', 'small'],
  tea: ['water', 'life'], coffee: ['water', 'life'], sugar: ['life', 'small'], salt: ['place', 'small'],
  apple: ['life', 'feel'], fruit: ['life', 'feel'], soup: ['water', 'life'],
  // time
  day: ['light', 'change'], night: ['not', 'light'], morning: ['light', 'change'], evening: ['change', 'not', 'light'],
  week: ['change', 'many'], month: ['change', 'light'], hour: ['change', 'small'], minute: ['change', 'small'],
  moment: ['change', 'small'], today: ['change', 'self'], tomorrow: ['change', 'flow'], yesterday: ['change', 'not'],
  now: ['change', 'self'], future: ['change', 'flow'], past: ['change', 'not'], spring: ['life', 'change'],
  summer: ['light', 'big', 'change'], autumn: ['change', 'life', 'not'], winter: ['not', 'light', 'change'],
  season: ['change', 'many'], age: ['change', 'big'],
  // actions
  go: ['flow'], come: ['flow', 'self'], walk: ['flow', 'self'], run: ['flow', 'big'], jump: ['flow', 'light'],
  fly: ['flow', 'light'], swim: ['flow', 'water'], move: ['flow'], stop: ['not', 'flow'], start: ['change', 'flow'],
  begin: ['change'], end: ['not', 'change'], stay: ['not', 'flow'], leave: ['flow', 'not'], give: ['made', 'flow'],
  take: ['self', 'made'], get: ['self'], do: ['made', 'self'], use: ['made', 'self'], help: ['feel', 'self'],
  work: ['made', 'self'], play: ['feel', 'flow'], read: ['see', 'speak'], write: ['made', 'speak'],
  learn: ['see', 'change'], find: ['see', 'change'], lose: ['not', 'see'], win: ['big', 'self'], buy: ['made', 'self'],
  sell: ['made', 'flow'], open: ['change', 'place'], close: ['not', 'place'], grow: ['life', 'change'],
  live: ['life'], die: ['not', 'life'], sleep: ['not', 'see'], wake: ['see', 'change'], hear: ['speak', 'self'],
  listen: ['speak', 'see'], look: ['see'], watch: ['see', 'change'], wait: ['not', 'change'], want: ['feel', 'self'],
  need: ['feel', 'not'], hope: ['feel', 'change'], dream: ['see', 'feel'], sing: ['speak', 'feel'], dance: ['flow', 'feel'],
  call: ['speak', 'flow'], ask: ['speak', 'change'], answer: ['speak', 'self'], tell: ['speak'], meet: ['flow', 'feel'],
  follow: ['flow', 'many'], lead: ['flow', 'big'], carry: ['flow', 'made'], fix: ['made', 'change'], break: ['not', 'made'],
  // qualities
  bad: ['not', 'feel'], new: ['change'], old: ['change', 'many'], young: ['life', 'small'], hot: ['light', 'big'],
  cold: ['not', 'light'], warm: ['light', 'feel'], long: ['big', 'flow'], short: ['small'], tall: ['big', 'life'],
  high: ['big', 'light'], low: ['small', 'place'], fast: ['flow', 'big'], slow: ['flow', 'small'], strong: ['big', 'self'],
  weak: ['small', 'not'], happy: ['feel', 'light'], sad: ['feel', 'not'], angry: ['feel', 'big'], beautiful: ['feel', 'light'],
  clean: ['water', 'made'], dirty: ['not', 'water'], rich: ['made', 'many'], poor: ['not', 'made'], dark: ['not', 'light'],
  bright: ['light', 'big'], deep: ['water', 'big'], wide: ['big', 'place'], full: ['big', 'many'], empty: ['not', 'many'],
  true: ['see'], free: ['not', 'made'], quiet: ['not', 'speak'], loud: ['speak', 'big'], soft: ['feel', 'small'],
  hard: ['made', 'big'], easy: ['small', 'flow'], important: ['big', 'feel'], real: ['see', 'place'],
  // society & things
  money: ['made', 'many'], book: ['speak', 'made'], word: ['speak', 'small'], story: ['speak', 'many'], song: ['speak', 'feel'],
  music: ['speak', 'feel'], art: ['made', 'feel'], science: ['see', 'made'], war: ['big', 'not', 'feel'], peace: ['feel', 'big'],
  truth: ['see', 'place'], power: ['big', 'self'], energy: ['light', 'big'], health: ['life', 'feel'], law: ['made', 'speak'],
  death: ['not', 'life'], birth: ['life', 'change'], name: ['speak', 'self'], number: ['many', 'made'], color: ['light', 'many'],
  sound: ['speak'], shadow: ['not', 'light'], road: ['place', 'flow'], path: ['flow', 'place'], door: ['place', 'change'],
  window: ['place', 'see'], wall: ['made', 'place'], house: ['made', 'place'], room: ['place', 'small'], school: ['place', 'see'],
  hospital: ['place', 'life', 'feel'], market: ['place', 'made', 'many'], shop: ['place', 'made'], bridge: ['made', 'flow'],
  boat: ['made', 'water'], ship: ['made', 'water', 'big'], car: ['made', 'flow'], train: ['made', 'flow', 'many'],
  plane: ['made', 'flow', 'light'], machine: ['made', 'change'], computer: ['made', 'see'], phone: ['made', 'speak'],
  tool: ['made', 'self'], gift: ['made', 'feel'], letter: ['speak', 'made'], message: ['speak', 'flow'], paper: ['made', 'speak']
};

// English lemma -> concept key (handles a few synonyms / plurals)
const LEMMA = {
  countries: 'country', universities: 'university', systems: 'system', places: 'place',
  photographs: 'photo', photos: 'photo', notes: 'note', rivers: 'river', cats: 'cat',
  microplastics: 'microplastic', plastics: 'plastic', forests: 'forest', years: 'year',
  comments: 'comment', maps: 'map'
};

// deterministic fallback: a ring with hash-placed dots (distinct, not semantic)
function hashWord(w) {
  let h = 2166136261;
  for (let i = 0; i < w.length; i++) { h ^= w.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h >>> 0;
}
function fallbackMarks(w) {
  let h = hashWord(w);
  const n = 2 + (h % 3);
  let m = '';
  for (let i = 0; i < n; i++) {
    const a = (h % 360); h = Math.floor(h / 360) + 97 * (i + 1);
    const [x, y] = at(a, R - 9);
    m += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" fill="currentColor" stroke="none"/>`;
  }
  return m;
}

function marksFor(radicals) {
  return radicals.map((id) => {
    const r = RADICALS[id];
    if (!r) return '';
    if (r.anchor === 'center') return r.draw(C, C);
    if (r.anchor === 'ring' || r.anchor === 'ears') return r.draw();
    const [x, y] = at(r.anchor);
    return r.draw(x, y);
  }).join('');
}

export function renderGlyph(radicalsOrConcept, opts = {}) {
  const radicals = Array.isArray(radicalsOrConcept) ? radicalsOrConcept : (CONCEPTS[radicalsOrConcept] || []);
  const plural = opts.plural;
  const size = opts.size || 64;
  const ring = `<circle cx="${C}" cy="${C}" r="${R}"/>`;
  const outer = plural ? `<circle cx="${C}" cy="${C}" r="${R + 5}" stroke-dasharray="2 4"/>` : '';
  const body = radicals.length ? marksFor(radicals) : (opts.fallback ? fallbackMarks(opts.fallback) : '');
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="${opts.label || ''}" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">${ring}${outer}${body}</g></svg>`;
}

export function glyphFor(englishWord, opts = {}) {
  const raw = englishWord.toLowerCase().replace(/[^a-z]/g, '');
  let key = CONCEPTS[raw] ? raw : LEMMA[raw];
  let plural = false;
  if (!key && raw.endsWith('s') && CONCEPTS[raw.slice(0, -1)]) { key = raw.slice(0, -1); plural = true; }
  const radicals = key ? CONCEPTS[key] : [];
  return {
    word: englishWord, concept: key || null, radicals,
    svg: renderGlyph(radicals, { ...opts, plural, fallback: key ? null : raw, label: key || raw })
  };
}

// Skip pure grammatical words when drawing a phrase as logograms.
const SKIP = new Set(['a', 'an', 'the', 'and', 'or', 'of', 'to', 'in', 'on', 'is', 'are', 'with', 'for', 'as', 'at', 'by']);

export function glyphsForPhrase(text, opts = {}) {
  return (text.toLowerCase().match(/[a-z]+/g) || [])
    .filter((w) => !SKIP.has(w))
    .map((w) => glyphFor(w, opts));
}

// ---------- sentence as ONE circle (Heptapod-style) ----------
// The whole utterance is a single ring. Each content word fuses onto the ring
// at its own sector (read clockwise from the start dot); its radicals cluster
// there. A question opens a wide gap in the ring. This is holistic, not linear.
const ringPt = (cx, cy, r, a) => [cx + r * Math.cos(deg(a)), cy - r * Math.sin(deg(a))];

function clusterRadical(id, x, y, s) {
  if (id === 'big') return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(12 * s).toFixed(1)}"/>`;
  if (id === 'not') { const o = 9 * s; return `<line x1="${(x - o).toFixed(1)}" y1="${(y + o).toFixed(1)}" x2="${(x + o).toFixed(1)}" y2="${(y - o).toFixed(1)}"/>`; }
  if (id === 'being') { const e = 5 * s; return `<path d="M${(x - e).toFixed(1)} ${(y - e * 0.4).toFixed(1)} l${(e * 0.5).toFixed(1)} ${(-e * 1.4).toFixed(1)} l${(e * 1.1).toFixed(1)} ${(e).toFixed(1)}z"/><path d="M${(x + e).toFixed(1)} ${(y - e * 0.4).toFixed(1)} l${(-e * 0.5).toFixed(1)} ${(-e * 1.4).toFixed(1)} l${(-e * 1.1).toFixed(1)} ${(e).toFixed(1)}z"/>`; }
  const inner = RADICALS[id] ? RADICALS[id].draw(x, y) : '';
  return `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${s}) translate(${(-x).toFixed(2)} ${(-y).toFixed(2)})">${inner}</g>`;
}

function renderCluster(radicals, px, py, s) {
  if (!radicals.length) return `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="1.8" fill="currentColor" stroke="none"/>`;
  const k = radicals.length;
  const o = k === 1 ? 0 : 7.5;
  return radicals.map((id, j) => {
    const a = 90 - j * (360 / k);
    const x = px + o * Math.cos(deg(a)), y = py - o * Math.sin(deg(a));
    return clusterRadical(id, x, y, s);
  }).join('');
}

// a number node: tally ticks for small counts, a "great count" for large ones
function renderNumber(val, px, py, s) {
  const n = parseInt(val, 10);
  if (n >= 1 && n <= 6) {
    const span = (n - 1) * 4;
    let m = '';
    for (let j = 0; j < n; j++) {
      const x = px - span / 2 + j * 4;
      m += `<line x1="${x.toFixed(1)}" y1="${(py - 5).toFixed(1)}" x2="${x.toFixed(1)}" y2="${(py + 5).toFixed(1)}"/>`;
    }
    return m;
  }
  return clusterRadical('many', px, py, s) + `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(11 * s).toFixed(1)}"/>`;
}

// internal punctuation: a notch crossing the ring (a clause break); ; and : add an outer dot
function renderDivider(chars, cx, cy, BR, ang) {
  const [ix, iy] = ringPt(cx, cy, BR - 4.5, ang);
  const [ox, oy] = ringPt(cx, cy, BR + 4.5, ang);
  let d = `<line x1="${ix.toFixed(1)}" y1="${iy.toFixed(1)}" x2="${ox.toFixed(1)}" y2="${oy.toFixed(1)}" stroke-width="2.4"/>`;
  if (/[;:]/.test(chars)) {
    const [mx, my] = ringPt(cx, cy, BR + 8, ang);
    d += `<circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="1.7" fill="currentColor" stroke="none"/>`;
  }
  return d;
}

// arc from a0 clockwise to a1 (degrees, math convention; SVG sweep=1)
const arcPath = (cx, cy, r, a0, a1) => {
  const [x0, y0] = ringPt(cx, cy, r, a0);
  const [x1, y1] = ringPt(cx, cy, r, a1);
  const large = ((a0 - a1 + 360) % 360) > 180 ? 1 : 0;
  return `M${x0.toFixed(2)} ${y0.toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
};

const SVG_OPEN = (size, label) => `<svg viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="${String(label || '').replace(/"/g, '')}" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">`;
const SVG_CLOSE = `</g></svg>`;

// Draw one sentence (ring + clusters + punctuation) at a given centre/radius.
// Returns raw markup (no <svg>) so it can be nested inside a bigger ring.
function sentenceInner(text, cx, cy, BR) {
  const toks = String(text).match(/[A-Za-z]+|[0-9]+|[.,;:!?]/g) || [];
  const nodes = []; const divAfter = {}; let terminal = '';
  for (const t of toks) {
    if (/^[A-Za-z]+$/.test(t)) { if (!SKIP.has(t.toLowerCase())) nodes.push({ kind: 'word', val: t }); }
    else if (/^[0-9]+$/.test(t)) nodes.push({ kind: 'num', val: t });
    else if (t === '.' || t === '!' || t === '?') terminal = t;
    else if (nodes.length) divAfter[nodes.length - 1] = (divAfter[nodes.length - 1] || '') + t;
  }
  const N = Math.max(nodes.length, 1);
  const k = BR / 33;
  const scale = (N <= 3 ? 0.62 : N <= 6 ? 0.5 : 0.4) * k;
  const angleOf = (i) => 90 - (i + 0.5) * (360 / N);
  const isQ = terminal === '?';
  const isExcl = terminal === '!';
  const gap = isQ ? 30 : 9;

  // base ring + a faint inner concentric line (Arrival-style double stroke = linking)
  let parts = `<path d="${arcPath(cx, cy, BR, 90 - gap / 2, 90 + gap / 2 - 360)}" stroke-width="${(1.9 * k).toFixed(2)}"/>`;
  parts += `<path d="${arcPath(cx, cy, BR - 3 * k, 90 - gap / 2, 90 + gap / 2 - 360)}" stroke-width="${(0.7 * k).toFixed(2)}"/>`;

  let clusters = '', stems = '', dividers = '', heavy = '';
  nodes.forEach((node, i) => {
    const ang = angleOf(i);
    const [px, py] = ringPt(cx, cy, BR, ang);
    clusters += node.kind === 'num' ? renderNumber(node.val, px, py, scale) : renderCluster(glyphFor(node.val).radicals, px, py, scale);
    const [ix, iy] = ringPt(cx, cy, BR - 6 * k, ang);
    const [ox, oy] = ringPt(cx, cy, BR + 6 * k, ang);
    stems += `<line x1="${ix.toFixed(1)}" y1="${iy.toFixed(1)}" x2="${ox.toFixed(1)}" y2="${oy.toFixed(1)}" stroke-width="${(0.8 * k).toFixed(2)}"/>`;
    // ink-weight variation: thicken the arc leading into "heavier" (multi-radical) words
    if (i < N - 1 && node.kind === 'word' && glyphFor(node.val).radicals.length >= 2) {
      heavy += `<path d="${arcPath(cx, cy, BR, angleOf(i), angleOf(i + 1))}" stroke-width="${(3.4 * k).toFixed(2)}"/>`;
    }
    if (divAfter[i] && i < N - 1) dividers += renderDivider(divAfter[i], cx, cy, BR, (angleOf(i) + angleOf(i + 1)) / 2);
  });

  let start = `<circle cx="${cx}" cy="${(cy - BR).toFixed(1)}" r="${(2.6 * k).toFixed(1)}" fill="currentColor" stroke="none"/>`;
  if (isExcl) start += `<line x1="${cx}" y1="${(cy - BR - 3 * k).toFixed(1)}" x2="${cx}" y2="${(cy - BR - 10 * k).toFixed(1)}" stroke-width="${(2.6 * k).toFixed(2)}"/>`;

  return parts + heavy + dividers + stems + start + clusters;
}

export function renderSentence(text, opts = {}) {
  return SVG_OPEN(opts.size || 220, opts.label || text) + sentenceInner(text, 50, 50, 33) + SVG_CLOSE;
}

// Nested clauses = rings within a ring: a sentence with commas / colons becomes a
// big ring whose clauses are smaller sub-rings arranged inside it.
export function renderNested(text, opts = {}) {
  const clauses = String(text).split(/[,;:]+/).map((c) => c.trim()).filter(Boolean);
  if (clauses.length <= 1) return renderSentence(text, opts);
  const cx = 50, cy = 50, BR = 46;
  const terminal = (String(text).match(/[.!?]\s*$/) || [''])[0].trim();
  const gap = terminal === '?' ? 26 : 8;
  let inner = `<path d="${arcPath(cx, cy, BR, 90 - gap / 2, 90 + gap / 2 - 360)}" stroke-width="2.4"/>`;
  inner += `<circle cx="${cx}" cy="${(cy - BR).toFixed(1)}" r="2.8" fill="currentColor" stroke="none"/>`;
  const M = clauses.length;
  const subR = M === 2 ? 18 : M === 3 ? 15 : 13;
  const orbit = 22;
  clauses.forEach((cl, i) => {
    const a = 90 - (i + 0.5) * (360 / M);
    const scx = cx + orbit * Math.cos(deg(a));
    const scy = cy - orbit * Math.sin(deg(a));
    inner += sentenceInner(cl + (i === M - 1 ? terminal : ''), scx, scy, subR);
  });
  return SVG_OPEN(opts.size || 240, opts.label || text) + inner + SVG_CLOSE;
}

// One ring per sentence (nested if a sentence has clauses). For whole-page text.
export function renderText(text, opts = {}) {
  const sents = String(text).split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
  return (sents.length ? sents : [String(text)]).map((s) => renderNested(s, opts));
}

// English word -> its semantic radical ids (the dictionary lookup, no SVG).
export function radicalsFor(word) {
  const raw = String(word).toLowerCase().replace(/[^a-z]/g, '');
  let key = CONCEPTS[raw] ? raw : LEMMA[raw];
  if (!key && raw.endsWith('s') && CONCEPTS[raw.slice(0, -1)]) key = raw.slice(0, -1);
  return key ? CONCEPTS[key] : [];
}

export default { RADICALS: RADICAL_GLOSSES, CONCEPTS, radicalsFor, renderGlyph, glyphFor, glyphsForPhrase, renderSentence, renderNested, renderText };
