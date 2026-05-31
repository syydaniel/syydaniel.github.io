// Nya (猫猫语) — a small constructed cat language.
//
// Design: a meaning-based core lexicon + light, regular grammar, plus a
// productive phonetic fallback so ANY English text can be rendered in Nya. It
// is meant to be written in the NyaGlyph font, where each letter is drawn as a
// cat, but it also reads as cute cat words in plain text.
//
// Phonology  : consonants m n p r w y (+ clusters ny mr pr); vowels a i u e o;
//              optional codas n r. Syllables are (C)V(n/r). Words are 1-3 of these.
// Grammar    : articles "a/an" are dropped; "the" -> na. Plurals add suffix -mi.
//              A clause-final purr particle "nya" precedes . ! ? . Word order
//              follows the source (analytic, isolating).
// Orthography: the NyaGlyph cat-glyph font (font/build-cat-font.py).
//
// This file is the single source of truth; the website ships a copy.

import { CONCEPTS } from './nya-logogram';

export const VERSION = '0.3.0';

// ---------- core lexicon (English -> Nya) ----------
export const LEXICON = {
  // pronouns
  i: 'mi', me: 'mi', my: 'mii', mine: 'mii', we: 'nau', us: 'nau', our: 'naui', ours: 'naui',
  you: 'yu', your: 'yui', yours: 'yui',
  // determiners / demonstratives
  the: 'na', this: 'ne', that: 'no', these: 'nemi', those: 'nomi',
  // conjunctions / prepositions
  and: 'pa', or: 'wo', but: 'pan', of: 'mu', in: 'ni', on: 'nu', to: 'ru', with: 'wim',
  for: 'pur', from: 'pram', at: 'ya', by: 'mai', as: 'nan', about: 'muri',
  // be / aux / negation / yes
  is: 'e', are: 'e', am: 'e', was: 'ewa', were: 'ewa', be: 'e', been: 'ewu',
  have: 'wom', has: 'wom', had: 'woma', do: 'noo', does: 'noo', will: 'wira',
  not: 'nim', no: 'nim', yes: 'nya', can: 'kanu',
  // question words
  where: 'mawe', how: 'mawo', what: 'mawa', who: 'mawu', why: 'mawi', when: 'mawen',
  // common verbs
  study: 'puwa', research: 'purwa', photograph: 'miapo', make: 'manu', made: 'manwa',
  read: 'rimi', say: 'pawi', talk: 'pawo', change: 'pirwa', collaborate: 'panwa',
  explore: 'ronya', view: 'wimu', download: 'raupo', hover: 'womu', graduate: 'ranyo',
  open: 'orin', pick: 'piku', meet: 'miwa', carry: 'karu', stand: 'panu', think: 'rinka',
  // nouns
  home: 'muna', journey: 'ranpa', photography: 'miapoo', photo: 'miapo', contact: 'mewo',
  journal: 'nupa', note: 'nupa', water: 'miru', plastic: 'puran', microplastic: 'mipuran',
  system: 'pirun', world: 'wora', light: 'rimu', land: 'rano', landscape: 'ranwo',
  place: 'pora', university: 'winyo', master: 'manyo', field: 'pira', essay: 'nupe',
  map: 'mapu', timeline: 'ranri', version: 'winu', education: 'puyo', experience: 'panyo',
  project: 'puro', supervisor: 'puwanyo', card: 'panu', frame: 'mira', year: 'nyaru',
  time: 'ranu', range: 'ranwe', life: 'riwo', pressure: 'puna', question: 'mawamu',
  country: 'woni', page: 'peni', comment: 'mewa', post: 'nupo', city: 'puni', forest: 'rumi',
  cat: 'mau', river: 'mirun', sub: 'pra', basin: 'wano', model: 'monu',
  // adjectives / adverbs / misc
  global: 'woru', available: 'womi', published: 'nupi', all: 'ono', latest: 'nuwa',
  present: 'nyau', ongoing: 'onwa', personal: 'menyo', academic: 'panyu', based: 'muru',
  built: 'mawu', visible: 'wimi', quiet: 'muwa', good: 'woni', little: 'piri', new: 'nuu',
  hello: 'nyao', hi: 'nyao', four: 'nyo', one: 'wun', let: 'pan', us2: 'nau'
};

// ---------- combinatorial roots: a word's SOUND derives from its MEANING ----------
// Each of the 16 semantic radicals has one canonical syllable. A content word's
// spoken form is its radicals' syllables joined, so you can HEAR the meaning the
// same way the cat-sigil's forehead SHOWS it. e.g. river = water+flow = "waro".
// Onsets use only Nya consonants (m n p r w y); being = "mau" (a cat!).
export const ROOT_SOUND = {
  self: 'mi', water: 'wa', flow: 'ro', big: 'wo', small: 'pi', see: 'wi',
  light: 'ri', made: 'ma', not: 'ni', place: 'po', life: 'nu', change: 'pe',
  many: 'mu', speak: 'pa', feel: 'ne', being: 'mau'
};
// Compose a spoken word from a list of radical ids (the meaning), e.g.
// ['water','flow'] -> 'waro'. Unknown radicals are skipped.
export function composeSound(radicals) {
  if (!radicals || !radicals.length) return '';
  return radicals.map((r) => ROOT_SOUND[r] || '').join('');
}

// Closed-class function words are irregular (as in every language): kept stable
// and arbitrary. Content words instead compose from their radicals (above).
const FUNCTION_KEYS = new Set([
  'i', 'me', 'my', 'mine', 'we', 'us', 'our', 'ours', 'you', 'your', 'yours',
  'the', 'this', 'that', 'these', 'those',
  'and', 'or', 'but', 'of', 'in', 'on', 'to', 'with', 'for', 'from', 'at', 'by', 'as', 'about',
  'is', 'are', 'am', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'will',
  'not', 'no', 'yes', 'can', 'where', 'how', 'what', 'who', 'why', 'when',
  'hello', 'hi', 'let'
]);
// A couple of iconic content words stay irregular for charm (documented).
const IRREGULAR = { cat: 'mau' };

// articles that are simply dropped (Nya has no indefinite article)
const DROP = new Set(['a', 'an']);

// ---------- phonetic fallback (for words not in the lexicon) ----------
const ONSETS = ['', 'n', 'm', 'p', 'r', 'w', 'y', 'ny', 'mr', 'pr', 'mi', 'mu'];
const NUCLEI = ['a', 'i', 'u', 'e', 'o'];
const CODAS = ['', '', '', 'n', 'r'];

function hashWord(w) {
  let h = 2166136261;
  for (let i = 0; i < w.length; i++) {
    h ^= w.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

export function fallbackWord(word) {
  const n = word.length <= 2 ? 1 : word.length <= 5 ? 2 : 3;
  let h = hashWord(word);
  let out = '';
  for (let i = 0; i < n; i++) {
    out += ONSETS[h % ONSETS.length]; h = Math.floor(h / 7) + 101;
    out += NUCLEI[h % NUCLEI.length]; h = Math.floor(h / 7) + 211;
    out += CODAS[h % CODAS.length]; h = Math.floor(h / 7) + 307;
  }
  return out || 'nya';
}

const PLURAL = 'mi';
const cap = (w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w);

// Translate one already-lowercased word to its Nya form (no caps handling).
// Priority: drop articles -> function words (irregular, stable) -> iconic
// irregulars -> content words composed from their meaning (transparent) ->
// curated/merged lexicon -> simple plural -> phonetic fallback.
export function word(w) {
  if (DROP.has(w)) return '';
  if (FUNCTION_KEYS.has(w) && LEXICON[w] !== undefined) return LEXICON[w];
  if (IRREGULAR[w]) return IRREGULAR[w];
  if (CONCEPTS[w]) return composeSound(CONCEPTS[w]);
  if (LEXICON[w] !== undefined) return LEXICON[w];
  // simple plural: trailing -s on a known singular -> base + -mi
  if (w.length > 2 && w.endsWith('s')) {
    const base = w.slice(0, -1);
    if (CONCEPTS[base]) return composeSound(CONCEPTS[base]) + PLURAL;
    if (LEXICON[base] !== undefined) return LEXICON[base] + PLURAL;
    if (DROP.has(base)) return '';
  }
  return fallbackWord(w);
}

// ---------- morphology: productive derivation + grammatical features ----------
// Nya is built from roots + a few regular affixes. A derivational affix is
// applied only when stripping the English affix leaves a KNOWN root, so derived
// words stay decipherable (root + affix), not random. Inflection (plural, tense,
// mood, question, emphasis) is returned as FEATURES; tense and mood are shown in
// the WRITTEN cat (its tail / eyes), not spoken, the way a cat shows mood.
const AFFIX = {
  agent: 'nyo',   // -er / -or / -ist : one who
  abstract: 'wa', // -ness / -tion / -ity : a state or quality
  adverb: 'li',   // -ly
  full: 'wim',    // -ful : with
  without: 'nim', // -less : not
  able: 'kan',    // -able / -ible : can
  like: 'na',     // -ish / -like / -y
  neg: 'ni',      // un- / in- / dis- / non- : opposite (prefix)
  redo: 'wi'      // re- : again (prefix)
};
const isRoot = (w) => LEXICON[w] !== undefined || CONCEPTS[w] !== undefined;
function firstRoot(stem) {
  const c = [stem, stem + 'e'];
  if (/([bdgklmnprt])\1$/.test(stem)) c.push(stem.slice(0, -1)); // running -> run
  if (stem.endsWith('i')) c.push(stem.slice(0, -1) + 'y');       // studi -> study
  for (const x of c) if (isRoot(x)) return x;
  return null;
}

// Analyse one English word -> { nya, features }.
export function analyze(token) {
  let w = String(token).toLowerCase();
  const feat = {};
  if (DROP.has(w)) return { nya: '', features: feat };
  if (isRoot(w)) return { nya: word(w), features: feat };

  let pre = '', suf = '', m;
  // prefixes (opposite / again) — only if the remainder is a known root
  if ((m = w.match(/^(?:un|in|im|il|ir|dis|non)(.+)$/)) && isRoot(m[1])) { feat.neg = true; pre = AFFIX.neg; w = m[1]; }
  else if ((m = w.match(/^re(.+)$/)) && isRoot(m[1])) { feat.redo = true; pre = AFFIX.redo; w = m[1]; }

  // inflection: plural, then tense (root must resolve)
  let r;
  if (/(?:ies|es|s)$/.test(w) && !/(?:ss|us|is)$/.test(w) && (r = firstRoot(w.replace(/ies$/, 'y').replace(/es$/, '').replace(/s$/, '')))) {
    feat.plural = true; suf = PLURAL + suf; w = r;
  } else if ((m = w.match(/^(.+?)ing$/)) && (r = firstRoot(m[1]))) { feat.tense = 'ongoing'; w = r; }
  else if ((m = w.match(/^(.+?)ed$/)) && (r = firstRoot(m[1]))) { feat.tense = 'past'; w = r; }

  // one derivational suffix (only if we still don't have a root)
  if (!isRoot(w)) {
    const rules = [
      [/^(.+?)(?:ness|ity|tion|sion|ment|ance|ence)$/, 'abstract'],
      [/^(.+?)(?:er|or)$/, 'agent'],
      [/^(.+?)ly$/, 'adverb'],
      [/^(.+?)ful$/, 'full'],
      [/^(.+?)less$/, 'without'],
      [/^(.+?)(?:able|ible)$/, 'able'],
      [/^(.+?)(?:ish|like)$/, 'like']
    ];
    for (const [re, key] of rules) {
      const mm = w.match(re);
      if (mm && (r = firstRoot(mm[1]))) { suf = AFFIX[key] + suf; if (key === 'agent') feat.agent = true; if (key === 'adverb') feat.adverb = true; w = r; break; }
    }
  }

  const base = word(w);
  return { nya: pre + base + suf, features: feat };
}

// Translate free English text into Nya, preserving numbers, punctuation, and
// capitalisation. A purr particle "nya" is added before clause-final . ! ?.
export function translate(text) {
  if (!text) return text;
  let out = text.replace(/[A-Za-z]+/g, (tok) => {
    const isCap = tok[0] >= 'A' && tok[0] <= 'Z';
    const nya = analyze(tok).nya;
    return isCap ? cap(nya) : nya;
  });
  out = out.replace(/\s{2,}/g, ' ').replace(/\s+([.,!?;:])/g, '$1').trim();
  out = out.replace(/\s*([.!?])(\s*)$/, ' nya$1');
  return out;
}

// Merge an extra dictionary (e.g. the generated 3000-word lexicon) into the core.
export function mergeLexicon(extra) {
  if (extra) for (const k in extra) if (LEXICON[k] === undefined) LEXICON[k] = extra[k];
}

export default { VERSION, LEXICON, ROOT_SOUND, composeSound, translate, word, analyze, fallbackWord, mergeLexicon };
