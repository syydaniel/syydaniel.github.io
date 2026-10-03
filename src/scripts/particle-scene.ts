/** One GPU particle system; morphs happen in the vertex shader, without per-frame uploads. */
export function initParticleScene() {
  const root = document.getElementById('particle-scene');
  const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement | null;
  if (!root || !canvas) return;
  const modes = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-particle-mode]'));
  const pause = root.querySelector<HTMLButtonElement>('#particle-pause');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  let selected = Number(root.dataset.initialMode) || 0;
  let userPaused = reducedMotion.matches;
  let visible = false;
  let disposed = false;
  let redraw: (() => void) | undefined;
  let syncPlayback: (() => void) | undefined;

  function updatePlayback() {
    root!.dataset.motion = userPaused ? 'paused' : 'running';
    pause?.setAttribute('aria-pressed', String(userPaused));
    const labelKey = userPaused ? 'scene.resume' : 'scene.pause';
    if (pause) {
      pause.dataset.i18nAttr = JSON.stringify({'aria-label': labelKey});
      const translate = (window as unknown as {__t?: (key: string) => string}).__t;
      pause.setAttribute('aria-label', translate?.(labelKey) || (userPaused ? 'Resume particle atmosphere' : 'Pause particle atmosphere'));
    }
    syncPlayback?.();
  }
  modes.forEach((button, index) => button.addEventListener('click', () => {
    selected = index;
    root.dataset.shape = String(index);
    modes.forEach((mode, i) => mode.setAttribute('aria-pressed', String(i === index)));
    redraw?.();
  }));
  pause?.addEventListener('click', () => {
    userPaused = !userPaused;
    updatePlayback();
  });
  reducedMotion.addEventListener('change', () => {
    userPaused = reducedMotion.matches;
    updatePlayback();
  });
  updatePlayback();
  addEventListener('lang:change', updatePlayback);

  async function mount() {
    // Only load Three.js when the artwork actually approaches the viewport.
    try {
      const THREE = await import('three');
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({canvas: canvas!, alpha: true, antialias: false, powerPreference: 'low-power'});
      const mobile = matchMedia('(max-width: 767px)').matches;
      const budget = mobile || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ? 56 : 82;
      const count = budget * budget;
      const terrain = new Float32Array(count * 3);
      const orbit = new Float32Array(count * 3);
      const flow = new Float32Array(count * 3);
      const seeds = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        const u = (i % budget) / (budget - 1);
        const v = Math.floor(i / budget) / (budget - 1);
        const theta = u * Math.PI * 2;
        const phi = v * Math.PI;
        const radius = 1.2 + .065 * Math.sin(phi * 12 + theta * 3) + .045 * Math.cos(theta * 6 - phi * 4);
        terrain.set([radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta)], i * 3);
        const tube = v * Math.PI * 2;
        const r = 1.06 + .32 * Math.cos(tube);
        orbit.set([r * Math.cos(theta), .32 * Math.sin(tube), r * Math.sin(theta)], i * 3);
        const x = (u - .5) * 3.1;
        const z = (v - .5) * 2.8;
        flow.set([x, .25 * Math.sin(x * 3 + z * 2) + .12 * Math.cos(z * 4), z], i * 3);
        seeds[i] = Math.random();
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(terrain, 3));
      geometry.setAttribute('aOrbit', new THREE.BufferAttribute(orbit, 3));
      geometry.setAttribute('aFlow', new THREE.BufferAttribute(flow, 3));
      geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
      const uniforms = {
        uTime: { value: 0 },
        uMorph: { value: new THREE.Vector3(selected === 0 ? 1 : 0, selected === 1 ? 1 : 0, selected === 2 ? 1 : 0) },
        uPointer: { value: new THREE.Vector2() },
        uPixelRatio: { value: 1 }
      };
      const material = new THREE.ShaderMaterial({
        uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        vertexShader: `
          attribute vec3 aOrbit;
          attribute vec3 aFlow;
          attribute float aSeed;
          uniform float uTime;
          uniform float uPixelRatio;
          uniform vec3 uMorph;
          uniform vec2 uPointer;
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            vec3 p = position * uMorph.x + aOrbit * uMorph.y + aFlow * uMorph.z;
            float ripple = sin(p.x * 4.0 + p.z * 3.0 + uTime * .75);
            p += normalize(p + vec3(.001)) * ripple * .028;
            p.y += sin(p.x * 3.0 + p.z * 2.0 + uTime * .8) * .13 * uMorph.z;
            float proximity = exp(-length(p.xy - uPointer * 1.8) * 2.3);
            p.z += proximity * .16;
            vec4 view = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * view;
            gl_PointSize = clamp((2.5 + aSeed * 1.7) * uPixelRatio * (3.0 / -view.z), 1.0, 7.0);
            vec3 cool = vec3(.45, .80, .72);
            vec3 pale = vec3(.90, .96, .75);
            vColor = mix(cool, pale, smoothstep(-1.2, 1.3, p.y + p.x * .4));
            vColor = mix(vColor, vec3(.96, .88, .66), proximity * .22);
            vAlpha = (.66 + aSeed * .34) * smoothstep(-7.0, -2.0, view.z);
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - .5);
            if (d > .5) discard;
            float core = 1.0 - smoothstep(.10, .48, d);
            gl_FragColor = vec4(vColor, core * vAlpha);
          }
        `
      });
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, .1, 30);
      camera.position.z = 4.9;
      const particles = new THREE.Points(geometry, material);
      // The shader can move points outside the base geometry's bounding sphere.
      particles.frustumCulled = false;
      particles.rotation.set(.22, -.35, -.15);
      scene.add(particles);
      let frame = 0;
      let previous = 0;
      let time = 0;
      let contextLost = false;
      const pointer = new THREE.Vector2();
      const target = new THREE.Vector3();

      function render(delta = 0) {
        target.set(selected === 0 ? 1 : 0, selected === 1 ? 1 : 0, selected === 2 ? 1 : 0);
        const immediate = userPaused || reducedMotion.matches;
        const ease = immediate ? 1 : 1 - Math.exp(-delta * 4.2);
        uniforms.uMorph.value.lerp(target, ease);
        uniforms.uPointer.value.lerp(pointer, immediate ? 1 : 1 - Math.exp(-delta * 5));
        uniforms.uTime.value = time;
        const orbitWeight = uniforms.uMorph.value.y;
        const flowWeight = uniforms.uMorph.value.z;
        particles.rotation.x = .22 + orbitWeight * .5 + flowWeight * .38 + uniforms.uPointer.value.y * .08;
        particles.rotation.y = -.35 + time * .075 + uniforms.uPointer.value.x * .13;
        particles.rotation.z = -.15 - orbitWeight * .2;
        renderer.render(scene, camera);
      }
      function tick(now: number) {
        frame = 0;
        const delta = previous ? Math.min((now - previous) / 1000, .05) : 1 / 60;
        previous = now;
        time += delta;
        render(delta);
        if (visible && !document.hidden && !userPaused && !contextLost) frame = requestAnimationFrame(tick);
      }
      syncPlayback = () => {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        previous = 0;
        if (disposed || contextLost) return;
        if (visible && !document.hidden && !userPaused) frame = requestAnimationFrame(tick);
        else if (visible && !document.hidden) render();
      };
      redraw = () => {
        if (!contextLost && visible && !document.hidden && (userPaused || reducedMotion.matches)) render();
      };
      function resize() {
        if (disposed || contextLost) return;
        const { width, height } = canvas!.getBoundingClientRect();
        if (!width || !height) return;
        const ratio = Math.min(devicePixelRatio, mobile ? 1.25 : 1.5);
        renderer.setPixelRatio(ratio);
        uniforms.uPixelRatio.value = ratio;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        render();
      }
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas!);
      resize();
      root!.dataset.ready = 'true';
      root!.dataset.renderer = 'webgl';
      canvas!.addEventListener('pointermove', event => {
        if (!finePointer.matches || userPaused || reducedMotion.matches) return;
        const rect = canvas!.getBoundingClientRect();
        pointer.set(((event.clientX - rect.left) / rect.width - .5) * 2, -((event.clientY - rect.top) / rect.height - .5) * 2);
      }, {passive: true});
      canvas!.addEventListener('pointerleave', () => pointer.set(0, 0));
      canvas!.addEventListener('webglcontextlost', event => {
        event.preventDefault();
        contextLost = true;
        root!.removeAttribute('data-ready');
        root!.dataset.renderer = 'fallback';
        syncPlayback?.();
      });
      canvas!.addEventListener('webglcontextrestored', () => {
        contextLost = false;
        resize();
        root!.dataset.ready = 'true';
        root!.dataset.renderer = 'webgl';
        syncPlayback?.();
      });
      document.addEventListener('visibilitychange', () => syncPlayback?.());
      window.addEventListener('pageshow', () => syncPlayback?.());
      window.addEventListener('pagehide', event => {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        if (event.persisted) return;
        disposed = true;
        observer.disconnect();
        resizeObserver.disconnect();
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      });
      syncPlayback();
    } catch {
      // A usable static SVG stays visible on devices without WebGL or failed imports.
      root!.dataset.renderer = 'fallback';
    }
  }

  let mounted = false;
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible && !mounted) {
      mounted = true;
      void mount();
    }
    syncPlayback?.();
  }, {rootMargin: '0px', threshold: 0});
  observer.observe(root);
}
