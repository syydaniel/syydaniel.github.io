// A list that changes shape (a filter, a "show all") moves rather than jumps.
// FLIP: measure the visible items, apply the change, measure again, and play
// each survivor from where it was to where it is; arrivals rise in. No
// snapshots, so it costs nothing on a page full of canvases. Reduced motion
// just applies the change.

const still = matchMedia('(prefers-reduced-motion: reduce)');
const EASE = 'cubic-bezier(.16, 1, .3, 1)';
const visible = (el: HTMLElement) => el.offsetParent !== null;

export function reflow(items: Iterable<HTMLElement>, change: () => void): void {
  const list = [...items];
  if (still.matches || document.hidden) { change(); return; }
  const before = new Map<HTMLElement, DOMRect>();
  list.forEach((el) => { if (visible(el)) before.set(el, el.getBoundingClientRect()); });
  change();
  let arrivals = 0;
  list.forEach((el) => {
    if (!visible(el)) return;
    el.getAnimations().forEach((a) => a.cancel());
    const after = el.getBoundingClientRect();
    const prev = before.get(el);
    if (prev) {
      const dx = prev.left - after.left, dy = prev.top - after.top;
      if (Math.abs(dx) + Math.abs(dy) < 0.5) return;
      el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 560, easing: EASE });
    } else {
      el.animate([{ opacity: 0, transform: 'translateY(14px) scale(.985)' }, { opacity: 1, transform: 'none' }], { duration: 480, easing: EASE, delay: Math.min(240, 40 + arrivals++ * 35), fill: 'backwards' });
    }
  });
}
