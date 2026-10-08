// Ink in water: a real-time fluid simulation behind the whole site. Velocity is
// advected, curled and projected on a small grid (semi-Lagrangian advection, a
// Jacobi pressure solve) and dye is carried on a larger one, all in WebGL
// ping-pong framebuffers. The pointer drags ink, scrolling stirs it, a drop lands
// on its own now and then, and the opening ends with one drop blooming in the
// middle. It needs half-float render targets; where they are missing the noise
// atmosphere (atmosphere.ts) takes over. ~30 fps, paused in hidden tabs.

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

// The ink is lit like a wet surface: a little relief from the dye gradient, a
// paper-dark base, a vignette, and the hour in Wageningen warming or cooling it.
const DISPLAY = `precision highp float; varying vec2 vUv, vL, vR, vT, vB; uniform sampler2D uTexture; uniform vec2 uRes; uniform float uHour; uniform float uDim;
void main () {
  vec3 a = texture2D(uTexture, vUv).rgb;
  vec3 la = texture2D(uTexture, vL).rgb, ra = texture2D(uTexture, vR).rgb, ta = texture2D(uTexture, vT).rgb, ba = texture2D(uTexture, vB).rgb;
  float dx = length(ra) - length(la), dy = length(ta) - length(ba);
  vec3 n = normalize(vec3(dx, dy, length(uRes) * 0.00035));
  float relief = 1.0;
  float dawn = smoothstep(4.5, 7.0, uHour) * (1.0 - smoothstep(8.0, 10.5, uHour));
  float dusk = smoothstep(16.5, 19.0, uHour) * (1.0 - smoothstep(20.0, 22.5, uHour));
  float night = 1.0 - smoothstep(5.0, 8.0, uHour) * (1.0 - smoothstep(19.5, 23.0, uHour));
  vec3 paper = vec3(0.953, 0.937, 0.902);
  paper = mix(paper, paper * vec3(1.0, 0.97, 0.92), (dawn + dusk) * 0.35);
  paper = mix(paper, paper * vec3(0.95, 0.96, 0.98), night * 0.25);
  vec3 absorb = clamp(a * 0.6 * uDim, 0.0, 0.9);
  vec3 color = paper * (vec3(1.0) - absorb) * relief;
  float vig = 1.0 - 0.08 * smoothstep(0.25, 1.15, length(vUv - vec2(0.5, 0.45)) * 1.25);
  gl_FragColor = vec4(color * vig, 1.0);
}`;

// Ink on paper. Each entry is what the ink absorbs (1 - its colour), so a drop
// darkens the paper toward its own hue: 墨, 淡墨, 黛青, 清墨 and, one in twenty, 朱砂.
const PALETTE: [number, number, number][] = [
  [0.86, 0.84, 0.82], [0.55, 0.50, 0.50], [0.80, 0.62, 0.64], [0.30, 0.26, 0.27], [0.62, 0.58, 0.58], [0.26, 0.80, 0.88]
];
const PALETTE_WEIGHTS = [0.24, 0.3, 0.2, 0.12, 0.09, 0.05];

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
  function allocate() {
    const aspect = innerWidth / Math.max(1, innerHeight);
    const sim = 128, dyeSide = Math.min(640, Math.round(innerWidth * 0.5));
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

  const CONFIG = { dyeDissipation: 0.5, velocityDissipation: 0.45, pressureIterations: 16, pressureDamping: 0.8, curl: 18, splatRadius: 0.0026, splatForce: 5200 };

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
    for (let i = 0; i < CONFIG.pressureIterations; i++) {
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

  const hourIn = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: 'numeric', hour12: false, timeZone: 'Europe/Amsterdam' });
  function localHour(): number {
    const [h, m] = hourIn.format(new Date()).split(':').map(Number);
    return (h % 24) + (m || 0) / 60;
  }
  let hour = localHour();
  setInterval(() => { hour = localHour(); }, 60000);

  function present() {
    gl!.useProgram(P.display.p);
    gl!.uniform2f(P.display.u.texelSize, 1 / dyeW, 1 / dyeH);
    gl!.uniform1i(P.display.u.uTexture, bind(dye.read, 0));
    gl!.uniform2f(P.display.u.uRes, canvas.width, canvas.height);
    gl!.uniform1f(P.display.u.uHour, hour);
    gl!.uniform1f(P.display.u.uDim, 1 - 0.7 * Math.min(1, scrollY / Math.max(1, innerHeight)));
    draw(null);
  }

  // ---- inputs ----
  let px = 0.5, py = 0.5, hasPointer = false;
  if (fine.matches) {
    addEventListener('pointermove', e => {
      const x = e.clientX / innerWidth, y = 1 - e.clientY / innerHeight;
      if (!hasPointer) { px = x; py = y; hasPointer = true; return; }
      const dx = x - px, dy = y - py;
      px = x; py = y;
      const speed = Math.hypot(dx, dy);
      if (speed < 0.0006) return;
      const c = pickColor();
      const k = Math.min(1, speed * 90) * 0.22 + 0.04;
      pending.push({ x, y, dx: dx * CONFIG.splatForce, dy: dy * CONFIG.splatForce, color: [c[0] * k, c[1] * k, c[2] * k], radius: CONFIG.splatRadius * (0.8 + Math.min(2.2, speed * 40)) });
    }, { passive: true });
  }
  let lastScroll = scrollY;
  addEventListener('scroll', () => {
    const d = scrollY - lastScroll;
    lastScroll = scrollY;
    if (Math.abs(d) < 12) return;
    const c = pickColor();
    const k = Math.min(1, Math.abs(d) / 400) * 0.22;
    pending.push({ x: 0.15 + Math.random() * 0.7, y: 0.2 + Math.random() * 0.6, dx: (Math.random() - 0.5) * 600, dy: Math.sign(d) * Math.min(2400, Math.abs(d) * 6), color: [c[0] * k, c[1] * k, c[2] * k], radius: CONFIG.splatRadius * 3 });
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

  // ---- loop ----
  let last = 0, frame = 0, visible = !document.hidden;
  function tick(now: number) {
    frame = 0;
    if (!visible) return;
    if (now - last < 31) { frame = requestAnimationFrame(tick); return; }
    const dt = Math.min(0.033, last ? (now - last) / 1000 : 0.016);
    last = now;
    if (now > nextDrop) { drop(0.1 + Math.random() * 0.8, 0.15 + Math.random() * 0.7, 0.1 + Math.random() * 0.08, 3 + Math.random() * 4); nextDrop = now + 5000 + Math.random() * 6000; }
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
  wake();
  return true;
}
