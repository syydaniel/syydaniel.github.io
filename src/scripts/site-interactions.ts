const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

// Content starts visible. Only off-screen blocks opt in to an entrance animation.
const reveals = document.querySelectorAll<HTMLElement>('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  }
}, {rootMargin: '0px 0px -30px 0px', threshold: 0});
reveals.forEach(element => {
  const surface = element.querySelector('canvas, [id$="-map"]');
  element.classList.add(surface ? 'reveal-surface' : element.querySelector('.media-img') ? 'reveal-image' : 'reveal-text');
  if (reducedMotion.matches || element.getBoundingClientRect().top < innerHeight) element.classList.add('is-visible');
  else {
    element.classList.add('will-reveal');
    revealObserver.observe(element);
  }
});
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) {
    reveals.forEach(element => element.classList.add('is-visible'));
    revealObserver.disconnect();
  }
});


// A single frame per pointer event for the active card; no perpetual cursor loop.
const pointerMedia = matchMedia('(hover: hover) and (pointer: fine)');
let activeCard: HTMLElement | null = null;
let pointerFrame = 0;
let pointerX = 0;
let pointerY = 0;
function clearCard() {
  if (!activeCard) return;
  activeCard.style.removeProperty('--glass-x');
  activeCard.style.removeProperty('--glass-y');
  activeCard.style.removeProperty('--glass-angle');
  activeCard.style.removeProperty('--tilt-x');
  activeCard.style.removeProperty('--tilt-y');
  activeCard.removeAttribute('data-glass-active');
  activeCard = null;
  if (pointerFrame) cancelAnimationFrame(pointerFrame);
  pointerFrame = 0;
}
document.addEventListener('pointermove', event => {
  if (!pointerMedia.matches || reducedMotion.matches) return;
  const card = (event.target as HTMLElement | null)?.closest<HTMLElement>('a.glass.card-hover, button.glass.card-hover, .skill-tile, .site-nav-panel, .scene-console, .gallery-console, .film-open, .film-stage');
  if (!card) { clearCard(); return; }
  if (activeCard !== card) {
    clearCard();
    activeCard = card;
    card.dataset.glassActive = 'true';
  }
  pointerX = event.clientX;
  pointerY = event.clientY;
  if (pointerFrame) return;
  pointerFrame = requestAnimationFrame(() => {
    pointerFrame = 0;
    if (!activeCard) return;
    const rect = activeCard.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (pointerX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (pointerY - rect.top) / rect.height));
    activeCard.style.setProperty('--glass-x', `${x * 100}%`);
    activeCard.style.setProperty('--glass-y', `${y * 100}%`);
    activeCard.style.setProperty('--glass-angle', `${Math.atan2(y - .5, x - .5) * 180 / Math.PI + 90}deg`);
    activeCard.style.setProperty('--tilt-x', `${(.5 - y) * 2}deg`);
    activeCard.style.setProperty('--tilt-y', `${(x - .5) * 2}deg`);
  });
}, {passive: true});
document.addEventListener('pointerleave', clearCard);
addEventListener('blur', clearCard);
reducedMotion.addEventListener('change', clearCard);
