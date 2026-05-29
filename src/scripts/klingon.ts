// tlhIngan Hol: a small but real Klingon engine.
//
// The GRAMMAR follows the publicly documented Klingon language: Object-Verb-Subject
// word order, verb pronominal prefixes, noun number / possessive / type-5 suffixes,
// stative-verb adjectives after the noun, and pronoun-as-copula. These are factual
// rules (see e.g. the Klingon grammar overview on Wikipedia and klingon.wiki).
//
// The VOCABULARY is a curated set of common, widely-published words. The complete
// Klingon dictionary is copyrighted (Marc Okrand / Paramount), so this is
// deliberately limited; any word outside the set uses a Klingon-styled phonetic
// fallback. The result is grammatical for simple clauses and degrades gracefully.

type POS = 'n' | 'v' | 'adj' | 'pron' | 'num' | 'q' | 'conj' | 'adv';
interface Entry { k: string; pos: POS; being?: boolean; body?: boolean; }

// ---------- curated lexicon (English -> Klingon) ----------
const N = (k: string, x: Partial<Entry> = {}): Entry => ({ k, pos: 'n', ...x });
const V = (k: string): Entry => ({ k, pos: 'v' });
const A = (k: string): Entry => ({ k, pos: 'adj' });

const LEX: Record<string, Entry> = {
  // pronouns
  i: { k: 'jIH', pos: 'pron' }, me: { k: 'jIH', pos: 'pron' },
  you: { k: 'SoH', pos: 'pron' }, he: { k: 'ghaH', pos: 'pron' }, she: { k: 'ghaH', pos: 'pron' },
  him: { k: 'ghaH', pos: 'pron' }, her: { k: 'ghaH', pos: 'pron' }, it: { k: "'oH", pos: 'pron' },
  we: { k: 'maH', pos: 'pron' }, us: { k: 'maH', pos: 'pron' },
  they: { k: 'chaH', pos: 'pron' }, them: { k: 'chaH', pos: 'pron' },

  // nouns (beings): language-capable take -pu' / -wI'; body parts take -Du'
  person: N('nuv', { being: true }), human: N('Human', { being: true }), people: N('nuv', { being: true }),
  woman: N("be'", { being: true }), man: N('loD', { being: true }), child: N('puq', { being: true }),
  mother: N('SoS', { being: true }), father: N('vav', { being: true }),
  friend: N('jup', { being: true }), enemy: N('jagh', { being: true }), warrior: N("SuvwI'", { being: true }),
  student: N("ghojwI'", { being: true }), teacher: N("ghojmoHwI'", { being: true }),
  cat: N("vIghro'"), animal: N("Ha'DIbaH"), bird: N("bo'Degh"),
  heart: N('tIq'), eye: N('mIn', { body: true }), hand: N('ghop', { body: true }),
  foot: N('qam', { body: true }), head: N('nach', { body: true }),
  // nouns (things)
  water: N('bIQ'), fire: N('qul'), food: N('Soj'), language: N('Hol'), world: N("qo'"),
  day: N('jaj'), night: N('ram'), sun: N('jul'), star: N('Hov'), moon: N('maS'),
  sky: N('chal'), ground: N('yav'), land: N('yav'), ocean: N("bIQ'a'"), sea: N("bIQ'a'"),
  river: N('bIQtIq'), mountain: N('HuD'), hill: N('HuD'), tree: N('Sor'), forest: N('ngem'),
  stone: N('nagh'), rock: N('nagh'), name: N('pong'), home: N('juH'), house: N('juH'),
  city: N('veng'), country: N('Sep'), region: N('Sep'), empire: N("wo'"), road: N('He'), route: N('He'),
  book: N('paq'), word: N("mu'"), story: N('lut'), time: N('poH'), year: N('DIS'),
  month: N('jar'), week: N('Hogh'), hour: N('rep'), ship: N('Duj'), door: N('lojmIt'),
  room: N("pa'"), task: N("Qu'"), mission: N("Qu'"), duty: N("Qu'"), work: N("Qu'"), project: N("Qu'"),
  school: N('DuSaQ'), university: N('DuSaQ'), war: N('noH'), peace: N('roj'), truth: N('vIt'),
  strength: N('HoS'), power: N('HoS'), energy: N('HoS'), message: N('QIn'), news: N('QIn'),
  comment: N('QIn'), contact: N('QIn'), writing: N('ghItlh'), document: N('ghItlh'),
  journal: N('ghItlh'), blog: N('ghItlh'), post: N('ghItlh'), essay: N('ghItlh'),
  song: N('bom'), music: N('QoQ'), voice: N('ghogh'), mind: N('yab'), science: N('QeD'),
  journey: N('leng'), trip: N('leng'), tea: N('Dargh'), coffee: N("qa'vIn"), money: N('Huch'),

  // verbs
  see: V('legh'), watch: V('bej'), look: V('bej'), know: V('Sov'), study: V('HaD'),
  learn: V('ghoj'), teach: V('ghojmoH'), speak: V('jatlh'), say: V('jatlh'), talk: V('jatlh'),
  want: V('neH'), go: V('ghoS'), come: V('ghoS'), travel: V('leng'), eat: V('Sop'),
  drink: V('tlhutlh'), sleep: V('Qong'), live: V('yIn'), die: V('Hegh'), make: V('chenmoH'),
  build: V('chenmoH'), create: V('chenmoH'), do: V('ruch'), give: V('nob'), read: V('laD'),
  write: V('ghItlh'), think: V('Qub'), love: V("muSHa'"), help: V('QaH'), change: V('choH'),
  find: V("tu'"), discover: V("tu'"), succeed: V('Qap'), sell: V('ngev'), fight: V('Suv'),
  fly: V('puv'), run: V('qet'), hear: V('Qoy'), seek: V('nej'), search: V('nej'),
  explore: V('nej'), research: V('nej'), play: V('reH'), sing: V('bom'), get: V('Suq'),
  obtain: V('Suq'), choose: V('wIv'), select: V('wIv'), view: V('bej'),

  // adjectives (stative verbs, follow the noun)
  big: A('tIn'), large: A('tIn'), great: A('Dun'), wonderful: A('Dun'), small: A('mach'),
  little: A('mach'), good: A('QaQ'), bad: A('qab'), new: A("chu'"), latest: A("chu'"),
  recent: A("chu'"), old: A("ngo'"), long: A('tIq'), short: A('ngaj'), happy: A('Quch'),
  strong: A('HoS'), hot: A('tuj'), cold: A('bIr'), dark: A('Hurgh'), high: A('jen'),
  beautiful: A("'IH"), young: A('Qup'), quiet: A('tam'), true: A('teH'), many: A("law'"), more: A("law'"), few: A('puS'),

  // numbers
  one: { k: "wa'", pos: 'num' }, two: { k: "cha'", pos: 'num' }, three: { k: 'wej', pos: 'num' },
  four: { k: 'loS', pos: 'num' }, five: { k: 'vagh', pos: 'num' }, six: { k: 'jav', pos: 'num' },
  seven: { k: 'Soch', pos: 'num' }, eight: { k: 'chorgh', pos: 'num' }, nine: { k: 'Hut', pos: 'num' },
  ten: { k: "wa'maH", pos: 'num' }, zero: { k: 'pagh', pos: 'num' }, hundred: { k: 'vatlh', pos: 'num' },

  // question words / conjunctions / adverbs / interjections
  what: { k: 'nuq', pos: 'q' }, who: { k: "'Iv", pos: 'q' }, where: { k: 'nuqDaq', pos: 'q' },
  when: { k: 'ghorgh', pos: 'q' }, why: { k: 'qatlh', pos: 'q' }, how: { k: "chay'", pos: 'q' },
  and: { k: 'je', pos: 'conj' }, or: { k: 'joq', pos: 'conj' }, but: { k: "'ach", pos: 'conj' },
  yes: { k: 'HISlaH', pos: 'adv' }, now: { k: 'DaH', pos: 'adv' }, here: { k: 'naDev', pos: 'adv' },
  today: { k: 'DaHjaj', pos: 'adv' }, always: { k: 'reH', pos: 'adv' },
  hello: { k: 'nuqneH', pos: 'adv' }, hi: { k: 'nuqneH', pos: 'adv' },
  thanks: { k: "qatlho'", pos: 'adv' }, welcome: { k: 'nuqneH', pos: 'adv' }
};

// possessive determiner -> {thing-suffix, being-suffix}
const POSS: Record<string, { t: string; b: string }> = {
  my: { t: 'wIj', b: "wI'" }, your: { t: 'lIj', b: "lI'" }, his: { t: 'Daj', b: 'Daj' },
  her: { t: 'Daj', b: 'Daj' }, its: { t: 'Daj', b: 'Daj' }, our: { t: 'maj', b: "ma'" },
  their: { t: 'chaj', b: 'chaj' }
};
// preposition -> type-5 noun suffix
const PREP: Record<string, string> = {
  in: 'Daq', on: 'Daq', at: 'Daq', into: 'Daq', to: 'Daq', about: "'e'",
  from: "vo'", for: 'vaD', because: "mo'", of: '' // "of"/"about" handled specially
};
// verb pronominal prefixes [subject][object]; '' = null prefix (Ø)
const PREFIX: Record<string, Record<string, string>> = {
  I:    { none: 'jI', it: 'vI', them: 'vI', you: 'qa', us: '', me: '' },
  you:  { none: 'bI', it: 'Da', them: 'Da', me: 'cho', us: 'ju' },
  he:   { none: '', it: '', them: '', me: 'mu', you: 'Du', us: 'nu' },
  we:   { none: 'ma', it: 'wI', them: 'DI', you: 'pI', me: '' },
  youpl:{ none: 'Su', it: 'bo', them: 'bo', me: 'tu', us: 'che' },
  they: { none: '', it: 'lu', them: '', me: 'mu', you: 'nI', us: 'nu' }
};
const PRON_PERSON: Record<string, string> = {
  i: 'I', we: 'we', you: 'you', he: 'he', she: 'he', it: 'he', they: 'they'
};
const ARTICLES = new Set(['a', 'an', 'the']);
const NEG = new Set(['not', "don't", "doesn't", "didn't", "won't", "isn't", "aren't", 'no']);
const ABILITY = new Set(['can', 'could', 'able']);
const COPULA = new Set(['is', 'am', 'are', 'be', 'was', 'were', "'s"]);

// ---------- phonetic fallback (Klingon-flavoured) ----------
const POOL = ['tlha', 'gha', 'Qo', 'vagh', 'wIj', 'tlhI', 'ngan', 'Daq', 'qu', 'jaq', 'vetlh', 'HoS',
  'batlh', 'Suv', 'qey', 'maH', 'tlhuH', 'yIn', 'Qel', 'tagh', "wo'", 'cha', 'ghor', 'meH', 'vam', 'Daj', 'logh'];
function hashWord(w: string): number {
  let h = 2166136261;
  for (let i = 0; i < w.length; i++) { h ^= w.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h >>> 0;
}
function fallback(word: string): string {
  const n = word.length <= 4 ? 1 : 2;
  let h = hashWord(word.toLowerCase());
  let out = '';
  for (let i = 0; i < n; i++) { out += POOL[h % POOL.length]; h = (Math.floor(h / POOL.length) + 0x9e3779b9 + i) >>> 0; }
  return out;
}

// ---------- noun morphology ----------
function plural(e: Entry): string {
  return e.k + (e.being ? "pu'" : e.body ? "Du'" : 'mey');
}
function nounForm(token: string): { k: string; plural: boolean } {
  const lw = token.toLowerCase();
  if (LEX[lw] && LEX[lw].pos === 'n') return { k: LEX[lw].k, plural: false };
  // english plural -> singular lookup
  for (const cut of ['s', 'es']) {
    if (lw.endsWith(cut)) {
      const base = lw.slice(0, -cut.length);
      if (LEX[base] && LEX[base].pos === 'n') return { k: plural(LEX[base]), plural: true };
    }
  }
  if (lw.endsWith('ies')) {
    const base = lw.slice(0, -3) + 'y';
    if (LEX[base] && LEX[base].pos === 'n') return { k: plural(LEX[base]), plural: true };
  }
  return { k: fallback(token), plural: false };
}
function lookup(token: string): Entry | null {
  const lw = token.toLowerCase();
  if (LEX[lw]) return LEX[lw];
  for (const cut of ['s', 'es']) {
    if (lw.endsWith(cut) && LEX[lw.slice(0, -cut.length)]) return LEX[lw.slice(0, -cut.length)];
  }
  return null;
}

// Translate a noun phrase (array of english tokens) honouring articles, possessives,
// prepositions, plurals, and adjective-after-noun order. Returns Klingon tokens.
function translateNP(tokens: string[]): string[] {
  const out: string[] = [];
  let pend: string[] = []; // leading adjectives, emitted AFTER their noun (stative verbs follow)
  const pushNoun = (k: string) => { out.push(k); out.push(...pend); pend = []; };
  for (let i = 0; i < tokens.length; i++) {
    const lw = tokens[i].toLowerCase();
    if (ARTICLES.has(lw)) continue;
    if (POSS[lw]) {
      // possessive determiner + (adjs) + noun -> noun+poss + adjs
      let j = i + 1;
      const adjs: string[] = [];
      while (j < tokens.length && lookup(tokens[j])?.pos === 'adj') { adjs.push(LEX[tokens[j].toLowerCase()].k); j++; }
      if (j < tokens.length) {
        const e = lookup(tokens[j]);
        const head = e && e.pos === 'n' ? e.k : fallback(tokens[j]);
        const being = !!(e && e.pos === 'n' && e.being);
        out.push(head + (being ? POSS[lw].b : POSS[lw].t));
        out.push(...adjs);
        i = j;
      } else { out.push(lw === 'my' ? 'jIH' : 'SoH'); }
      continue;
    }
    if (PREP[lw] !== undefined && i + 1 < tokens.length) {
      // preposition + (possessive?) noun/pronoun -> word + suffixes (drop articles)
      let j = i + 1;
      const suf = PREP[lw] || '';
      while (j < tokens.length && ARTICLES.has(tokens[j].toLowerCase())) j++;
      const pdet = tokens[j] ? POSS[tokens[j].toLowerCase()] : undefined;
      if (pdet) {
        j++;
        const e = lookup(tokens[j] || '');
        const head = e && e.pos === 'n' ? e.k : fallback(tokens[j] || '');
        const being = !!(e && e.pos === 'n' && e.being);
        out.push(head + (being ? pdet.b : pdet.t) + suf);
        i = j;
        continue;
      }
      const nx = tokens[j] || '';
      const en = lookup(nx);
      const base = en && en.pos === 'pron' ? en.k : nounForm(nx).k;
      out.push(base + suf);
      i = j;
      continue;
    }
    const e = lookup(tokens[i]);
    if (e && e.pos === 'adj') { pend.push(e.k); continue; }
    if (e && e.pos === 'n') { pushNoun(nounForm(tokens[i]).k); continue; }
    if (e) { out.push(e.k); continue; }
    out.push(fallback(tokens[i]));
  }
  out.push(...pend);
  return out;
}

// object key for the prefix table, from the object tokens
function objectKey(tokens: string[]): string {
  if (!tokens.length) return 'none';
  const lw = tokens[tokens.length - 1].toLowerCase();
  if (lw === 'me') return 'me';
  if (lw === 'us') return 'us';
  if (lw === 'you') return 'you';
  if (lw === 'them' || lw === 'they') return 'them';
  // a thing/being object: plural -> them, else it
  const nf = nounForm(tokens[tokens.length - 1]);
  return nf.plural ? 'them' : 'it';
}

// Translate one clause (already split on sentence punctuation).
function translateClause(raw: string): string {
  const words = raw.match(/[A-Za-z']+/g);
  if (!words || !words.length) return raw.trim();

  // find the (first) verb and a leading subject pronoun
  let verbIdx = -1;
  for (let i = 0; i < words.length; i++) { if (lookup(words[i])?.pos === 'v') { verbIdx = i; break; } }

  // copula clause: "X is/are Y" -> "Y X(pronoun)"
  const copIdx = words.findIndex((w) => COPULA.has(w.toLowerCase()));
  if (verbIdx === -1 && copIdx > -1) {
    const left = words.slice(0, copIdx);
    const right = words.slice(copIdx + 1);
    const subjPron = left.length === 1 && lookup(left[0])?.pos === 'pron' ? lookup(left[0])!.k : translateNP(left).join(' ');
    const comp = translateNP(right).join(' ');
    return [comp, subjPron].filter(Boolean).join(' ');
  }

  if (verbIdx > -1) {
    const verb = lookup(words[verbIdx])!;
    const before = words.slice(0, verbIdx);
    const after = words.slice(verbIdx + 1);
    // negation / ability markers anywhere adjacent
    const neg = words.some((w) => NEG.has(w.toLowerCase()));
    const abil = before.some((w) => ABILITY.has(w.toLowerCase()));
    // subject: a leading pronoun?
    const subjTok = before.find((w) => PRON_PERSON[w.toLowerCase()]);
    const subjPerson = subjTok ? PRON_PERSON[subjTok.toLowerCase()] : null;
    const subjNounTokens = before.filter((w) => !PRON_PERSON[w.toLowerCase()] && !ARTICLES.has(w.toLowerCase()) && !ABILITY.has(w.toLowerCase()) && !NEG.has(w.toLowerCase()));
    const objTokens = after.filter((w) => !NEG.has(w.toLowerCase()));

    let person = subjPerson;
    let oKey = objectKey(objTokens);
    if (!person) {
      if (subjNounTokens.length) person = 'he'; // 3rd person noun subject
      else { // imperative
        const objNP = translateNP(objTokens);
        const imp = 'yI' + verb.k + (neg ? "Qo'" : '');
        return [...objNP, imp].filter(Boolean).join(' ');
      }
    }
    const pre = (PREFIX[person] && PREFIX[person][oKey] !== undefined) ? PREFIX[person][oKey] : (PREFIX[person]?.none ?? '');
    const verbStr = pre + verb.k + (abil ? 'laH' : '') + (neg ? "be'" : '');
    const objNP = translateNP(objTokens);
    const subjNP = subjPerson ? [] : translateNP(subjNounTokens); // drop pronoun subject
    // OVS: object, verb, subject
    return [...objNP, verbStr, ...subjNP].filter(Boolean).join(' ');
  }

  // no verb, no copula: plain noun phrase
  return translateNP(words).join(' ');
}

export function toKlingon(text: string): string {
  if (!text) return text;
  // split into clauses on sentence punctuation, keep the delimiters
  const parts = text.split(/([.!?;:,]+)/);
  let out = '';
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 1) { out += parts[i]; continue; } // delimiter
    const seg = parts[i];
    if (!seg.trim()) { out += seg; continue; }
    const lead = (seg.match(/^\s*/) || [''])[0];
    const trail = (seg.match(/\s*$/) || [''])[0];
    try { out += lead + translateClause(seg) + trail; }
    catch { out += lead + seg.trim().replace(/[A-Za-z']+/g, (w) => (lookup(w)?.k ?? fallback(w))) + trail; }
  }
  return out.replace(/[ \t]{2,}/g, ' ').trim();
}

export default { toKlingon };
