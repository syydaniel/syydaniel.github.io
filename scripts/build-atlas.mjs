// Builds the atlas the maps are drawn from: Natural Earth 1:50m country shapes
// (via the world-atlas package), simplified a little and kept as TopoJSON so the
// whole world is one small file. scripts/atlas.ts decodes it in the browser.
//   npm run atlas
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { presimplify, simplify, quantile } from 'topojson-simplify';
import { quantize } from 'topojson-client';

const require = createRequire(import.meta.url);
const source = require.resolve('world-atlas/countries-50m.json');
const topo = JSON.parse(readFileSync(source, 'utf8'));
// Keep 55% of the vertices: enough for the coastlines to curve at the zooms the atlas is read at.
const weighted = presimplify(topo);
// Back to a quantized grid (integers, delta-encoded) so the file stays small.
const simplified = quantize(simplify(weighted, quantile(weighted, 0.45)), 2e4);
for (const g of simplified.objects.countries.geometries) g.properties = { name: g.properties?.name ?? '' };
const out = { type: 'Topology', transform: simplified.transform, arcs: simplified.arcs, objects: { countries: simplified.objects.countries } };
const json = JSON.stringify(out);
writeFileSync(new URL('../public/atlas/countries.json', import.meta.url), json);
console.log(`public/atlas/countries.json: ${(json.length / 1024).toFixed(0)} KB, ${out.arcs.length} arcs, ${out.objects.countries.geometries.length} countries`);
