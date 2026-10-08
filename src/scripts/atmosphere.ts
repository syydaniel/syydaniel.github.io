// A living atmosphere behind the whole site: domain-warped fractal noise rendered
// as slow aurora curtains in the site's sage, teal and amber, lit softly by the
// pointer. Raw WebGL (no library) so it costs ~4 KB and no extra request. It
// renders at a capped, low resolution, holds at 30 fps, stops in hidden tabs and
// draws one still frame for reduced-motion users. The CSS aurora stays as the
// fallback whenever WebGL is unavailable.

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform float uScroll;
uniform float uGlow;
uniform float uHour;
uniform float uDark;

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = r * p * 2.05 + 11.3; a *= 0.5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y) * 1.6;
  p.y += uScroll * 0.35;
  float t = uTime * 0.045;

  vec2 q = vec2(fbm(p + t * 0.7), fbm(p + vec2(5.2, 1.3) - t * 0.5));
  vec2 r = vec2(fbm(p + 3.2 * q + vec2(1.7, 9.2) + t * 0.3), fbm(p + 3.2 * q + vec2(8.3, 2.8) - t * 0.2));
  float f = fbm(p + 3.0 * r);

  vec3 indigo = vec3(0.07, 0.09, 0.19);
  vec3 teal   = vec3(0.10, 0.44, 0.40);
  vec3 sage   = vec3(0.36, 0.50, 0.34);
  vec3 amber  = vec3(0.62, 0.46, 0.22);

  // Dawn and dusk in Wageningen warm the field; night cools it.
  float dawn = smoothstep(4.5, 7.0, uHour) * (1.0 - smoothstep(8.0, 10.5, uHour));
  float dusk = smoothstep(16.5, 19.0, uHour) * (1.0 - smoothstep(20.0, 22.5, uHour));
  float night = 1.0 - smoothstep(5.0, 8.0, uHour) * (1.0 - smoothstep(19.5, 23.0, uHour));
  teal = mix(teal, amber, (dawn + dusk) * 0.28);
  sage = mix(sage, indigo, night * 0.35);
  vec3 col = mix(indigo, teal, clamp(f * f * 3.2, 0.0, 1.0));
  col = mix(col, sage, clamp(length(q) * 0.9, 0.0, 1.0));
  col = mix(col, amber, clamp(r.x * r.x * 1.4, 0.0, 1.0) * 0.55);

  // Aurora curtains: tall, slowly swaying bands.
  float curtain = smoothstep(0.25, 0.95, sin(p.x * 2.4 + r.y * 4.0 + t * 1.5) * 0.5 + 0.5);
  curtain *= smoothstep(0.0, 0.9, uv.y + 0.2);
  col += teal * curtain * 0.16;

  float energy = f * f * f * 1.3 + 0.55 * f * f + 0.3 * f;
  vec3 final = col * energy * 0.42;

  // Pointer light: a soft lamp that follows the cursor.
  vec2 m = vec2(uPointer.x * aspect, uPointer.y) * 1.6;
  float d = length(p - m);
  final += vec3(0.62, 0.92, 0.82) * exp(-d * d * 2.2) * 0.07 * uGlow;

  // Vignette. By day the field is an ink wash drawn off the paper; by night it is light on lamp-black.
  float vig = 1.0 - 0.55 * smoothstep(0.2, 1.1, length(uv - vec2(0.5, 0.45)) * 1.25);
  vec3 nightSide = final * vig + vec3(0.07, 0.08, 0.085);
  float wash = clamp(dot(final, vec3(0.333)) * 1.4, 0.0, 1.0);
  vec3 daySide = vec3(0.953, 0.937, 0.902) * (1.0 - wash * 0.22 * (0.6 + 0.4 * vig));
  gl_FragColor = vec4(mix(daySide, nightSide, uDark), 1.0);
}`;

export function initAtmosphere(canvas: HTMLCanvasElement): void {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power', preserveDrawingBuffer: false });
  if (!gl) return;

  function compile(type: number, src: string): WebGLShader | null {
    const s = gl!.createShader(type);
    if (!s) return null;
    gl!.shaderSource(s, src);
    gl!.compileShader(s);
    if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) { gl!.deleteShader(s); return null; }
    return s;
  }
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, 'uRes');
  const uTime = gl.getUniformLocation(program, 'uTime');
  const uPointer = gl.getUniformLocation(program, 'uPointer');
  const uScroll = gl.getUniformLocation(program, 'uScroll');
  const uGlow = gl.getUniformLocation(program, 'uGlow');
  const uHour = gl.getUniformLocation(program, 'uHour');
  const uDark = gl.getUniformLocation(program, 'uDark');
  const paintTheme = () => gl!.uniform1f(uDark, document.documentElement.dataset.theme === 'dark' ? 1 : 0);
  paintTheme();
  addEventListener('themechange', () => { paintTheme(); wake(); });
  const hourIn = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: 'numeric', hour12: false, timeZone: 'Europe/Amsterdam' });
  function localHour(): number {
    const [h, m] = hourIn.format(new Date()).split(':').map(Number);
    return (h % 24) + (m || 0) / 60;
  }
  gl.uniform1f(uHour, localHour());
  setInterval(() => gl!.uniform1f(uHour, localHour()), 60000);

  let width = 0, height = 0;
  function resize() {
    // Cap the backing store: the field is soft, so 640 px across is plenty.
    const scale = Math.min(0.5, 640 / Math.max(1, innerWidth));
    width = Math.max(1, Math.round(innerWidth * scale));
    height = Math.max(1, Math.round(innerHeight * scale));
    canvas.width = width;
    canvas.height = height;
    gl!.viewport(0, 0, width, height);
    gl!.uniform2f(uRes, width, height);
  }
  resize();
  addEventListener('resize', resize, { passive: true });

  let targetX = 0.5, targetY = 0.55, px = 0.5, py = 0.55, glow = 0, targetGlow = 0;
  if (fine.matches) {
    addEventListener('pointermove', e => {
      targetX = e.clientX / innerWidth;
      targetY = 1 - e.clientY / innerHeight;
      targetGlow = 1;
    }, { passive: true });
    document.addEventListener('pointerleave', () => { targetGlow = 0; });
  }

  let scroll = 0;
  addEventListener('scroll', () => { scroll = scrollY / Math.max(1, innerHeight); }, { passive: true });

  const start = performance.now();
  let last = 0;
  let frame = 0;
  function draw(now: number) {
    frame = 0;
    if (now - last < 32) { frame = requestAnimationFrame(draw); return; } // ~30 fps
    last = now;
    px += (targetX - px) * 0.06;
    py += (targetY - py) * 0.06;
    glow += (targetGlow - glow) * 0.05;
    gl!.uniform1f(uTime, (now - start) / 1000);
    gl!.uniform2f(uPointer, px, py);
    gl!.uniform1f(uScroll, scroll);
    gl!.uniform1f(uGlow, glow);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    if (!reduced.matches && !document.hidden) frame = requestAnimationFrame(draw);
  }
  function wake() {
    if (!frame && !document.hidden) frame = requestAnimationFrame(draw);
  }
  // One frame always, so reduced-motion users get a still composition.
  draw(performance.now());
  wake();
  document.addEventListener('visibilitychange', wake);
  reduced.addEventListener('change', wake);
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); delete document.documentElement.dataset.atmosphere; });
  canvas.addEventListener('webglcontextrestored', () => { document.documentElement.dataset.atmosphere = 'live'; wake(); });
  document.documentElement.dataset.atmosphere = 'live';
}
