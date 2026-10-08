import type { Photo } from '../data/photos';
import type { createPhotoDeveloper } from './gallery-particles';

type GalleryPhoto = Photo & {captionZh?: string};
type Developer = ReturnType<typeof createPhotoDeveloper>;

export function mountSpatialGallery() {
  const root = document.getElementById('spatial-gallery');
  const data = document.getElementById('gallery-data');
  const viewer = document.getElementById('gallery-viewer') as HTMLDialogElement | null;
  if (!root || !data || !viewer?.showModal) return;
  const photos: GalleryPhoto[] = JSON.parse(data.textContent || '[]');
  const cards = Array.from(root.querySelectorAll<HTMLAnchorElement>('.gallery-plane'));
  if (!photos.length || photos.length !== cards.length) return;
  const element = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
  const stage = root.querySelector<HTMLElement>('.gallery-stage')!;
  const ambient = root.querySelector<HTMLElement>('.gallery-ambient')!;
  const canvas = element<HTMLCanvasElement>('gallery-particles');
  const fullImage = element<HTMLImageElement>('gallery-full-image');
  const viewerInfo = root.ownerDocument.querySelector<HTMLElement>('.gallery-viewer-info')!;
  const closeButton = element<HTMLButtonElement>('gallery-viewer-close');
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  let selected = 0;
  let frameWidth = 0;
  let radius = 0;
  let poseFrame = 0;
  let visible = true;
  let developer: Developer | null = null;
  let developerImport: Promise<typeof import('./gallery-particles')> | null = null;
  let development: AbortController | null = null;
  let developmentTimer = 0;
  let developmentVersion = 0;
  let rendererUnavailable = false;
  let imageVersion = 0;
  let motion: Animation | null = null;
  let previousOverflow = '';
  let drag: {id: number; start: number; current: number; moved: boolean} | null = null;
  let suppressClickUntil = 0;
  let wheelTotal = 0;
  let wheelTime = 0;
  const upgraded = new Set<number>();

  const wrap = (index: number) => ((index % photos.length) + photos.length) % photos.length;
  const chinese = () => document.documentElement.dataset.lang === 'zh';
  const caption = (photo: GalleryPhoto) => chinese() ? photo.captionZh || photo.caption || photo.location.name : photo.caption || photo.location.name;
  const photoDate = (photo: GalleryPhoto) => new Intl.DateTimeFormat(chinese() ? 'zh-CN' : 'en-GB', {year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC'}).format(new Date(photo.takenAt));
  const translated = (key: string, fallback: string) => (window as unknown as {__t?: (key: string) => string}).__t?.(key) || fallback;

  function upgradeSelectedPhoto() {
    const index = selected;
    if (upgraded.has(index)) return;
    upgraded.add(index);
    const original = new Image();
    original.onload = () => {
      const image = cards[index].querySelector('img');
      if (image) image.src = photos[index].src;
    };
    original.onerror = () => upgraded.delete(index);
    original.src = photos[index].src;
  }

  function updateLabels() {
    const photo = photos[selected];
    element('gallery-current-caption').textContent = caption(photo);
    element('gallery-current-place').textContent = `${photo.location.name} · ${photo.location.country}`;
    element('gallery-current-number').textContent = String(selected + 1).padStart(2, '0');
    cards.forEach((card, i) => card.setAttribute('aria-label', `${translated('gallery.open', 'View photograph')}: ${caption(photos[i])}`));
    element('gallery-announcement').textContent = `${selected + 1} / ${photos.length} · ${caption(photo)}`;
    if (viewer!.open) updateFullLabels();
  }
  function updateFullLabels() {
    const photo = photos[selected];
    element('gallery-full-caption').textContent = caption(photo);
    element('gallery-full-place').textContent = `${photo.location.name} · ${photo.location.country} · ${photoDate(photo)}`;
    element('gallery-full-camera').textContent = photo.camera || '';
    element('gallery-full-exposure').textContent = photo.exposure || '';
    element('gallery-full-number').textContent = `${String(selected + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
    fullImage.alt = caption(photo);
  }
  function paintPose(position = selected) {
    cards.forEach((card, i) => {
      let offset = i - position;
      offset -= Math.round(offset / photos.length) * photos.length;
      const angle = offset * .62;
      const x = Math.sin(angle) * radius;
      const z = (Math.cos(angle) - 1) * radius;
      const near = Math.abs(offset) < 2.8;
      card.style.transform = `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px) rotateY(${-angle * 180 / Math.PI}deg)`;
      card.style.opacity = near ? String(Math.max(.15, 1 - Math.abs(offset) * .3)) : '0';
      card.style.filter = `brightness(${Math.max(.42, 1 - Math.abs(offset) * .25)})`;
      card.style.pointerEvents = near ? 'auto' : 'none';
      const active = i === selected;
      card.toggleAttribute('data-selected', active);
      card.tabIndex = active ? 0 : -1;
      card.setAttribute('aria-hidden', String(!active));
    });
  }
  function cancelDevelopment() {
    developmentVersion++;
    if (developmentTimer) clearTimeout(developmentTimer);
    developmentTimer = 0;
    development?.abort();
    development = null;
    developer?.cancel();
    root!.removeAttribute('data-developing');
    root!.style.removeProperty('--develop-image-opacity');
  }
  function scheduleDevelopment(delay: number) {
    cancelDevelopment();
    if (still.matches || !visible || document.hidden || rendererUnavailable || viewer!.open) return;
    const version = developmentVersion;
    root!.dataset.developing = 'pending';
    developmentTimer = window.setTimeout(async () => {
      developmentTimer = 0;
      const controller = new AbortController();
      development = controller;
      try {
        developerImport ??= import('./gallery-particles');
        const module = await developerImport;
        if (version !== developmentVersion || controller.signal.aborted) return;
        developer ??= module.createPhotoDeveloper(canvas);
        root!.dataset.renderer = 'webgl';
        // Let the helper finish loading the source before hiding the native image.
        const complete = await developer.develop(photos[selected].thumb, controller.signal, blend => {
          if (version !== developmentVersion) return;
          root!.dataset.developing = 'active';
          root!.style.setProperty('--develop-image-opacity', String(blend));
        });
        if (!complete && version === developmentVersion) root!.dataset.renderer = 'fallback';
      } catch {
        if (version === developmentVersion) {
          rendererUnavailable = true;
          root!.dataset.renderer = 'fallback';
          developer?.dispose();
          developer = null;
        }
      } finally {
        if (version === developmentVersion) {
          root!.removeAttribute('data-developing');
          root!.style.removeProperty('--develop-image-opacity');
          development = null;
        }
      }
    }, delay);
  }
  function goTo(index: number, keyboard = false, develop = true) {
    const next = wrap(index);
    const changed = next !== selected;
    cancelDevelopment();
    selected = next;
    root!.dataset.index = String(selected);
    paintPose();
    updateLabels();
    upgradeSelectedPhoto();
    ambient.style.backgroundImage = `url(${JSON.stringify(photos[selected].thumb)})`;
    if (keyboard && !viewer!.open) cards[selected].focus({preventScroll: true});
    if (viewer!.open) showFullImage(false);
    else if (changed && develop) scheduleDevelopment(870);
  }
  function fullRect() {
    const photo = photos[selected];
    const mobile = innerWidth < 768;
    const availableWidth = innerWidth - (mobile ? 32 : 144);
    const infoHeight = viewerInfo.getBoundingClientRect().height;
    const top = mobile ? 78 : 80;
    const bottom = Math.max(mobile ? 180 : 145, infoHeight + (mobile ? 30 : 42));
    const availableHeight = Math.max(80, innerHeight - top - bottom);
    const width = Math.min(availableWidth, availableHeight * photo.width / photo.height, 1400);
    const height = width * photo.height / photo.width;
    return {left: (innerWidth - width) / 2, top: top + (availableHeight - height) / 2, width, height};
  }
  function positionFullImage() {
    const rect = fullRect();
    Object.assign(fullImage.style, {left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`});
    return rect;
  }
  function animateImage(frames: Keyframe[], duration: number) {
    motion?.cancel();
    motion = null;
    if (still.matches) return Promise.resolve();
    motion = fullImage.animate(frames, {duration, easing: 'cubic-bezier(.22,1,.36,1)'});
    return motion.finished.catch(() => {});
  }
  function showFullImage(fromCard: boolean) {
    const version = ++imageVersion;
    const photo = photos[selected];
    const origin = cards[selected].getBoundingClientRect();
    fullImage.src = photo.thumb;
    updateFullLabels();
    viewer!.querySelector<HTMLElement>('.gallery-viewer-atmosphere')!.style.backgroundImage = `url(${JSON.stringify(photo.thumb)})`;
    const destination = positionFullImage();
    if (fromCard) {
      void animateImage([
        {transform: `translate(${origin.left - destination.left}px, ${origin.top - destination.top}px) scale(${origin.width / destination.width}, ${origin.height / destination.height})`, borderRadius: '5px'},
        {transform: 'translate(0, 0) scale(1)', borderRadius: '4px'}
      ], 720);
    } else void animateImage([{opacity: .3, transform: 'translateY(8px)'}, {opacity: 1, transform: 'none'}], 400);
    const highResolution = new Image();
    highResolution.onload = () => {
      if (version === imageVersion && viewer!.open && !viewer!.hasAttribute('data-closing')) fullImage.src = photo.src;
    };
    highResolution.src = photo.src;
  }
  function openPhoto() {
    if (viewer!.open) return;
    cancelDevelopment();
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    viewer!.removeAttribute('data-closing');
    viewer!.showModal();
    showFullImage(true);
    closeButton.focus({preventScroll: true});
  }
  async function closePhoto(immediate = false) {
    if (!viewer!.open) return;
    if (immediate) {
      imageVersion++;
      motion?.cancel(); motion = null;
      document.body.style.overflow = previousOverflow;
      viewer!.close();
      return;
    }
    if (viewer!.hasAttribute('data-closing')) return;
    imageVersion++;
    viewer!.dataset.closing = '';
    const origin = cards[selected].getBoundingClientRect();
    const destination = fullImage.getBoundingClientRect();
    await animateImage([
      {transform: 'translate(0, 0) scale(1)', opacity: 1},
      {transform: `translate(${origin.left - destination.left}px, ${origin.top - destination.top}px) scale(${origin.width / destination.width}, ${origin.height / destination.height})`, opacity: .8}
    ], 540);
    viewer!.close();
  }
  viewer.addEventListener('close', () => {
    imageVersion++;
    motion?.cancel(); motion = null;
    document.body.style.overflow = previousOverflow;
    viewer.removeAttribute('data-closing');
    cards[selected].focus({preventScroll: true});
  });
  viewer.addEventListener('cancel', event => { event.preventDefault(); void closePhoto(); });
  viewer.addEventListener('click', event => { if (event.target === viewer) void closePhoto(); });
  closeButton.addEventListener('click', () => { void closePhoto(); });
  element('gallery-full-prev').addEventListener('click', () => { if (!viewer.hasAttribute('data-closing')) goTo(selected - 1); });
  element('gallery-full-next').addEventListener('click', () => { if (!viewer.hasAttribute('data-closing')) goTo(selected + 1); });
  cards.forEach((card, index) => card.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (performance.now() < suppressClickUntil) return;
    if (selected === index) openPhoto();
    else goTo(index);
  }));
  element('gallery-prev').addEventListener('click', () => goTo(selected - 1));
  element('gallery-next').addEventListener('click', () => goTo(selected + 1));
  element('gallery-open').addEventListener('click', openPhoto);

  document.addEventListener('keydown', event => {
    if ((!visible && !viewer.open) || event.metaKey || event.ctrlKey || event.altKey || viewer.hasAttribute('data-closing')) return;
    if (document.querySelector('dialog[open]:not(#gallery-viewer), #arcade-modal[aria-hidden="false"]')) return;
    if (event.target instanceof HTMLElement && (/INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || event.target.closest('#site-nav'))) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(selected + (event.key === 'ArrowLeft' ? -1 : 1), true);
    }
  });
  stage.addEventListener('pointerdown', event => {
    if (event.button !== 0 || !event.isPrimary) return;
    drag = {id: event.pointerId, start: event.clientX, current: event.clientX, moved: false};
  });
  stage.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    drag.current = event.clientX;
    if (!drag.moved && Math.abs(drag.current - drag.start) > 8) {
      drag.moved = true;
      cancelDevelopment();
      root.dataset.dragging = '';
      stage.setPointerCapture(event.pointerId);
    }
    if (!drag.moved || poseFrame) return;
    poseFrame = requestAnimationFrame(() => {
      poseFrame = 0;
      if (drag) paintPose(selected + (drag.start - drag.current) / (frameWidth * .65));
    });
  });
  function finishDrag(event: PointerEvent) {
    if (!drag || drag.id !== event.pointerId) return;
    const state = drag;
    drag = null;
    root!.removeAttribute('data-dragging');
    if (poseFrame) cancelAnimationFrame(poseFrame);
    poseFrame = 0;
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    if (state.moved) {
      suppressClickUntil = performance.now() + 350;
      const offset = event.type === 'pointercancel' ? 0 : (state.start - state.current) / (frameWidth * .65);
      goTo(selected + Math.round(offset), false, false);
    }
  }
  stage.addEventListener('pointerup', finishDrag);
  stage.addEventListener('pointercancel', finishDrag);
  // Touch begins with implicit capture on the image. Its transfer to the stage
  // bubbles a lost-capture event from the image, while the drag is still active.
  stage.addEventListener('lostpointercapture', event => {
    if (event.target === stage) finishDrag(event);
  });
  stage.addEventListener('dragstart', event => event.preventDefault());
  stage.addEventListener('wheel', event => {
    if (event.ctrlKey || viewer.open || !(event.target instanceof Element) || !event.target.closest('.gallery-plane')) return;
    event.preventDefault();
    const now = performance.now();
    if (now - wheelTime > 200) wheelTotal = 0;
    wheelTotal += Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (Math.abs(wheelTotal) >= 55 && now - wheelTime > 220) {
      goTo(selected + Math.sign(wheelTotal));
      wheelTotal = 0;
      wheelTime = now;
    }
  }, {passive: false});

  function resize() {
    cancelDevelopment();
    const box = stage.getBoundingClientRect();
    frameWidth = Math.max(180, Math.min(innerWidth < 768 ? box.width * .78 : box.width * .48, 620, box.height * .86 * 1.5));
    radius = frameWidth * 1.36;
    root!.style.setProperty('--frame-width', `${frameWidth}px`);
    root!.style.setProperty('--frame-height', `${frameWidth / 1.5}px`);
    paintPose();
    if (viewer!.open) { motion?.cancel(); motion = null; positionFullImage(); }
  }
  root.dataset.enhanced = '';
  root.dataset.index = '0';
  root.querySelectorAll<HTMLElement>('.gallery-console, .gallery-caption').forEach(el => { el.hidden = false; });
  let firstSize = true;
  new ResizeObserver(() => {
    resize();
    if (firstSize) {
      firstSize = false;
      scheduleDevelopment(120);
    }
  }).observe(stage);
  addEventListener('resize', resize, {passive: true});
  resize();
  updateLabels();
  upgradeSelectedPhoto();
  ambient.style.backgroundImage = `url(${JSON.stringify(photos[0].thumb)})`;
  const visibility = new IntersectionObserver(entries => {
    visible = entries[0]?.isIntersecting ?? false;
    if (!visible) cancelDevelopment();
  });
  visibility.observe(stage);
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelDevelopment(); });
  still.addEventListener('change', () => {
    cancelDevelopment();
    if (still.matches) { developer?.dispose(); developer = null; }
  });
  addEventListener('lang:change', () => {
    updateLabels();
    if (viewer.open) requestAnimationFrame(() => positionFullImage());
  });
  addEventListener('pagehide', () => {
    cancelDevelopment();
    developer?.dispose(); developer = null;
    if (viewer.open) void closePhoto(true);
  });
  requestAnimationFrame(updateLabels);
}
