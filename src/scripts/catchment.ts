// 流域, the catchment: a living ink-wash height field. The pointer is a rain
// cloud. Each drop lands on the terrain and runs downhill along the gradient,
// the way runoff is routed in a hydrological model, until it reaches the water
// in the valley, where it pools and seeps into the ink of the page background
// (scripts/ink.ts). Contour lines mark elevation; the wash is stepped in five
// densities, 墨分五色; the shoreline is one vermilion line. The camera lands
// from above when the page opens and climbs again as the page scrolls.
// Three.js is loaded only when the hero is on screen. Reduced motion gets one
// still frame and no rain.

type Three = typeof import('three');

// The relief is a sum of waves, so it is cheap to evaluate on the GPU for the
// mesh and on the CPU for the drops, with one formula on both sides.
const WAVES: [number, number, number, number, number][] = [
  // amplitude, frequency x, frequency z, phase, speed
  [0.34, 0.52, 0.31, 1.3, 0.05], [0.26, 0.37, 0.69, 4.1, 0.04], [0.18, 1.07, 0.44, 2.2, 0.07],
  [0.14, 0.73, 1.21, 0.4, 0.06], [0.09, 1.62, 0.98, 5.3, 0.09], [0.07, 1.31, 1.83, 3.7, 0.08],
  [0.05, 2.41, 1.37, 1.9, 0.11], [0.04, 1.93, 2.72, 0.9, 0.1], [0.03, 3.33, 2.31, 2.6, 0.13], [0.025, 2.87, 3.61, 4.4, 0.12]
];
const WATER = -0.16;

function height(x: number, z: number, t: number): number {
  let h = 0;
  for (const [a, fx, fz, p, w] of WAVES) h += a * Math.sin(x * fx + z * fz + p + t * w);
  h -= 0.55 * Math.exp(-((x * 0.55) ** 2 + ((z + 0.4) * 0.8) ** 2));
  h += 0.07 * z;
  return h;
}

const VERT = `
uniform float uTime;
uniform vec4 uWaves[10];
uniform float uSpeed[10];
uniform vec3 uCamera;
varying float vH;
varying float vFog;
varying vec2 vXZ;
varying float vShade;
float relief(vec2 p) {
  float h = 0.0;
  for (int i = 0; i < 10; i++) h += uWaves[i].x * sin(p.x * uWaves[i].y + p.y * uWaves[i].z + uWaves[i].w + uTime * uSpeed[i]);
  h -= 0.55 * exp(-(pow(p.x * 0.55, 2.0) + pow((p.y + 0.4) * 0.8, 2.0)));
  h += 0.07 * p.y;
  return h;
}
void main() {
  vec3 p = position;
  p.y = relief(p.xz);
  vH = p.y;
  vXZ = p.xz;
  // Hillshade: the slope's normal against a low light from the upper left.
  float e = 0.03;
  vec3 n = normalize(vec3(relief(p.xz - vec2(e, 0.0)) - relief(p.xz + vec2(e, 0.0)), 2.0 * e, relief(p.xz - vec2(0.0, e)) - relief(p.xz + vec2(0.0, e))));
  vShade = dot(n, normalize(vec3(-0.55, 0.62, 0.55)));
  vec4 world = modelMatrix * vec4(p, 1.0);
  vFog = 1.0 - smoothstep(4.5, 9.5, distance(world.xyz, uCamera));
  gl_Position = projectionMatrix * viewMatrix * world;
}`;

const FRAG = `
precision highp float;
uniform float uWater;
uniform float uLevels;
uniform float uTime;
varying float vH;
varying float vFog;
varying vec2 vXZ;
varying float vShade;
void main() {
  float lv = vH * uLevels;
  float fw = max(fwidth(lv), 1e-4);
  float d = abs(fract(lv + 0.5) - 0.5);
  float minor = 1.0 - smoothstep(0.0, fw * 1.3, d);
  float lv5 = lv / 5.0;
  float fw5 = max(fwidth(lv5), 1e-4);
  float d5 = abs(fract(lv5 + 0.5) - 0.5);
  float major = 1.0 - smoothstep(0.0, fw5 * 1.6, d5);
  float line = max(minor * 0.5, major * 0.92);
  // 墨分五色: five densities of wash by elevation band, lit by the hillshade.
  float band = clamp(floor((vH + 0.7) / 1.4 * 5.0), 0.0, 4.0);
  float lit = smoothstep(-0.2, 0.9, vShade);
  // On paper the wash is ink: deepest on the shadowed slopes and in the lowest band.
  float wash = (0.04 + (4.0 - band) * 0.035) * (0.6 + (1.0 - lit) * 0.9);
  float shadow = (1.0 - lit) * 0.34;
  float below = smoothstep(uWater, uWater - 0.22, vH);
  float shoreW = max(fwidth(vH), 1e-4) * 2.2;
  float shore = 1.0 - smoothstep(0.0, shoreW, abs(vH - uWater));
  float ripple = 0.5 + 0.5 * sin(vXZ.x * 7.0 + vXZ.y * 3.0 + uTime * 0.9);
  vec3 ink = vec3(0.09, 0.11, 0.11);
  vec3 wet = vec3(0.24, 0.30, 0.30);
  vec3 water = vec3(0.18, 0.37, 0.35);
  vec3 cinnabar = vec3(0.74, 0.21, 0.13);
  // Wash and shadow in ink, then the water, the lines, the shore. Mist is paper showing through.
  vec3 color = mix(wet, ink, shadow / max(wash + shadow, 1e-4));
  float alpha = wash + shadow;
  color = mix(color, water, below);
  alpha = mix(alpha, 0.45 + ripple * 0.08, below);
  float lineA = line * (1.0 - below * 0.5);
  color = mix(color, ink, lineA);
  alpha = max(alpha, lineA);
  color = mix(color, cinnabar, shore);
  alpha = max(alpha, shore * 0.95);
  gl_FragColor = vec4(color, alpha * vFog);
}`;

const DROP_VERT = `
attribute float aLife;
uniform float uPixelRatio;
varying float vLife;
void main() {
  vLife = aLife;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = (3.4 + aLife * 3.2) * uPixelRatio * (10.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}`;
const DROP_FRAG = `
precision mediump float;
varying float vLife;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float core = 1.0 - smoothstep(0.08, 0.5, d);
  gl_FragColor = vec4(vec3(0.18, 0.37, 0.35), core * (0.35 + vLife * 0.65));
}`;

export async function initCatchment(host: HTMLElement, canvas: HTMLCanvasElement): Promise<void> {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const mobile = matchMedia('(max-width: 767px)').matches;
  const THREE: Three = await import('three');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);

  const uniforms = {
    uTime: { value: 0 },
    uWaves: { value: WAVES.map(([a, fx, fz, p]) => new THREE.Vector4(a, fx, fz, p)) },
    uSpeed: { value: WAVES.map(w => w[4]) },
    uCamera: { value: new THREE.Vector3() },
    uWater: { value: WATER },
    uLevels: { value: 11 }
  };
  const segments = mobile ? [120, 84] : [220, 150];
  const geometry = new THREE.PlaneGeometry(11, 7.6, segments[0], segments[1]);
  geometry.rotateX(-Math.PI / 2);
  const terrain = new THREE.Mesh(geometry, new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: true }));
  terrain.frustumCulled = false;
  scene.add(terrain);

  // Runoff: drops that follow the slope.
  const MAX = mobile ? 420 : 900;
  const ECHO = 3; // each drop is drawn where it is and where it just was
  const positions = new Float32Array(MAX * ECHO * 3);
  const lives = new Float32Array(MAX * ECHO);
  const dropGeometry = new THREE.BufferGeometry();
  dropGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
  dropGeometry.setAttribute('aLife', new THREE.BufferAttribute(lives, 1).setUsage(THREE.DynamicDrawUsage));
  const dropUniforms = { uPixelRatio: { value: 1 } };
  const drops = new THREE.Points(dropGeometry, new THREE.ShaderMaterial({ uniforms: dropUniforms, vertexShader: DROP_VERT, fragmentShader: DROP_FRAG, transparent: true, depthWrite: false, blending: THREE.NormalBlending }));
  drops.frustumCulled = false;
  scene.add(drops);
  const dx = new Float32Array(MAX), dz = new Float32Array(MAX), vx = new Float32Array(MAX), vz = new Float32Array(MAX), age = new Float32Array(MAX);
  const alive = new Uint8Array(MAX);
  let cursor = 0;
  function rain(x: number, z: number, count: number, spread: number) {
    for (let i = 0; i < count; i++) {
      const k = cursor; cursor = (cursor + 1) % MAX;
      const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * spread;
      dx[k] = x + Math.cos(a) * r; dz[k] = z + Math.sin(a) * r;
      vx[k] = 0; vz[k] = 0; age[k] = 0; alive[k] = 1;
      for (let e = 0; e < ECHO; e++) { lives[k * ECHO + e] = e === 0 ? 1 : 0; positions.fill(0, (k * ECHO + e) * 3, (k * ECHO + e) * 3 + 3); }
    }
  }

  // Pooled water seeps into the page's ink.
  const splat = () => (window as any).__inkSplat as ((x: number, y: number, strength: number, color?: [number, number, number]) => void) | undefined;
  const projected = new THREE.Vector3();
  let seepBudget = 0;
  function seep(x: number, y: number, z: number) {
    if (seepBudget <= 0) return;
    const hook = splat();
    if (!hook) return;
    seepBudget--;
    projected.set(x, y, z).project(camera);
    const rect = host.getBoundingClientRect();
    const sx = (projected.x * 0.5 + 0.5) * rect.width + rect.left;
    const sy = (-projected.y * 0.5 + 0.5) * rect.height + rect.top;
    if (sx < 0 || sy < 0 || sx > innerWidth || sy > innerHeight) return;
    hook(sx / innerWidth, 1 - sy / innerHeight, 0.05, [0.8, 0.62, 0.64]);
  }

  let time = 0;
  function simulate(dt: number) {
    const eps = 0.02;
    for (let k = 0; k < MAX; k++) {
      if (!alive[k]) { for (let e = 0; e < ECHO; e++) lives[k * ECHO + e] = 0; continue; }
      // shift the echoes back
      for (let e = ECHO - 1; e > 0; e--) {
        const to = (k * ECHO + e) * 3, from = (k * ECHO + e - 1) * 3;
        positions[to] = positions[from]; positions[to + 1] = positions[from + 1]; positions[to + 2] = positions[from + 2];
        lives[k * ECHO + e] = lives[k * ECHO + e - 1] * 0.45;
      }
      const x = dx[k], z = dz[k];
      const gx = (height(x + eps, z, time) - height(x - eps, z, time)) / (2 * eps);
      const gz = (height(x, z + eps, time) - height(x, z - eps, time)) / (2 * eps);
      vx[k] = (vx[k] - gx * 7.5 * dt) * 0.93;
      vz[k] = (vz[k] - gz * 7.5 * dt) * 0.93;
      dx[k] = x + vx[k] * dt;
      dz[k] = z + vz[k] * dt;
      age[k] += dt;
      const h = height(dx[k], dz[k], time);
      const speed = Math.hypot(vx[k], vz[k]);
      lives[k * ECHO] = Math.max(0, 1 - Math.max(0, age[k] - 5) / 1.5);
      positions[k * ECHO * 3] = dx[k]; positions[k * ECHO * 3 + 1] = h + 0.035; positions[k * ECHO * 3 + 2] = dz[k];
      if (h < WATER - 0.01 || age[k] > 6.5 || Math.abs(dx[k]) > 6 || Math.abs(dz[k]) > 4.2 || (age[k] > 1.2 && speed < 0.004)) {
        if (h < WATER) seep(dx[k], h, dz[k]);
        alive[k] = 0; for (let e = 0; e < ECHO; e++) lives[k * ECHO + e] = 0;
      }
    }
    dropGeometry.attributes.position.needsUpdate = true;
    dropGeometry.attributes.aLife.needsUpdate = true;
  }

  // ---- camera: lands from above, climbs away with the scroll ----
  const rest = { y: 2.55, z: 5.7, lookY: -0.05, lookZ: -1.1 };
  let landing = reduced.matches ? 1 : 0;
  let scrollT = 0;
  function placeCamera() {
    const ease = 1 - Math.pow(1 - landing, 3);
    const lift = scrollT * scrollT;
    camera.position.set(0.2, rest.y + (1 - ease) * 7.5 + lift * 6.5, rest.z - (1 - ease) * 1.2 - lift * 2.2);
    camera.lookAt(0, rest.lookY - (1 - ease) * 0.6, rest.lookZ + lift * 1.4);
    uniforms.uCamera.value.copy(camera.position);
    host.style.setProperty('--catchment-fade', String(Math.max(0, 1 - scrollT * 1.35)));
  }
  addEventListener('scroll', () => { scrollT = Math.max(0, Math.min(1, scrollY / Math.max(1, host.offsetHeight))); }, { passive: true });

  // ---- pointer: a rain cloud ----
  const raycaster = new THREE.Raycaster();
  const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.05);
  const hit = new THREE.Vector3();
  const ndc = new THREE.Vector2();
  let cloudX = 0, cloudZ = 0, cloudOn = false, lastPX = 0, lastPY = 0, pouring = false;
  function locate(clientX: number, clientY: number): boolean {
    const rect = host.getBoundingClientRect();
    ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    if (!raycaster.ray.intersectPlane(ground, hit)) return false;
    cloudX = hit.x; cloudZ = hit.z;
    return Math.abs(hit.x) < 6 && Math.abs(hit.z) < 4.2;
  }
  const surface = host.parentElement ?? host;
  surface.addEventListener('pointermove', e => {
    if (reduced.matches) return;
    const speed = Math.hypot(e.clientX - lastPX, e.clientY - lastPY);
    lastPX = e.clientX; lastPY = e.clientY;
    cloudOn = locate(e.clientX, e.clientY);
    if (cloudOn && landing > 0.6) rain(cloudX, cloudZ, pouring ? 6 : Math.min(5, 1 + Math.floor(speed / 6)), pouring ? 0.9 : 0.35);
  }, { passive: true });
  surface.addEventListener('pointerleave', () => { cloudOn = false; pouring = false; });
  surface.addEventListener('pointerdown', e => {
    if (reduced.matches || (e.target as HTMLElement).closest('a, button, [data-seal]')) return;
    if (!locate(e.clientX, e.clientY)) return;
    pouring = true;
    rain(cloudX, cloudZ, mobile ? 50 : 110, 1.1);
    try { navigator.vibrate?.(8); } catch {}
  }, { passive: true });
  addEventListener('pointerup', () => { pouring = false; }, { passive: true });

  // ---- lifecycle ----
  let visible = true, frame = 0, previous = 0, ambient = 2.5;
  function resize() {
    const rect = host.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const ratio = Math.min(devicePixelRatio || 1, mobile ? 1.25 : 1.5);
    renderer.setPixelRatio(ratio);
    dropUniforms.uPixelRatio.value = ratio;
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  }
  function render() {
    placeCamera();
    uniforms.uTime.value = time;
    renderer.render(scene, camera);
  }
  function tick(now: number) {
    frame = 0;
    const dt = previous ? Math.min((now - previous) / 1000, 0.05) : 1 / 60;
    previous = now;
    if (!reduced.matches) {
      time += dt;
      if (landing < 1) landing = Math.min(1, landing + dt / 2.8);
      ambient -= dt;
      if (ambient <= 0 && landing > 0.8) { rain((Math.random() - 0.5) * 7, (Math.random() - 0.5) * 4.5 - 0.3, 10 + Math.floor(Math.random() * 14), 0.6); ambient = 1.6 + Math.random() * 2.6; }
      if (pouring && cloudOn) rain(cloudX, cloudZ, mobile ? 2 : 4, 0.9);
      seepBudget = 10;
      simulate(dt);
    }
    render();
    if (visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(tick);
  }
  function wake() {
    if (frame) return;
    previous = 0;
    if (visible && !document.hidden) frame = requestAnimationFrame(tick);
  }
  new ResizeObserver(() => { resize(); render(); }).observe(host);
  resize();
  new IntersectionObserver(entries => { visible = entries.some(e => e.isIntersecting); if (visible) wake(); }, { rootMargin: '0px' }).observe(host);
  document.addEventListener('visibilitychange', wake);
  reduced.addEventListener('change', () => { landing = 1; wake(); });
  const begin = () => { host.dataset.ready = ''; wake(); };
  if (document.documentElement.dataset.intro === 'playing') addEventListener('intro:done', begin, { once: true });
  else begin();
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); delete host.dataset.ready; });
  canvas.addEventListener('webglcontextrestored', () => { host.dataset.ready = ''; wake(); });
  addEventListener('pagehide', e => { if (e.persisted) return; if (frame) cancelAnimationFrame(frame); geometry.dispose(); dropGeometry.dispose(); renderer.dispose(); });
}
