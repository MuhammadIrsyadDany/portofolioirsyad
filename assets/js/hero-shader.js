/**
 * Hero WebGL Suit-Up Shader
 * Reproduces the interactive cyber-tactical civilian-to-suited transformation
 */

(function () {
  const canvas = document.getElementById('suitup-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const container = canvas.parentElement;
  let renderer, scene, camera, mesh, material;
  let baseTex, hoverTex;
  let width = container.clientWidth;
  let height = container.clientHeight;

  // Shader uniforms
  const uniforms = {
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(width, height) },
    uMouse: { value: new THREE.Vector2(-1000, -1000) },
    uMouseOn: { value: 0.0 },
    uScan: { value: 0.0 },
    uVel: { value: 0.0 },
    uBase: { value: null },
    uHover: { value: null },
    uBoxMin: { value: new THREE.Vector2(0, 0) },
    uBoxSize: { value: new THREE.Vector2(width, height) },
    uLine: { value: new THREE.Color('#EDEDF0') },
    uAccent: { value: new THREE.Color('#FF5A1F') },
    uSuit: { value: new THREE.Color('#31A8FF') },
    uHasBase: { value: 1.0 },
    uHasHover: { value: 1.0 }
  };

  // Simplex Noise and FBM in GLSL
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    precision highp float;
    uniform vec2 uRes;
    uniform vec2 uMouse;
    uniform float uMouseOn;
    uniform float uScan;
    uniform float uVel;
    uniform float uTime;
    uniform sampler2D uBase;
    uniform sampler2D uHover;
    uniform vec2 uBoxMin;
    uniform vec2 uBoxSize;
    uniform vec3 uLine;
    uniform vec3 uAccent;
    uniform vec3 uSuit;
    uniform float uHasBase;
    uniform float uHasHover;
    varying vec2 vUv;

    // Simplex Noise 2D
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m;
      m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    float fbm(vec2 p) {
      float total = 0.0;
      float amp = 0.5;
      for (int i = 0; i < 4; i++) {
        total += snoise(p) * amp;
        p *= 2.05;
        amp *= 0.5;
      }
      return total;
    }

    float hash(float n) { return fract(sin(n) * 43758.5453123); }

    void main() {
      vec2 frag = gl_FragCoord.xy;
      vec2 p = frag / uRes.y;
      vec2 m = uMouse / uRes.y;
      float md = length(p - m);

      // Pointer interactive blob mask
      float blobNoise = snoise(p * 3.5 + vec2(uTime * 0.25, -uTime * 0.2)) * 0.35;
      float blob = smoothstep(0.35, 0.05, md + blobNoise) * uMouseOn;

      // Vertical scan line that descends as user scrolls
      vec2 iuv = (frag - uBoxMin) / uBoxSize;
      float edgeY = 1.08 - uScan * 1.2;
      float wob = snoise(vec2(iuv.x * 6.0, uTime * 0.9)) * 0.018 + snoise(vec2(iuv.x * 22.0, uTime * 2.3)) * 0.006;
      float d = iuv.y - (edgeY + wob);
      float scanMask = smoothstep(-0.01, 0.01, -d);
      float mask = clamp(max(blob, scanMask), 0.0, 1.0);

      // Glitch effect near transition edge
      float band = floor(frag.y / (6.0 + 10.0 * hash(floor(uTime * 12.0))));
      float near = exp(-abs(d) * 26.0);
      float jitter = (hash(band + floor(uTime * 20.0)) - 0.5) * (near * 0.04 + uVel * 0.02);
      jitter *= step(0.55, hash(band * 1.7 + floor(uTime * 9.0)));

      // Contour lines background
      float bump = exp(-md * md * 14.0) * 0.35 * uMouseOn;
      float f = fbm(p * 1.1 + vec2(uTime * 0.012, uTime * 0.016)) + bump;
      float lv = f * 7.0;
      float ld = abs(fract(lv + 0.5) - 0.5);
      float w = fwidth(lv);
      float line = 1.0 - smoothstep(0.0, w * 1.4, ld);

      float scanBand = exp(-abs(frag.y - (uBoxMin.y + uBoxSize.y * edgeY)) / uRes.y * 22.0) * step(0.001, uScan) * step(uScan, 0.999);
      float hot = clamp(blob + scanBand, 0.0, 1.0);
      float la = line * mix(0.06, 0.75, hot);
      vec4 acc = vec4(mix(uLine, uAccent, hot) * la, la);

      // Character portrait sampling within box
      if (iuv.x >= 0.0 && iuv.x <= 1.0 && iuv.y >= 0.0 && iuv.y <= 1.0) {
        vec2 tuv = vec2(iuv.x + jitter, iuv.y);
        tuv = clamp(tuv, 0.0, 1.0);
        float fade = smoothstep(0.0, 0.12, iuv.y);

        // Base civilian texture
        vec4 b = texture2D(uBase, tuv);
        float ba = b.a * fade * uHasBase * (1.0 - mask * uHasHover);
        acc = vec4(b.rgb * ba, ba) + acc * (1.0 - ba);

        // Suited alter ego texture with RGB split
        float split = near * 0.015 + uVel * 0.005;
        vec4 hR = texture2D(uHover, tuv + vec2(split, 0.0));
        vec4 hG = texture2D(uHover, tuv);
        vec4 hB = texture2D(uHover, tuv - vec2(split, 0.0));
        vec4 h = vec4(hR.r, hG.g, hB.b, hG.a);

        // Key out dark background
        float lum = dot(h.rgb, vec3(0.299, 0.587, 0.114));
        float ha = smoothstep(0.04, 0.18, lum) * mask * fade * uHasHover;
        acc = mix(acc, vec4(h.rgb, 1.0), ha);
      }

      gl_FragColor = vec4(acc.rgb, acc.a);
    }
  `;

  function init() {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const textureLoader = new THREE.TextureLoader();
    baseTex = textureLoader.load('assets/images/portrait-civilian.webp', () => {
      uniforms.uBase.value = baseTex;
      updateBox();
    });
    hoverTex = textureLoader.load('assets/images/portrait-suited.jpg', () => {
      uniforms.uHover.value = hoverTex;
      updateBox();
    });

    material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: uniforms,
      transparent: true
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    updateBox();
    bindEvents();
    animate();
  }

  function updateBox() {
    width = container.clientWidth;
    height = container.clientHeight;
    renderer.setSize(width, height);
    uniforms.uRes.value.set(width, height);

    // Calculate aspect ratio box for character centered at bottom
    const imgAspect = 375 / 666;
    let boxH = height * 0.88;
    let boxW = boxH * imgAspect;
    if (boxW > width * 0.8) {
      boxW = width * 0.8;
      boxH = boxW / imgAspect;
    }
    const boxX = (width - boxW) * 0.5;
    const boxY = 0; // Aligned to bottom

    uniforms.uBoxMin.value.set(boxX, boxY);
    uniforms.uBoxSize.value.set(boxW, boxH);
  }

  let lastScrollY = window.scrollY;
  let scrollVel = 0;

  function bindEvents() {
    window.addEventListener('resize', () => {
      updateBox();
    });

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = rect.height - (e.clientY - rect.top);
      uniforms.uMouse.value.set(x, y);
      uniforms.uMouseOn.value = 1.0;
    });

    window.addEventListener('mouseleave', () => {
      uniforms.uMouseOn.value = 0.0;
    });

    // Touch support for mobile/tablet
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = rect.height - (touch.clientY - rect.top);
        uniforms.uMouse.value.set(x, y);
        uniforms.uMouseOn.value = 1.0;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      uniforms.uMouseOn.value = 0.0;
    });
  }

  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    uniforms.uTime.value += delta;

    // Calculate scroll velocity & scan position
    const currentScroll = window.scrollY;
    const heroH = container.clientHeight;
    const progress = Math.min(Math.max(currentScroll / (heroH * 0.65), 0), 1);

    scrollVel = THREE.MathUtils.lerp(scrollVel, Math.abs(currentScroll - lastScrollY) * 0.05, 0.1);
    lastScrollY = currentScroll;
    uniforms.uVel.value = scrollVel;

    // Smoothly interpolate uScan
    uniforms.uScan.value = THREE.MathUtils.lerp(uniforms.uScan.value, progress, 0.12);

    // Broadcast suit up progress to UI elements
    window.dispatchEvent(new CustomEvent('suitup-progress', {
      detail: { progress: uniforms.uScan.value }
    }));

    renderer.render(scene, camera);
  }

  // Safe initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

