// Nya logograms: an Arrival-inspired, compositional writing system.
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
  tool: ['made', 'self'], gift: ['made', 'feel'], letter: ['speak', 'made'], message: ['speak', 'flow'], paper: ['made', 'speak'],

  // ---------- hand-curated vocabulary, batch 2 (deliberately composed) ----------
  // emotion & mind
  pride: ['feel', 'big', 'self'], shame: ['feel', 'not', 'see'], envy: ['feel', 'not', 'many'],
  gratitude: ['feel', 'speak', 'feel'], patience: ['feel', 'not', 'change'], mercy: ['feel', 'not', 'big'],
  grief: ['feel', 'not', 'life'], delight: ['feel', 'light'], longing: ['feel', 'flow', 'not'],
  awe: ['feel', 'big', 'see'], curiosity: ['see', 'feel', 'change'], comfort: ['feel', 'place'],
  worry: ['feel', 'change', 'not'], relief: ['feel', 'not', 'flow'], desire: ['feel', 'flow', 'big'],
  regret: ['feel', 'change', 'not'], sorrow: ['feel', 'water'], bliss: ['feel', 'light', 'big'],
  dread: ['feel', 'not', 'change'], mood: ['feel', 'change'], spirit: ['feel', 'light', 'not'],
  soul: ['self', 'feel', 'light'], joy: ['feel', 'light', 'big'], fear: ['feel', 'not'], calm: ['feel', 'not', 'flow'],
  // body
  knee: ['self', 'flow'], shoulder: ['self', 'big'], chest: ['self', 'feel'],
  belly: ['self', 'life'], neck: ['self', 'small', 'flow'], lip: ['self', 'speak', 'small'], cheek: ['self', 'feel', 'place'],
  chin: ['self', 'small'], brow: ['self', 'see'], palm: ['self', 'made'], nail: ['self', 'made', 'small'],
  throat: ['self', 'speak', 'flow'], spine: ['self', 'place', 'many'], lung: ['self', 'flow', 'life'],
  vein: ['self', 'water', 'flow'], pulse: ['self', 'flow', 'change'], wound: ['self', 'not', 'life'],
  scar: ['self', 'change', 'not'], muscle: ['self', 'big', 'flow'], bone: ['self', 'made'], blood: ['water', 'life'],
  // people & kin
  uncle: ['being', 'big', 'flow'], aunt: ['being', 'feel', 'flow'], cousin: ['being', 'flow', 'many'],
  twin: ['being', 'self', 'self'], elder: ['being', 'change', 'big'], youth: ['being', 'small', 'life'],
  stranger: ['being', 'not', 'see'], crowd: ['being', 'many', 'big'], couple: ['being', 'self', 'feel'],
  partner: ['being', 'feel', 'made'], hero: ['being', 'big', 'feel'], fool: ['being', 'not', 'see'],
  sage: ['being', 'see', 'big'], judge: ['being', 'see', 'made'], priest: ['being', 'feel', 'light'],
  soldier: ['being', 'made', 'not'], farmer: ['being', 'life', 'made'], sailor: ['being', 'water', 'flow'],
  smith: ['being', 'made', 'light'], healer: ['being', 'life', 'feel'], thief: ['being', 'not', 'made'],
  servant: ['being', 'made', 'small'], chief: ['being', 'big', 'made'], nation: ['being', 'many', 'place'],
  tribe: ['being', 'many', 'feel'], clan: ['being', 'many', 'self'], crew: ['being', 'many', 'made'],
  // nature
  dawn: ['light', 'change', 'small'], dusk: ['light', 'not', 'change'], twilight: ['light', 'small', 'not'],
  horizon: ['place', 'light', 'flow'], mist: ['water', 'light', 'small'], fog: ['water', 'light', 'not'],
  frost: ['water', 'not', 'small'], dew: ['water', 'small', 'life'], rainbow: ['water', 'light', 'many'],
  thunder: ['speak', 'big', 'light'], lightning: ['light', 'big', 'flow'], flood: ['water', 'big', 'flow'],
  drought: ['not', 'water', 'place'], gorge: ['place', 'water', 'big'], peak: ['place', 'big', 'light'],
  summit: ['place', 'big', 'see'], plain: ['place', 'big'], swamp: ['water', 'place', 'life'],
  marsh: ['water', 'place', 'many'], glacier: ['water', 'not', 'big'], volcano: ['place', 'light', 'big'],
  ember: ['light', 'small', 'change'], flame: ['light', 'flow'], spark: ['light', 'small'], current: ['water', 'flow', 'big'],
  ripple: ['water', 'flow', 'small'], foam: ['water', 'light', 'many'], pebble: ['place', 'small'], canyon: ['place', 'water', 'not'],
  reef: ['water', 'place', 'life'], moss: ['life', 'water', 'small'], cliff: ['place', 'big'], cave: ['place', 'not', 'light'],
  // animals
  tiger: ['being', 'big', 'see'], eagle: ['being', 'see', 'light'], hawk: ['being', 'see', 'flow'],
  dove: ['being', 'feel', 'flow'], crow: ['being', 'not', 'light'], swan: ['being', 'water', 'feel'],
  duck: ['being', 'water', 'small'], sheep: ['being', 'many', 'small'], goat: ['being', 'place', 'big'],
  pig: ['being', 'life', 'big'], rat: ['being', 'small', 'not'], bat: ['being', 'not', 'light'],
  ant: ['being', 'small', 'many'], spider: ['being', 'small', 'made'], worm: ['being', 'small', 'place'],
  crab: ['being', 'water', 'made'], shark: ['being', 'water', 'not'], dolphin: ['being', 'water', 'feel'],
  seal: ['being', 'water', 'feel'], otter: ['being', 'water', 'flow'], squirrel: ['being', 'small', 'life'],
  nest: ['place', 'life', 'made'], hive: ['place', 'made', 'many'], den: ['place', 'not', 'light'],
  herd: ['being', 'many', 'place'], flock: ['being', 'many', 'flow'], swarm: ['being', 'small', 'many'],
  feather: ['life', 'light', 'small'], shell: ['life', 'made', 'place'],
  horn: ['being', 'made', 'big'], hoof: ['being', 'place', 'made'], beak: ['being', 'made', 'small'],
  // food & drink
  wine: ['water', 'life', 'feel'], honey: ['life', 'feel', 'small'], cheese: ['life', 'made', 'small'],
  butter: ['life', 'made', 'feel'], oil: ['life', 'flow'], grain: ['life', 'small', 'many'], wheat: ['life', 'small', 'big'],
  corn: ['life', 'big', 'many'], bean: ['life', 'small', 'place'], nut: ['life', 'made', 'small'], berry: ['life', 'feel', 'small'],
  spice: ['life', 'feel', 'change'], pepper: ['life', 'small', 'not'], herb: ['life', 'small', 'feel'], broth: ['water', 'life', 'feel'],
  cake: ['life', 'made', 'feel'], feast: ['life', 'made', 'many'], hunger: ['not', 'life', 'feel'], thirst: ['not', 'water', 'feel'],
  taste: ['feel', 'life', 'see'], sweet: ['feel', 'life'], sour: ['feel', 'not', 'life'], bitter: ['feel', 'not'], ripe: ['life', 'change', 'feel'],
  // society, belief & abstract
  empire: ['place', 'big', 'made'], kingdom: ['place', 'big', 'being'], realm: ['place', 'big'], border: ['place', 'not', 'flow'],
  throne: ['made', 'big', 'place'], crown: ['made', 'big', 'light'], flag: ['made', 'speak', 'place'], army: ['being', 'many', 'made'],
  weapon: ['made', 'not', 'life'], shield: ['made', 'place', 'feel'], arrow: ['made', 'flow', 'small'], spear: ['made', 'flow', 'big'],
  knife: ['made', 'small', 'not'], armor: ['made', 'place', 'self'], battle: ['big', 'not', 'many'], victory: ['big', 'self', 'feel'],
  defeat: ['not', 'self', 'feel'], treaty: ['speak', 'made', 'feel'], debt: ['made', 'not', 'many'], tax: ['made', 'flow', 'not'],
  gold: ['made', 'light', 'big'], silver: ['made', 'light', 'small'], coin: ['made', 'small', 'many'], gem: ['made', 'light', 'place'],
  treasure: ['made', 'many', 'feel'], promise: ['speak', 'feel', 'change'], oath: ['speak', 'feel', 'big'], lie: ['speak', 'not', 'see'],
  faith: ['feel', 'see', 'not'], prayer: ['speak', 'feel', 'light'], god: ['big', 'light', 'life'], heaven: ['place', 'light', 'big'],
  hell: ['place', 'not', 'light'], fate: ['change', 'not', 'self'], destiny: ['change', 'big', 'self'], luck: ['change', 'feel', 'small'],
  fortune: ['change', 'feel', 'many'], magic: ['made', 'not', 'see'], spell: ['speak', 'made', 'not'], charm: ['feel', 'made', 'small'],
  curse: ['speak', 'not', 'feel'], vision: ['see', 'light', 'change'], myth: ['speak', 'many', 'change'], legend: ['speak', 'big', 'change'],
  riddle: ['speak', 'see', 'not'], game: ['feel', 'made', 'flow'], toy: ['made', 'small', 'feel'], festival: ['many', 'feel', 'light'],
  ritual: ['made', 'feel', 'change'], tradition: ['change', 'many', 'feel'], custom: ['made', 'many', 'change'], culture: ['made', 'feel', 'many'],
  // verbs
  run: ['flow', 'big'], walk: ['flow', 'place'], jump: ['flow', 'light'], swim: ['flow', 'water'], fly: ['flow', 'light'],
  climb: ['flow', 'big', 'place'], fall: ['flow', 'place', 'not'], throw: ['flow', 'made', 'big'], catch: ['made', 'flow', 'self'],
  hold: ['self', 'made', 'feel'], push: ['flow', 'made', 'not'], pull: ['flow', 'made', 'self'], cut: ['made', 'not', 'small'],
  tie: ['made', 'flow', 'many'], finish: ['not', 'change', 'made'], lose: ['not', 'self'], search: ['see', 'flow', 'many'],
  laugh: ['feel', 'speak', 'light'], cry: ['feel', 'water'], weep: ['feel', 'water', 'flow'], smile: ['feel', 'speak'],
  breathe: ['self', 'flow', 'life'], kill: ['not', 'life', 'made'], save: ['life', 'feel', 'place'], count: ['many', 'see', 'made'], measure: ['made', 'see', 'many'],
  // qualities
  false: ['not', 'see'], ugly: ['not', 'feel'], cruel: ['not', 'feel', 'big'], afraid: ['feel', 'not'],
  evil: ['not', 'life', 'feel'], safe: ['place', 'feel', 'not'], dangerous: ['not', 'place', 'feel'], strange: ['not', 'see', 'change'],
  common: ['many', 'place'], rare: ['small', 'not', 'many'], ready: ['change', 'feel', 'flow'], tired: ['not', 'flow', 'feel'],
  busy: ['many', 'flow', 'made'], heavy: ['big', 'place'],
  // time
  century: ['change', 'big', 'many'], instant: ['change', 'small'], always: ['change', 'big', 'flow'], never: ['not', 'change'],
  often: ['change', 'many'], early: ['change', 'small', 'light'], late: ['change', 'big'], soon: ['change', 'small', 'flow'],
  begin: ['change', 'small'], end: ['not', 'change']
};

// ---------- hand-curated vocabulary, batch 3 (deliberately composed) ----------
// Merged (not overwriting) so each is a designed meaning, not an inference.
const CONCEPTS_B3 = {
  // direction & space
  north: ['place', 'not', 'light'], south: ['place', 'light'], east: ['place', 'light', 'change'], west: ['place', 'not', 'change'],
  up: ['flow', 'big'], down: ['flow', 'place'], left: ['place', 'not'], right2: ['place', 'made'],
  center: ['place', 'self'], edge: ['place', 'not', 'flow'], corner: ['place', 'made', 'not'], side: ['place', 'small'],
  top: ['big', 'place'], bottom: ['small', 'place'], front: ['place', 'see'], near: ['place', 'feel'], far: ['place', 'flow', 'big'],
  inside: ['place', 'self'], outside: ['place', 'not', 'self'], between: ['place', 'flow', 'many'], distance: ['place', 'flow', 'big'],
  // color
  red: ['light', 'feel'], blue: ['light', 'water'], green: ['light', 'life'], yellow: ['light', 'big'],
  white: ['light', 'many'], black: ['not', 'light'], grey: ['light', 'not', 'small'], brown: ['place', 'life', 'not'],
  gold2: ['light', 'made', 'big'], pink: ['light', 'feel', 'small'], purple: ['light', 'feel', 'big'], color2: ['light', 'many'],
  // clothing & cloth
  cloth: ['made', 'flow', 'many'], robe: ['made', 'self', 'big'], shirt: ['made', 'self'], shoe: ['made', 'flow', 'place'],
  hat: ['made', 'self', 'big'], glove: ['made', 'self', 'small'], belt: ['made', 'self', 'flow'], cloak: ['made', 'self', 'not'],
  thread: ['made', 'flow', 'small'], string: ['made', 'flow'], rope: ['made', 'flow', 'big'], knot: ['made', 'flow', 'place'],
  // tools & objects
  hammer: ['made', 'big', 'not'], blade: ['made', 'not', 'small'], axe: ['made', 'not', 'big'], saw: ['made', 'not', 'many'],
  needle: ['made', 'small', 'not'], hook: ['made', 'flow', 'self'], chain: ['made', 'many', 'flow'], lock: ['made', 'not', 'change'],
  wheel: ['made', 'flow', 'change'], pot: ['made', 'place', 'water'], cup: ['made', 'water', 'small'], bowl: ['made', 'place', 'small'],
  plate: ['made', 'place', 'flow'], jar: ['made', 'place'], basket: ['made', 'many', 'place'], box: ['made', 'place', 'not'],
  bag: ['made', 'place', 'self'], candle: ['made', 'light', 'small'], torch: ['made', 'light', 'big'], drum: ['made', 'speak', 'big'],
  bell: ['made', 'speak', 'light'], flute: ['made', 'speak', 'flow'], brush: ['made', 'flow', 'feel'], pen: ['made', 'speak', 'flow'],
  // building & dwelling
  roof: ['made', 'place', 'big'], floor: ['made', 'place'], gate: ['made', 'place', 'change'], stair: ['made', 'flow', 'place'],
  pillar: ['made', 'big', 'place'], hall: ['place', 'big', 'made'], castle: ['place', 'big', 'made'], hut: ['place', 'small', 'made'],
  tent: ['made', 'place', 'flow'], barn: ['place', 'made', 'life'], well: ['place', 'water', 'made'], fence: ['made', 'place', 'not'],
  // science & abstract
  number2: ['many', 'made'], shape: ['made', 'see'], line: ['flow', 'made'], circle: ['made', 'flow', 'big'],
  point2: ['small', 'place'], space: ['place', 'big', 'not'], matter: ['made', 'place'], force: ['flow', 'big'],
  weight: ['big', 'place'], speed: ['flow', 'big', 'change'], heat: ['light', 'big', 'feel'], cold2: ['not', 'light', 'feel'],
  reason: ['see', 'change'], logic: ['see', 'made'], proof: ['see', 'made', 'big'], theory: ['see', 'many', 'change'],
  fact: ['see', 'place'], cause: ['change', 'flow'], effect: ['change', 'made'], pattern: ['see', 'many', 'made'],
  balance: ['made', 'feel', 'place'], order2: ['made', 'many', 'place'], chaos: ['not', 'made', 'many'], energy2: ['light', 'flow', 'big'],
  // mind & communication
  thought: ['see', 'change', 'self'], belief: ['feel', 'see'], doubt: ['feel', 'not', 'see'], wisdom: ['see', 'big', 'change'],
  knowledge: ['see', 'many'], skill: ['made', 'self', 'change'], art2: ['made', 'feel'], craft: ['made', 'self', 'feel'],
  voice2: ['speak', 'self'], echo: ['speak', 'change', 'flow'], silence: ['not', 'speak'], whisper: ['speak', 'small'],
  shout: ['speak', 'big'], question2: ['speak', 'change'], reply: ['speak', 'self', 'change'], debate: ['speak', 'many', 'not'],
  poem: ['speak', 'feel', 'many'], verse: ['speak', 'feel', 'small'], rhyme: ['speak', 'feel', 'change'], lyric: ['speak', 'feel', 'light'],
  // verbs (more)
  give2: ['made', 'flow', 'feel'], send: ['flow', 'made', 'big'], bring: ['flow', 'self', 'made'], keep: ['place', 'self', 'not'],
  drop: ['flow', 'place', 'small'], lift: ['flow', 'big', 'self'], bend: ['change', 'flow', 'made'], turn: ['change', 'flow'],
  spin: ['flow', 'change', 'big'], shake: ['flow', 'change', 'small'], press: ['made', 'big', 'place'], rub: ['made', 'flow', 'feel'],
  pour: ['water', 'flow', 'down'], fill: ['big', 'many', 'place'], empty2: ['not', 'many', 'place'], join: ['many', 'flow', 'feel'],
  split: ['not', 'made', 'many'], mix: ['many', 'flow', 'change'], burn: ['light', 'change', 'not'], freeze: ['water', 'not', 'change'],
  melt: ['water', 'change', 'flow'], shine: ['light', 'flow'], glow: ['light', 'small', 'feel'], fade: ['not', 'light', 'change'],
  // qualities (more)
  smooth: ['flow', 'feel'], rough: ['not', 'flow', 'place'], sharp2: ['made', 'small', 'not'], dull: ['not', 'made', 'feel'],
  wet: ['water', 'feel'], dry: ['not', 'water'], soft: ['feel', 'small', 'flow'], firm: ['made', 'place', 'big'],
  loud: ['speak', 'big'], faint: ['small', 'not', 'light'], wild: ['life', 'not', 'made'], tame: ['made', 'feel', 'life'],
  pure: ['light', 'self', 'not'], holy: ['big', 'feel', 'light'], plain2: ['place', 'not', 'feel'], fancy: ['made', 'feel', 'many'],
  // social & life
  birth2: ['life', 'change', 'small'], death2: ['not', 'life'], marriage: ['being', 'feel', 'made'], funeral: ['being', 'not', 'life'],
  feast2: ['life', 'made', 'many'], work2: ['made', 'self', 'flow'], play2: ['feel', 'flow'], travel: ['flow', 'self', 'big'],
  trade2: ['made', 'flow', 'many'], gift2: ['made', 'feel', 'flow'], help2: ['feel', 'self', 'flow'], harm: ['not', 'feel', 'self'],
  freedom2: ['not', 'made', 'big'], slavery: ['made', 'not', 'self'], wealth: ['made', 'many', 'big'], poverty: ['not', 'made', 'many'],
  // weather & sky (more)
  breeze: ['flow', 'small', 'feel'], gale: ['flow', 'big', 'not'], hail: ['water', 'not', 'small'], sunrise: ['light', 'change', 'big'],
  sunset: ['light', 'not', 'change'], shadow2: ['not', 'light', 'place'], cloud2: ['water', 'light', 'flow'], season2: ['change', 'many']
};
for (const k in CONCEPTS_B3) if (!(k in CONCEPTS)) CONCEPTS[k] = CONCEPTS_B3[k];

// ---------- hand-curated vocabulary, batch 4 (deliberately composed) ----------
const CONCEPTS_B4 = {
  // academic fields & study
  history: ['see', 'change', 'many'], geography: ['place', 'see', 'many'], biology: ['life', 'see', 'many'],
  chemistry: ['made', 'change', 'see'], physics: ['place', 'made', 'see'], mathematics: ['many', 'see', 'made'],
  medicine: ['life', 'feel', 'made'], philosophy: ['see', 'feel', 'big'], psychology: ['self', 'feel', 'see'],
  economy: ['made', 'many', 'flow'], politics: ['being', 'many', 'made'], language: ['speak', 'many'],
  grammar: ['speak', 'made', 'many'], music: ['speak', 'feel', 'flow'], poetry: ['speak', 'feel', 'many'],
  ecology: ['life', 'place', 'many'], geology: ['place', 'see', 'change'], astronomy: ['light', 'see', 'big'],
  // abstract concepts
  truth: ['see', 'place'], meaning: ['speak', 'see'], purpose: ['see', 'flow', 'big'], value: ['feel', 'big', 'made'],
  quality: ['made', 'feel'], quantity: ['many', 'made'], unity: ['self', 'big'], harmony: ['feel', 'many', 'flow'],
  freedom3: ['not', 'made', 'flow'], duty2: ['made', 'self', 'feel'], honor: ['feel', 'big', 'see'], glory: ['light', 'big', 'feel'],
  beauty: ['feel', 'light', 'see'], chaos2: ['not', 'made', 'flow'], void: ['not', 'place'], whole: ['big', 'self'],
  origin: ['change', 'small', 'place'], future: ['change', 'flow', 'big'], memory: ['see', 'change', 'self'], dream3: ['see', 'feel', 'not'],
  // finer emotions & states
  hope3: ['feel', 'light', 'flow'], trust: ['feel', 'see', 'place'], peace2: ['feel', 'not', 'flow'], rage: ['feel', 'big', 'not'],
  jealousy: ['feel', 'not', 'self'], loneliness: ['self', 'not', 'feel'], nostalgia: ['feel', 'change', 'place'], passion: ['feel', 'big', 'light'],
  serenity: ['feel', 'not', 'change'], boredom: ['not', 'feel', 'change'], confusion: ['not', 'see', 'many'], wonder2: ['feel', 'see', 'big'],
  // plants
  oak: ['life', 'big', 'place'], pine: ['life', 'big', 'not'], willow: ['life', 'water', 'flow'], bamboo: ['life', 'big', 'small'],
  rose: ['life', 'feel', 'big'], lily: ['life', 'feel', 'water'], lotus: ['life', 'feel', 'water'], fern: ['life', 'small', 'many'],
  vine: ['life', 'flow', 'place'], reed: ['life', 'water', 'small'], thorn: ['life', 'not', 'small'], blossom: ['life', 'feel', 'change'],
  harvest: ['life', 'made', 'many'], orchard: ['place', 'life', 'many'], meadow2: ['place', 'life', 'big'], garden2: ['place', 'life', 'made'],
  // more animals
  elephant: ['being', 'big', 'place'], monkey: ['being', 'flow', 'small'], camel: ['being', 'big', 'place'], donkey: ['being', 'made', 'big'],
  goose: ['being', 'water', 'big'], hen: ['being', 'small', 'life'], rooster: ['being', 'speak', 'light'], peacock: ['being', 'feel', 'light'],
  turtle: ['being', 'place', 'made'], lizard: ['being', 'place', 'flow'], moth: ['being', 'light', 'not'], beetle: ['being', 'made', 'small'],
  jellyfish: ['being', 'water', 'light'], coral: ['being', 'water', 'place'], snail: ['being', 'small', 'flow'], serpent: ['being', 'flow', 'big'],
  // materials & substance
  iron: ['made', 'place', 'big'], copper: ['made', 'place', 'light'], steel: ['made', 'place', 'not'], glass: ['made', 'light', 'see'],
  clay: ['place', 'water', 'made'], brick: ['made', 'place', 'small'], paper2: ['made', 'speak', 'flow'], silk: ['made', 'flow', 'feel'],
  wool: ['life', 'made', 'feel'], leather: ['being', 'made', 'place'], crystal: ['made', 'light', 'place'], marble: ['place', 'made', 'light'],
  diamond: ['made', 'light', 'big'], coal: ['place', 'not', 'light'], salt2: ['place', 'small', 'see'], dust2: ['place', 'small', 'many'],
  // weather & cosmos
  comet: ['light', 'flow', 'big'], planet: ['place', 'light', 'big'], galaxy: ['light', 'many', 'big'], eclipse: ['not', 'light', 'change'],
  aurora: ['light', 'flow', 'feel'], meteor: ['light', 'flow', 'place'], orbit: ['flow', 'change', 'place'], gravity: ['flow', 'big', 'place'],
  // measure & quantity
  half2: ['small', 'made', 'self'], double: ['many', 'self'], dozen: ['many', 'made', 'small'], pair2: ['self', 'self'],
  amount: ['many', 'made', 'see'], total: ['big', 'many', 'made'], portion: ['small', 'made', 'many'], scale2: ['made', 'see', 'big'],
  level: ['place', 'made', 'flow'], degree: ['change', 'made', 'small'], rate: ['change', 'flow', 'made'], limit: ['not', 'flow', 'place'],
  // verbs (more)
  create2: ['made', 'change', 'big'], destroy: ['not', 'made', 'big'], protect2: ['feel', 'place', 'self'], attack: ['not', 'flow', 'big'],
  defend: ['place', 'feel', 'not'], gather2: ['many', 'flow', 'self'], scatter: ['many', 'flow', 'not'], guide: ['see', 'flow', 'feel'],
  discover: ['see', 'change', 'big'], invent: ['made', 'see', 'change'], imagine: ['see', 'feel', 'not'], decide: ['see', 'made', 'change'],
  promise2: ['speak', 'feel', 'flow'], forgive: ['feel', 'not', 'change'], betray: ['feel', 'not', 'flow'], obey: ['self', 'made', 'feel'],
  command: ['speak', 'big', 'made'], wander2: ['flow', 'not', 'self'], arrive: ['flow', 'place', 'self'], depart: ['flow', 'not', 'place'],
  // qualities (more)
  ancient: ['change', 'big', 'place'], modern: ['change', 'made', 'light'], eternal: ['change', 'big', 'not'], sacred: ['big', 'feel', 'light'],
  humble: ['small', 'feel', 'self'], proud: ['feel', 'big', 'self'], noble: ['being', 'big', 'feel'], gentle2: ['feel', 'small', 'flow'],
  fierce: ['feel', 'big', 'not'], swift: ['flow', 'big', 'small'], steady: ['place', 'not', 'change'], fragile: ['small', 'not', 'made'],
  hollow: ['not', 'place', 'made'], solid: ['made', 'place', 'big'], liquid: ['water', 'flow'], radiant: ['light', 'big', 'flow']
};
for (const k in CONCEPTS_B4) if (!(k in CONCEPTS)) CONCEPTS[k] = CONCEPTS_B4[k];

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

// ---------- inferred meaning: give EVERY word a radical composition ----------
// Strategy, most reliable first:
//   1. exact concept / lemma     2. plural & derivational stripping (recursive)
//   3. bound Latin/Greek roots   4. semantic-field keywords
//   5. sound-symbolism fallback  (onset + rime -> a plausible, never-empty set)
// The result is deterministic, so a word always maps to the same meaning.

// derivational endings -> the radical(s) they add, plus how to find the stem
const DERIV = [
  [/(ation|ition|tion|sion|ment|ness|ity|ty|ance|ence|hood|ship|ism|age|al|ure)$/, ['change'], 4],
  [/(er|or|ist|ant|ent|eer|ician)$/, ['being'], 3],     // agent
  [/(ology|ography|onomy|osophy|ics|logy)$/, ['see', 'many'], 5], // a field of study
  [/(able|ible|ful|ous|ive|ic|al|ary|ory|ish|like|y|ly)$/, ['feel'], 3], // quality-ish
  [/(ing|ed|en|s)$/, [], 2]                              // inflection only
];
const PREFIX = [
  [/^(un|in|im|il|ir|dis|non|anti|de)/, ['not']],
  [/^(re)/, ['change']],
  [/^(pre|fore|ante)/, ['change']],
  [/^(sub|under|infra)/, ['small', 'place']],
  [/^(super|over|hyper|out)/, ['big']],
  [/^(inter|trans|across)/, ['flow']],
  [/^(multi|poly|many)/, ['many']],
  [/^(micro|mini)/, ['small']],
  [/^(macro|mega|grand)/, ['big']],
  [/^(co|com|con|syn|together)/, ['many', 'feel']],
  [/^(tele|far)/, ['flow', 'place']],
  [/^(auto|self)/, ['self']],
  [/^(bio|zoo|eco)/, ['life']],
  [/^(geo|terra)/, ['place']],
  [/^(hydro|aqua)/, ['water']],
  [/^(photo|lumin|illu)/, ['light']],
  [/^(psych|neuro|cogn)/, ['see', 'self']]
];
// bound roots that strongly imply a radical (substring match, longest first)
const ROOTS = [
  ['aqua', 'water'], ['hydro', 'water'], ['mar', 'water'], ['rain', 'water'], ['ocean', 'water'], ['flu', 'flow'], ['riv', 'water'],
  ['photo', 'light'], ['lumin', 'light'], ['sol', 'light'], ['stell', 'light'], ['lux', 'light'], ['shin', 'light'],
  ['terr', 'place'], ['geo', 'place'], ['loc', 'place'], ['urb', 'place'], ['dom', 'place'], ['hous', 'place'], ['land', 'place'],
  ['bio', 'life'], ['viv', 'life'], ['vit', 'life'], ['zoo', 'life'], ['germ', 'life'], ['gen', 'life'], ['plant', 'life'],
  ['vid', 'see'], ['vis', 'see'], ['spec', 'see'], ['scop', 'see'], ['watch', 'see'], ['look', 'see'], ['ophth', 'see'],
  ['dict', 'speak'], ['loqu', 'speak'], ['phon', 'speak'], ['voc', 'speak'], ['ling', 'speak'], ['nounc', 'speak'], ['vot', 'speak'],
  ['fab', 'made'], ['fac', 'made'], ['struct', 'made'], ['mech', 'made'], ['techn', 'made'], ['mach', 'made'], ['build', 'made'],
  ['anim', 'being'], ['anthro', 'being'], ['homo', 'being'], ['ped', 'being'], ['cred', 'feel'], ['cord', 'feel'], ['emot', 'feel'],
  ['mov', 'flow'], ['mot', 'flow'], ['migr', 'flow'], ['curr', 'flow'], ['ven', 'flow'], ['port', 'flow'], ['grad', 'flow'],
  ['magn', 'big'], ['grand', 'big'], ['max', 'big'], ['micr', 'small'], ['min', 'small'], ['nano', 'small'],
  ['chron', 'change'], ['tempor', 'change'], ['nov', 'change'], ['mut', 'change'], ['volv', 'change'],
  ['cogn', 'see'], ['sci', 'see'], ['memor', 'see'], ['ment', 'self'], ['ego', 'self']
];
// semantic-field keyword substrings -> radicals (broad nets, checked last-ish)
const FIELDS = [
  [/(cat|dog|bird|fish|beast|animal|wolf|lion|bear|hors|cow|mous)/, ['being']],
  [/(king|queen|man|woman|child|person|peopl|folk|friend|famil|tribe)/, ['being']],
  [/(tree|leaf|flow|grass|seed|root|fruit|wood|forest|plant|grow)/, ['life']],
  [/(war|fight|kill|weapon|sword|battl)/, ['big', 'not', 'feel']],
  [/(love|joy|hope|kind|happy|heart|dear|warm|gentl)/, ['feel']],
  [/(sad|fear|anger|pain|grief|hurt|cruel)/, ['feel', 'not']],
  [/(king|rule|law|govern|order|power|lead)/, ['big', 'made']],
  [/(money|trade|buy|sell|gold|wealth|coin|market|price)/, ['made', 'many']],
  [/(time|year|day|hour|age|moment|season|clock)/, ['change']],
  [/(mountain|hill|rock|stone|cliff|peak)/, ['place', 'big']],
  [/(road|path|way|street|route|bridge)/, ['place', 'flow']],
  [/(book|word|story|song|name|note|letter|text|speak|tale)/, ['speak']],
  [/(star|sun|moon|sky|light|fire|bright|glow|day)/, ['light']],
  [/(water|sea|lake|wave|wet|drink|flood)/, ['water']],
  [/(big|great|huge|grand|vast|tall|wide)/, ['big']],
  [/(small|tiny|little|micro|wee|mini)/, ['small']]
];
const VOWELS = 'aeiou';
// onset (first consonant cluster) -> a radical; rime nucleus -> a radical.
const ONSET_RAD = { m: 'feel', n: 'self', p: 'made', b: 'made', t: 'place', d: 'place', k: 'made', c: 'made', g: 'life', f: 'flow', v: 'flow', s: 'see', z: 'see', r: 'flow', l: 'flow', w: 'water', h: 'light', j: 'change', y: 'self', q: 'speak', x: 'change' };
const VOWEL_RAD = { a: 'big', e: 'feel', i: 'small', o: 'place', u: 'change' };

function sym(raw) {
  // sound-symbolism: never empty. onset radical + first-vowel radical.
  const onset = (raw.match(/^[^aeiou]+/) || [''])[0][0];
  const vow = (raw.match(/[aeiou]/) || ['e'])[0];
  const out = [];
  if (onset && ONSET_RAD[onset]) out.push(ONSET_RAD[onset]);
  if (VOWEL_RAD[vow]) out.push(VOWEL_RAD[vow]);
  return out.length ? [...new Set(out)] : ['self'];
}

const dedupe = (a) => [...new Set(a)].filter(Boolean).slice(0, 3);
const inferCache = new Map();

// Infer a radical composition for ANY English word (deterministic, never empty).
export function inferRadicals(word) {
  const raw = String(word).toLowerCase().replace(/[^a-z]/g, '');
  if (!raw) return [];
  if (inferCache.has(raw)) return inferCache.get(raw);
  let result = null;

  // 1. exact concept / lemma
  if (CONCEPTS[raw]) result = CONCEPTS[raw];
  else if (LEMMA[raw] && CONCEPTS[LEMMA[raw]]) result = CONCEPTS[LEMMA[raw]];

  // 2. affix stripping: prefix and/or one derivational suffix that exposes a known stem
  if (!result) {
    let add = [];
    let stem = raw;
    for (const [re, rads] of PREFIX) { if (re.test(stem) && stem.replace(re, '').length >= 3) { add = add.concat(rads); stem = stem.replace(re, ''); break; } }
    for (const [re, rads, min] of DERIV) {
      const m = stem.match(re);
      if (m && stem.length - m[0].length >= min - 1) {
        let base = stem.slice(0, stem.length - m[0].length);
        for (const cand of [base, base + 'e', base + 'y', base.replace(/i$/, 'y')]) {
          if (CONCEPTS[cand]) { result = dedupe([...CONCEPTS[cand], ...rads, ...add]); break; }
          if (LEMMA[cand] && CONCEPTS[LEMMA[cand]]) { result = dedupe([...CONCEPTS[LEMMA[cand]], ...rads, ...add]); break; }
        }
        if (result) break;
        if (rads.length || add.length) { /* remember affix meaning for later */ stem = base || stem; add = add.concat(rads); }
      }
    }
    if (!result && add.length) {
      // prefix/suffix meaning + sound symbolism of the remaining stem
      result = dedupe([...add, ...sym(stem)]);
    }
  }

  // 3. bound Latin/Greek roots
  if (!result) {
    const hit = [];
    for (const [sub, rad] of ROOTS) if (raw.includes(sub)) { hit.push(rad); if (hit.length >= 2) break; }
    if (hit.length) result = dedupe(hit);
  }

  // 4. semantic fields
  if (!result) {
    for (const [re, rads] of FIELDS) if (re.test(raw)) { result = dedupe(rads); break; }
  }

  // 5. sound-symbolism fallback (always non-empty)
  if (!result) result = sym(raw);

  inferCache.set(raw, result);
  return result;
}

// English word -> its semantic radical ids. Curated concepts win; otherwise the
// meaning is inferred so EVERY word carries a composition (a forehead mark).
export function radicalsFor(word) {
  const raw = String(word).toLowerCase().replace(/[^a-z]/g, '');
  let key = CONCEPTS[raw] ? raw : LEMMA[raw];
  if (!key && raw.endsWith('s') && CONCEPTS[raw.slice(0, -1)]) key = raw.slice(0, -1);
  if (key) return CONCEPTS[key];
  return inferRadicals(raw);
}

// Whether a word's meaning is curated/structural (true) vs sound-symbolism only.
export function hasCuratedMeaning(word) {
  const raw = String(word).toLowerCase().replace(/[^a-z]/g, '');
  if (CONCEPTS[raw] || (LEMMA[raw] && CONCEPTS[LEMMA[raw]])) return true;
  if (raw.endsWith('s') && CONCEPTS[raw.slice(0, -1)]) return true;
  return false;
}

export default { RADICALS: RADICAL_GLOSSES, CONCEPTS, radicalsFor, inferRadicals, hasCuratedMeaning, renderGlyph, glyphFor, glyphsForPhrase, renderSentence, renderNested, renderText };
