// Generates public/og-image.jpg: a branded 1200x630 social-share card built
// from one of the photography frames, darkened, with name + title overlaid.
// Run: npm run og:image  (also safe to wire into the build).
// Falls back to a gradient-only card if the source photo is missing.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync } from 'node:fs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'public', 'og-image.jpg');
const W = 1200;
const H = 630;

// Pick the background frame (override by editing this path).
const SOURCE = join(root, 'public', 'photos', 'wildlife', 'DSC_0070.jpg');

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const NAME = 'Yiyang Shen';
const NAME_CN = '沈亦旸';
const EYEBROW = 'PORTFOLIO · SYYDANIEL.GITHUB.IO';
const SUBTITLE = 'MSc, Wageningen · Water, microplastics & photography';

// Foreground text + scrim as an SVG overlay.
const overlay = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="scrim" x1="0" y1="0" x2="1" y2="0.35">
      <stop offset="0" stop-color="#04060b" stop-opacity="0.92"/>
      <stop offset="0.55" stop-color="#04060b" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#04060b" stop-opacity="0.12"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#38e4d2"/>
      <stop offset="1" stop-color="#ffc46b"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#scrim)"/>
  <rect x="0" y="0" width="10" height="${H}" fill="url(#accent)"/>
  <text x="80" y="250" fill="#8be6dc" font-family="Helvetica, Arial, sans-serif"
        font-size="22" font-weight="700" letter-spacing="5">${esc(EYEBROW)}</text>
  <text x="76" y="350" fill="#f4f6fc" font-family="Georgia, 'Times New Roman', serif"
        font-size="92" font-weight="600">${esc(NAME)}
    <tspan fill="#9aa0bd" font-size="58" dx="24">${esc(NAME_CN)}</tspan>
  </text>
  <rect x="80" y="392" width="120" height="4" rx="2" fill="url(#accent)"/>
  <text x="80" y="452" fill="#cdd2e6" font-family="Helvetica, Arial, sans-serif"
        font-size="32" font-weight="400">${esc(SUBTITLE)}</text>
</svg>`);

async function run() {
  let base;
  if (existsSync(SOURCE)) {
    base = sharp(SOURCE)
      .resize(W, H, { fit: 'cover', position: 'attention' })
      .modulate({ brightness: 0.82, saturation: 1.05 });
  } else {
    console.warn('[og] source photo missing, using gradient-only card');
    base = sharp({
      create: { width: W, height: H, channels: 3, background: { r: 5, g: 6, b: 12 } }
    });
  }
  const bg = await base.png().toBuffer();
  await sharp(bg)
    .composite([{ input: overlay, top: 0, left: 0 }])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(OUT);
  console.log('[og] wrote', OUT);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
