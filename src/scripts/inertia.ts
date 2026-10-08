// Inertial wheel scrolling on desktop: the wheel sets a target and the page eases
// toward it, so parallax, marquees and the ink move as one. Only the wheel is
// taken over (keyboard, scrollbar, anchors and touch stay native) and only where
// nothing else wants it: never over the maps, the globe, the gallery stage, a
// canvas, a text field, or any element that can still scroll on its own.
// Reduced motion and coarse pointers never see it.

const fine = matchMedia('(hover: hover) and (pointer: fine)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const root = document.documentElement;

if (fine.matches && !reduced.matches && navigator.maxTouchPoints === 0) {
  let target = scrollY;
  let current = scrollY;
  let applied = scrollY;
  let frame = 0;
  const NATIVE = 'canvas, .maplibregl-map, .gallery-stage, textarea, select, input, [data-scroll-native]';

  function scrollable(el: Element | null, delta: number): boolean {
    for (let node = el; node && node !== document.body; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (!/(auto|scroll)/.test(style.overflowY)) continue;
      if (node.scrollHeight <= node.clientHeight + 1) continue;
      if (delta > 0 ? node.scrollTop + node.clientHeight < node.scrollHeight - 1 : node.scrollTop > 0) return true;
    }
    return false;
  }
  function place(y: number) {
    current = y;
    applied = Math.round(y);
    scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
  }
  function tick() {
    frame = 0;
    // Someone else moved the page (an anchor, a key, the scrollbar): let go at once.
    if (Math.abs(scrollY - applied) > 1) { target = current = applied = scrollY; return; }
    const max = root.scrollHeight - innerHeight;
    target = Math.max(0, Math.min(max, target));
    const diff = target - current;
    if (Math.abs(diff) < 0.4) { place(target); return; }
    place(current + diff * 0.15);
    frame = requestAnimationFrame(tick);
  }
  addEventListener('wheel', event => {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || reduced.matches) return;
    if (root.dataset.intro === 'playing' || root.dataset.smooth === 'off') return;
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const el = event.target instanceof Element ? event.target : null;
    if (el?.closest(NATIVE) || scrollable(el, event.deltaY)) return;
    if (document.querySelector('dialog[open], #lightbox[aria-hidden="false"], #globe-lightbox[aria-hidden="false"]')) return;
    event.preventDefault();
    let delta = event.deltaY;
    if (event.deltaMode === 1) delta *= 16;
    else if (event.deltaMode === 2) delta *= innerHeight;
    delta = Math.max(-260, Math.min(260, delta));
    if (!frame) current = applied = scrollY;
    target = Math.max(0, Math.min(root.scrollHeight - innerHeight, (frame ? target : scrollY) + delta * 1.1));
    if (!frame) frame = requestAnimationFrame(tick);
  }, { passive: false });
  // Anything else that moves the page (keys, scrollbar, anchors) resets the target.
  addEventListener('scroll', () => { if (!frame) { target = current = applied = scrollY; } }, { passive: true });
  addEventListener('keydown', () => { if (frame) { cancelAnimationFrame(frame); frame = 0; target = current = applied = scrollY; } });
}
