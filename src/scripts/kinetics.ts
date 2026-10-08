// Motion layer: letter-level hero typography with a variable-font wave under the
// pointer, the opening hand-off, masked reveals, chapter slips, scroll-velocity
// marquees, magnetic controls, counting numbers, the cursor lamp and badge, the
// scroll-aware navigation, the seals, the ink trail, and the footer's giant name,
// clock, solar term and lunar date. Nothing here touches the globe, the maps or
// the players, and every effect is skipped for reduced motion. Content is
// readable before any of it runs.

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const still = () => reduced.matches;
const t = (key: string): string => ((window as any).__t?.(key) as string) || '';
const lang = () => root.dataset.lang ?? 'en';

// ---------- Hero name: one span per letter ----------
function splitLetters(word: HTMLElement) {
  const text = word.textContent ?? '';
  word.setAttribute('aria-label', text);
  word.textContent = '';
  const offset = Number(word.dataset.offset ?? 0);
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'ch';
    span.setAttribute('aria-hidden', 'true');
    span.style.setProperty('--i', String(offset + i));
    span.textContent = ch === ' ' ? ' ' : ch;
    word.appendChild(span);
  });
}
const heroTitle = document.querySelector<HTMLElement>('.hero-title');
if (heroTitle && lang() !== 'cat') {
  let offset = 0;
  heroTitle.querySelectorAll<HTMLElement>('.hero-word').forEach(word => {
    word.dataset.offset = String(offset);
    offset += (word.textContent ?? '').length + 2;
    splitLetters(word);
  });
  heroTitle.dataset.kinetic = '';
  // The letters rise in the display face, never in a fallback: wait for it (briefly).
  const fontsReady = Promise.race([document.fonts.load('300 100px Fraunces'), new Promise(r => setTimeout(r, 900))]);
  const goLive = () => fontsReady.then(() => heroTitle.classList.add('is-live'), () => heroTitle.classList.add('is-live'));
  if (root.dataset.intro === 'playing') addEventListener('intro:done', goLive, { once: true });
  else goLive();

  // Variable-font wave: letters near the pointer gain weight and softness.
  if (fine.matches) {
    const letters = Array.from(heroTitle.querySelectorAll<HTMLElement>('.ch'));
    let frame = 0, px = 0, py = 0, inside = false;
    function paint() {
      frame = 0;
      for (const ch of letters) {
        const box = ch.getBoundingClientRect();
        const d = Math.hypot(px - (box.left + box.width / 2), py - (box.top + box.height / 2));
        const k = inside && !still() ? Math.max(0, 1 - d / 190) : 0;
        const e = k * k * (3 - 2 * k);
        ch.style.setProperty('--w', String(Math.round(300 + e * 400)));
        ch.style.setProperty('--s', String(Math.round(40 + e * 60)));
      }
    }
    heroTitle.addEventListener('pointermove', e => { px = e.clientX; py = e.clientY; inside = true; if (!frame) frame = requestAnimationFrame(paint); });
    heroTitle.addEventListener('pointerleave', () => { inside = false; if (!frame) frame = requestAnimationFrame(paint); });
  }
}

// ---------- Hero depth: the layers drift and tilt against the pointer ----------
const hero = document.getElementById('hero');
const heroCopy = hero?.querySelector<HTMLElement>('.hero-copy');
const heroArt = hero?.querySelector<HTMLElement>('.hero-art');
const heroSignature = hero?.querySelector<HTMLElement>('.hero-signature');
if (hero && heroCopy && fine.matches) {
  let frame = 0, x = 0, y = 0;
  hero.addEventListener('pointermove', e => {
    if (still()) return;
    x = (e.clientX / innerWidth - 0.5) * 2;
    y = (e.clientY / innerHeight - 0.5) * 2;
    if (!frame) frame = requestAnimationFrame(() => {
      frame = 0;
      heroCopy.style.translate = `${x * -7}px ${y * -5}px`;
      heroCopy.style.rotate = `y ${x * 1.6}deg`;
      if (heroArt) heroArt.style.translate = `${x * 12}px ${y * 8}px`;
      if (heroSignature) heroSignature.style.translate = `${x * -3}px ${y * -10}px`;
    });
  });
  hero.addEventListener('pointerleave', () => {
    heroCopy.style.translate = '0 0'; heroCopy.style.rotate = 'y 0deg'; if (heroArt) heroArt.style.translate = '0 0';
    if (heroSignature) heroSignature.style.translate = '0 0';
  });
}

// ---------- Magnetic controls ----------
if (fine.matches) {
  document.querySelectorAll<HTMLElement>('.btn, .hero-document, .to-top, .play-dot').forEach(el => {
    el.dataset.magnetic = '';
    el.addEventListener('pointermove', e => {
      if (still()) return;
      const box = el.getBoundingClientRect();
      const dx = (e.clientX - (box.left + box.width / 2)) / box.width;
      const dy = (e.clientY - (box.top + box.height / 2)) / box.height;
      el.classList.remove('is-magnet-rest');
      el.style.translate = `${dx * 10}px ${dy * 8}px`;
    });
    el.addEventListener('pointerleave', () => { el.classList.add('is-magnet-rest'); el.style.translate = '0 0'; });
  });
}

// ---------- Counting numbers ----------
function countUp(el: HTMLElement) {
  const raw = el.textContent?.trim() ?? '';
  const match = raw.match(/^(\d+)(.*)$/);
  if (!match || still()) return;
  const target = Number(match[1]), suffix = match[2], began = performance.now();
  function step(now: number) {
    const p = Math.min(1, (now - began) / 1400);
    el.textContent = `${Math.round((1 - Math.pow(1 - p, 4)) * target)}${suffix}`;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const counters = document.querySelectorAll<HTMLElement>('.hero-stat > span, [data-count]');
if (counters.length) {
  const io = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      io.unobserve(entry.target);
      const go = () => countUp(entry.target as HTMLElement);
      if (root.dataset.intro === 'playing') addEventListener('intro:done', () => setTimeout(go, 600), { once: true });
      else go();
    }
  }, { threshold: 0.4 });
  counters.forEach(el => io.observe(el));
}

// ---------- Titles and statements: phrases rise out of their masks ----------
const titles = document.querySelectorAll<HTMLElement>('.section-title, [data-rise]');
const titleObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    entry.target.classList.add('is-inview');
    titleObserver.unobserve(entry.target);
  }
}, { rootMargin: '0px 0px -12% 0px' });
titles.forEach(title => {
  Array.from(title.children).forEach((span, i) => (span as HTMLElement).style.setProperty('--i', String(i)));
  title.dataset.kinetic = '';
  if (still() || title.getBoundingClientRect().top < innerHeight * 0.9) title.classList.add('is-inview');
  else titleObserver.observe(title);
});

// ---------- The statement breathes: softness and weight follow its place on screen ----------
const statement = document.querySelector<HTMLElement>('.statement');
if (statement && !still()) {
  let inView = false, frame = 0;
  const paint = () => {
    frame = 0;
    const box = statement.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (innerHeight - box.top) / (innerHeight + box.height)));
    const m = Math.sin(p * Math.PI);
    statement.style.setProperty('--soft', (20 + 80 * m).toFixed(1));
    statement.style.setProperty('--soft-i', (60 + 40 * m).toFixed(1));
    statement.style.setProperty('--wght', (300 + 130 * m).toFixed(0));
  };
  new IntersectionObserver(entries => { inView = entries.some(e => e.isIntersecting); if (inView && !frame) frame = requestAnimationFrame(paint); }, { rootMargin: '10%' }).observe(statement);
  addEventListener('scroll', () => { if (inView && !frame) frame = requestAnimationFrame(paint); }, { passive: true });
}

// ---------- Chapter slips (题签): numeral and chapter name on a narrow label ----------
const NUMERALS = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
let slipped = false;
document.querySelectorAll<HTMLElement>('.section-eyebrow[data-chapter]').forEach(eyebrow => {
  const section = eyebrow.closest('section');
  if (!section || section.querySelector('.chapter-slip')) return;
  const n = Number(eyebrow.dataset.chapter ?? 0);
  const slip = document.createElement('span');
  slip.className = 'chapter-slip';
  slip.setAttribute('aria-hidden', 'true');
  const numeral = document.createElement('b');
  numeral.textContent = Number.isInteger(n) && n > 0 && n < NUMERALS.length ? NUMERALS[n] : eyebrow.dataset.chapter ?? '';
  const rule = document.createElement('i');
  const label = document.createElement('span');
  label.className = 'chapter-slip-label';
  label.textContent = eyebrow.textContent?.trim() ?? '';
  if (eyebrow.dataset.i18n) label.dataset.i18n = eyebrow.dataset.i18n;
  slip.append(numeral, rule, label);
  section.dataset.hasMark = '';
  section.prepend(slip);
  slipped = true;
});
if (slipped && lang() !== 'en') (window as any).__applyI18n?.();

// ---------- Chapter rail and the cue at the foot of each chapter ----------
const chapters = Array.from(document.querySelectorAll<HTMLElement>('.section-eyebrow[data-chapter]'))
  .map(eyebrow => ({ eyebrow, section: eyebrow.closest('section') as HTMLElement | null }))
  .filter((c): c is { eyebrow: HTMLElement; section: HTMLElement } => !!c.section?.id);
if (chapters.length > 1) {
  const rail = document.createElement('nav');
  rail.className = 'chapter-rail';
  rail.setAttribute('aria-label', 'Chapters');
  const line = document.createElement('i');
  line.className = 'chapter-rail-line';
  rail.appendChild(line);
  const items = chapters.map(({ eyebrow, section }) => {
    const a = document.createElement('a');
    a.href = `#${section.id}`;
    a.className = 'chapter-rail-item';
    const n = Number(eyebrow.dataset.chapter ?? 0);
    const b = document.createElement('b');
    b.textContent = Number.isInteger(n) && n > 0 && n < NUMERALS.length ? NUMERALS[n] : eyebrow.dataset.chapter ?? '';
    const name = document.createElement('span');
    name.textContent = eyebrow.textContent?.trim() ?? '';
    if (eyebrow.dataset.i18n) name.dataset.i18n = eyebrow.dataset.i18n;
    a.append(b, name);
    rail.appendChild(a);
    return a;
  });
  document.body.appendChild(rail);
  let railFrame = 0;
  const paintRail = () => {
    railFrame = 0;
    const probe = scrollY + innerHeight * 0.42;
    let current = -1;
    chapters.forEach((c, i) => { if (c.section.getBoundingClientRect().top + scrollY <= probe) current = i; });
    items.forEach((a, i) => { a.classList.toggle('is-current', i === current); if (i === current) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
    const max = root.scrollHeight - innerHeight;
    rail.classList.toggle('is-on', scrollY > innerHeight * 0.55 && scrollY < max - innerHeight * 0.6);
    line.style.setProperty('--p', String(Math.min(1, Math.max(0, scrollY / Math.max(1, max)))));
  };
  addEventListener('scroll', () => { if (!railFrame) railFrame = requestAnimationFrame(paintRail); }, { passive: true });
  addEventListener('resize', paintRail, { passive: true });
  paintRail();

  chapters.forEach((c, i) => {
    const next = chapters[i + 1];
    const container = c.section.querySelector<HTMLElement>(':scope > div');
    if (!next || !container) return;
    const a = document.createElement('a');
    a.className = 'chapter-next';
    a.href = `#${next.section.id}`;
    const label = document.createElement('span');
    label.dataset.i18n = 'chapter.next';
    label.textContent = 'Next';
    const name = document.createElement('em');
    name.textContent = next.eyebrow.textContent?.trim() ?? '';
    if (next.eyebrow.dataset.i18n) name.dataset.i18n = next.eyebrow.dataset.i18n;
    const arrow = document.createElement('i');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↓';
    a.append(label, name, arrow);
    container.appendChild(a);
  });
  if (lang() !== 'en') (window as any).__applyI18n?.();
}

// ---------- Glint on every grained frame ----------
document.querySelectorAll<HTMLElement>('.grain').forEach(grain => {
  const glint = document.createElement('span');
  glint.className = 'glint';
  glint.setAttribute('aria-hidden', 'true');
  grain.insertAdjacentElement('afterend', glint);
});

// ---------- Marquees: drift, faster and skewed with scroll velocity ----------
let lastScroll = scrollY;
let velocity = 0;
addEventListener('scroll', () => { velocity = scrollY - lastScroll; lastScroll = scrollY; }, { passive: true });
document.querySelectorAll<HTMLElement>('[data-marquee]').forEach(marquee => {
  const track = marquee.querySelector<HTMLElement>('.marquee-track');
  if (!track || still()) return;
  const direction = marquee.dataset.direction === 'right' ? 1 : -1;
  const base = Number(marquee.dataset.speed) || 0.6;
  const leans = !marquee.classList.contains('hero-ticker');
  let offset = 0, half = 0, frame = 0, visible = false, speed = 0, skew = 0;
  const measure = () => { half = track.scrollWidth / 2; };
  new ResizeObserver(measure).observe(track);
  addEventListener('lang:change', () => requestAnimationFrame(measure));
  function tick() {
    frame = 0;
    if (!visible || !half) return;
    speed += (base + (leans ? Math.min(14, Math.abs(velocity) * 0.25) : 0) - speed) * 0.08;
    skew += ((leans ? Math.max(-12, Math.min(12, velocity * 0.35)) : 0) - skew) * 0.1;
    velocity *= 0.9;
    offset = (offset + speed * direction) % half;
    if (offset > 0) offset -= half;
    track.style.transform = `translate3d(${offset}px, 0, 0) skewX(${skew.toFixed(2)}deg)`;
    frame = requestAnimationFrame(tick);
  }
  new IntersectionObserver(entries => {
    visible = entries.some(e => e.isIntersecting) && !document.hidden;
    if (visible && !frame) frame = requestAnimationFrame(tick);
  }, { rootMargin: '80px' }).observe(marquee);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && visible && !frame) frame = requestAnimationFrame(tick); });
});

// ---------- Cursor lamp and badge ----------
const spotlight = document.getElementById('spotlight');
const badge = document.getElementById('cursor-badge');
const badgeLabel = badge?.querySelector('span');
const ROLES: [string, string][] = [
  ['[data-film], .hero-film', 'cursor.play'],
  ['.gallery-invitation-link, .hero-gallery-link', 'cursor.enter'],
  ['.strip-cell a, .photo-pin, .film-pin, #lightbox-figure, .gallery-plane', 'cursor.view'],
  ['#globe-canvas, .gallery-stage', 'cursor.drag']
];
if (fine.matches && !still()) {
  let tx = innerWidth / 2, ty = innerHeight / 3, x = tx, y = ty, bx = tx, by = ty, frame = 0;
  let role: string | null = null;
  function glide() {
    x += (tx - x) * 0.12; y += (ty - y) * 0.12;
    bx += (tx - bx) * 0.3; by += (ty - by) * 0.3;
    if (spotlight) spotlight.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    if (badge) badge.style.transform = `translate3d(${bx}px, ${by}px, 0) scale(${role ? 1 : 0})`;
    frame = Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(tx - bx) > 0.3 ? requestAnimationFrame(glide) : 0;
  }
  function setRole(next: string | null) {
    if (next === role) return;
    role = next;
    if (role) {
      const text = t(role);
      if (badgeLabel) badgeLabel.innerHTML = lang() === 'cat' ? ((window as any).__nyaCat?.(text, 16) ?? text) : text;
      root.dataset.badge = role.split('.')[1];
    } else delete root.dataset.badge;
  }
  addEventListener('pointermove', e => {
    tx = e.clientX; ty = e.clientY;
    root.dataset.spotlight = 'on';
    const target = e.target instanceof Element ? e.target : null;
    let next: string | null = null;
    if (target) for (const [selector, key] of ROLES) { if (target.closest(selector)) { next = key; break; } }
    setRole(next);
    if (!frame) frame = requestAnimationFrame(glide);
  }, { passive: true });
  document.addEventListener('pointerleave', () => { delete root.dataset.spotlight; setRole(null); });
  document.addEventListener('pointerdown', () => { if (badge) badge.classList.add('is-pressed'); }, { passive: true });
  document.addEventListener('pointerup', () => { if (badge) badge.classList.remove('is-pressed'); }, { passive: true });
}

// ---------- Navigation slips away while reading, returns on the way up ----------
const nav = document.getElementById('site-nav');
if (nav) {
  let previous = scrollY, frame = 0;
  addEventListener('scroll', () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const y = scrollY;
      const menuOpen = document.getElementById('mobile-menu')?.classList.contains('hidden') === false;
      if (y > previous + 6 && y > 320 && !menuOpen) nav.classList.add('nav-hidden');
      else if (y < previous - 6 || y < 120) nav.classList.remove('nav-hidden');
      previous = y;
    });
  }, { passive: true });
}

// ---------- The seals: press one and it stamps again ----------
document.querySelectorAll<SVGElement>('[data-seal]').forEach(seal => {
  const stamp = () => {
    if (still()) return;
    seal.classList.remove('is-stamping');
    void seal.getBoundingClientRect();
    seal.classList.add('is-stamping');
    const box = seal.getBoundingClientRect();
    for (const cls of ['seal-blot', 'seal-ring']) {
      const mark = document.createElement('span');
      mark.className = cls;
      mark.setAttribute('aria-hidden', 'true');
      mark.style.left = `${box.left + box.width / 2}px`;
      mark.style.top = `${box.top + box.height / 2}px`;
      document.body.appendChild(mark);
      mark.addEventListener('animationend', () => mark.remove(), { once: true });
    }
    (window as any).__inkSplat?.((box.left + box.width / 2) / innerWidth, 1 - (box.top + box.height / 2) / innerHeight, 0.55, [0.52, 0.13, 0.08]);
    try { navigator.vibrate?.(12); } catch {}
  };
  seal.addEventListener('click', stamp);
  seal.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stamp(); } });
});

// ---------- Ink on press ----------
document.addEventListener('pointerdown', event => {
  if (still()) return;
  const button = (event.target as HTMLElement | null)?.closest<HTMLElement>('.btn, .hero-document, .skill-tile, .view-toggle, .journey-filter');
  if (!button) return;
  const box = button.getBoundingClientRect();
  const drop = document.createElement('span');
  drop.className = 'ink-drop';
  drop.setAttribute('aria-hidden', 'true');
  const size = Math.max(box.width, box.height) * 2.2;
  drop.style.width = drop.style.height = `${size}px`;
  drop.style.left = `${event.clientX - box.left - size / 2}px`;
  drop.style.top = `${event.clientY - box.top - size / 2}px`;
  button.appendChild(drop);
  drop.addEventListener('animationend', () => drop.remove(), { once: true });
}, { passive: true });

// ---------- Ink trail: fast strokes of the pointer leave drops that bleed and fade ----------
const trail = document.getElementById('ink-trail') as HTMLCanvasElement | null;
if (trail && fine.matches && !still()) {
  const ctx = trail.getContext('2d');
  if (ctx) {
    type Drop = { x: number; y: number; r: number; born: number; life: number; hue: number };
    const drops: Drop[] = [];
    let frame = 0, lastX = 0, lastY = 0, lastT = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(2, devicePixelRatio || 1);
      trail.width = Math.round(innerWidth * dpr); trail.height = Math.round(innerHeight * dpr);
      trail.style.width = `${innerWidth}px`; trail.style.height = `${innerHeight}px`;
    };
    resize();
    addEventListener('resize', resize, { passive: true });
    function paint(now: number) {
      frame = 0;
      ctx!.clearRect(0, 0, trail!.width, trail!.height);
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        const p = (now - d.born) / d.life;
        if (p >= 1) { drops.splice(i, 1); continue; }
        const ease = 1 - Math.pow(1 - p, 3);
        const r = d.r * (0.4 + ease * 1.2) * dpr;
        const g = ctx!.createRadialGradient(d.x * dpr, d.y * dpr, 0, d.x * dpr, d.y * dpr, r);
        const a = (1 - p) * 0.42;
        g.addColorStop(0, `hsla(${d.hue}, ${d.hue < 60 ? 70 : 20}%, ${d.hue < 60 ? 42 : 26}%, ${a})`);
        g.addColorStop(0.6, `hsla(${d.hue}, ${d.hue < 60 ? 70 : 20}%, ${d.hue < 60 ? 42 : 30}%, ${a * 0.45})`);
        g.addColorStop(1, `hsla(${d.hue}, ${d.hue < 60 ? 70 : 20}%, 35%, 0)`);
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(d.x * dpr, d.y * dpr, r, 0, Math.PI * 2);
        ctx!.fill();
      }
      if (drops.length) frame = requestAnimationFrame(paint);
    }
    addEventListener('pointermove', e => {
      const now = performance.now();
      const dt = Math.max(8, now - lastT);
      const speed = Math.hypot(e.clientX - lastX, e.clientY - lastY) / dt * 16;
      lastX = e.clientX; lastY = e.clientY; lastT = now;
      if (speed < 9 || drops.length > 80) return;
      const n = Math.min(3, Math.floor(speed / 14));
      for (let i = 0; i < n; i++) {
        drops.push({ x: e.clientX + (Math.random() - 0.5) * speed * 0.6, y: e.clientY + (Math.random() - 0.5) * speed * 0.6, r: 2 + Math.min(14, speed * 0.28) * Math.random(), born: now, life: 700 + Math.random() * 600, hue: Math.random() < 0.9 ? 160 + Math.random() * 16 : 10 });
      }
      if (!frame) frame = requestAnimationFrame(paint);
    }, { passive: true });
  }
}

// ---------- Footer: the giant name ----------
const giant = document.querySelector<HTMLElement>('.footer-giant');
if (giant) {
  const io = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) { giant.classList.add('is-inview'); io.disconnect(); } }, { threshold: 0.3 });
  io.observe(giant);
}

// ---------- Time in Wageningen ----------
const clockFormat = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Amsterdam' });
const clocks = document.querySelectorAll<HTMLElement>('.footer-clock b:not([data-solar-term]):not([data-lunar-date]), [data-intro-time], [data-ticker-time]');
if (clocks.length) {
  const paint = () => clocks.forEach(el => { el.innerHTML = clockFormat.format(new Date()).replace(':', '<i>:</i>'); });
  paint();
  setInterval(paint, 15000);
}

// ---------- The solar term, 节气: the Sun's ecliptic longitude in 15° steps ----------
const TERMS: [string, string][] = [
  ['春分', 'Spring Equinox'], ['清明', 'Clear and Bright'], ['谷雨', 'Grain Rain'], ['立夏', 'Start of Summer'],
  ['小满', 'Grain Buds'], ['芒种', 'Grain in Ear'], ['夏至', 'Summer Solstice'], ['小暑', 'Minor Heat'],
  ['大暑', 'Major Heat'], ['立秋', 'Start of Autumn'], ['处暑', 'End of Heat'], ['白露', 'White Dew'],
  ['秋分', 'Autumn Equinox'], ['寒露', 'Cold Dew'], ['霜降', 'Frost Descent'], ['立冬', 'Start of Winter'],
  ['小雪', 'Minor Snow'], ['大雪', 'Major Snow'], ['冬至', 'Winter Solstice'], ['小寒', 'Minor Cold'],
  ['大寒', 'Major Cold'], ['立春', 'Start of Spring'], ['雨水', 'Rain Water'], ['惊蛰', 'Awakening of Insects']
];
function solarTerm(date = new Date()): [string, string] {
  const n = (date.getTime() / 86400000) - 10957.5; // days since J2000.0
  const rad = Math.PI / 180;
  const L = (280.460 + 0.9856474 * n) % 360;
  const g = ((357.528 + 0.9856003 * n) % 360) * rad;
  const lambda = (((L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) % 360) + 360) % 360;
  return TERMS[Math.floor(lambda / 15) % 24];
}
{
  const [zh, en] = solarTerm();
  document.querySelectorAll<HTMLElement>('[data-solar-term]').forEach(el => { el.innerHTML = `<span lang="zh">${zh}</span><i>·</i>${en}`; });
  document.querySelectorAll<HTMLElement>('[data-intro-term]').forEach(el => { el.innerHTML = `<span lang="zh">${zh}</span> ${en}`; });
}

// ---------- The lunar date, 农历, from the browser's Chinese calendar ----------
function lunarDate(date = new Date()): string | null {
  try {
    const parts = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', { month: 'long', day: 'numeric' }).formatToParts(date);
    const month = parts.find(p => p.type === 'month')?.value;
    const day = Number(parts.find(p => p.type === 'day')?.value);
    if (!month || !day || !/月/.test(month)) return null;
    const digits = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    const dayName = day <= 10 ? `初${digits[day]}` : day < 20 ? `十${digits[day - 10]}` : day === 20 ? '二十' : day < 30 ? `廿${digits[day - 20]}` : '三十';
    return `${month}${dayName}`;
  } catch { return null; }
}
document.querySelectorAll<HTMLElement>('[data-lunar-date]').forEach(el => {
  const lunar = lunarDate();
  const row = el.closest<HTMLElement>('.footer-lunar, .ticker-item');
  if (!lunar) { row?.setAttribute('hidden', ''); return; }
  el.innerHTML = `<span lang="zh">${lunar}</span>`;
});

document.querySelector<HTMLElement>('.to-top')?.addEventListener('click', event => {
  event.preventDefault();
  scrollTo({ top: 0, behavior: still() ? 'auto' : 'smooth' });
});
