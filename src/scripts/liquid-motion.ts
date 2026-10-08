const root = document.documentElement;
const prefersStill = matchMedia('(prefers-reduced-motion: reduce)');

// SVG backdrop filters are reliable in Blink. The base material works elsewhere.
if (/Chrome|Chromium|Edg\//.test(navigator.userAgent) && CSS.supports('backdrop-filter', 'url(#liquid-lens) blur(1px)')) {
  root.classList.add('refraction-enabled');
}

function installLens(host: HTMLElement, selector: string, selected: string, className: string) {
  const controls = Array.from(host.querySelectorAll<HTMLElement>(selector));
  if (!controls.length) return;
  const lens = document.createElement(host.tagName === 'UL' ? 'li' : 'span');
  lens.className = className;
  lens.setAttribute('aria-hidden', 'true');
  if (host.tagName === 'UL') lens.setAttribute('role', 'presentation');
  host.prepend(lens);
  let hovered: HTMLElement | null = null;
  let frame = 0;

  function paint() {
    frame = 0;
    const focused = controls.find(control => control.matches(':focus-visible'));
    const control = hovered ?? focused ?? host.querySelector<HTMLElement>(selected);
    if (!control || !host.getClientRects().length) {
      lens.style.opacity = '0';
      return;
    }
    const box = control.getBoundingClientRect();
    const parent = host.getBoundingClientRect();
    lens.style.width = `${box.width}px`;
    lens.style.height = `${box.height}px`;
    lens.style.transform = `translate3d(${box.left - parent.left}px, ${box.top - parent.top}px, 0)`;
    lens.style.opacity = '1';
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(paint);
  }
  controls.forEach(control => {
    control.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch') return;
      hovered = control;
      schedule();
    });
    control.addEventListener('pointerleave', () => { hovered = null; schedule(); });
    control.addEventListener('focus', schedule);
    control.addEventListener('blur', schedule);
  });
  new MutationObserver(schedule).observe(host, {subtree: true, attributes: true, attributeFilter: ['aria-current', 'aria-pressed']});
  new ResizeObserver(schedule).observe(host);
  addEventListener('lang:change', schedule);
  document.fonts.ready.then(schedule);
  schedule();
}

document.querySelectorAll<HTMLElement>('.nav-track').forEach(host => {
  installLens(host, '.nav-link', '.nav-link[aria-current]', 'nav-lens');
});
document.querySelectorAll<HTMLElement>('.particle-modes').forEach(host => {
  installLens(host, 'button[data-particle-mode]', 'button[aria-pressed="true"]', 'mode-lens');
});

// A native snapshot transition changes only the viewport and hash. It never
// replaces the page DOM, so the globe, maps, players and language state survive.
let chapterTransition: ViewTransition | null = null;
document.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || prefersStill.matches || !document.startViewTransition) return;
  const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
  if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self') || anchor.classList.contains('skip-link')) return;
  const destination = new URL(anchor.href, location.href);
  if (destination.origin !== location.origin || destination.pathname !== location.pathname || destination.search !== location.search || !destination.hash) return;
  let target: HTMLElement | null;
  try { target = document.getElementById(decodeURIComponent(destination.hash.slice(1))); }
  catch { return; }
  if (!target) return;
  event.preventDefault();
  chapterTransition?.skipTransition();
  const x = event.detail === 0 ? innerWidth / 2 : event.clientX;
  const y = event.detail === 0 ? Math.min(160, innerHeight / 3) : event.clientY;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  root.style.setProperty('--transition-x', `${x}px`);
  root.style.setProperty('--transition-y', `${y}px`);
  root.style.setProperty('--transition-radius', `${Math.ceil(radius)}px`);
  root.dataset.transition = 'chapter';

  const transition = document.startViewTransition(() => {
    if (location.hash !== destination.hash) history.pushState(null, '', destination.href);
    target.scrollIntoView({behavior: 'instant', block: 'start'});
    // The chapter's number answers the jump: a moment of cinnabar, then it settles.
    target.classList.remove('is-arrived'); void target.offsetWidth; target.classList.add('is-arrived');
    setTimeout(() => target.classList.remove('is-arrived'), 2000);
    // IntersectionObserver runs asynchronously; make the new snapshot readable.
    document.querySelectorAll<HTMLElement>('.reveal').forEach(element => {
      const box = element.getBoundingClientRect();
      if (box.bottom > 0 && box.top < innerHeight) element.classList.add('is-visible');
    });
    if (event.detail === 0) {
      const temporaryTabIndex = !target.hasAttribute('tabindex');
      if (temporaryTabIndex) target.tabIndex = -1;
      target.dataset.arriving = '';
      target.focus({preventScroll: true});
      target.addEventListener('blur', () => {
        if (temporaryTabIndex) target.removeAttribute('tabindex');
        target.removeAttribute('data-arriving');
      }, {once: true});
    }
  });
  chapterTransition = transition;
  // A hidden tab or a rapid second click can skip an otherwise valid transition.
  transition.ready.catch(() => {});
  const finish = () => {
    if (chapterTransition !== transition) return;
    chapterTransition = null;
    delete root.dataset.transition;
    root.style.removeProperty('--transition-x');
    root.style.removeProperty('--transition-y');
    root.style.removeProperty('--transition-radius');
  };
  transition.finished.then(finish, finish);
});

prefersStill.addEventListener('change', () => {
  if (prefersStill.matches) chapterTransition?.skipTransition();
});
