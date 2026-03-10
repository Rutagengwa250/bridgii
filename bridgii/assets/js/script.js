/* =========================================================
   BRIDGII - Interactions
   - Mobile menu toggle
   - Reveal on scroll
   - Service card tilt effect
   - Testimonial slider
   - Contact form feedback
   ========================================================= */

const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('#mobileMenu a');

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    const wasHidden = mobileMenu.classList.toggle('hidden');
    menuBtn.setAttribute('aria-expanded', String(!wasHidden));
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// Reveal animation on scroll
const revealNodes = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
      }
    });
  },
  { threshold: 0.15 }
);
revealNodes.forEach((node) => revealObserver.observe(node));

// Service card interactive tilt
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    if (window.innerWidth < 1024) return;

    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 8;
    const rotateX = (0.5 - py) * 8;

    card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// Testimonial slider animation
const testimonialTrack = document.getElementById('testimonialTrack');
let slideIndex = 0;

function rotateTestimonial() {
  if (!testimonialTrack) return;
  slideIndex = (slideIndex + 1) % 2;
  testimonialTrack.style.transform = `translateX(-${slideIndex * 50}%)`;
}
setInterval(rotateTestimonial, 4500);

// Contact form email submit (FormSubmit endpoint)
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const emailMode = contactForm.getAttribute('data-email-mode');
    const endpoint = contactForm.getAttribute('data-email-endpoint');

    if (emailMode !== 'formsubmit' || !endpoint) {
      formStatus.textContent = 'Email endpoint is not configured.';
      formStatus.classList.remove('hidden');
      return;
    }

    formStatus.textContent = 'Sending message...';
    formStatus.classList.remove('hidden', 'text-red-600', 'text-green-700');
    formStatus.classList.add('text-[#8A1538]');

    try {
      const payload = Object.fromEntries(new FormData(contactForm).entries());
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed request');
      }

      formStatus.textContent = 'Message sent successfully. Check your email inbox for confirmation flow if this is first submit.';
      formStatus.classList.remove('text-[#8A1538]', 'text-red-600');
      formStatus.classList.add('text-green-700');
      contactForm.reset();
    } catch (_err) {
      formStatus.textContent = 'Unable to send message right now. Please try again in a moment.';
      formStatus.classList.remove('text-[#8A1538]', 'text-green-700');
      formStatus.classList.add('text-red-600');
    }
  });
}

// Footer year
const yearNode = document.getElementById('year');
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

// Global learning search in navbar (models + simulations)
const learningCatalog = [
  { title: 'Human Heart', subject: 'Biology', type: 'Model' },
  { title: 'Kidney Model', subject: 'Biology', type: 'Model' },
  { title: 'Neuron Cell', subject: 'Biology', type: 'Model' },
  { title: 'Eukaryotic Cell', subject: 'Biology', type: 'Model' },
  { title: 'DNA Model', subject: 'Biology', type: 'Model' },
  { title: 'DNA Replication', subject: 'Biology', type: 'Model' },
  { title: 'Haber Process Plant', subject: 'Chemistry', type: 'Model' },
  { title: 'Chemistry Lab Equipment', subject: 'Chemistry', type: 'Model' },
  { title: 'Electrolysis Model', subject: 'Chemistry', type: 'Model' },
  { title: 'Buoyancy', subject: 'Physics', type: 'Simulation' },
  { title: 'Magnet and Compass', subject: 'Physics', type: 'Simulation' },
  { title: 'Sound Waves', subject: 'Physics', type: 'Simulation' },
  { title: 'Geometric Optics', subject: 'Physics', type: 'Simulation' },
  { title: 'Circuit Construction Kit', subject: 'Physics', type: 'Simulation' },
  { title: 'Energy Skate Park', subject: 'Physics', type: 'Simulation' },
  { title: 'Masses and Springs', subject: 'Physics', type: 'Simulation' },
  { title: 'Bending Light', subject: 'Physics', type: 'Simulation' },
  { title: "Hooke's Law", subject: 'Physics', type: 'Simulation' },
  { title: 'Projectile Motion', subject: 'Physics', type: 'Simulation' },
  { title: 'Hydrogen Atom Model', subject: 'Chemistry', type: 'Simulation' },
  { title: 'Diffusion', subject: 'Chemistry', type: 'Simulation' },
  { title: 'Gas Properties', subject: 'Chemistry', type: 'Simulation' },
  { title: 'Energy Forms and Changes', subject: 'Chemistry', type: 'Simulation' },
  { title: "Coulomb's Law", subject: 'Chemistry', type: 'Simulation' },
  { title: 'States of Matter', subject: 'Chemistry', type: 'Simulation' },
  { title: 'Rutherford Scattering', subject: 'Chemistry', type: 'Simulation' },
  { title: 'Molecules and Light', subject: 'Chemistry', type: 'Simulation' },
  { title: 'pH Scale', subject: 'Chemistry', type: 'Simulation' },
  { title: 'Concentration', subject: 'Chemistry', type: 'Simulation' },
  { title: 'Acid Base Solutions', subject: 'Chemistry', type: 'Simulation' },
  { title: 'Balancing Chemical Equations', subject: 'Chemistry', type: 'Simulation' },
  { title: 'Greenhouse Effect', subject: 'Chemistry', type: 'Simulation' },
  { title: 'Membrane Transport', subject: 'Biology', type: 'Simulation' },
  { title: 'Gene Expression Essentials', subject: 'Biology', type: 'Simulation' },
  { title: 'Neuron Simulation', subject: 'Biology', type: 'Simulation' }
];

function initNavSearch() {
  const nav = document.querySelector('header nav');
  const navList = nav ? nav.querySelector('ul') : null;
  if (!nav || !navList || nav.querySelector('[data-nav-search]')) return;

  const desktopSearchWrap = document.createElement('div');
  desktopSearchWrap.setAttribute('data-nav-search', 'true');
  desktopSearchWrap.className = 'relative hidden lg:block';
  desktopSearchWrap.innerHTML = `
    <input
      id="navSearchInput"
      type="search"
      placeholder="Search models and simulations"
      class="w-64 rounded-lg border border-[#d8a8b8] bg-[#f8eef2]/70 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#c97a96]"
      autocomplete="off"
    />
    <div id="navSearchResults" class="absolute right-0 top-[calc(100%+0.4rem)] z-50 hidden w-[26rem] max-w-[85vw] rounded-xl border border-[#e7c9d4] bg-[#f8eef2]/95 p-2 shadow-lg backdrop-blur"></div>
  `;

  const authBlock = nav.querySelector('div.hidden.items-center.gap-3.lg\\:flex');
  if (authBlock) nav.insertBefore(desktopSearchWrap, authBlock);
  else nav.appendChild(desktopSearchWrap);

  const menuButton = nav.querySelector('#menuBtn');
  let mobileSearchContainer = nav.querySelector('[data-mobile-search-inline]');
  if (menuButton && !mobileSearchContainer) {
    mobileSearchContainer = document.createElement('div');
    mobileSearchContainer.setAttribute('data-mobile-search-inline', 'true');
    mobileSearchContainer.className = 'relative mx-2 flex-1 lg:hidden';
    mobileSearchContainer.innerHTML = `
      <input
        id="mobileSearchInput"
        type="search"
        placeholder="Search..."
        class="w-full rounded-lg border border-[#d8a8b8] bg-[#f8eef2]/70 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#c97a96]"
        autocomplete="off"
      />
      <div id="mobileSearchResults" class="absolute left-0 top-[calc(100%+0.35rem)] z-50 hidden w-full rounded-lg border border-[#e7c9d4] bg-[#f8eef2]/95 p-2 shadow-lg"></div>
    `;
    nav.insertBefore(mobileSearchContainer, menuButton);
  }

  function goToItem(item) {
    const targetPage = item.type === 'Simulation' ? 'labs.html' : 'models.html';
    const url = `${targetPage}?subject=${encodeURIComponent(item.subject)}&type=${encodeURIComponent(item.type)}&title=${encodeURIComponent(item.title)}`;
    window.location.href = url;
  }

  function bindSearch(input, resultsBox, container) {
    if (!input || !resultsBox) return;
    let currentResults = [];

    function renderResults(items) {
      if (!items.length) {
        resultsBox.innerHTML = '<p class="px-2 py-2 text-xs text-slate-500">No matching model/simulation found.</p>';
        resultsBox.classList.remove('hidden');
        return;
      }

      resultsBox.innerHTML = items
        .map((item) => `
          <button
            type="button"
            class="mb-1 block w-full rounded-lg border border-transparent bg-transparent px-3 py-2 text-left transition hover:border-[#e7c9d4] hover:bg-white/60"
            data-title="${item.title}"
            data-subject="${item.subject}"
            data-type="${item.type}"
          >
            <p class="text-sm font-semibold text-brandDeep">${item.title}</p>
            <p class="text-xs text-slate-600">${item.subject} • ${item.type}</p>
          </button>
        `)
        .join('');

      resultsBox.classList.remove('hidden');
    }

    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      if (!query) {
        currentResults = [];
        resultsBox.classList.add('hidden');
        resultsBox.innerHTML = '';
        return;
      }

      currentResults = learningCatalog
        .filter((item) =>
          item.title.toLowerCase().includes(query) ||
          item.subject.toLowerCase().includes(query) ||
          item.type.toLowerCase().includes(query)
        )
        .slice(0, 8);

      renderResults(currentResults);
    });

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && currentResults.length > 0) {
        event.preventDefault();
        goToItem(currentResults[0]);
      }
    });

    resultsBox.addEventListener('click', (event) => {
      const btn = event.target.closest('button[data-title]');
      if (!btn) return;
      goToItem({
        title: btn.getAttribute('data-title'),
        subject: btn.getAttribute('data-subject'),
        type: btn.getAttribute('data-type')
      });
    });

    document.addEventListener('click', (event) => {
      if (!container.contains(event.target)) {
        resultsBox.classList.add('hidden');
      }
    });
  }

  bindSearch(
    desktopSearchWrap.querySelector('#navSearchInput'),
    desktopSearchWrap.querySelector('#navSearchResults'),
    desktopSearchWrap
  );

  if (mobileSearchContainer) {
    bindSearch(
      mobileSearchContainer.querySelector('#mobileSearchInput'),
      mobileSearchContainer.querySelector('#mobileSearchResults'),
      mobileSearchContainer
    );
  }
}

initNavSearch();

// Recent activity tracker (models, simulations, videos, labs, books)
const BRIDGII_ACTIVITY_KEY = 'bridgii_recent_activity_v1';

function getRecentActivities() {
  try {
    const raw = localStorage.getItem(BRIDGII_ACTIVITY_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveRecentActivities(items) {
  localStorage.setItem(BRIDGII_ACTIVITY_KEY, JSON.stringify(items.slice(0, 40)));
}

function logRecentActivity(entry) {
  const item = {
    title: entry.title || 'Untitled',
    subject: entry.subject || 'General',
    type: entry.type || 'Resource',
    source: entry.source || 'Platform',
    at: new Date().toISOString()
  };

  const current = getRecentActivities();
  const deduped = current.filter(
    (x) => !(x.title === item.title && x.type === item.type && x.source === item.source)
  );
  deduped.unshift(item);
  saveRecentActivities(deduped);
}

window.BridgiiActivity = {
  log: logRecentActivity,
  getAll: getRecentActivities
};

function ensureActivityNavLink() {
  const desktopNav = document.querySelector('header nav ul.hidden.lg\\:flex');
  if (desktopNav && !desktopNav.querySelector('a[href="activity.html"]')) {
    const li = document.createElement('li');
    li.innerHTML = '<a href="activity.html" class="nav-link">Activity</a>';
    desktopNav.appendChild(li);
  }

  const mobileNav = document.querySelector('#mobileMenu ul');
  if (mobileNav && !mobileNav.querySelector('a[href="activity.html"]')) {
    const li = document.createElement('li');
    li.innerHTML = '<a href="activity.html" class="block rounded-md px-3 py-2 hover:bg-[#f8eef2]">Activity</a>';
    mobileNav.appendChild(li);
  }
}

function inferContentType() {
  const page = window.location.pathname.split('/').pop().toLowerCase();
  if (page.includes('videos')) return 'Video';
  if (page.includes('labs')) return 'Simulation';
  if (page.includes('books')) return 'Book';
  if (page.includes('models')) return '3D Model';
  return 'Resource';
}

function autoTrackCardActions() {
  document.addEventListener('click', (event) => {
    const action = event.target.closest('.learning-card .open-btn, .service-card .open-btn');
    if (!action) return;

    const card = action.closest('.learning-card, .service-card');
    if (!card) return;

    const title = (card.querySelector('h3')?.textContent || '').trim();
    const subject = (card.querySelector('.subject-tag')?.textContent || 'General').trim();
    const source = (window.location.pathname.split('/').pop() || 'page').replace('.html', '');
    const type = inferContentType();

    if (title) {
      logRecentActivity({ title, subject, type, source });
    }
  });
}

function formatActivityDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString();
}

function initActivityPage() {
  const host = document.getElementById('recentActivityList');
  if (!host) return;

  const clearBtn = document.getElementById('clearActivityBtn');
  const render = () => {
    const items = getRecentActivities();
    if (!items.length) {
      host.innerHTML = '<p class="text-sm text-slate-600">No activity yet. Open models, simulations, videos, or labs to build recent activity.</p>';
      return;
    }

    host.innerHTML = items
      .map(
        (item) => `
          <article class="contact-card">
            <p class="text-base font-bold text-brandDeep">${item.title}</p>
            <p class="mt-1 text-xs text-slate-600">${item.subject} • ${item.type} • ${item.source}</p>
            <p class="mt-2 text-xs text-[#8A1538]">${formatActivityDate(item.at)}</p>
          </article>
        `
      )
      .join('');
  };

  render();

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      saveRecentActivities([]);
      render();
    });
  }
}

ensureActivityNavLink();
autoTrackCardActions();
initActivityPage();

// Floating AI assistant widget (all pages)
function initAIAssistantWidget() {
  if (document.querySelector('[data-ai-widget]')) return;

  const widget = document.createElement('div');
  widget.className = 'ai-widget';
  widget.setAttribute('data-ai-widget', 'true');
  widget.innerHTML = `
    <div class="ai-widget-panel" id="aiWidgetPanel" aria-hidden="true">
      <div class="ai-widget-head">
        <p class="ai-widget-title">Ask me anything</p>
        <button type="button" class="ai-widget-close" id="aiWidgetClose">Close</button>
      </div>
      <iframe
        class="ai-widget-frame"
        src="https://app.chatgptbuilder.io/webchat/?p=1616923"
        title="AI Assistant"
        loading="lazy"
      ></iframe>
    </div>
    <button type="button" class="ai-widget-btn" id="aiWidgetToggle" aria-label="Open AI assistant">
      <span class="ai-widget-label">AI Assistant</span>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="6" y="8" width="12" height="10" rx="3" stroke="currentColor" stroke-width="1.8"/>
        <path d="M12 5v2M9 12h.01M15 12h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M9 16h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    </button>
  `;

  document.body.appendChild(widget);

  const toggleBtn = document.getElementById('aiWidgetToggle');
  const closeBtn = document.getElementById('aiWidgetClose');
  const panel = document.getElementById('aiWidgetPanel');

  if (!toggleBtn || !closeBtn || !panel) return;

  function setOpen(open) {
    panel.classList.toggle('open', open);
    panel.setAttribute('aria-hidden', String(!open));
    toggleBtn.setAttribute('aria-expanded', String(open));
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = panel.classList.contains('open');
    setOpen(!isOpen);
  });

  closeBtn.addEventListener('click', () => setOpen(false));
}

initAIAssistantWidget();

