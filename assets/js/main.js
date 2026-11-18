/**
 * Main Application Logic & Micro-interactions
 * Alter Portfolio Implementation
 */

document.addEventListener('DOMContentLoaded', () => {
  initSuitUpSync();
  initNavigation();
  initTimelineStops();
  initPowerRadar();
  initMissionFiles();
  initModals();
  initCopyEmail();
});

/* ==========================================================================
   1. SUIT UP HUD & TYPOGRAPHY SYNC
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

  const name1Civilian = name1El?.getAttribute('data-civilian') || 'YASSIN';
  const name1Suited = name1El?.getAttribute('data-suited') || 'ALTER';
  const name2Civilian = name2El?.getAttribute('data-civilian') || 'FARAG';
  const name2Suited = name2El?.getAttribute('data-suited') || 'EGO';

  let currentSuitedState = false;

  window.addEventListener('suitup-progress', (e) => {
    const progress = e.detail.progress; // 0.0 to 1.0
    const pct = Math.round(progress * 100);

    // Update Percentage & Meter
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
        // Morph to suited
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
        // Morph back to civilian
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

  // Glitch text character scrambler
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

  // Click on "Scroll to suit up" hint to smoothly scroll down
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

  // Sticky header border opacity on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  menuBtn?.addEventListener('click', () => {
    const isOpen = navDrawer?.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close drawer on link click
  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', () => {
      navDrawer?.classList.remove('open');
    });
  });
}

/* ==========================================================================
   3. ORIGIN STORY TIMELINE STOPS
   ========================================================================== */
function initTimelineStops() {
  const stops = document.querySelectorAll('.timeline-stop');
  const progressBar = document.getElementById('timeline-progress-bar');
  const statementEl = document.getElementById('origin-statement-text');

  const stopData = [
    {
      city: 'Cairo',
      width: '25%',
      statement: 'Studied typography and visual communications. Studio apprentice discovering how culture shapes visual identity.'
    },
    {
      city: 'Amsterdam',
      width: '50%',
      statement: 'Four years designing European brands and digital platforms in fast-paced international design consultancies.'
    },
    {
      city: 'Copenhagen',
      width: '75%',
      statement: 'Leading wayfinding, brand systems, and physical-digital product design for Scandinavian cultural and urban institutions.'
    },
    {
      city: 'Independent',
      width: '100%',
      statement: 'Ten years in studios taught me one rule: if a brand needs a paragraph to explain itself, the design isn’t finished. So I work like a specialist on call. One founder, one product, no committee, from the first sketch to the files that ship.'
    }
  ];

  stops.forEach((stop, index) => {
    stop.addEventListener('click', () => {
      stops.forEach(s => s.classList.remove('active'));
      stop.classList.add('active');

      if (progressBar && stopData[index]) {
        progressBar.style.width = stopData[index].width;
      }
      if (statementEl && stopData[index]) {
        statementEl.style.opacity = '0';
        setTimeout(() => {
          statementEl.textContent = stopData[index].statement;
          statementEl.style.opacity = '1';
        }, 180);
      }
    });
  });
}

/* ==========================================================================
   4. POWER PROFILE INTERACTIVE RADAR
   ========================================================================== */
function initPowerRadar() {
  const cards = document.querySelectorAll('.power-card');
  const readoutCode = document.getElementById('readout-power-code');
  const readoutText = document.getElementById('readout-power-desc');
  const targetDot = document.getElementById('radar-target-dot');

  const powerDetails = {
    'pwr-01': {
      code: 'Scan / PWR-01',
      desc: 'Marks, type, colour and the rules that keep them consistent long after I leave the room. Complete corporate identities and design systems.',
      dotPos: { top: '35%', left: '60%' }
    },
    'pwr-02': {
      code: 'Scan / PWR-02',
      desc: 'Custom digital experiences, high-performance web products, interactive storytelling, and fluid responsive design engineered with precision.',
      dotPos: { top: '65%', left: '40%' }
    },
    'pwr-03': {
      code: 'Scan / PWR-03',
      desc: 'Architectural signage, spatial navigation, pedestrian wayfinding systems, and information density tailored for high-transit environments.',
      dotPos: { top: '25%', left: '30%' }
    },
    'pwr-04': {
      code: 'Scan / PWR-04',
      desc: 'Editorial visual direction, campaign narratives, photography guidelines, and product launch staging for premium creative ventures.',
      dotPos: { top: '70%', left: '72%' }
    }
  };

  cards.forEach(card => {
    card.addEventListener('mouseenter', activatePower);
    card.addEventListener('click', activatePower);
  });

  function activatePower(e) {
    const card = e.currentTarget;
    const powerId = card.getAttribute('data-power');
    const data = powerDetails[powerId];
    if (!data) return;

    cards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');

    if (readoutCode) readoutCode.textContent = data.code;
    if (readoutText) readoutText.textContent = data.desc;

    if (targetDot) {
      targetDot.style.top = data.dotPos.top;
      targetDot.style.left = data.dotPos.left;
    }
  }
}

/* ==========================================================================
   5. MISSION FILES & FLOATING PREVIEW
   ========================================================================== */
const PROJECTS_DATA = [
  {
    id: 'halden-acoustics',
    file: 'Case file 01',
    title: 'Halden Acoustics',
    discipline: 'Identity, Packaging',
    client: 'Halden, Oslo',
    year: '2026',
    duration: '14 weeks',
    role: 'Lead Brand & Packaging Designer',
    image: 'assets/images/halden.jpg',
    brief: 'Halden engineers high-end studio acoustic monitors and room tuning hardware. They needed an identity and physical packaging system that conveyed absolute sonic fidelity.',
    approach: 'We developed an ultra-minimalist typographic architecture with calibrated technical debossing, matte obsidian paper, and precise frequency response graphs across every touchpoint.',
    debrief: 'Wholesale retail orders from European distribution partners tripled in the first 60 days following the Oslo launch event.'
  },
  {
    id: 'parallel-archive',
    file: 'Case file 02',
    title: 'Parallel Archive',
    discipline: 'Website, Art direction',
    client: 'Parallel, Rotterdam',
    year: '2025',
    duration: '12 weeks',
    role: 'Art Director & Frontend Architect',
    image: 'assets/images/parallel.jpg',
    brief: 'A private repository of 20th-century architectural blueprints and industrial design schematics needed a public-facing digital platform.',
    approach: 'Engineered an editorial browsing interface with custom canvas zoom pan viewers, metadata indexing, and darkroom-grade contrast levels.',
    debrief: 'Over 120,000 architectural assets were digitized and accessed by 45,000 monthly active researchers.'
  },
  {
    id: 'nordvik-ceramics',
    file: 'Case file 03',
    title: 'Nordvik Ceramics',
    discipline: 'Identity, E-commerce',
    client: 'Nordvik, Bergen',
    year: '2025',
    duration: '8 weeks',
    role: 'Brand Identity & Web Designer',
    image: 'assets/images/nordvik.jpg',
    brief: 'Craft studio producing hand-thrown stoneware sought an online flagship experience that felt as tactile and grounded as their clay.',
    approach: 'High-contrast typography paired with raw textural photography, generous whitespace, and an intuitive checkout without unnecessary chrome.',
    debrief: 'Average cart size increased by 42% and seasonal collections consistently sell out within hours of launch.'
  },
  {
    id: 'lumen-line',
    file: 'Case file 04',
    title: 'Lumen Line',
    discipline: 'Wayfinding, Signage',
    client: 'Aarhus Light Rail',
    year: '2024',
    duration: '18 weeks',
    role: 'Wayfinding Lead',
    image: 'assets/images/lumen.jpg',
    brief: 'A new 14-station transit line required passenger wayfinding and interchange mapping that was instantly legible in low light and inclement weather.',
    approach: 'High-visibility pictograms, universal colour-coding, anti-glare vitrified porcelain enamel panels, and clear line-of-sight node hierarchies.',
    debrief: 'Transit passenger satisfaction surveys scored 94% on route legibility and transfer ease.'
  },
  {
    id: 'osk-audio',
    file: 'Case file 05',
    title: 'Osk Audio',
    discipline: 'Identity, Launch site',
    client: 'Osk, Copenhagen',
    year: '2024',
    duration: '10 weeks',
    role: 'Brand & Launch Website',
    image: 'assets/images/osk.jpg',
    brief: 'Brand identity and launch site for a boutique speaker company that wanted to sound expensive without looking loud.',
    approach: 'Taking cues from the machined aluminium grille: a perforated grid system, tactile typography, and cinematic interactive 3D product showcase.',
    debrief: 'Initial manufacturing run of 500 units completely sold out during the pre-order launch week.'
  },
  {
    id: 'mork-roasters',
    file: 'Case file 06',
    title: 'Mørk Roasters',
    discipline: 'Identity, Packaging',
    client: 'Mørk, Trondheim',
    year: '2023',
    duration: '6 weeks',
    role: 'Brand Designer',
    image: 'assets/images/mork.jpg',
    brief: 'Micro-roastery specializing in high-latitude Nordic roasts requiring bespoke packaging labels that celebrate bean origin and elevation.',
    approach: 'Color-calibrated elevation bands, technical roast profiles, and biodegradable matte compostable bags with stark monospaced typography.',
    debrief: 'Established distribution in 35 specialty cafes across Norway, Sweden, and Denmark.'
  },
  {
    id: 'kunsthal-nord',
    file: 'Case file 07',
    title: 'Kunsthal Nord',
    discipline: 'Wayfinding, Signage',
    client: 'Kunsthal Nord, Aalborg',
    year: '2023',
    duration: '20 weeks',
    role: 'Wayfinding Lead',
    image: 'assets/images/kunsthal.jpg',
    brief: 'Wayfinding for a concrete art hall where every floor looks the same and visitors kept ending up in the car park.',
    approach: 'Every level got one oversized marker painted straight onto the concrete, and every direction got one thin arrow. Nothing is lit or colored, keeping the art loudest.',
    debrief: 'Help-desk inquiries regarding gallery directions dropped by 52% in the first quarter post-implementation.'
  }
];

function initMissionFiles() {
  const rows = document.querySelectorAll('.project-row');
  const previewBox = document.getElementById('project-floating-preview');
  const previewImg = previewBox?.querySelector('img');

  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updatePreviewPosition() {
    currentX += (mouseX - currentX) * 0.15;
    currentY += (mouseY - currentY) * 0.15;
    if (previewBox) {
      previewBox.style.left = `${currentX + 30}px`;
      previewBox.style.top = `${currentY + 20}px`;
    }
    requestAnimationFrame(updatePreviewPosition);
  }
  requestAnimationFrame(updatePreviewPosition);

  rows.forEach(row => {
    const projectId = row.getAttribute('data-project');
    const project = PROJECTS_DATA.find(p => p.id === projectId);

    row.addEventListener('mouseenter', () => {
      if (previewBox && previewImg && project) {
        previewImg.src = project.image;
        previewBox.classList.add('visible');
      }
    });

    row.addEventListener('mouseleave', () => {
      previewBox?.classList.remove('visible');
    });

    row.addEventListener('click', () => {
      openCaseStudy(projectId);
    });
  });
}

/* ==========================================================================
   6. MODALS & DRAWERS (ABOUT, CONTACT, CASE STUDY)
   ========================================================================== */
function initModals() {
  // Triggers
  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-open-modal');
      openModal(modalId);
    });
  });

  // Close buttons
  document.querySelectorAll('.modal-close-btn, .modal-overlay').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el || el.classList.contains('modal-close-btn')) {
        closeAllModals();
      }
    });
  });

  // ESC key to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // Interactive Alter Ego Slider in About Modal
  initAlterEgoSlider();

  // Contact form submission
  initContactForm();
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    document.body.style.overflow = 'hidden';
    modal.classList.add('open');
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
  document.body.style.overflow = '';
}

function openCaseStudy(projectId) {
  const project = PROJECTS_DATA.find(p => p.id === projectId);
  if (!project) return;

  const modal = document.getElementById('modal-case-study');
  if (!modal) return;

  // Populate dynamic data
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

  openModal('modal-case-study');
}

/* Interactive Alter Ego Image Comparison in About */
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

/* Contact Mission Form Terminal */
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
      showToast('Signal transmitted. Reply incoming within 48h.');
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
   7. UTILITY: COPY EMAIL & TOAST NOTIFICATION
   ========================================================================== */
function initCopyEmail() {
  const copyBtns = document.querySelectorAll('[data-copy-email]');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-copy-email') || 'hello@example.com';
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

