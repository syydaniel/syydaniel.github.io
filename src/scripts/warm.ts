// Heavy things (a map and the shaders it compiles) are built while the page is
// idle after it has loaded, one at a time with a breath between them, instead
// of the moment they scroll into view: a shader compiling mid-scroll is a
// dropped frame or three. Anything the reader reaches before its turn is built
// at once. Phones short of memory, and readers who asked for less data, keep
// the lazy behaviour.

type Job = { run: () => void; done: boolean };
const queue: Job[] = [];
const root = document.documentElement;
const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
const eager = !nav.connection?.saveData && (nav.deviceMemory === undefined || nav.deviceMemory >= 4);
const idle = (fn: () => void, timeout: number) =>
  'requestIdleCallback' in window ? (window as any).requestIdleCallback(fn, { timeout }) : setTimeout(fn, 300);

let ready = false, draining = false;
function drain() {
  if (draining || !ready) return;
  const next = queue.find(j => !j.done);
  if (!next) return;
  draining = true;
  idle(() => {
    draining = false;
    if (!next.done) { next.done = true; try { next.run(); } catch {} }
    setTimeout(drain, 1200);
  }, 3000);
}
function begin() { if (ready) return; ready = true; setTimeout(drain, 1800); }
function start() {
  if (root.dataset.intro === 'pending' || root.dataset.intro === 'playing') addEventListener('intro:done', () => setTimeout(begin, 1500), { once: true });
  else begin();
}
if (eager) { if (document.readyState === 'complete') start(); else addEventListener('load', start); }

export function warm(el: Element, run: () => void, rootMargin = '300px') {
  const job: Job = { run, done: false };
  queue.push(job);
  const io = new IntersectionObserver(entries => {
    if (!entries.some(e => e.isIntersecting)) return;
    io.disconnect();
    if (!job.done) { job.done = true; run(); }
  }, { rootMargin });
  io.observe(el);
  drain();
}
