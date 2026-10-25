// 轻装, the lite page. On a phone or a tablet (a coarse pointer, no hover), on
// a connection that asked for less data, or on a device short of memory, the
// page keeps its paper, its type and its colours but not the GPU work: no ink
// fluid (a still wash instead), the catchment frozen into a picture once it
// has landed, the globe asleep while off screen, the maps built only when
// reached and at a lower pixel ratio, no filtered washes, no blur behind the
// cards, no blend pass for the grain. Six WebGL contexts with their
// framebuffers at 3x is what made a phone's browser give up on the page.
// ?lite=1 shows the lite page on a desktop; ?lite=0 the full one on a phone.
const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
const forced = new URLSearchParams(location.search).get('lite');
export const lite: boolean =
  forced === '1' ? true : forced === '0' ? false :
  matchMedia('(hover: none) and (pointer: coarse)').matches ||
  !!nav.connection?.saveData ||
  (nav.deviceMemory !== undefined && nav.deviceMemory < 4);
if (lite) document.documentElement.dataset.lite = '';
