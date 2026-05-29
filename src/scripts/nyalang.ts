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

export const VERSION = '0.1.0';

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
export function word(w) {
  if (DROP.has(w)) return '';
  if (LEXICON[w] !== undefined) return LEXICON[w];
  // simple plural: trailing -s on a known singular -> base + -mi
  if (w.length > 2 && w.endsWith('s')) {
    const base = w.slice(0, -1);
    if (LEXICON[base] !== undefined) return LEXICON[base] + PLURAL;
    if (DROP.has(base)) return '';
  }
  return fallbackWord(w);
}

// Translate free English text into Nya, preserving numbers, punctuation, and
// capitalisation. A purr particle "nya" is added before clause-final . ! ?.
export function translate(text) {
  if (!text) return text;
  let out = text.replace(/[A-Za-z]+/g, (tok) => {
    const isCap = tok[0] >= 'A' && tok[0] <= 'Z';
    const nya = word(tok.toLowerCase());
    return isCap ? cap(nya) : nya;
  });
  out = out.replace(/\s{2,}/g, ' ').replace(/\s+([.,!?;:])/g, '$1').trim();
  out = out.replace(/\s*([.!?])(\s*)$/, ' nya$1');
  return out;
}

export default { VERSION, LEXICON, translate, word, fallbackWord };
