// Motion layer: letter-level hero typography with a variable-font wave under the
// pointer, the opening hand-off, masked section-title reveals, chapter
// watermarks, scroll-velocity marquees, magnetic controls, counting numbers, the
// cursor lamp, the scroll-aware navigation, and the footer's giant name and clock.
// Nothing here touches the globe, the maps or the players, and every effect is
// skipped for reduced motion. Content is readable before any of it runs.

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const still = () => reduced.matches;

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
if (heroTitle && root.dataset.lang !== 'cat') {
  const words = heroTitle.querySelectorAll<HTMLElement>('.hero-word');
  let offset = 0;
  words.forEach(word => {
    word.dataset.offset = String(offset);
    offset += (word.textContent ?? '').length + 2;
    splitLetters(word);
  });
  heroTitle.dataset.kinetic = '';
  const goLive = () => heroTitle.classList.add('is-live');
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
        const dx = px - (box.left + box.width / 2);
        const dy = py - (box.top + box.height / 2);
        const d = Math.hypot(dx, dy);
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

// ---------- Hero parallax: copy and art drift against the pointer ----------
const hero = document.getElementById('hero');
const heroCopy = hero?.querySelector<HTMLElement>('.hero-copy');
const heroArt = hero?.querySelector<HTMLElement>('.hero-art');
if (hero && heroCopy && heroArt && fine.matches) {
  let frame = 0, x = 0, y = 0;
  hero.addEventListener('pointermove', e => {
    if (still()) return;
    x = (e.clientX / innerWidth - 0.5) * 2;
    y = (e.clientY / innerHeight - 0.5) * 2;
    if (!frame) frame = requestAnimationFrame(() => {
      frame = 0;
      heroCopy.style.translate = `${x * -6}px ${y * -4}px`;
      heroArt.style.translate = `${x * 10}px ${y * 7}px`;
    });
  });
  hero.addEventListener('pointerleave', () => { heroCopy.style.translate = '0 0'; heroArt.style.translate = '0 0'; });
}

// ---------- Magnetic controls ----------
if (fine.matches) {
  const targets = document.querySelectorAll<HTMLElement>('.btn, .hero-document, .to-top, .play-dot');
  targets.forEach(el => {
    el.dataset.magnetic = '';
    el.addEventListener('pointermove', e => {
      if (still()) return;
      const box = el.getBoundingClientRect();
      const dx = (e.clientX - (box.left + box.width / 2)) / box.width;
      const dy = (e.clientY - (box.top + box.height / 2)) / box.height;
      el.classList.remove('is-magnet-rest');
      el.style.translate = `${dx * 10}px ${dy * 8}px`;
    });
    el.addEventListener('pointerleave', () => {
      el.classList.add('is-magnet-rest');
      el.style.translate = '0 0';
    });
  });
}

// ---------- Counting numbers ----------
function countUp(el: HTMLElement) {
  const raw = el.textContent?.trim() ?? '';
  const match = raw.match(/^(\d+)(.*)$/);
  if (!match || still()) return;
  const target = Number(match[1]);
  const suffix = match[2];
  const began = performance.now();
  const duration = 1400;
  function step(now: number) {
    const t = Math.min(1, (now - began) / duration);
    const eased = 1 - Math.pow(1 - t, 4);
    el.textContent = `${Math.round(eased * target)}${suffix}`;
    if (t < 1) requestAnimationFrame(step);
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

// ---------- Section titles: phrases rise out of their masks ----------
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

// ---------- Chapter watermarks ----------
document.querySelectorAll<HTMLElement>('.section-eyebrow[data-chapter]').forEach(eyebrow => {
  const section = eyebrow.closest('section');
  if (!section || section.querySelector('.chapter-mark')) return;
  const mark = document.createElement('span');
  mark.className = 'chapter-mark';
  mark.setAttribute('aria-hidden', 'true');
  // Chapter numerals in the Chinese financial forms, 壹 贰 叁, set in Noto Serif SC.
  const NUMERALS = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const n = Number(eyebrow.dataset.chapter ?? 0);
  const numeral = Number.isInteger(n) && n > 0 && n < NUMERALS.length ? NUMERALS[n] : eyebrow.dataset.chapter ?? '';
  mark.dataset.mark = numeral;
  mark.textContent = numeral;
  section.dataset.hasMark = '';
  section.prepend(mark);
});

// ---------- Marquees: drift, faster and skewed with scroll velocity ----------
let lastScroll = scrollY;
let velocity = 0;
addEventListener('scroll', () => {
  velocity = scrollY - lastScroll;
  lastScroll = scrollY;
}, { passive: true });

document.querySelectorAll<HTMLElement>('[data-marquee]').forEach(marquee => {
  const track = marquee.querySelector<HTMLElement>('.marquee-track');
  if (!track || still()) return;
  const direction = marquee.dataset.direction === 'right' ? 1 : -1;
  let offset = 0, half = 0, frame = 0, visible = false, speed = 0, skew = 0;
  const measure = () => { half = track.scrollWidth / 2; };
  new ResizeObserver(measure).observe(track);
  addEventListener('lang:change', () => requestAnimationFrame(measure));
  function tick() {
    frame = 0;
    if (!visible || !half) return;
    speed += (0.6 + Math.min(14, Math.abs(velocity) * 0.25) - speed) * 0.08;
    skew += (Math.max(-12, Math.min(12, velocity * 0.35)) - skew) * 0.1;
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

// ---------- Cursor lamp ----------
const spotlight = document.getElementById('spotlight');
if (spotlight && fine.matches && !still()) {
  let tx = innerWidth / 2, ty = innerHeight / 3, x = tx, y = ty, frame = 0;
  function glide() {
    x += (tx - x) * 0.12;
    y += (ty - y) * 0.12;
    spotlight!.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(glide) : 0;
  }
  addEventListener('pointermove', e => {
    tx = e.clientX; ty = e.clientY;
    root.dataset.spotlight = 'on';
    if (!frame) frame = requestAnimationFrame(glide);
  }, { passive: true });
  document.addEventListener('pointerleave', () => { delete root.dataset.spotlight; });
}

// ---------- Navigation slips away while reading, returns on the way up ----------
const nav = document.getElementById('site-nav');
if (nav) {
  let previous = scrollY;
  let frame = 0;
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

// ---------- Footer: the giant name and the clock in Wageningen ----------
const giant = document.querySelector<HTMLElement>('.footer-giant');
if (giant) {
  const io = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting)) { giant.classList.add('is-inview'); io.disconnect(); }
  }, { threshold: 0.3 });
  io.observe(giant);
}
const clock = document.querySelector<HTMLElement>('.footer-clock b');
if (clock) {
  const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Amsterdam' });
  const paint = () => { clock.innerHTML = fmt.format(new Date()).replace(':', '<i>:</i>'); };
  paint();
  setInterval(paint, 15000);
}
document.querySelector<HTMLElement>('.to-top')?.addEventListener('click', event => {
  event.preventDefault();
  scrollTo({ top: 0, behavior: still() ? 'auto' : 'smooth' });
});

// ---------- The seal: press it and it stamps again ----------
document.querySelectorAll<SVGElement>('[data-seal]').forEach(seal => {
  const stamp = () => {
    if (still()) return;
    seal.classList.remove('is-stamping');
    void seal.getBoundingClientRect();
    seal.classList.add('is-stamping');
    const ring = document.createElement('span');
    ring.className = 'seal-ring';
    ring.setAttribute('aria-hidden', 'true');
    const box = seal.getBoundingClientRect();
    ring.style.left = `${box.left + box.width / 2}px`;
    ring.style.top = `${box.top + box.height / 2}px`;
    document.body.appendChild(ring);
    ring.addEventListener('animationend', () => ring.remove(), { once: true });
    try { navigator.vibrate?.(12); } catch {}
  };
  seal.addEventListener('click', stamp);
  seal.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stamp(); } });
});

// ---------- Ink on press: a drop spreads from where a button was touched ----------
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
      trail.width = Math.round(innerWidth * dpr);
      trail.height = Math.round(innerHeight * dpr);
      trail.style.width = `${innerWidth}px`;
      trail.style.height = `${innerHeight}px`;
    };
    resize();
    addEventListener('resize', resize, { passive: true });
    function paint(now: number) {
      frame = 0;
      ctx!.clearRect(0, 0, trail!.width, trail!.height);
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        const t = (now - d.born) / d.life;
        if (t >= 1) { drops.splice(i, 1); continue; }
        const ease = 1 - Math.pow(1 - t, 3);
        const r = d.r * (0.4 + ease * 1.2) * dpr;
        const g = ctx!.createRadialGradient(d.x * dpr, d.y * dpr, 0, d.x * dpr, d.y * dpr, r);
        const a = (1 - t) * 0.42;
        g.addColorStop(0, `hsla(${d.hue}, 45%, 72%, ${a})`);
        g.addColorStop(0.6, `hsla(${d.hue}, 45%, 62%, ${a * 0.45})`);
        g.addColorStop(1, `hsla(${d.hue}, 45%, 55%, 0)`);
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
        drops.push({
          x: e.clientX + (Math.random() - 0.5) * speed * 0.6,
          y: e.clientY + (Math.random() - 0.5) * speed * 0.6,
          r: 2 + Math.min(14, speed * 0.28) * Math.random(),
          born: now,
          life: 700 + Math.random() * 600,
          hue: Math.random() < 0.82 ? 150 + Math.random() * 20 : 38
        });
      }
      if (!frame) frame = requestAnimationFrame(paint);
    }, { passive: true });
  }
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
document.querySelectorAll<HTMLElement>('[data-solar-term]').forEach(el => {
  const [zh, en] = solarTerm();
  el.innerHTML = `<span lang="zh">${zh}</span><i>·</i>${en}`;
});
