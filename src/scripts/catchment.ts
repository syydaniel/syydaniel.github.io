// 流域, the catchment: a living ink-wash height field. Contour lines mark
// elevation; the wash is stepped in five densities, 墨分五色; the shoreline is
// one vermilion line. The pointer carries the light: the hillshade turns to
// follow it, and the ground gives a little under it, so the contours bend
// around the hand like paper under a finger. The camera lands from above when
// the page opens and climbs again as the page scrolls. Three.js is loaded only
// when the hero is on screen. Reduced motion gets one still frame.

type Three = typeof import('three');

// The relief is a sum of waves, cheap to evaluate per vertex on the GPU.
const WAVES: [number, number, number, number, number][] = [
  // amplitude, frequency x, frequency z, phase, speed
  [0.34, 0.52, 0.31, 1.3, 0.05], [0.26, 0.37, 0.69, 4.1, 0.04], [0.18, 1.07, 0.44, 2.2, 0.07],
  [0.14, 0.73, 1.21, 0.4, 0.06], [0.09, 1.62, 0.98, 5.3, 0.09], [0.07, 1.31, 1.83, 3.7, 0.08],
  [0.05, 2.41, 1.37, 1.9, 0.11], [0.04, 1.93, 2.72, 0.9, 0.1], [0.03, 3.33, 2.31, 2.6, 0.13], [0.025, 2.87, 3.61, 4.4, 0.12]
];
const WATER = -0.16;

const VERT = `
uniform float uTime;
uniform vec4 uWaves[10];
uniform float uSpeed[10];
uniform vec3 uCamera;
uniform vec3 uLight;
uniform vec3 uPress; // x, z and depth of the hand on the paper
uniform vec2 uFogRange; // where the mist begins and where it closes
varying float vH;
varying float vFog;
varying vec2 vXZ;
varying float vShade;
float relief(vec2 p) {
  float h = 0.0;
  for (int i = 0; i < 10; i++) h += uWaves[i].x * sin(p.x * uWaves[i].y + p.y * uWaves[i].z + uWaves[i].w + uTime * uSpeed[i]);
  h -= 0.55 * exp(-(pow(p.x * 0.55, 2.0) + pow((p.y + 0.4) * 0.8, 2.0)));
  h += 0.07 * p.y;
  h -= uPress.z * exp(-dot(p - uPress.xy, p - uPress.xy) / 0.42);
  return h;
}
void main() {
  vec3 p = position;
  p.y = relief(p.xz);
  vH = p.y;
  vXZ = p.xz;
  // Hillshade: the slope's normal against a low light that follows the pointer.
  float e = 0.03;
  vec3 n = normalize(vec3(relief(p.xz - vec2(e, 0.0)) - relief(p.xz + vec2(e, 0.0)), 2.0 * e, relief(p.xz - vec2(0.0, e)) - relief(p.xz + vec2(0.0, e))));
  vShade = dot(n, normalize(uLight));
  vec4 world = modelMatrix * vec4(p, 1.0);
  vFog = 1.0 - smoothstep(uFogRange.x, uFogRange.y, distance(world.xyz, uCamera));
  gl_Position = projectionMatrix * viewMatrix * world;
}`;

const FRAG = `
precision highp float;
uniform float uWater;
uniform float uLevels;
uniform float uTime;
uniform float uDark;
uniform float uDiffuse; // cloud cover flattens the light
uniform float uRain; // rain there lifts the water here and stirs it
uniform float uSnow; // snow there lies on the heights here
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
  float lit = mix(smoothstep(-0.2, 0.9, vShade), 0.58, uDiffuse * 0.4);
  // On paper the wash is ink: deepest on the shadowed slopes and in the lowest band.
  float wash = (0.04 + (4.0 - band) * 0.035) * (0.6 + (1.0 - lit) * 0.9);
  float shadow = (1.0 - lit) * 0.34;
  float below = smoothstep(uWater, uWater - 0.22, vH);
  float shoreW = max(fwidth(vH), 1e-4) * 2.2;
  float shore = 1.0 - smoothstep(0.0, shoreW, abs(vH - uWater));
  float ripple = 0.5 + 0.5 * sin(vXZ.x * 7.0 + vXZ.y * 3.0 + uTime * (0.9 + uRain * 1.4));
  // By night the same drawing is mist and lamplight on lamp-black paper.
  vec3 ink = mix(vec3(0.09, 0.11, 0.11), vec3(0.80, 0.84, 0.82), uDark);
  vec3 wet = mix(vec3(0.24, 0.30, 0.30), vec3(0.48, 0.58, 0.56), uDark);
  vec3 water = mix(vec3(0.18, 0.37, 0.35), vec3(0.34, 0.62, 0.58), uDark);
  vec3 cinnabar = mix(vec3(0.74, 0.21, 0.13), vec3(0.90, 0.42, 0.30), uDark);
  wash *= mix(1.0, 0.75, uDark);
  // Wash and shadow in ink, then the water, the lines, the shore. Mist is paper showing through.
  vec3 color = mix(wet, ink, shadow / max(wash + shadow, 1e-4));
  float alpha = wash + shadow;
  color = mix(color, water, below);
  alpha = mix(alpha, 0.45 + ripple * (0.08 + uRain * 0.07), below);
  float lineA = line * (1.0 - below * 0.5);
  color = mix(color, ink, lineA);
  alpha = max(alpha, lineA);
  color = mix(color, cinnabar, shore);
  alpha = max(alpha, shore * 0.95);
  // Snow: the upper bands whiten, the lines stay.
  float snowy = uSnow * smoothstep(0.12, 0.42, vH) * (1.0 - below);
  vec3 snow = mix(vec3(0.90, 0.93, 0.97), vec3(0.72, 0.78, 0.84), uDark);
  color = mix(color, snow, snowy * (1.0 - lineA * 0.85));
  alpha = max(alpha, snowy * mix(0.5, 0.35, uDark));
  gl_FragColor = vec4(color, alpha * vFog);
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
    uLevels: { value: 11 },
    uLight: { value: new THREE.Vector3(-0.55, 0.62, 0.55) },
    uPress: { value: new THREE.Vector3(0, 0, 0) },
    uDiffuse: { value: 0 },
    uFogRange: { value: new THREE.Vector2(4.5, 9.5) },
    uRain: { value: 0 },
    uSnow: { value: 0 },
    uDark: { value: document.documentElement.dataset.theme === 'dark' ? 1 : 0 }
  };
  addEventListener('themechange', () => { uniforms.uDark.value = document.documentElement.dataset.theme === 'dark' ? 1 : 0; wake(); });
  const segments = mobile ? [120, 84] : [220, 150];
  const geometry = new THREE.PlaneGeometry(11, 7.6, segments[0], segments[1]);
  geometry.rotateX(-Math.PI / 2);
  const terrain = new THREE.Mesh(geometry, new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: true }));
  terrain.frustumCulled = false;
  scene.add(terrain);

  let time = 0;

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

  // ---- pointer: the light and the hand ----
  // The pointer's place on the ground plane steers the light (it comes from
  // the side the pointer is on) and presses the relief under it; both ease.
  const raycaster = new THREE.Raycaster();
  const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.05);
  const hit = new THREE.Vector3();
  const ndc = new THREE.Vector2();
  // The resting light is the Sun over Wageningen (scripts/sky.ts): it stands
  // where the Sun stands, from the east in the morning to the west at dusk,
  // low in winter; after dark a lamp from the viewer's side takes over, and
  // cloud cover flattens the shading. North is away from the viewer.
  const LAMP = new THREE.Vector3(-0.55, 0.62, 0.55);
  const lightRest = LAMP.clone();
  const lightAim = lightRest.clone();
  let handX = 0, handZ = 0, handOn = false, pressAim = 0;
  function readSky() {
    const sky = (window as any).__sky;
    if (!sky) return;
    const deg = Math.PI / 180;
    const az = sky.azimuth * deg, el = Math.max(10, sky.elevation) * deg;
    const sun = new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el));
    lightRest.copy(LAMP).lerp(sun, sky.daylight).normalize();
    if (!handOn) lightAim.copy(lightRest);
    const w = sky.weather;
    uniforms.uDiffuse.value = w ? w.cloud : 0;
    // Real rain fills the valley a little; snow lies on the heights; fog or heavy cloud brings the mist in.
    const kind = w ? (w.code >= 71 && w.code <= 77) || w.code === 85 || w.code === 86 ? 'snow' : w.code === 45 || w.code === 48 ? 'fog' : 'other' : 'other';
    const rain = w && kind !== 'snow' ? w.rain : 0;
    uniforms.uRain.value = rain;
    uniforms.uWater.value = WATER + rain * 0.07;
    uniforms.uSnow.value = kind === 'snow' ? 1 : 0;
    const mist = kind === 'fog' ? 1 : w ? Math.max(0, w.cloud - 0.7) * 0.6 : 0;
    uniforms.uFogRange.value.set(4.5 - mist * 1.2, 9.5 - mist * 2.4);
    wake();
  }
  function locate(clientX: number, clientY: number): boolean {
    const rect = host.getBoundingClientRect();
    ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    if (!raycaster.ray.intersectPlane(ground, hit)) return false;
    handX = hit.x; handZ = hit.z;
    return Math.abs(hit.x) < 6 && Math.abs(hit.z) < 4.2;
  }
  const surface = host.parentElement ?? host;
  if (fine.matches) {
    surface.addEventListener('pointermove', e => {
      if (reduced.matches) return;
      handOn = locate(e.clientX, e.clientY);
      pressAim = handOn ? 0.11 : 0;
      // The light leans toward the pointer, from wherever the Sun has it.
      lightAim.set(lightRest.x + ndc.x * 0.9, lightRest.y, lightRest.z - ndc.y * 0.5).normalize();
    }, { passive: true });
    surface.addEventListener('pointerleave', () => { handOn = false; pressAim = 0; lightAim.copy(lightRest); });
  }
  function easeInputs(dt: number) {
    const k = 1 - Math.exp(-dt * 4.5);
    uniforms.uLight.value.lerp(lightAim, k);
    const press = uniforms.uPress.value;
    if (handOn) { press.x += (handX - press.x) * k; press.y += (handZ - press.y) * k; }
    press.z += (pressAim - press.z) * k;
  }

  // ---- lifecycle ----
  let visible = true, frame = 0, previous = 0;
  function resize() {
    const rect = host.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const ratio = Math.min(devicePixelRatio || 1, mobile ? 1.25 : 1.5);
    renderer.setPixelRatio(ratio);
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
      easeInputs(dt);
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
  readSky();
  addEventListener('skychange', readSky);
  const begin = () => { host.dataset.ready = ''; wake(); };
  if (document.documentElement.dataset.intro === 'playing') addEventListener('intro:done', begin, { once: true });
  else begin();
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); delete host.dataset.ready; });
  canvas.addEventListener('webglcontextrestored', () => { host.dataset.ready = ''; wake(); });
  addEventListener('pagehide', e => { if (e.persisted) return; if (frame) cancelAnimationFrame(frame); geometry.dispose(); renderer.dispose(); });
}
