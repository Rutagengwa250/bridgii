(function () {
  const simulationGroups = {
    Biology: [
      { title: 'Membrane Transport', url: 'https://phet.colorado.edu/sims/html/membrane-transport/latest/membrane-transport_en.html' },
      { title: 'Gene Expression Essentials', url: 'https://phet.colorado.edu/sims/html/gene-expression-essentials/latest/gene-expression-essentials_en.html' },
      { title: 'Neuron Simulation', url: 'https://phet.colorado.edu/sims/html/neuron/latest/neuron_en.html' }
    ],
    Chemistry: [
      { title: 'Hydrogen Atom Model', url: 'https://phet.colorado.edu/sims/html/models-of-the-hydrogen-atom/latest/models-of-the-hydrogen-atom_en.html' },
      { title: 'Diffusion', url: 'https://phet.colorado.edu/sims/html/diffusion/latest/diffusion_en.html' },
      { title: 'Gas Properties', url: 'https://phet.colorado.edu/sims/html/gas-properties/latest/gas-properties_en.html' },
      { title: 'Energy Forms and Changes', url: 'https://phet.colorado.edu/sims/html/energy-forms-and-changes/latest/energy-forms-and-changes_en.html' },
      { title: "Coulomb's Law", url: 'https://phet.colorado.edu/sims/html/coulombs-law/latest/coulombs-law_en.html' },
      { title: 'States of Matter', url: 'https://phet.colorado.edu/sims/html/states-of-matter/latest/states-of-matter_en.html' },
      { title: 'Rutherford Scattering', url: 'https://phet.colorado.edu/sims/html/rutherford-scattering/latest/rutherford-scattering_en.html' },
      { title: 'Molecules and Light', url: 'https://phet.colorado.edu/sims/html/molecules-and-light/latest/molecules-and-light_en.html' },
      { title: 'pH Scale', url: 'https://phet.colorado.edu/sims/html/ph-scale/latest/ph-scale_en.html' },
      { title: 'Concentration', url: 'https://phet.colorado.edu/sims/html/concentration/latest/concentration_en.html' },
      { title: 'Acid Base Solutions', url: 'https://phet.colorado.edu/sims/html/acid-base-solutions/latest/acid-base-solutions_en.html' },
      { title: 'Balancing Chemical Equations', url: 'https://phet.colorado.edu/sims/html/balancing-chemical-equations/latest/balancing-chemical-equations_en.html' },
      { title: 'Greenhouse Effect', url: 'https://phet.colorado.edu/sims/html/greenhouse-effect/latest/greenhouse-effect_en.html' }
    ],
    Physics: [
      { title: 'Buoyancy', url: 'https://phet.colorado.edu/sims/html/buoyancy/latest/buoyancy_en.html' },
      { title: 'Magnet and Compass', url: 'https://phet.colorado.edu/sims/html/magnet-and-compass/latest/magnet-and-compass_en.html' },
      { title: 'Sound Waves', url: 'https://phet.colorado.edu/sims/html/sound-waves/latest/sound-waves_en.html' },
      { title: 'Geometric Optics', url: 'https://phet.colorado.edu/sims/html/geometric-optics/latest/geometric-optics_en.html' },
      { title: 'Circuit Construction Kit', url: 'https://phet.colorado.edu/sims/html/circuit-construction-kit-ac/latest/circuit-construction-kit-ac_en.html' },
      { title: 'Energy Skate Park', url: 'https://phet.colorado.edu/sims/html/energy-skate-park/latest/energy-skate-park_en.html' },
      { title: 'Masses and Springs', url: 'https://phet.colorado.edu/sims/html/masses-and-springs-basics/latest/masses-and-springs-basics_en.html' },
      { title: 'Bending Light', url: 'https://phet.colorado.edu/sims/html/bending-light/latest/bending-light_en.html' },
      { title: "Hooke's Law", url: 'https://phet.colorado.edu/sims/html/hookes-law/latest/hookes-law_en.html' },
      { title: 'Projectile Motion', url: 'https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_en.html' }
    ]
  };

  const subjectCover = {
    Biology: 'assets/images/covers/biology.svg',
    Chemistry: 'assets/images/covers/chemistry.svg',
    Physics: 'assets/images/covers/physics.svg'
  };

  const simsCategories = document.getElementById('simsCategories');
  const simsHost = document.getElementById('simsHost');
  const modal = document.getElementById('embedModal');
  const modalTitle = document.getElementById('embedModalTitle');
  const modalFrame = document.getElementById('embedFrame');
  const modalLink = document.getElementById('embedExternalLink');
  const modalClose = document.getElementById('embedCloseBtn');

  if (!simsHost || !modal || !simsCategories) return;

  const query = new URLSearchParams(window.location.search);
  const querySubject = query.get('subject');
  const queryTitle = query.get('title');

  let activeSimSubject = 'Biology';
  let pendingAutoOpenTitle = queryTitle || '';

  if (querySubject && simulationGroups[querySubject]) {
    activeSimSubject = querySubject;
  }

  function cardTemplate(item, subject, i) {
    const cover = subjectCover[subject] || 'assets/images/covers/models-sim.svg';
    const aos = i % 3 === 0 ? 'fade-up' : i % 3 === 1 ? 'zoom-in' : 'slide-up';

    return `
      <article class="learning-card" data-aos="${aos}" data-aos-duration="700">
        <div class="learning-thumb"><img src="${cover}" alt="${subject} cover"></div>
        <div class="p-4">
          <span class="subject-tag">${subject}</span>
          <h3 class="mt-2 text-base font-extrabold text-brandDeep">${item.title}</h3>
          <div class="mt-4 flex items-center justify-between gap-2">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Simulation</p>
            <button class="open-btn" data-open-embed="${item.url}" data-open-title="${item.title}">Open</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderCategoryButtons(host, subjects, active, onClick) {
    host.innerHTML = subjects
      .map((subject) => `<button class="category-btn ${subject === active ? 'active' : ''}" data-subject="${subject}">${subject}</button>`)
      .join('');

    host.querySelectorAll('[data-subject]').forEach((btn) => {
      btn.addEventListener('click', () => onClick(btn.getAttribute('data-subject')));
    });
  }

  function renderCards(host, dataBySubject, subject) {
    const items = dataBySubject[subject] || [];
    host.innerHTML = `
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-xl font-black text-brandDeep">${subject}</h3>
        <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">${items.length} items</span>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        ${items.map((item, i) => cardTemplate(item, subject, i)).join('')}
      </div>
    `;

    if (window.AOS && typeof window.AOS.refreshHard === 'function') {
      window.AOS.refreshHard();
    }
  }

  function renderAll() {
    const simSubjects = Object.keys(simulationGroups);

    renderCategoryButtons(simsCategories, simSubjects, activeSimSubject, (subject) => {
      activeSimSubject = subject;
      renderAll();
    });

    renderCards(simsHost, simulationGroups, activeSimSubject);

    if (pendingAutoOpenTitle) {
      const target = Array.from(document.querySelectorAll('button[data-open-title]')).find(
        (btn) => btn.getAttribute('data-open-title') === pendingAutoOpenTitle
      );
      if (target) {
        pendingAutoOpenTitle = '';
        target.click();
      }
    }
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-open-embed]');
    if (!trigger) return;

    const url = trigger.getAttribute('data-open-embed');
    const title = trigger.getAttribute('data-open-title') || 'Interactive Resource';
    const card = trigger.closest('.learning-card');
    const subject = (card?.querySelector('.subject-tag')?.textContent || 'General').trim();

    if (window.BridgiiActivity && typeof window.BridgiiActivity.log === 'function') {
      window.BridgiiActivity.log({
        title,
        subject,
        type: 'Simulation',
        source: 'labs'
      });
    }

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    modalTitle.textContent = title;
    modalFrame.src = url;
    modalLink.href = url;
  });

  function closeModal() {
    modal.classList.remove('is-open');
    modalFrame.src = '';
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  renderAll();
})();
