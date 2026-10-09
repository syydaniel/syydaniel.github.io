// Ink in water: a real-time fluid simulation behind the whole site. Velocity is
// advected, curled and projected on a small grid (semi-Lagrangian advection, a
// Jacobi pressure solve) and dye is carried on a larger one, all in WebGL
// ping-pong framebuffers. The pointer drags ink (its path is resampled into an
// even trail of splats, so a fast stroke is one continuous filament, not a row
// of blobs), scrolling stirs it, a drop lands on its own now and then, and the
// opening ends with one drop blooming in the middle. It needs half-float render
// targets; where they are missing the noise atmosphere (atmosphere.ts) takes
// over. Runs at the display's rate, paused in hidden tabs.

type GL = WebGLRenderingContext | WebGL2RenderingContext;
type Target = { fbo: WebGLFramebuffer; tex: WebGLTexture; w: number; h: number; texel: [number, number] };
type Pair = { read: Target; write: Target; swap(): void };

const VERT = `
precision highp float;
attribute vec2 aPosition;
varying vec2 vUv, vL, vR, vT, vB;
uniform vec2 texelSize;
void main () {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const COPY = `precision mediump float; varying vec2 vUv; uniform sampler2D uTexture; uniform float value;
void main () { gl_FragColor = value * texture2D(uTexture, vUv); }`;

const SPLAT = `precision highp float; varying vec2 vUv; uniform sampler2D uTarget; uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius;
void main () {
  vec2 p = vUv - point; p.x *= aspectRatio;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  gl_FragColor = vec4(texture2D(uTarget, vUv).xyz + splat, 1.0);
}`;

const ADVECT = `precision highp float; varying vec2 vUv; uniform sampler2D uVelocity, uSource; uniform vec2 texelSize; uniform float dt, dissipation;
void main () {
  vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
  gl_FragColor = texture2D(uSource, coord) / (1.0 + dissipation * dt);
}`;

const DIVERGENCE = `precision mediump float; varying vec2 vUv, vL, vR, vT, vB; uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uVelocity, vL).x, R = texture2D(uVelocity, vR).x, T = texture2D(uVelocity, vT).y, B = texture2D(uVelocity, vB).y;
  vec2 C = texture2D(uVelocity, vUv).xy;
  if (vL.x < 0.0) L = -C.x; if (vR.x > 1.0) R = -C.x; if (vT.y > 1.0) T = -C.y; if (vB.y < 0.0) B = -C.y;
  gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`;

const CURL = `precision mediump float; varying vec2 vUv, vL, vR, vT, vB; uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uVelocity, vL).y, R = texture2D(uVelocity, vR).y, T = texture2D(uVelocity, vT).x, B = texture2D(uVelocity, vB).x;
  gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`;

const VORTICITY = `precision highp float; varying vec2 vUv, vL, vR, vT, vB; uniform sampler2D uVelocity, uCurl; uniform float curl, dt;
void main () {
  float L = texture2D(uCurl, vL).x, R = texture2D(uCurl, vR).x, T = texture2D(uCurl, vT).x, B = texture2D(uCurl, vB).x, C = texture2D(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C; force.y *= -1.0;
  vec2 velocity = texture2D(uVelocity, vUv).xy + force * dt;
  gl_FragColor = vec4(clamp(velocity, -1000.0, 1000.0), 0.0, 1.0);
}`;

const PRESSURE = `precision mediump float; varying vec2 vUv, vL, vR, vT, vB; uniform sampler2D uPressure, uDivergence;
void main () {
  float L = texture2D(uPressure, vL).x, R = texture2D(uPressure, vR).x, T = texture2D(uPressure, vT).x, B = texture2D(uPressure, vB).x;
  gl_FragColor = vec4((L + R + B + T - texture2D(uDivergence, vUv).x) * 0.25, 0.0, 0.0, 1.0);
}`;

const GRADIENT = `precision mediump float; varying vec2 vUv, vL, vR, vT, vB; uniform sampler2D uPressure, uVelocity;
void main () {
  float L = texture2D(uPressure, vL).x, R = texture2D(uPressure, vR).x, T = texture2D(uPressure, vT).x, B = texture2D(uPressure, vB).x;
  vec2 velocity = texture2D(uVelocity, vUv).xy - vec2(R - L, T - B);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}`;

// By day the dye is absorbance: each drop darkens the paper toward its own hue.
// By night (uDark) the same dye is light held in lamp-black: 黛青 for the inks,
// a warm glow where the cinnabar fell. The sky over Wageningen tints both: the
// paper warms while the Sun is low (uGolden), cools and dims once it has set
// (uNight), and leans warm or cold with the day's temperature (uWarmth).
const DISPLAY = `precision highp float; varying vec2 vUv, vL, vR, vT, vB; uniform sampler2D uTexture; uniform vec2 uRes; uniform float uGolden; uniform float uNight; uniform float uWarmth; uniform float uCloud; uniform float uRain; uniform float uSnow; uniform float uFlash; uniform float uDim; uniform float uDark;
void main () {
  vec3 a = texture2D(uTexture, vUv).rgb;
  vec3 paper = vec3(0.953, 0.937, 0.902) * (1.0 + uFlash * 0.16);
  paper = mix(paper, paper * vec3(1.0, 0.935, 0.84), uGolden * 0.7);
  paper = mix(paper, paper * vec3(0.93, 0.955, 1.0), uNight * 0.45);
  paper *= mix(vec3(1.0), vec3(1.0, 0.98, 0.94), max(uWarmth, 0.0) * 0.8);
  paper *= mix(vec3(1.0), vec3(0.955, 0.975, 1.0), max(-uWarmth, 0.0) * 0.8);
  paper = mix(paper, paper * vec3(0.915, 0.925, 0.935), uCloud * 0.55);
  paper = mix(paper, paper * vec3(0.90, 0.94, 1.0), uRain * 0.5);
  paper = mix(paper, vec3(0.975, 0.98, 0.985), uSnow * 0.35);
  vec3 absorb = clamp(a * 0.6 * uDim, 0.0, 0.9);
  vec3 day = paper * (vec3(1.0) - absorb) * mix(1.0, 0.955, uNight);
  // A glaze: where the dye lies thick, its colour deepens rather than greys.
  float dense = smoothstep(0.3, 0.95, dot(a, vec3(0.3333)));
  day = mix(vec3(dot(day, vec3(0.299, 0.587, 0.114))), day, 1.0 + dense * 0.4);
  vec3 lamp = vec3(0.071, 0.082, 0.086) + uFlash * vec3(0.16, 0.17, 0.2);
  lamp = mix(lamp, lamp * vec3(1.12, 1.0, 0.9), uGolden * 0.4);
  lamp = mix(lamp, lamp * vec3(0.88, 0.94, 1.08), uRain * 0.5);
  lamp = mix(lamp, lamp * vec3(1.06, 1.08, 1.12), uSnow * 0.5);
  float dye = dot(a, vec3(0.3333));
  vec3 glow = dye * vec3(0.40, 0.60, 0.56) * 0.5 * uDim;
  float warm = max(a.g + a.b - a.r * 2.2, 0.0);
  glow += warm * vec3(0.95, 0.38, 0.22) * 0.32 * uDim;
  vec3 color = mix(day, lamp + glow, uDark);
  float vig = 1.0 - mix(0.08, 0.3, uDark) * smoothstep(0.25, 1.15, length(vUv - vec2(0.5, 0.45)) * 1.25);
  gl_FragColor = vec4(color * vig, 1.0);
}`;

// Ink on paper. Each entry is what the ink absorbs (1 - its colour), so a drop
// darkens the paper toward its own hue: 墨, 淡墨, 黛青, 清墨 and, now and then,
// a mineral from the painter's box: 朱砂, 石青 (azurite), 石绿 (malachite),
// 赭石 (ochre) and 藤黄 (gamboge).
const PALETTE: [number, number, number][] = [
  [0.86, 0.84, 0.82], [0.55, 0.50, 0.50], [0.80, 0.62, 0.64], [0.30, 0.26, 0.27], [0.62, 0.58, 0.58], [0.26, 0.80, 0.88],
  [0.78, 0.56, 0.28], [0.68, 0.36, 0.52], [0.36, 0.56, 0.74], [0.14, 0.30, 0.84]
];
const PALETTE_WEIGHTS = [0.22, 0.27, 0.18, 0.11, 0.08, 0.05, 0.03, 0.025, 0.03, 0.015];

function pickColor(): [number, number, number] {
  let r = Math.random();
  for (let i = 0; i < PALETTE.length; i++) { r -= PALETTE_WEIGHTS[i]; if (r <= 0) return PALETTE[i]; }
  return PALETTE[0];
}

export function initInk(canvas: HTMLCanvasElement): boolean {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return false;
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const attrs = { alpha: false, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false, powerPreference: 'low-power' as const };
  const gl2 = canvas.getContext('webgl2', attrs) as WebGL2RenderingContext | null;
  const gl: GL | null = gl2 ?? (canvas.getContext('webgl', attrs) as WebGLRenderingContext | null);
  if (!gl) return false;
  const isGL2 = !!gl2;

  let halfFloat = 0x8D61; // HALF_FLOAT_OES
  if (isGL2) {
    if (!gl.getExtension('EXT_color_buffer_float')) return false;
    halfFloat = (gl as WebGL2RenderingContext).HALF_FLOAT;
  } else {
    const ext = gl.getExtension('OES_texture_half_float');
    if (!ext || !gl.getExtension('OES_texture_half_float_linear')) return false;
    halfFloat = ext.HALF_FLOAT_OES;
  }

  type Format = { internal: number; format: number };
  function supported(internal: number, format: number): boolean {
    const tex = gl!.createTexture();
    gl!.bindTexture(gl!.TEXTURE_2D, tex);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.NEAREST);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.NEAREST);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, internal, 4, 4, 0, format, halfFloat, null);
    const fbo = gl!.createFramebuffer();
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
    gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, tex, 0);
    const ok = gl!.checkFramebufferStatus(gl!.FRAMEBUFFER) === gl!.FRAMEBUFFER_COMPLETE;
    gl!.deleteFramebuffer(fbo);
    gl!.deleteTexture(tex);
    return ok;
  }
  function choose(internal: number, format: number, fallback?: Format): Format | null {
    if (supported(internal, format)) return { internal, format };
    return fallback ?? null;
  }
  let rgba: Format | null, rg: Format | null, r: Format | null;
  if (isGL2) {
    const g = gl as WebGL2RenderingContext;
    rgba = choose(g.RGBA16F, g.RGBA);
    rg = choose(g.RG16F, g.RG, rgba ?? undefined);
    r = choose(g.R16F, g.RED, rg ?? undefined);
  } else {
    rgba = choose(gl.RGBA, gl.RGBA);
    rg = rgba; r = rgba;
  }
  if (!rgba || !rg || !r) return false;

  function compile(type: number, src: string): WebGLShader | null {
    const s = gl!.createShader(type);
    if (!s) return null;
    gl!.shaderSource(s, src);
    gl!.compileShader(s);
    if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) { gl!.deleteShader(s); return null; }
    return s;
  }
  const vs = compile(gl.VERTEX_SHADER, VERT);
  if (!vs) return false;
  type Program = { p: WebGLProgram; u: Record<string, WebGLUniformLocation | null> };
  function program(frag: string): Program | null {
    const fs = compile(gl!.FRAGMENT_SHADER, frag);
    const p = gl!.createProgram();
    if (!fs || !p) return null;
    gl!.attachShader(p, vs!);
    gl!.attachShader(p, fs);
    gl!.linkProgram(p);
    if (!gl!.getProgramParameter(p, gl!.LINK_STATUS)) return null;
    const u: Record<string, WebGLUniformLocation | null> = {};
    const count = gl!.getProgramParameter(p, gl!.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < count; i++) {
      const info = gl!.getActiveUniform(p, i);
      if (info) u[info.name] = gl!.getUniformLocation(p, info.name);
    }
    return { p, u };
  }
  const programs = {
    copy: program(COPY), splat: program(SPLAT), advect: program(ADVECT), divergence: program(DIVERGENCE), curl: program(CURL),
    vorticity: program(VORTICITY), pressure: program(PRESSURE), gradient: program(GRADIENT), display: program(DISPLAY)
  };
  if (Object.values(programs).some(p => !p)) return false;
  const P = programs as Record<keyof typeof programs, Program>;

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.disable(gl.BLEND);

  function target(w: number, h: number, f: Format): Target {
    const tex = gl!.createTexture()!;
    gl!.activeTexture(gl!.TEXTURE0);
    gl!.bindTexture(gl!.TEXTURE_2D, tex);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, f.internal, w, h, 0, f.format, halfFloat, null);
    const fbo = gl!.createFramebuffer()!;
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
    gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, tex, 0);
    gl!.viewport(0, 0, w, h);
    gl!.clearColor(0, 0, 0, 1);
    gl!.clear(gl!.COLOR_BUFFER_BIT);
    return { fbo, tex, w, h, texel: [1 / w, 1 / h] };
  }
  function pair(w: number, h: number, f: Format): Pair {
    let read = target(w, h, f), write = target(w, h, f);
    return { get read() { return read; }, get write() { return write; }, swap() { const t = read; read = write; write = t; } } as Pair;
  }
  function bind(t: Target, unit: number): number {
    gl!.activeTexture(gl!.TEXTURE0 + unit);
    gl!.bindTexture(gl!.TEXTURE_2D, t.tex);
    return unit;
  }
  function draw(dest: Target | null) {
    if (dest) { gl!.viewport(0, 0, dest.w, dest.h); gl!.bindFramebuffer(gl!.FRAMEBUFFER, dest.fbo); }
    else { gl!.viewport(0, 0, canvas.width, canvas.height); gl!.bindFramebuffer(gl!.FRAMEBUFFER, null); }
    gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
  }

  let dye: Pair, velocity: Pair, divergence: Target, curl: Target, pressure: Pair;
  let simW = 0, simH = 0, dyeW = 0, dyeH = 0;
  // Three qualities. The page starts at the finest and steps down, once, when
  // frames keep running long, so a weaker machine gets silk at a lower grain
  // rather than a stutter at the full one.
  const LEVELS = [
    { sim: 112, dye: 0.42, cap: 640, iterations: 12 },
    { sim: 144, dye: 0.55, cap: 832, iterations: 16 },
    { sim: 176, dye: 0.66, cap: 1024, iterations: 20 }
  ];
  let quality = 2;
  function allocate() {
    const aspect = innerWidth / Math.max(1, innerHeight);
    const level = LEVELS[quality];
    const sim = level.sim, dyeSide = Math.min(level.cap, Math.round(innerWidth * level.dye));
    simW = aspect >= 1 ? Math.round(sim * aspect) : sim;
    simH = aspect >= 1 ? sim : Math.round(sim / aspect);
    dyeW = aspect >= 1 ? dyeSide : Math.round(dyeSide * aspect);
    dyeH = aspect >= 1 ? Math.round(dyeSide / aspect) : dyeSide;
    canvas.width = dyeW; canvas.height = dyeH;
    dye = pair(dyeW, dyeH, rgba!);
    velocity = pair(simW, simH, rg!);
    divergence = target(simW, simH, r!);
    curl = target(simW, simH, r!);
    pressure = pair(simW, simH, r!);
  }
  allocate();

  const CONFIG = { dyeDissipation: 0.42, velocityDissipation: 0.3, pressureIterations: 20, pressureDamping: 0.8, curl: 22, splatRadius: 0.0022, splatForce: 90 };

  function splat(x: number, y: number, dx: number, dy: number, color: [number, number, number], radius = CONFIG.splatRadius) {
    gl!.useProgram(P.splat.p);
    gl!.uniform2f(P.splat.u.texelSize, 1 / simW, 1 / simH);
    gl!.uniform1i(P.splat.u.uTarget, bind(velocity.read, 0));
    gl!.uniform1f(P.splat.u.aspectRatio, canvas.width / canvas.height);
    gl!.uniform2f(P.splat.u.point, x, y);
    gl!.uniform3f(P.splat.u.color, dx, dy, 0);
    gl!.uniform1f(P.splat.u.radius, radius);
    draw(velocity.write); velocity.swap();
    gl!.uniform2f(P.splat.u.texelSize, 1 / dyeW, 1 / dyeH);
    gl!.uniform1i(P.splat.u.uTarget, bind(dye.read, 0));
    gl!.uniform3f(P.splat.u.color, color[0], color[1], color[2]);
    draw(dye.write); dye.swap();
  }

  function step(dt: number) {
    gl!.disable(gl!.BLEND);
    // curl and vorticity confinement keep the filaments alive
    gl!.useProgram(P.curl.p);
    gl!.uniform2f(P.curl.u.texelSize, velocity.read.texel[0], velocity.read.texel[1]);
    gl!.uniform1i(P.curl.u.uVelocity, bind(velocity.read, 0));
    draw(curl);
    gl!.useProgram(P.vorticity.p);
    gl!.uniform2f(P.vorticity.u.texelSize, velocity.read.texel[0], velocity.read.texel[1]);
    gl!.uniform1i(P.vorticity.u.uVelocity, bind(velocity.read, 0));
    gl!.uniform1i(P.vorticity.u.uCurl, bind(curl, 1));
    gl!.uniform1f(P.vorticity.u.curl, CONFIG.curl);
    gl!.uniform1f(P.vorticity.u.dt, dt);
    draw(velocity.write); velocity.swap();
    // divergence, pressure, projection
    gl!.useProgram(P.divergence.p);
    gl!.uniform2f(P.divergence.u.texelSize, velocity.read.texel[0], velocity.read.texel[1]);
    gl!.uniform1i(P.divergence.u.uVelocity, bind(velocity.read, 0));
    draw(divergence);
    gl!.useProgram(P.copy.p);
    gl!.uniform2f(P.copy.u.texelSize, pressure.read.texel[0], pressure.read.texel[1]);
    gl!.uniform1i(P.copy.u.uTexture, bind(pressure.read, 0));
    gl!.uniform1f(P.copy.u.value, CONFIG.pressureDamping);
    draw(pressure.write); pressure.swap();
    gl!.useProgram(P.pressure.p);
    gl!.uniform2f(P.pressure.u.texelSize, velocity.read.texel[0], velocity.read.texel[1]);
    gl!.uniform1i(P.pressure.u.uDivergence, bind(divergence, 0));
    for (let i = 0; i < LEVELS[quality].iterations; i++) {
      gl!.uniform1i(P.pressure.u.uPressure, bind(pressure.read, 1));
      draw(pressure.write); pressure.swap();
    }
    gl!.useProgram(P.gradient.p);
    gl!.uniform2f(P.gradient.u.texelSize, velocity.read.texel[0], velocity.read.texel[1]);
    gl!.uniform1i(P.gradient.u.uPressure, bind(pressure.read, 0));
    gl!.uniform1i(P.gradient.u.uVelocity, bind(velocity.read, 1));
    draw(velocity.write); velocity.swap();
    // advection
    gl!.useProgram(P.advect.p);
    gl!.uniform2f(P.advect.u.texelSize, velocity.read.texel[0], velocity.read.texel[1]);
    const v = bind(velocity.read, 0);
    gl!.uniform1i(P.advect.u.uVelocity, v);
    gl!.uniform1i(P.advect.u.uSource, v);
    gl!.uniform1f(P.advect.u.dt, dt);
    gl!.uniform1f(P.advect.u.dissipation, CONFIG.velocityDissipation);
    draw(velocity.write); velocity.swap();
    gl!.uniform1i(P.advect.u.uVelocity, bind(velocity.read, 0));
    gl!.uniform1i(P.advect.u.uSource, bind(dye.read, 1));
    gl!.uniform1f(P.advect.u.dissipation, CONFIG.dyeDissipation);
    draw(dye.write); dye.swap();
  }

  // The sky over Wageningen (scripts/sky.ts): the Sun's height tints the paper;
  // rain there lands as drops here; a wind there is a slow drift here.
  let golden = 0, night = 0, warmth = 0, rain = 0, cloud = 0, snow = 0, windX = 0, windY = 0, storm = false, flash = 0, nextFlash = 0;
  const isDark = () => document.documentElement.dataset.theme === 'dark';
  // Each reading is an aim; the paper tints and the rain sets in over a couple of seconds.
  const skyAim = { golden: 0, night: 0, warmth: 0, rain: 0, cloud: 0, snow: 0 };
  function readSky() {
    const sky = (window as any).__sky;
    if (!sky) return;
    skyAim.golden = sky.golden ?? 0;
    skyAim.night = isDark() ? 1 - (sky.daylight ?? 1) : 0;
    const w = sky.weather;
    if (w) {
      skyAim.warmth = Math.max(-1, Math.min(1, (w.temp - 12) / 14));
      const snowing = (w.code >= 71 && w.code <= 77) || w.code === 85 || w.code === 86;
      skyAim.rain = snowing ? 0 : w.rain ?? 0;
      skyAim.snow = snowing ? 1 : 0;
      skyAim.cloud = w.cloud ?? 0;
      storm = w.code >= 95;
      const blowsTo = ((w.windDir ?? 0) + 180) * Math.PI / 180;
      const k = w.wind >= 12 ? Math.min(1, w.wind / 45) : 0;
      windX = Math.sin(blowsTo) * k; windY = Math.cos(blowsTo) * k;
    }
    wake();
  }

  let dark = isDark() ? 1 : 0;
  addEventListener('themechange', () => { dark = isDark() ? 1 : 0; readSky(); wake(); });
  function present() {
    gl!.useProgram(P.display.p);
    gl!.uniform1f(P.display.u.uDark, dark);
    gl!.uniform2f(P.display.u.texelSize, 1 / dyeW, 1 / dyeH);
    gl!.uniform1i(P.display.u.uTexture, bind(dye.read, 0));
    gl!.uniform2f(P.display.u.uRes, canvas.width, canvas.height);
    gl!.uniform1f(P.display.u.uGolden, golden);
    gl!.uniform1f(P.display.u.uNight, night);
    gl!.uniform1f(P.display.u.uWarmth, warmth);
    gl!.uniform1f(P.display.u.uCloud, cloud);
    gl!.uniform1f(P.display.u.uRain, rain);
    gl!.uniform1f(P.display.u.uSnow, snow);
    gl!.uniform1f(P.display.u.uFlash, flash);
    gl!.uniform1f(P.display.u.uDim, 1 - 0.7 * Math.min(1, scrollY / Math.max(1, innerHeight)));
    draw(null);
  }

  // ---- inputs ----
  // The pointer's path is resampled: every coalesced sample is joined to the
  // last by splats a fraction of a radius apart, each carrying the stroke's
  // velocity (screen fractions per second, smoothed), so the trail is even.
  let px = 0.5, py = 0.5, pt = 0, hasPointer = false, smoothV = 0, strokeColor = pickColor(), strokeLeft = 0;
  if (fine.matches) {
    addEventListener('pointermove', e => {
      const samples = (e as any).getCoalescedEvents?.() as PointerEvent[] | undefined;
      for (const s of samples && samples.length ? samples : [e]) {
        const x = s.clientX / innerWidth, y = 1 - s.clientY / innerHeight, t = s.timeStamp || performance.now();
        if (!hasPointer) { px = x; py = y; pt = t; hasPointer = true; continue; }
        const dx = x - px, dy = y - py, dist = Math.hypot(dx, dy);
        const dtS = Math.max(0.004, (t - pt) / 1000);
        pt = t;
        if (dist < 0.0004) continue;
        const v = Math.min(3, dist / dtS);
        smoothV += (v - smoothV) * 0.35;
        // one ink per stroke; the colour changes only after the pointer rests
        if (strokeLeft <= 0) strokeColor = pickColor();
        strokeLeft = 0.35;
        const radius = CONFIG.splatRadius * (1.0 + Math.min(1.8, smoothV * 1.1));
        const stepLen = Math.sqrt(radius) * 0.55;
        const n = Math.max(1, Math.min(24, Math.ceil(dist / stepLen)));
        const k = (Math.min(1, smoothV * 0.7) * 0.2 + 0.035) / Math.sqrt(n);
        const ux = dx / dist * smoothV * CONFIG.splatForce, uy = dy / dist * smoothV * CONFIG.splatForce;
        for (let i = 1; i <= n; i++) {
          const f = i / n;
          pending.push({ x: px + dx * f, y: py + dy * f, dx: ux, dy: uy, color: [strokeColor[0] * k, strokeColor[1] * k, strokeColor[2] * k], radius });
        }
        px = x; py = y;
      }
    }, { passive: true });
  }
  let lastScroll = scrollY;
  addEventListener('scroll', () => {
    const d = scrollY - lastScroll;
    lastScroll = scrollY;
    if (Math.abs(d) < 12) return;
    const c = pickColor();
    const k = Math.min(1, Math.abs(d) / 400) * 0.18;
    pending.push({ x: 0.15 + Math.random() * 0.7, y: 0.2 + Math.random() * 0.6, dx: (Math.random() - 0.5) * 400, dy: Math.sign(d) * Math.min(1600, Math.abs(d) * 5), color: [c[0] * k, c[1] * k, c[2] * k], radius: CONFIG.splatRadius * 3.5 });
  }, { passive: true });

  type Splat = { x: number; y: number; dx: number; dy: number; color: [number, number, number]; radius: number };
  const pending: Splat[] = [];
  function drop(x: number, y: number, strength: number, radiusScale = 4) {
    const c = pickColor();
    pending.push({ x, y, dx: (Math.random() - 0.5) * 400, dy: (Math.random() - 0.5) * 400, color: [c[0] * strength, c[1] * strength, c[2] * strength], radius: CONFIG.splatRadius * radiusScale });
  }
  // The opening ends with one drop hitting the water in the middle of the page.
  function bloom() {
    const cx = 0.5, cy = 0.55;
    pending.push({ x: cx, y: cy, dx: 0, dy: 0, color: [0.5, 0.48, 0.46], radius: CONFIG.splatRadius * 9 });
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 + Math.random() * 0.3;
      const c = PALETTE[i % 2 === 0 ? 0 : 2];
      pending.push({ x: cx + Math.cos(a) * 0.02, y: cy + Math.sin(a) * 0.03, dx: Math.cos(a) * 2600, dy: Math.sin(a) * 2600, color: [c[0] * 0.25, c[1] * 0.25, c[2] * 0.25], radius: CONFIG.splatRadius * 2.5 });
    }
  }
  if (document.documentElement.dataset.intro === 'playing') addEventListener('intro:done', bloom, { once: true });
  else for (let i = 0; i < 4; i++) drop(0.2 + Math.random() * 0.6, 0.25 + Math.random() * 0.5, 0.14, 5);
  let nextDrop = performance.now() + 4000;
  let nextGust = performance.now() + 3000;

  // ---- loop ----
  let last = 0, frame = 0, visible = !document.hidden;
  let slowFrames = 0;
  function tick(now: number) {
    frame = 0;
    if (!visible) return;
    // Far down the page the ink is dim and nothing stirs it: half rate is plenty.
    if (scrollY > innerHeight * 1.6 && now - last < 31) { frame = requestAnimationFrame(tick); return; }
    const elapsed = last ? (now - last) / 1000 : 0.016;
    const dt = Math.min(0.033, elapsed);
    last = now;
    strokeLeft -= dt;
    const ks = 1 - Math.exp(-dt * 0.9);
    golden += (skyAim.golden - golden) * ks; night += (skyAim.night - night) * ks;
    warmth += (skyAim.warmth - warmth) * ks; rain += (skyAim.rain - rain) * ks;
    cloud += (skyAim.cloud - cloud) * ks; snow += (skyAim.snow - snow) * ks;
    // The governor: a second of long frames in a row steps the quality down.
    if (scrollY < innerHeight * 1.6) {
      slowFrames = elapsed > 0.027 ? slowFrames + 1 : Math.max(0, slowFrames - 2);
      if (slowFrames > 45 && quality > 0) {
        quality--; slowFrames = 0; allocate();
        for (let i = 0; i < 3; i++) drop(0.2 + Math.random() * 0.6, 0.25 + Math.random() * 0.5, 0.16, 5);
      }
    }
    if (now > nextDrop) {
      // Rain in Wageningen lands here too: more often and a little heavier.
      drop(0.1 + Math.random() * 0.8, 0.15 + Math.random() * 0.7, 0.1 + Math.random() * 0.08 + rain * 0.14, 3 + Math.random() * 4);
      nextDrop = now + (5000 + Math.random() * 6000) * (1 - 0.88 * rain);
    }
    // A thunderstorm there: now and then the paper lights up twice and fades.
    if (storm) {
      if (now > nextFlash) { flash = 1; nextFlash = now + 7000 + Math.random() * 16000; setTimeout(() => { flash = Math.max(flash, 0.7); }, 90 + Math.random() * 120); }
      flash *= Math.exp(-dt * 7);
      if (flash < 0.002) flash = 0;
    } else flash = 0;
    if ((windX || windY) && now > nextGust) {
      // The wind there is a slow drift here: a wide, weak push across the page.
      const c = pickColor();
      pending.push({ x: Math.random(), y: Math.random(), dx: windX * 700, dy: windY * 700, color: [c[0] * 0.02, c[1] * 0.02, c[2] * 0.02], radius: CONFIG.splatRadius * 7 });
      nextGust = now + 1800 + Math.random() * 1600;
    }
    while (pending.length) { const s = pending.shift()!; splat(s.x, s.y, s.dx, s.dy, s.color, s.radius); }
    step(dt);
    present();
    frame = requestAnimationFrame(tick);
  }
  function wake() {
    visible = !document.hidden;
    if (visible && !frame) { last = 0; frame = requestAnimationFrame(tick); }
  }
  let resizeTimer = 0;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => { allocate(); for (let i = 0; i < 3; i++) drop(0.2 + Math.random() * 0.6, 0.25 + Math.random() * 0.5, 0.2, 5); }, 250);
  }, { passive: true });
  document.addEventListener('visibilitychange', wake);
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); visible = false; delete document.documentElement.dataset.atmosphere; });
  canvas.addEventListener('webglcontextrestored', () => { allocate(); document.documentElement.dataset.atmosphere = 'ink'; wake(); });
  reduced.addEventListener('change', () => { if (reduced.matches) { visible = false; } else wake(); });
  // Other layers pour into the ink: the catchment's pooled water, a pressed seal.
  (window as any).__inkSplat = (x: number, y: number, strength: number, color?: [number, number, number]) => {
    const c = color ?? pickColor();
    pending.push({ x, y, dx: (Math.random() - 0.5) * 300, dy: (Math.random() - 0.5) * 300, color: [c[0] * strength, c[1] * strength, c[2] * strength], radius: CONFIG.splatRadius * (2.5 + strength * 4) });
    wake();
  };
  document.documentElement.dataset.atmosphere = 'ink';
  readSky();
  addEventListener('skychange', readSky);
  wake();
  return true;
}
