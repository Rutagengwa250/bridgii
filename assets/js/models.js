(function () {
  const modelGroups = {
    Biology: [
      { title: 'Human Heart', url: 'https://sketchfab.com/models/1b7bfb07e6b24dd891099395ed98e989/embed', cover: 'assets/images/covers/human-heart.jpg' },
      { title: 'Kidney Model', url: 'https://sketchfab.com/models/1b7bfb07e6b24dd891099395ed98e989/embed', cover: 'assets/images/covers/kidney.jpg' },
      { title: 'Neuron Cell', url: 'https://sketchfab.com/models/f33ea01f8e674578b55ac51d110b1721/embed', cover: 'assets/images/covers/neuron.svg' },
      { title: 'Eukaryotic Cell', url: 'https://sketchfab.com/models/b7d84e5f2d5e411fbb195ab2742f2256/embed', cover: 'assets/images/covers/eukaryotic.svg' },
      { title: 'DNA Model', url: 'https://sketchfab.com/models/547d42f6c0184232a945051b6952a39e/embed' },
      { title: 'DNA Replication', url: 'https://sketchfab.com/models/3122da8323374eb5bf9ed4736c0de563/embed' }
    ],
    Chemistry: [
      { title: 'Haber Process Plant', url: 'https://sketchfab.com/models/84d49fdc296f459283af25aa8113a504/embed' },
      { title: 'Chemistry Lab Equipment', url: 'https://sketchfab.com/models/b5be7b605c934b2d8ab14ebe1f848825/embed' },
      { title: 'Electrolysis Model', url: 'https://sketchfab.com/models/30bdf89c0c3b44f3b0ffbb56aa6dffd7/embed' }
    ]
  };

  const subjectCover = {
    Biology: 'assets/images/covers/biology.svg',
    Chemistry: 'assets/images/covers/chemistry.svg'
  };

  const modelsCategories = document.getElementById('modelsCategories');
  const modelsHost = document.getElementById('modelsHost');
  const modal = document.getElementById('embedModal');
  const modalTitle = document.getElementById('embedModalTitle');
  const modalFrame = document.getElementById('embedFrame');
  const modalLink = document.getElementById('embedExternalLink');
  const modalClose = document.getElementById('embedCloseBtn');

  if (!modelsHost || !modal || !modelsCategories) return;

  const query = new URLSearchParams(window.location.search);
  const querySubject = query.get('subject');
  const queryTitle = query.get('title');

  let activeModelSubject = 'Biology';
  let pendingAutoOpenTitle = queryTitle || '';

  if (querySubject && modelGroups[querySubject]) {
    activeModelSubject = querySubject;
  }

  function cardTemplate(item, subject, i) {
    const cover = item.cover || subjectCover[subject] || 'assets/images/covers/models-sim.svg';
    const aos = i % 3 === 0 ? 'fade-up' : i % 3 === 1 ? 'zoom-in' : 'slide-up';

    return `
      <article class="learning-card" data-aos="${aos}" data-aos-duration="700">
        <div class="learning-thumb"><img src="${cover}" alt="${subject} cover"></div>
        <div class="p-4">
          <span class="subject-tag">${subject}</span>
          <h3 class="mt-2 text-base font-extrabold text-brandDeep">${item.title}</h3>
          <div class="mt-4 flex items-center justify-between gap-2">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">3D Model</p>
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
    const modelSubjects = Object.keys(modelGroups);

    renderCategoryButtons(modelsCategories, modelSubjects, activeModelSubject, (subject) => {
      activeModelSubject = subject;
      renderAll();
    });

    renderCards(modelsHost, modelGroups, activeModelSubject);

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
        type: '3D Model',
        source: 'models'
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
