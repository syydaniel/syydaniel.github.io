import * as THREE from 'three';

function loadImage(src: string, signal: AbortSignal): Promise<HTMLImageElement | null> {
  return new Promise(resolve => {
    if (signal.aborted) { resolve(null); return; }
    const img = new Image();
    const finish = (value: HTMLImageElement | null) => {
      img.onload = img.onerror = null;
      signal.removeEventListener('abort', abort);
      resolve(value);
    };
    const abort = () => { finish(null); img.src = ''; };
    img.onload = () => finish(img);
    img.onerror = () => finish(null);
    signal.addEventListener('abort', abort, {once: true});
    img.src = src;
  });
}

/** A finite photo development, with no idle animation or background rendering. */
export function createPhotoDeveloper(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: false, powerPreference: 'low-power'});
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-.75, .75, .5, -.5, .1, 12);
  camera.position.z = 5;
  let frame = 0;
  let disposed = false;
  let contextLost = false;
  let generation = 0;
  let points: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial> | null = null;
  let finishRun: ((completed: boolean) => void) | null = null;

  function cancel() {
    generation++;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    if (points) {
      scene.remove(points);
      points.geometry.dispose();
      points.material.dispose();
      points = null;
    }
    if (!disposed && !contextLost) renderer.clear();
    finishRun?.(false);
    finishRun = null;
  }
  function lost(event: Event) {
    event.preventDefault();
    contextLost = true;
    cancel();
  }
  canvas.addEventListener('webglcontextlost', lost);

  async function develop(src: string, signal: AbortSignal, blend: (value: number) => void): Promise<boolean> {
    cancel();
    const version = generation;
    if (disposed || contextLost || signal.aborted) return false;
    const img = await loadImage(src, signal);
    if (!img || version !== generation || disposed || contextLost || signal.aborted) return false;
    const small = matchMedia('(max-width: 767px)').matches || navigator.hardwareConcurrency <= 4;
    const cols = small ? 72 : 112;
    const rows = Math.round(cols / 1.5);
    const sample = document.createElement('canvas');
    sample.width = cols; sample.height = rows;
    const context = sample.getContext('2d', {willReadFrequently: true});
    if (!context) return false;
    // Match the exhibition frames' 3:2 crop, while the full viewer keeps the original.
    const aspect = img.naturalWidth / img.naturalHeight;
    const cropW = aspect > 1.5 ? img.naturalHeight * 1.5 : img.naturalWidth;
    const cropH = aspect > 1.5 ? img.naturalHeight : img.naturalWidth / 1.5;
    context.drawImage(img, (img.naturalWidth - cropW) / 2, (img.naturalHeight - cropH) / 2, cropW, cropH, 0, 0, cols, rows);
    const pixels = context.getImageData(0, 0, cols, rows).data;
    const count = cols * rows;
    const position = new Float32Array(count * 3);
    const scatter = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const u = (i % cols + .5) / cols;
      const v = (Math.floor(i / cols) + .5) / rows;
      position.set([(u - .5) * 1.5, .5 - v, 0], i * 3);
      const seed = ((i * 16807 + 17) % 2147483647) / 2147483647;
      const angle = i * 2.399963;
      const radius = .4 + ((i * 7919) % 1000) / 380;
      scatter.set([Math.cos(angle) * radius, Math.sin(angle) * radius, Math.sin(i * .17) * 1.4], i * 3);
      seeds[i] = (Math.sin(i * 78.233 + seed * 17) * 43758.5453) % 1;
      seeds[i] = Math.abs(seeds[i]);
      color.setRGB(pixels[i * 4] / 255, pixels[i * 4 + 1] / 255, pixels[i * 4 + 2] / 255, THREE.SRGBColorSpace);
      colors.set([color.r, color.g, color.b], i * 3);
    }
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(devicePixelRatio || 1, small ? 1.25 : 1.5);
    renderer.setPixelRatio(ratio);
    renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
    geometry.setAttribute('aScatter', new THREE.BufferAttribute(scatter, 3));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    const material = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: {uProgress: {value: 0}, uSize: {value: rect.width / cols * ratio * .95}},
      vertexShader: `
        attribute vec3 aScatter;
        attribute vec3 aColor;
        attribute float aSeed;
        uniform float uProgress;
        uniform float uSize;
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
          float t = clamp(uProgress * 1.3 - aSeed * .3, 0.0, 1.0);
          float eased = 1.0 - pow(1.0 - t, 3.0);
          vec3 p = mix(aScatter, position, eased);
          float angle = (1.0 - eased) * (3.0 + aSeed * 2.0);
          p.xy = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * p.xy;
          p.z += sin(eased * 3.14159265) * .35;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = uSize * (.65 + eased * .35);
          vColor = aColor;
          vOpacity = smoothstep(0.0, .08, uProgress) * (1.0 - smoothstep(.76, 1.0, uProgress));
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
          float d = length(gl_PointCoord - .5);
          if (d > .5) discard;
          float alpha = 1.0 - smoothstep(.2, .5, d);
          gl_FragColor = vec4(vColor, alpha * vOpacity);
          #include <colorspace_fragment>
        }
      `
    });
    points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);
    return new Promise(resolve => {
      let start = 0;
      finishRun = resolve;
      const abort = () => cancel();
      signal.addEventListener('abort', abort, {once: true});
      const finish = (complete: boolean) => {
        signal.removeEventListener('abort', abort);
        resolve(complete);
      };
      finishRun = finish;
      function tick(now: number) {
        frame = 0;
        if (version !== generation || disposed || contextLost || signal.aborted) { cancel(); return; }
        if (!start) start = now;
        const progress = Math.min(1, (now - start) / 1650);
        material.uniforms.uProgress.value = progress;
        blend(Math.max(0, (progress - .74) / .26));
        renderer.render(scene, camera);
        if (progress < 1) frame = requestAnimationFrame(tick);
        else {
          finishRun = null;
          finish(true);
          cancel();
        }
      }
      frame = requestAnimationFrame(tick);
    });
  }
  function dispose() {
    if (disposed) return;
    cancel();
    disposed = true;
    canvas.removeEventListener('webglcontextlost', lost);
    renderer.dispose();
    renderer.forceContextLoss();
  }
  return {develop, cancel, dispose};
}
