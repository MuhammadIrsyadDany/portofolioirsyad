/**
 * Main Application Logic & High-Fidelity Micro-interactions
 * Alter Portfolio Implementation for Muhammad Irsyad Dany
 */

document.addEventListener('DOMContentLoaded', () => {
  initSuitUpSync();
  initNavigation();
  initOriginScrollProgress();
  initTacticalRadar();
  initModals();
  initCopyEmail();
});

/* ==========================================================================
   1. SUIT UP HUD & HERO SYNC
   ========================================================================== */
function initSuitUpSync() {
  const percentEl = document.getElementById('hud-percent');
  const meterFillEl = document.getElementById('hud-meter-fill');
  const statusEl = document.getElementById('hud-status-val');
  const statusWrap = document.getElementById('hud-status');
  const integrityWrap = document.getElementById('hud-integrity');
  const fileWrap = document.getElementById('hud-file');
  const fileLabel = document.getElementById('hud-file-label');
  const name1El = document.getElementById('hero-name-1');
  const name2El = document.getElementById('hero-name-2');

  const name1Civilian = name1El?.getAttribute('data-civilian') || 'IRSYAD';
  const name1Suited = name1El?.getAttribute('data-suited') || 'ALTER';
  const name2Civilian = name2El?.getAttribute('data-civilian') || 'DANY';
  const name2Suited = name2El?.getAttribute('data-suited') || 'EGO';

  let currentSuitedState = false;

  window.addEventListener('suitup-progress', (e) => {
    const progress = e.detail.progress; // 0.0 to 1.0
    const pct = Math.round(progress * 100);

    // Update Percentage & Meter Fill
    if (percentEl) {
      percentEl.textContent = `${String(pct).padStart(3, '0')}%`;
    }
    if (meterFillEl) {
      meterFillEl.style.width = `${pct}%`;
    }

    // State thresholds
    if (progress >= 0.55) {
      if (!currentSuitedState) {
        currentSuitedState = true;
        if (statusEl) statusEl.textContent = 'Suited';
        statusWrap?.classList.add('suited');
        integrityWrap?.classList.add('suited');
        fileWrap?.classList.add('suited');
        if (fileLabel) fileLabel.textContent = 'FILE 001 / ALTER EGO';

        glitchText(name1El, name1Suited);
        glitchText(name2El, name2Suited);
        name1El?.classList.add('suited');
        name2El?.classList.add('suited');
      }
    } else if (progress < 0.25) {
      if (currentSuitedState) {
        currentSuitedState = false;
        if (statusEl) statusEl.textContent = 'Civilian';
        statusWrap?.classList.remove('suited');
        integrityWrap?.classList.remove('suited');
        fileWrap?.classList.remove('suited');
        if (fileLabel) fileLabel.textContent = 'FILE 001 / CIVILIAN';

        glitchText(name1El, name1Civilian);
        glitchText(name2El, name2Civilian);
        name1El?.classList.remove('suited');
        name2El?.classList.remove('suited');
      }
    } else {
      if (statusEl && currentSuitedState) {
        statusEl.textContent = 'Transforming';
      }
    }
  });

  // Glitch character scrambler
  function glitchText(el, targetText) {
    if (!el || el.textContent === targetText) return;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\/[]{}—=+*^?#________';
    let iteration = 0;
    const interval = setInterval(() => {
      el.textContent = targetText
        .split('')
        .map((letter, index) => {
          if (index < iteration) {
            return targetText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= targetText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2;
    }, 28);
  }

  // Click on "Scroll to suit up" hint
  const hintWrap = document.getElementById('hud-hint');
  hintWrap?.addEventListener('click', () => {
    const originSection = document.getElementById('origin');
    if (originSection) {
      originSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

/* ==========================================================================
   2. NAVIGATION & MOBILE DRAWER
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navDrawer = document.getElementById('mobile-drawer');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  menuBtn?.addEventListener('click', () => {
    const isOpen = navDrawer?.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', () => {
      navDrawer?.classList.remove('open');
    });
  });
}

/* ==========================================================================
   3. ORIGIN STORY SCROLL-DRIVEN PROGRESS & STOPS
   ========================================================================== */
function initOriginScrollProgress() {
  const originSection = document.getElementById('origin');
  const progressFill = document.getElementById('timeline-progress-fill');
  const counterEl = document.getElementById('origin-counter');
  const stops = document.querySelectorAll('.timeline-stop');
  const statementEl = document.getElementById('origin-statement-text');

  const stopStatements = [
    'Growing up in Malang, developing a deep curiosity for computing, algorithms, and how code transforms ideas into living digital tools.',
    'Graduated in Informatics Engineering from State Polytechnic of Malang. Rigorous focus on software architecture, data structures, and web technologies.',
    'Mobile & Front-End Developer internship at UTERO Indonesia. Engineered client-facing applications, state management, and streamlined mobile UI flows.',
    'I enjoy transforming ideas and complex requirements into <span class="highlight">functional, intuitive, and well-structured digital experiences</span> through thoughtful development and problem-solving.'
  ];

  window.addEventListener('scroll', () => {
    if (!originSection) return;
    const rect = originSection.getBoundingClientRect();
    const windowH = window.innerHeight;
    
    // Calculate progress as section scrolls through viewport
    const totalDist = rect.height + windowH * 0.5;
    const currentDist = windowH - rect.top;
    let progress = currentDist / totalDist;
    progress = Math.min(1, Math.max(0, progress));

    const pct = Math.round(progress * 100);
    if (counterEl) counterEl.textContent = `${String(pct).padStart(3, '0')}%`;

    // Map progress to timeline fill (minimum 25%)
    const fillPct = Math.max(25, progress * 100);
    if (progressFill) progressFill.style.width = `${fillPct}%`;

    // Update active stop based on progress
    const activeIdx = Math.min(3, Math.floor(progress * 4));
    stops.forEach((s, idx) => {
      if (idx <= activeIdx) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });
  });

  // Clickable stops
  stops.forEach((stop, index) => {
    stop.addEventListener('click', () => {
      stops.forEach((s, i) => {
        if (i <= index) s.classList.add('active');
        else s.classList.remove('active');
      });

      const targetFill = (index + 1) * 25;
      if (progressFill) progressFill.style.width = `${targetFill}%`;
      if (counterEl) counterEl.textContent = `${String(targetFill).padStart(3, '0')}%`;

      if (statementEl && stopStatements[index]) {
        statementEl.style.opacity = '0';
        setTimeout(() => {
          statementEl.innerHTML = stopStatements[index];
          statementEl.style.opacity = '1';
        }, 180);
      }
    });
  });
}

/* ==========================================================================
   4. TACTICAL 5-AXIS SPIDER RADAR (SKILLS)
   ========================================================================== */
function initTacticalRadar() {
  const AXES = ['CLARITY', 'SPEED', 'SYSTEMS', 'CRAFT', 'RANGE'];
  const CENTER_X = 150;
  const CENTER_Y = 150;
  const MAX_RADIUS = 114;
  const NUM_AXES = AXES.length;

  const POWERS_DATA = {
    'pwr-01': {
      code: 'Scan / PWR-01 // WEB DEVELOPMENT',
      name: 'Web Development',
      desc: 'Building responsive and functional web applications using Laravel, PHP, HTML, CSS, JavaScript, and Bootstrap with clean, maintainable architecture.',
      stats: [95, 90, 94, 88, 85]
    },
    'pwr-02': {
      code: 'Scan / PWR-02 // BACKEND & DATABASE',
      name: 'Backend & Database',
      desc: 'Developing structured backend systems, database architecture (MySQL/PostgreSQL), authentication, API integration, and role-based access control (RBAC).',
      stats: [88, 85, 98, 92, 86]
    },
    'pwr-03': {
      code: 'Scan / PWR-03 // UI/UX & INTERFACE',
      name: 'UI/UX & Interface',
      desc: 'Designing intuitive user interfaces and user experiences with a rigorous focus on usability, consistency, visual hierarchy, and accessibility.',
      stats: [94, 80, 88, 96, 82]
    },
    'pwr-04': {
      code: 'Scan / PWR-04 // SYSTEM ANALYSIS',
      name: 'System Analysis',
      desc: 'Analyzing system requirements and translating business needs into structured, efficient, scalable, and maintainable technical solutions.',
      stats: [92, 88, 95, 90, 94]
    }
  };

  // Helper: compute coordinates on axis
  function getPoint(axisIdx, normalizedVal) {
    const angle = -Math.PI / 2 + (axisIdx / NUM_AXES) * Math.PI * 2;
    const r = MAX_RADIUS * normalizedVal;
    const x = CENTER_X + Math.cos(angle) * r;
    const y = CENTER_Y + Math.sin(angle) * r;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }

  // Draw concentric polygon grids
  for (let level = 1; level <= 4; level++) {
    const polyEl = document.getElementById(`radar-grid-${level}`);
    if (polyEl) {
      const norm = level / 4;
      const pts = Array.from({ length: NUM_AXES }, (_, i) => getPoint(i, norm)).join(' ');
      polyEl.setAttribute('points', pts);
    }
  }

  // Draw radial axis lines & labels
  const axesGroup = document.getElementById('radar-axes-group');
  if (axesGroup) {
    axesGroup.innerHTML = '';
    AXES.forEach((axisName, i) => {
      const angle = -Math.PI / 2 + (i / NUM_AXES) * Math.PI * 2;
      const x2 = CENTER_X + Math.cos(angle) * MAX_RADIUS;
      const y2 = CENTER_Y + Math.sin(angle) * MAX_RADIUS;
      const labelX = CENTER_X + Math.cos(angle) * (MAX_RADIUS + 22);
      const labelY = CENTER_Y + Math.sin(angle) * (MAX_RADIUS + 16);

      // Radial line
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', CENTER_X);
      line.setAttribute('y1', CENTER_Y);
      line.setAttribute('x2', x2.toFixed(2));
      line.setAttribute('y2', y2.toFixed(2));
      line.setAttribute('style', 'stroke: rgba(237,237,240,0.1); stroke-width: 1;');
      axesGroup.appendChild(line);

      // Axis label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', labelX.toFixed(2));
      text.setAttribute('y', labelY.toFixed(2));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('style', 'fill: rgba(237,237,240,0.6); font-size: 10px; font-family: var(--font-mono); letter-spacing: 0.1em;');
      text.textContent = axisName;
      axesGroup.appendChild(text);
    });
  }

  // Animated sweep line
  const sweepLine = document.getElementById('radar-sweep-line');
  let sweepAngle = 0;
  function rotateSweep() {
    sweepAngle += 0.02;
    const sx = CENTER_X + Math.cos(sweepAngle) * MAX_RADIUS;
    const sy = CENTER_Y + Math.sin(sweepAngle) * MAX_RADIUS;
    if (sweepLine) {
      sweepLine.setAttribute('x2', sx.toFixed(2));
      sweepLine.setAttribute('y2', sy.toFixed(2));
    }
    requestAnimationFrame(rotateSweep);
  }
  requestAnimationFrame(rotateSweep);

  // Stats polygon update function
  const statsPoly = document.getElementById('radar-stats-poly');
  let currentStats = [95, 90, 94, 88, 85];

  function renderStats(stats) {
    const pts = stats.map((val, i) => getPoint(i, val / 100)).join(' ');
    if (statsPoly) statsPoly.setAttribute('points', pts);

    // Update readout numbers
    stats.forEach((val, i) => {
      const valEl = document.getElementById(`stat-val-${i}`);
      if (valEl) valEl.textContent = String(val).padStart(3, '0');
    });
  }
  renderStats(currentStats);

  // Ability cards click / hover listener
  const rows = document.querySelectorAll('.power-row');
  const codeLabel = document.getElementById('radar-code-label');
  const titleEl = document.getElementById('radar-info-title');
  const descEl = document.getElementById('radar-info-desc');

  rows.forEach(row => {
    function activate() {
      const pId = row.getAttribute('data-power');
      const data = POWERS_DATA[pId];
      if (!data) return;

      rows.forEach(r => r.classList.remove('active'));
      row.classList.add('active');

      if (codeLabel) codeLabel.textContent = data.code;
      if (titleEl) titleEl.textContent = data.name;
      if (descEl) descEl.textContent = data.desc;

      renderStats(data.stats);
    }
    row.addEventListener('mouseenter', activate);
    row.addEventListener('click', activate);
  });
}

/* ==========================================================================
   5. CASE STUDY DATA & MODALS
   ========================================================================== */
const PROJECTS_DATA = [
  {
    id: 'proj-01',
    file: 'Case file 01',
    title: 'Digital Information System',
    discipline: 'Website Development',
    client: 'Academic Project / Malang',
    year: '2025',
    duration: '14 weeks',
    role: 'Lead Full-Stack Developer',
    image: 'assets/images/halden.jpg',
    brief: 'A comprehensive academic and operational information system designed to automate institutional record keeping, user authorization, and data processing workflows.',
    approach: 'Engineered using Laravel, MySQL relational schema, Bootstrap responsive layout, and granular role-based permissions (Superadmin, Staff, Student).',
    debrief: 'Streamlined academic records retrieval time by over 50% and passed institutional verification with zero data redundancy.'
  },
  {
    id: 'proj-02',
    file: 'Case file 02',
    title: 'Management Dashboard',
    discipline: 'Dashboard & Analytics',
    client: 'Academic Project / Malang',
    year: '2025',
    duration: '10 weeks',
    role: 'Frontend & Analytics Architect',
    image: 'assets/images/parallel.jpg',
    brief: 'Real-time administrative control panel providing data analytics, system health monitoring, and activity reporting across multiple institutional modules.',
    approach: 'Designed interactive statistical graphs, dynamic filter queries, export routines (CSV/PDF), and an eye-friendly dark tactical interface.',
    debrief: 'Provided decision makers with unified real-time reporting, cutting monthly reconciliation overhead from days to minutes.'
  },
  {
    id: 'proj-03',
    file: 'Case file 03',
    title: 'Mobile Application Development',
    discipline: 'Mobile Development',
    client: 'UTERO Indonesia',
    year: '2025',
    duration: '12 weeks',
    role: 'Mobile Front-End Developer Intern',
    image: 'assets/images/nordvik.jpg',
    brief: 'Client-facing mobile application built during professional internship at UTERO Indonesia, focused on fluid user interaction, media display, and responsive navigation.',
    approach: 'Implemented modular component architectures, asynchronous API services, local persistence, and touch-optimized gestures adhering to modern UX conventions.',
    debrief: 'Successfully delivered production-grade app prototypes meeting agency design and functional standards ahead of schedule.'
  },
  {
    id: 'proj-04',
    file: 'Case file 04',
    title: 'Database Management System',
    discipline: 'Database Design',
    client: 'Academic Project / Malang',
    year: '2025',
    duration: '8 weeks',
    role: 'Database Engineer & Modeler',
    image: 'assets/images/lumen.jpg',
    brief: 'Architectural design, normalization, and optimization of an enterprise-level database schema handling multi-entity relationships and high transaction rates.',
    approach: 'Executed 3NF normalization, optimized query execution plans, indexing strategies, foreign key constraints, and automated stored procedures.',
    debrief: 'Significantly reduced complex multi-table query latencies with 100% ACID compliance and robust referential integrity.'
  },
  {
    id: 'proj-05',
    file: 'Case file 05',
    title: 'Authentication & Access Control',
    discipline: 'System Development',
    client: 'Personal Project',
    year: '2025',
    duration: '6 weeks',
    role: 'Backend Security Developer',
    image: 'assets/images/osk.jpg',
    brief: 'Specialized security module featuring granular multi-tenant permission assignment, token-based session verification, and audit logging.',
    approach: 'Constructed custom middleware authentication guards, password hashing policies, CSRF shields, rate-limiting handlers, and session revocations.',
    debrief: 'Established a plug-and-play security boilerplate successfully utilized across several subsequent web application builds.'
  },
  {
    id: 'proj-06',
    file: 'Case file 06',
    title: 'Company Profile Website',
    discipline: 'Web Development',
    client: 'Personal Project',
    year: '2026',
    duration: '6 weeks',
    role: 'UI/UX & Web Developer',
    image: 'assets/images/mork.jpg',
    brief: 'Modern commercial website tailored to showcase company identity, services, portfolio deliverables, and streamlined client inquiry channels.',
    approach: 'Built with clean semantic HTML, modular CSS3 animations, fast-loading optimized media assets, and SEO-friendly metadata architecture.',
    debrief: 'Earned 98+ Google Lighthouse scores across performance, accessibility, best practices, and SEO benchmarks.'
  },
  {
    id: 'proj-07',
    file: 'Case file 07',
    title: 'Personal Portfolio Website',
    discipline: 'UI/UX & Web Development',
    client: 'Independent Project',
    year: '2026',
    duration: 'Ongoing',
    role: 'Lead Architect & Designer',
    image: 'assets/images/kunsthal.jpg',
    brief: 'Interactive cyber-tactical developer portfolio inspired by the Alter design language featuring WebGL shader transformations and HUD aesthetics.',
    approach: 'Crafted custom GLSL shaders, Three.js 3D bending tunnel canvas, fluid scroll-synced typography glitching, and zero-dependency vanilla JS logic.',
    debrief: 'Optimized for 100% serverless static deployment on Cloudflare Pages with zero build latency and global CDN edge distribution.'
  }
];

window.openCaseStudy = function(projectId) {
  const project = PROJECTS_DATA.find(p => p.id === projectId);
  if (!project) return;

  const modal = document.getElementById('modal-case-study');
  if (!modal) return;

  document.getElementById('cs-file-tag').textContent = project.file;
  document.getElementById('cs-title').textContent = project.title;
  document.getElementById('cs-discipline').textContent = project.discipline;
  document.getElementById('cs-client').textContent = project.client;
  document.getElementById('cs-year').textContent = project.year;
  document.getElementById('cs-role').textContent = project.role;
  document.getElementById('cs-duration').textContent = project.duration;
  document.getElementById('cs-brief').textContent = project.brief;
  document.getElementById('cs-approach').textContent = project.approach;
  document.getElementById('cs-debrief').textContent = project.debrief;
  document.getElementById('cs-image').src = project.image;

  document.body.style.overflow = 'hidden';
  modal.classList.add('open');
};

function initModals() {
  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-open-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        document.body.style.overflow = 'hidden';
        modal.classList.add('open');
      }
    });
  });

  document.querySelectorAll('.modal-close-btn, .modal-overlay').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el || el.classList.contains('modal-close-btn')) {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
        document.body.style.overflow = '';
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
      document.body.style.overflow = '';
    }
  });

  initAlterEgoSlider();
  initContactForm();
}

function initAlterEgoSlider() {
  const container = document.getElementById('alter-ego-compare');
  const sliderHandle = document.getElementById('compare-handle');
  const suitedLayer = document.getElementById('compare-suited-layer');
  if (!container || !sliderHandle || !suitedLayer) return;

  let isDragging = false;

  function setSliderPos(x) {
    const rect = container.getBoundingClientRect();
    let pos = (x - rect.left) / rect.width;
    pos = Math.max(0, Math.min(pos, 1));
    const pct = pos * 100;
    sliderHandle.style.left = `${pct}%`;
    suitedLayer.style.clipPath = `polygon(0 0, ${pct}% 0, ${pct}% 100%, 0 100%)`;
  }

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    setSliderPos(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) setSliderPos(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches[0]) setSliderPos(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches[0]) setSliderPos(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}

function initContactForm() {
  const form = document.getElementById('mission-contact-form');
  const statusNotice = document.getElementById('form-status-notice');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.textContent = 'TRANSMITTING SIGNAL...';
      btn.disabled = true;
    }

    setTimeout(() => {
      if (statusNotice) {
        statusNotice.textContent = 'SIGNAL RECEIVED // MISSION DISPATCH CONFIRMED';
        statusNotice.style.color = '#22c55e';
      }
      showToast('Signal transmitted. Reply incoming within 2 working days.');
      form.reset();
      if (btn) {
        btn.textContent = 'SIGNAL TRANSMITTED';
        setTimeout(() => {
          btn.textContent = 'SEND THE SIGNAL [TX-01]';
          btn.disabled = false;
        }, 3000);
      }
    }, 1200);
  });
}

/* ==========================================================================
   6. UTILITY: COPY EMAIL & TOAST NOTIFICATION
   ========================================================================== */
function initCopyEmail() {
  const copyBtns = document.querySelectorAll('[data-copy-email]');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-copy-email') || 'irsyaddany@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Email copied: ${email}`);
      }).catch(() => {
        window.location.href = `mailto:${email}`;
      });
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
