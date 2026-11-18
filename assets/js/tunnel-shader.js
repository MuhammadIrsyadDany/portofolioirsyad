/**
 * Mission Tunnel — 3D WebGL Bending Tunnel Carousel
 * Replicating the exact Framer Three.js tunnel architecture from alter.framer.photos
 */

(function () {
  const tunnelSection = document.getElementById('mission-tunnel-section');
  const tunnelSticky = document.getElementById('mission-tunnel-sticky');
  const canvas = document.getElementById('mission-tunnel-canvas');

  if (!tunnelSection || !tunnelSticky || !canvas || typeof THREE === 'undefined') return;

  const PROJECTS_CONFIG = [
    {
      index: 0,
      num: '01',
      title: 'Digital Information System',
      discipline: 'Website Development',
      client: 'Academic Project / Malang',
      year: '2025',
      image: 'assets/images/halden.jpg',
      id: 'proj-01'
    },
    {
      index: 1,
      num: '02',
      title: 'Management Dashboard',
      discipline: 'Dashboard & Analytics',
      client: 'Academic Project / Malang',
      year: '2025',
      image: 'assets/images/parallel.jpg',
      id: 'proj-02'
    },
    {
      index: 2,
      num: '03',
      title: 'Mobile Application Development',
      discipline: 'Mobile Development',
      client: 'UTERO Indonesia',
      year: '2025',
      image: 'assets/images/nordvik.jpg',
      id: 'proj-03'
    },
    {
      index: 3,
      num: '04',
      title: 'Database Management System',
      discipline: 'Database Design',
      client: 'Academic Project / Malang',
      year: '2025',
      image: 'assets/images/lumen.jpg',
      id: 'proj-04'
    },
    {
      index: 4,
      num: '05',
      title: 'Authentication & Access Control',
      discipline: 'System Development',
      client: 'Personal Project',
      year: '2025',
      image: 'assets/images/osk.jpg',
      id: 'proj-05'
    },
    {
      index: 5,
      num: '06',
      title: 'Company Profile Website',
      discipline: 'Web Development',
      client: 'Personal Project',
      year: '2026',
      image: 'assets/images/mork.jpg',
      id: 'proj-06'
    },
    {
      index: 6,
      num: '07',
      title: 'Personal Portfolio Website',
      discipline: 'UI/UX & Web Development',
      client: 'Independent Project',
      year: '2026',
      image: 'assets/images/kunsthal.jpg',
      id: 'proj-07'
    }
  ];

  // GLSL Shaders for the 3D planes
  const vertexShader = `
    uniform float uVel;
    uniform float uHover;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec3 p = position;
      float bend = sin(uv.x * 3.14159);
      p.z += bend * uVel * 0.55 - bend * uHover * 0.12;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    }
  `;

  const fragmentShader = `
    precision highp float;
    uniform sampler2D uTex;
    uniform float uImgAspect;
    uniform float uPlaneAspect;
    uniform float uVel;
    uniform float uFocus;
    uniform float uFade;
    uniform float uHover;
    uniform float uLoaded;
    uniform float uTime;
    uniform vec3 uAccent;
    uniform vec3 uBg;
    varying vec2 vUv;

    vec2 cover(vec2 uv) {
      vec2 s = vec2(1.0);
      if (uImgAspect > uPlaneAspect) s.x = uPlaneAspect / uImgAspect; else s.y = uImgAspect / uPlaneAspect;
      vec2 zoom = s * (1.0 - uHover * 0.06);
      return (uv - 0.5) * zoom + 0.5;
    }

    void main() {
      vec2 uv = cover(vUv);
      float shift = uVel * 0.014 + (1.0 - uFocus) * 0.004;
      float r = texture2D(uTex, uv + vec2(shift, 0.0)).r;
      float g = texture2D(uTex, uv).g;
      float b = texture2D(uTex, uv - vec2(shift, 0.0)).b;
      vec3 col = vec3(r, g, b);
      float lum = dot(col, vec3(0.299, 0.587, 0.114));
      vec3 mono = vec3(lum) * vec3(0.9, 0.95, 1.05);
      col = mix(mono * 0.82, col, uFocus);
      // Scanlines
      col *= 0.92 + 0.08 * sin(vUv.y * 420.0 + uTime * 4.0);
      // Focused frame glow
      vec2 e = min(vUv, 1.0 - vUv);
      float edge = min(e.x * uPlaneAspect, e.y);
      float frame = (1.0 - smoothstep(0.0, 0.012, edge)) * (0.35 + 0.65 * uHover);
      col = mix(col, uAccent, frame * uFocus);
      col = mix(uBg, col, 1.0 - uLoaded);
      col = mix(uBg, col, uFade);
      gl_FragColor = vec4(col, 1.0);
    }
  `;

  let renderer, scene, camera;
  const projectPlanes = [];
  let width = tunnelSticky.clientWidth;
  let height = tunnelSticky.clientHeight;
  const totalProjects = PROJECTS_CONFIG.length;
  const zSpacing = 7.0;

  // UI Element References
  const numEl = document.getElementById('tunnel-project-num');
  const titleEl = document.getElementById('tunnel-project-title');
  const disciplineEl = document.getElementById('tunnel-project-discipline');
  const clientEl = document.getElementById('tunnel-project-client');
  const yearEl = document.getElementById('tunnel-project-year');
  const ticksContainer = document.getElementById('tunnel-pagination-ticks');

  let currentActiveIndex = 0;
  let scrollProgress = 0;
  let scrollVel = 0;
  let lastScrollY = window.scrollY;

  function init() {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(width, height);
    renderer.setClearColor(new THREE.Color('#07080a'), 1);

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(new THREE.Color('#07080a'), 4, 32);

    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 80);
    camera.position.set(0, 0, 4.4);

    createTunnelWireframe();
    createTunnelParticles();
    createProjectPlanes();
    createPaginationTicks();

    bindEvents();
    animate();
  }

  function createTunnelWireframe() {
    const totalDepth = (totalProjects - 1) * zSpacing + 30;
    const b = 5.2;
    const x = 3.1;
    const positions = [];
    const colors = [];

    const accentColor = new THREE.Color('#FF5A1F');
    const gridColor = new THREE.Color('#EDEDF0');

    let ringIdx = 0;
    for (let z = 8; z > -totalDepth; z -= 1.75) {
      const isMajor = ringIdx % 4 === 0;
      const col = isMajor ? accentColor : gridColor;
      const alpha = isMajor ? 0.75 : 0.16;

      const ringCorners = [
        [-b, -x], [b, -x],
        [b, -x], [b, x],
        [b, x], [-b, x],
        [-b, x], [-b, -x]
      ];

      for (let i = 0; i < ringCorners.length; i++) {
        const pt = ringCorners[i];
        positions.push(pt[0], pt[1], z);
        colors.push(col.r * alpha, col.g * alpha, col.b * alpha);
      }
      ringIdx++;
    }

    // Longitudinal rails along tunnel
    const rails = [
      [-b, -x], [b, -x],
      [-b, x], [b, x],
      [-b * 0.5, -x], [b * 0.5, -x], [0, -x]
    ];
    for (let r = 0; r < rails.length; r++) {
      const pt = rails[r];
      positions.push(pt[0], pt[1], 8, pt[0], pt[1], -totalDepth);
      colors.push(gridColor.r * 0.12, gridColor.g * 0.12, gridColor.b * 0.12, 0, 0, 0);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const mat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true });
    const lines = new THREE.LineSegments(geo, mat);
    scene.add(lines);
  }

  function createTunnelParticles() {
    const b = 5.2;
    const x = 3.1;
    const totalDepth = (totalProjects - 1) * zSpacing + 30;
    const count = 300;
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      let px = (Math.random() * 2 - 1) * b;
      let py = (Math.random() * 2 - 1) * x;
      if (Math.random() < 0.5) {
        px = Math.sign(px || 1) * (b * (0.7 + Math.random() * 0.3));
      } else {
        py = Math.sign(py || 1) * (x * (0.6 + Math.random() * 0.4));
      }
      pos[i * 3] = px;
      pos[i * 3 + 1] = py;
      pos[i * 3 + 2] = 8 - Math.random() * totalDepth;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: new THREE.Color('#31A8FF'), size: 0.04, transparent: true, opacity: 0.55 });
    const points = new THREE.Points(geo, mat);
    scene.add(points);
  }

  function createProjectPlanes() {
    const textureLoader = new THREE.TextureLoader();
    const planeGeo = new THREE.PlaneGeometry(1, 1, 24, 8);

    PROJECTS_CONFIG.forEach((proj, idx) => {
      const mat = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
          uTex: { value: null },
          uImgAspect: { value: 1.5 },
          uPlaneAspect: { value: 16 / 10 },
          uVel: { value: 0 },
          uFocus: { value: idx === 0 ? 1 : 0 },
          uFade: { value: 0 },
          uHover: { value: 0 },
          uLoaded: { value: 0 },
          uTime: { value: 0 },
          uAccent: { value: new THREE.Color('#FF5A1F') },
          uBg: { value: new THREE.Color('#07080a') }
        },
        transparent: true
      });

      const mesh = new THREE.Mesh(planeGeo, mat);
      mesh.userData = { index: idx, id: proj.id };
      mesh.position.z = -idx * zSpacing;
      scene.add(mesh);

      // Load image
      textureLoader.load(proj.image, (tex) => {
        tex.minFilter = THREE.LinearFilter;
        mat.uniforms.uTex.value = tex;
        mat.uniforms.uImgAspect.value = tex.image.width / tex.image.height;
        mat.uniforms.uLoaded.value = 1.0;
      });

      projectPlanes.push({ mesh, mat, index: idx });
    });

    updatePlanesLayout();
  }

  function updatePlanesLayout() {
    width = tunnelSticky.clientWidth;
    height = tunnelSticky.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const isMobile = width / height < 1;
    const vFOV = camera.fov * Math.PI / 180;
    const dist = 4.4;
    const viewHeight = 2 * dist * Math.tan(vFOV / 2);
    const viewWidth = viewHeight * camera.aspect;

    const planeW = isMobile ? viewWidth * 0.88 : Math.min(viewWidth * 0.52, 3.8);
    const planeH = planeW / 1.6;

    projectPlanes.forEach((item, idx) => {
      const side = idx % 2 === 0 ? 1 : -1;
      const baseX = isMobile ? 0 : side * (viewWidth * 0.5 - planeW * 0.5 - viewWidth * 0.06);
      item.mesh.scale.set(planeW, planeH, 1);
      item.mesh.position.x = baseX;
      item.mesh.position.y = isMobile ? viewHeight * 0.12 : 0.1;
      item.mat.uniforms.uPlaneAspect.value = planeW / planeH;
    });
  }

  function createPaginationTicks() {
    if (!ticksContainer) return;
    ticksContainer.innerHTML = '';
    PROJECTS_CONFIG.forEach((_, idx) => {
      const tick = document.createElement('span');
      tick.className = 'tunnel-tick' + (idx === 0 ? ' active' : '');
      tick.style.display = 'block';
      tick.style.height = '2px';
      tick.style.width = '24px';
      tick.style.transformOrigin = 'right';
      tick.style.transform = idx === 0 ? 'scaleX(1)' : 'scaleX(0.4)';
      tick.style.background = idx === 0 ? '#ff5a1f' : 'rgba(237, 237, 240, 0.25)';
      tick.style.transition = 'transform 0.4s ease, background 0.4s ease';
      ticksContainer.appendChild(tick);
    });
  }

  function bindEvents() {
    window.addEventListener('resize', updatePlanesLayout);

    // Click canvas / project to open modal
    canvas.addEventListener('click', () => {
      const activeProj = PROJECTS_CONFIG[currentActiveIndex];
      if (activeProj && window.openCaseStudy) {
        window.openCaseStudy(activeProj.id);
      }
    });

    titleEl?.addEventListener('click', (e) => {
      e.preventDefault();
      const activeProj = PROJECTS_CONFIG[currentActiveIndex];
      if (activeProj && window.openCaseStudy) {
        window.openCaseStudy(activeProj.id);
      }
    });
  }

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Calculate scroll within tunnelSection (510vh)
    const rect = tunnelSection.getBoundingClientRect();
    const scrollDist = tunnelSection.offsetHeight - window.innerHeight;
    const rawProgress = -rect.top / Math.max(1, scrollDist);
    scrollProgress = Math.min(1, Math.max(0, rawProgress));

    // Scroll velocity
    const currentScrollY = window.scrollY;
    scrollVel = THREE.MathUtils.lerp(scrollVel, Math.abs(currentScrollY - lastScrollY) * 0.05, 0.12);
    lastScrollY = currentScrollY;

    // Camera moves through tunnel along Z
    const maxTargetZ = -(totalProjects - 1) * zSpacing;
    const targetCameraZ = 4.4 + scrollProgress * maxTargetZ;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCameraZ, 0.1);

    // Determine currently focused project index
    const currentVirtualIdx = Math.round((-camera.position.z + 4.4) / zSpacing);
    const clampedIdx = Math.max(0, Math.min(totalProjects - 1, currentVirtualIdx));

    if (clampedIdx !== currentActiveIndex) {
      currentActiveIndex = clampedIdx;
      updateFocusedProjectUI(currentActiveIndex);
    }

    // Update shaders
    projectPlanes.forEach((item, idx) => {
      const planeZ = item.mesh.position.z;
      const distToCamera = Math.abs(camera.position.z - (planeZ + 4.4));
      const focus = Math.max(0, 1 - distToCamera / (zSpacing * 0.8));

      item.mat.uniforms.uTime.value = elapsedTime;
      item.mat.uniforms.uVel.value = scrollVel;
      item.mat.uniforms.uFocus.value = THREE.MathUtils.lerp(item.mat.uniforms.uFocus.value, focus, 0.15);
    });

    renderer.render(scene, camera);
  }

  function updateFocusedProjectUI(idx) {
    const proj = PROJECTS_CONFIG[idx];
    if (!proj) return;

    if (numEl) numEl.textContent = proj.num;
    if (titleEl) {
      titleEl.textContent = proj.title.toUpperCase();
      titleEl.setAttribute('data-id', proj.id);
    }
    if (disciplineEl) disciplineEl.textContent = proj.discipline;
    if (clientEl) clientEl.textContent = proj.client;
    if (yearEl) yearEl.textContent = proj.year;

    // Update ticks
    const ticks = ticksContainer?.querySelectorAll('.tunnel-tick');
    ticks?.forEach((t, i) => {
      if (i === idx) {
        t.style.transform = 'scaleX(1)';
        t.style.background = '#ff5a1f';
      } else {
        t.style.transform = 'scaleX(0.4)';
        t.style.background = 'rgba(237, 237, 240, 0.25)';
      }
    });
  }

  // Safe initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
