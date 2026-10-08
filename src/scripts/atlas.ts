// The atlas: one ink-wash base shared by the three maps (Journey, Places,
// Photography). The world is drawn here, not fetched as somebody else's tiles:
// Natural Earth coastlines decoded from public/atlas/countries.json (TopoJSON,
// scripts/build-atlas.mjs) become paper land on a washed sea, a hairline coast,
// dashed borders and a 10° graticule, all in the page's two inks. Beyond zoom 5
// a desaturated raster base (Esri light or dark grey, by theme) fades in under
// the lines for street-level detail. Every colour is read from the theme tokens
// and repainted on `themechange`.
import type { Map as MLMap, StyleSpecification, LayerSpecification } from 'maplibre-gl';
import { resolveColor } from './theme';

type ML = typeof import('maplibre-gl').default;
type Topology = { transform: { scale: [number, number]; translate: [number, number] }; arcs: number[][][]; objects: { countries: { geometries: { type: string; arcs: any; properties?: { name?: string }; id?: string }[] } } };
export type World = { land: GeoJSON.FeatureCollection; coast: GeoJSON.Feature; borders: GeoJSON.Feature; graticule: GeoJSON.FeatureCollection };

let lib: Promise<ML> | null = null;
export function loadMapLibre(): Promise<ML> {
  if (!lib) lib = Promise.all([import('maplibre-gl/dist/maplibre-gl.css'), import('maplibre-gl')]).then(([, m]) => m.default);
  return lib;
}

// The atlas is stitched (a ring may run straight across the antimeridian, as on a
// sphere). A flat map needs every ring cut at ±180° and a ring around a pole closed
// through the pole along the seam.
type Pt = [number, number];
function cutRing(r: Pt[]): Pt[][] {
  const jumps: number[] = [];
  for (let i = 1; i < r.length; i++) if (Math.abs(r[i][0] - r[i - 1][0]) > 180) jumps.push(i);
  if (!jumps.length) return [r];
  if (jumps.length % 2 === 1) {
    const i = jumps[0], a = r[i - 1], b = r[i];
    const side = a[0] > 0 ? 180 : -180;
    const pole = r.reduce((s, p) => s + p[1], 0) / r.length < 0 ? -89.99 : 89.99;
    const path: Pt[] = [[side, a[1]], [side, pole], [-side, pole], [-side, b[1]]];
    return [[...r.slice(0, i), ...path, ...r.slice(i)]];
  }
  const shifted: Pt[] = r.map(([x, y]) => [x < 0 ? x + 360 : x, y]);
  const clip = (west: boolean): Pt[] => {
    const out: Pt[] = [];
    for (let i = 0; i < shifted.length - 1; i++) {
      const cur = shifted[i], nxt = shifted[i + 1];
      const cin = west ? cur[0] <= 180 : cur[0] >= 180, nin = west ? nxt[0] <= 180 : nxt[0] >= 180;
      if (cin) out.push(cur);
      if (cin !== nin && nxt[0] !== cur[0]) { const t = (180 - cur[0]) / (nxt[0] - cur[0]); out.push([180, cur[1] + t * (nxt[1] - cur[1])]); }
    }
    if (out.length) out.push(out[0]);
    return out;
  };
  const east = clip(true);
  const west: Pt[] = clip(false).map(([x, y]) => [x > 180 ? x - 360 : -180, y]);
  return [east, west].filter((p) => p.length >= 4);
}
function cutLine(a: Pt[]): Pt[][] {
  const parts: Pt[][] = [];
  let cur: Pt[] = [a[0]];
  for (let i = 1; i < a.length; i++) {
    if (Math.abs(a[i][0] - a[i - 1][0]) > 180) { parts.push(cur); cur = [a[i]]; } else cur.push(a[i]);
  }
  parts.push(cur);
  return parts.filter((p) => p.length >= 2);
}

// ---- TopoJSON → GeoJSON, just the parts the atlas needs ----
function decodeTopology(topo: Topology): World {
  const [sx, sy] = topo.transform.scale, [tx, ty] = topo.transform.translate;
  const arcs = topo.arcs.map((arc) => { let x = 0, y = 0; return arc.map(([dx, dy]) => { x += dx; y += dy; return [x * sx + tx, y * sy + ty] as [number, number]; }); });
  const use = new Uint8Array(arcs.length);
  const ring = (ids: number[]): [number, number][] => {
    const out: [number, number][] = [];
    for (const id of ids) {
      const a = arcs[id < 0 ? ~id : id];
      const pts = id < 0 ? [...a].reverse() : a;
      for (let i = out.length ? 1 : 0; i < pts.length; i++) out.push(pts[i]);
    }
    return out;
  };
  const features: GeoJSON.Feature[] = [];
  for (const g of topo.objects.countries.geometries) {
    const polys: number[][][] = g.type === 'Polygon' ? [g.arcs] : g.type === 'MultiPolygon' ? g.arcs : [];
    for (const poly of polys) for (const r of poly) for (const id of r) use[id < 0 ? ~id : id] = Math.min(2, use[id < 0 ? ~id : id] + 1);
    // Simplification can leave slivers (drop rings that no longer enclose anything); the
    // outer ring may need cutting at the seam, in which case its holes follow their side.
    const coords: Pt[][][] = [];
    for (const poly of polys) {
      const rings = poly.map(ring).filter((r) => r.length >= 4);
      if (!rings.length) continue;
      const outers = cutRing(rings[0]);
      const holes = rings.slice(1).flatMap(cutRing);
      if (outers.length === 1) coords.push([outers[0], ...holes]);
      else outers.forEach((o) => { const eastSide = o.some((p) => p[0] > 0); coords.push([o, ...holes.filter((h) => (h[0][0] > 0) === eastSide)]); });
    }
    if (!coords.length) continue;
    features.push({ type: 'Feature', id: g.id, properties: { name: g.properties?.name ?? '' }, geometry: coords.length === 1 ? { type: 'Polygon', coordinates: coords[0] } : { type: 'MultiPolygon', coordinates: coords } });
  }
  const coast: Pt[][] = [], borders: Pt[][] = [];
  arcs.forEach((a, i) => { if (use[i] === 1) coast.push(...cutLine(a)); else if (use[i] >= 2) borders.push(...cutLine(a)); });
  const lines: GeoJSON.Feature[] = [];
  for (let lon = -180; lon <= 180; lon += 10) { const c: [number, number][] = []; for (let lat = -85; lat <= 85; lat += 5) c.push([lon, lat]); lines.push({ type: 'Feature', properties: { major: lon % 30 === 0 }, geometry: { type: 'LineString', coordinates: c } }); }
  for (let lat = -80; lat <= 80; lat += 10) { const c: [number, number][] = []; for (let lon = -180; lon <= 180; lon += 5) c.push([lon, lat]); lines.push({ type: 'Feature', properties: { major: lat % 30 === 0 }, geometry: { type: 'LineString', coordinates: c } }); }
  return {
    land: { type: 'FeatureCollection', features },
    coast: { type: 'Feature', properties: {}, geometry: { type: 'MultiLineString', coordinates: coast } },
    borders: { type: 'Feature', properties: {}, geometry: { type: 'MultiLineString', coordinates: borders } },
    graticule: { type: 'FeatureCollection', features: lines }
  };
}
let world: Promise<World> | null = null;
export function loadWorld(): Promise<World> {
  if (!world) world = fetch('/atlas/countries.json').then((r) => r.json()).then(decodeTopology);
  return world;
}

// ---- The inks of the atlas, resolved for the current theme ----
export type AtlasInk = ReturnType<typeof atlasInk>;
export function atlasInk() {
  const dark = document.documentElement.dataset.theme === 'dark';
  return {
    dark,
    sea: resolveColor(dark ? 'color-mix(in srgb, var(--daiqing) 7%, var(--paper))' : 'color-mix(in srgb, var(--daiqing) 7%, var(--paper-2))'),
    land: resolveColor(dark ? 'var(--paper-4)' : 'var(--paper-hi)'),
    coast: resolveColor('var(--ink)'),
    border: resolveColor('var(--ink)'),
    grat: resolveColor('var(--ink)'),
    ink: resolveColor('var(--ink)'),
    ink3: resolveColor('var(--ink-3)'),
    daiqing: resolveColor('var(--daiqing)'),
    daiqing2: resolveColor('var(--daiqing-2)'),
    zhusha: resolveColor('var(--zhusha)'),
    seal: resolveColor('var(--seal)'),
    paper: resolveColor('var(--paper)'),
    paperHi: resolveColor('var(--paper-hi)')
  };
}

export type AtlasOptions = {
  center: [number, number];
  zoom: number;
  maxZoom?: number;
  minZoom?: number;
  pitch?: number;
  bearing?: number;
  rotate?: boolean;
  /** Street-level raster detail beyond zoom 5 (off for small maps that never zoom). */
  detail?: boolean;
  /** Where the +/- control sits; false for none. */
  controls?: 'top-right' | 'top-left' | false;
};
export type Atlas = { map: MLMap; maplibregl: ML; world: World; ready: Promise<void>; ink: () => AtlasInk; onTheme: (cb: (ink: AtlasInk) => void) => void };

const ESRI = (base: string) => `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/${base}/MapServer/tile/{z}/{y}/{x}`;

export async function createAtlas(container: HTMLElement, opts: AtlasOptions): Promise<Atlas> {
  const [maplibregl, world] = await Promise.all([loadMapLibre(), loadWorld()]);
  let ink = atlasInk();
  const detail = opts.detail !== false;
  const style: StyleSpecification = {
    version: 8,
    sources: {
      land: { type: 'geojson', data: world.land, attribution: 'Natural Earth' },
      coast: { type: 'geojson', data: world.coast },
      borders: { type: 'geojson', data: world.borders },
      graticule: { type: 'geojson', data: world.graticule },
      ...(detail ? {
        'esri-light': { type: 'raster', tiles: [ESRI('World_Light_Gray_Base')], tileSize: 256, minzoom: 4, maxzoom: 16, attribution: 'Detail © Esri, HERE, Garmin, © OpenStreetMap contributors' },
        'esri-dark': { type: 'raster', tiles: [ESRI('World_Dark_Gray_Base')], tileSize: 256, minzoom: 4, maxzoom: 16, attribution: 'Detail © Esri, HERE, Garmin, © OpenStreetMap contributors' }
      } : {})
    },
    layers: [
      { id: 'sea', type: 'background', paint: { 'background-color': ink.sea } },
      { id: 'land', type: 'fill', source: 'land', paint: { 'fill-color': ink.land, 'fill-antialias': true } },
      ...(detail ? (['esri-light', 'esri-dark'] as const).map((id): LayerSpecification => ({
        id, type: 'raster', source: id, minzoom: 4,
        layout: { visibility: (id === 'esri-dark') === ink.dark ? 'visible' : 'none' },
        paint: { 'raster-opacity': ['interpolate', ['linear'], ['zoom'], 5, 0, 6.6, 0.85], 'raster-saturation': -0.92, 'raster-contrast': ink.dark ? 0.05 : -0.05, 'raster-brightness-min': ink.dark ? 0 : 0.08, 'raster-brightness-max': ink.dark ? 0.6 : 1, 'raster-fade-duration': 400 }
      })) : []),
      { id: 'graticule', type: 'line', source: 'graticule', paint: { 'line-color': ink.grat, 'line-opacity': ['case', ['get', 'major'], ink.dark ? 0.14 : 0.1, ink.dark ? 0.08 : 0.055], 'line-width': 0.6 } },
      { id: 'borders', type: 'line', source: 'borders', paint: { 'line-color': ink.border, 'line-opacity': ink.dark ? 0.28 : 0.22, 'line-width': ['interpolate', ['linear'], ['zoom'], 1, 0.5, 6, 0.9], 'line-dasharray': [2.5, 2] } },
      { id: 'coast', type: 'line', source: 'coast', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': ink.coast, 'line-opacity': ink.dark ? 0.55 : 0.5, 'line-width': ['interpolate', ['linear'], ['zoom'], 1, 0.55, 5, 1, 9, 1.4] } }
    ]
  };
  const map = new maplibregl.Map({
    container, style, center: opts.center, zoom: opts.zoom, minZoom: opts.minZoom ?? 0.6, maxZoom: opts.maxZoom ?? 9,
    pitch: opts.pitch ?? 0, bearing: opts.bearing ?? 0, dragRotate: !!opts.rotate, pitchWithRotate: !!opts.rotate, touchPitch: !!opts.rotate,
    attributionControl: { compact: true }, renderWorldCopies: true
  });
  if (!opts.rotate) map.touchZoomRotate.disableRotation();
  // Beyond the edge of the world (visible when the table is tilted) the sea continues.
  container.style.background = ink.sea;
  if (opts.controls !== false) map.addControl(new maplibregl.NavigationControl({ showCompass: !!opts.rotate, visualizePitch: !!opts.rotate }), opts.controls ?? 'top-right');

  const listeners: ((ink: AtlasInk) => void)[] = [];
  function repaint() {
    ink = atlasInk();
    container.style.background = ink.sea;
    if (!map.isStyleLoaded()) return;
    map.setPaintProperty('sea', 'background-color', ink.sea);
    map.setPaintProperty('land', 'fill-color', ink.land);
    map.setPaintProperty('graticule', 'line-color', ink.grat);
    map.setPaintProperty('graticule', 'line-opacity', ['case', ['get', 'major'], ink.dark ? 0.14 : 0.1, ink.dark ? 0.08 : 0.055]);
    map.setPaintProperty('borders', 'line-color', ink.border);
    map.setPaintProperty('borders', 'line-opacity', ink.dark ? 0.28 : 0.22);
    map.setPaintProperty('coast', 'line-color', ink.coast);
    map.setPaintProperty('coast', 'line-opacity', ink.dark ? 0.55 : 0.5);
    if (detail) {
      map.setLayoutProperty('esri-light', 'visibility', ink.dark ? 'none' : 'visible');
      map.setLayoutProperty('esri-dark', 'visibility', ink.dark ? 'visible' : 'none');
    }
    listeners.forEach((cb) => cb(ink));
  }
  addEventListener('themechange', repaint);
  const ready = new Promise<void>((resolve) => { if (map.loaded()) resolve(); else map.once('load', () => resolve()); });
  return { map, maplibregl, world, ready, ink: () => ink, onTheme: (cb) => listeners.push(cb) };
}
