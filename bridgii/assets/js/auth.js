/* =========================================================
   BRIDGII Auth
   - Email/password login
   - Email/password register
   - Google OAuth login
   ========================================================= */

(function () {
  const config = window.BRIDGII_AUTH || {};
  const hasValidConfig =
    typeof config.supabaseUrl === 'string' &&
    typeof config.supabaseAnonKey === 'string' &&
    config.supabaseUrl.startsWith('http') &&
    !config.supabaseUrl.includes('YOUR_PROJECT_ID') &&
    !config.supabaseAnonKey.includes('YOUR_SUPABASE_ANON_KEY');

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const googleBtn = document.getElementById('googleLoginBtn');
  const authStatus = document.getElementById('authStatus');

  const onAuthPage = Boolean(loginForm || registerForm);
  if (!onAuthPage) return;

  const setStatus = (message, type) => {
    if (!authStatus) return;
    authStatus.textContent = message;
    authStatus.classList.remove('hidden', 'text-[#8A1538]', 'text-red-600', 'text-slate-600');

    if (type === 'error') authStatus.classList.add('text-red-600');
    else if (type === 'success') authStatus.classList.add('text-[#8A1538]');
    else authStatus.classList.add('text-slate-600');
  };

  if (!window.supabase || !hasValidConfig) {
    setStatus('Auth is not configured yet. Add Supabase URL and anon key in assets/js/auth-config.js.', 'error');
    return;
  }

  if (window.location.protocol === 'file:') {
    setStatus('Run this site from a local server (not file://) for auth to work correctly.', 'error');
    return;
  }

  const supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });

  const currentDir = window.location.href.slice(0, window.location.href.lastIndexOf('/') + 1);
  const loginRedirectUrl = `${currentDir}login.html`;

  // If user already logged in, redirect away from auth pages.
  supabaseClient.auth.getSession().then(({ data }) => {
    if (data.session) {
      window.location.href = 'index.html';
    }
  });

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);
      const email = String(formData.get('email') || '').trim();
      const password = String(formData.get('password') || '');

      if (!email || !password) {
        setStatus('Enter email and password.', 'error');
        return;
      }

      setStatus('Signing in...', 'info');
      const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

      if (error) {
        setStatus(error.message, 'error');
        return;
      }

      setStatus('Login successful. Redirecting...', 'success');
      window.location.href = 'index.html';
    });
  }

  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      setStatus('Redirecting to Google...', 'info');
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: loginRedirectUrl
        }
      });

      if (error) {
        setStatus(error.message, 'error');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(registerForm);
      const fullName = String(formData.get('full_name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const password = String(formData.get('password') || '');

      if (!fullName || !email || !password) {
        setStatus('Please fill all fields.', 'error');
        return;
      }

      if (password.length < 6) {
        setStatus('Password must be at least 6 characters.', 'error');
        return;
      }

      setStatus('Creating account...', 'info');
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: loginRedirectUrl
        }
      });

      if (error) {
        setStatus(error.message, 'error');
        return;
      }

      if (data.user && !data.session) {
        setStatus('Account created. Check your email to confirm your account.', 'success');
        return;
      }

      setStatus('Account created. Redirecting...', 'success');
      window.location.href = 'index.html';
    });
  }
})();


