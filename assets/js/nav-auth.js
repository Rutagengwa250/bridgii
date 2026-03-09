/* =========================================================
   BRIDGII Nav Auth UI
   - Hides Login/Register when authenticated
   - Shows Logout button (desktop + mobile)
   ========================================================= */

(function () {
  const config = window.BRIDGII_AUTH || {};
  const hasValidConfig =
    typeof config.supabaseUrl === 'string' &&
    typeof config.supabaseAnonKey === 'string' &&
    config.supabaseUrl.startsWith('http');

  if (!window.supabase || !hasValidConfig) return;

  const client = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true }
  });

  function createDesktopLogout(container) {
    if (!container || container.querySelector('[data-logout-desktop]')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Logout';
    btn.setAttribute('data-logout-desktop', 'true');
    btn.className = 'hidden rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50';
    btn.addEventListener('click', async () => {
      await client.auth.signOut();
      window.location.href = 'index.html';
    });

    container.appendChild(btn);
  }

  function createDesktopUserLabel(container) {
    if (!container || container.querySelector('[data-user-label-desktop]')) return;

    const label = document.createElement('span');
    label.setAttribute('data-user-label-desktop', 'true');
    label.className = 'hidden rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700';
    container.insertBefore(label, container.firstChild);
  }

  function createMobileLogout(menuList) {
    if (!menuList || menuList.querySelector('[data-logout-mobile]')) return;

    const li = document.createElement('li');
    li.className = 'hidden';
    li.setAttribute('data-logout-mobile-wrap', 'true');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Logout';
    btn.setAttribute('data-logout-mobile', 'true');
    btn.className = 'block w-full rounded-md px-3 py-2 text-left hover:bg-[#f8eef2]';
    btn.addEventListener('click', async () => {
      await client.auth.signOut();
      window.location.href = 'index.html';
    });

    li.appendChild(btn);
    menuList.appendChild(li);
  }

  function createMobileUserLabel(menuList) {
    if (!menuList || menuList.querySelector('[data-user-label-mobile-wrap]')) return;

    const li = document.createElement('li');
    li.className = 'hidden';
    li.setAttribute('data-user-label-mobile-wrap', 'true');

    const label = document.createElement('p');
    label.setAttribute('data-user-label-mobile', 'true');
    label.className = 'rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700';

    li.appendChild(label);
    menuList.insertBefore(li, menuList.firstChild);
  }

  function getDisplayName(session) {
    const user = session && session.user ? session.user : null;
    if (!user) return '';

    const meta = user.user_metadata || {};
    return (
      meta.full_name ||
      meta.name ||
      user.email ||
      ''
    );
  }

  function updateHomeWelcome(session) {
    const welcome = document.getElementById('homeWelcome');
    const nameNode = document.getElementById('homeWelcomeName');
    if (!welcome || !nameNode) return;

    if (!session) {
      welcome.classList.add('hidden');
      nameNode.textContent = '';
      return;
    }

    const displayName = getDisplayName(session);
    nameNode.textContent = displayName || 'Learner';
    welcome.classList.remove('hidden');
  }

  function setVisibilityForAuth(session) {
    const isLoggedIn = Boolean(session);
    const displayName = getDisplayName(session);
    const loginLinks = document.querySelectorAll('a[href="login.html"]');
    const registerLinks = document.querySelectorAll('a[href="register.html"]');

    loginLinks.forEach((a) => a.classList.toggle('hidden', isLoggedIn));
    registerLinks.forEach((a) => a.classList.toggle('hidden', isLoggedIn));

    const desktopContainers = new Set();
    loginLinks.forEach((a) => {
      const parent = a.closest('div');
      if (parent && parent.className.includes('lg:flex')) desktopContainers.add(parent);
    });

    desktopContainers.forEach((container) => {
      createDesktopLogout(container);
      createDesktopUserLabel(container);
      const logoutBtn = container.querySelector('[data-logout-desktop]');
      const userLabel = container.querySelector('[data-user-label-desktop]');
      if (logoutBtn) logoutBtn.classList.toggle('hidden', !isLoggedIn);
      if (userLabel) {
        userLabel.classList.toggle('hidden', !isLoggedIn);
        if (isLoggedIn) userLabel.textContent = displayName;
      }
    });

    const mobileMenuList = document.querySelector('#mobileMenu ul');
    if (mobileMenuList) {
      createMobileLogout(mobileMenuList);
      createMobileUserLabel(mobileMenuList);
      const mobileLogoutWrap = mobileMenuList.querySelector('[data-logout-mobile-wrap]');
      const mobileUserWrap = mobileMenuList.querySelector('[data-user-label-mobile-wrap]');
      const mobileUserLabel = mobileMenuList.querySelector('[data-user-label-mobile]');
      if (mobileLogoutWrap) mobileLogoutWrap.classList.toggle('hidden', !isLoggedIn);
      if (mobileUserWrap) mobileUserWrap.classList.toggle('hidden', !isLoggedIn);
      if (mobileUserLabel && isLoggedIn) mobileUserLabel.textContent = `Signed in as ${displayName}`;
    }

    updateHomeWelcome(session);
  }

  client.auth.getSession().then(({ data }) => {
    setVisibilityForAuth(data.session || null);
  });

  client.auth.onAuthStateChange((_event, session) => {
    setVisibilityForAuth(session || null);
  });
})();

