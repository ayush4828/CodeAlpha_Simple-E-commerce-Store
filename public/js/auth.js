/* ═══════════════════════════════════════════════════════════════
   NovaBuy — Auth Pages (Login & Register)
   ═══════════════════════════════════════════════════════════════ */

function renderLoginPage() {
  const main = document.getElementById('mainContent');
  main.innerHTML = `
    <div class="auth-page">
      <div class="auth-card">
        <h2>Welcome Back</h2>
        <p class="auth-subtitle">Sign in to access your cart, orders, and more</p>
        
        <form id="loginForm" onsubmit="handleLogin(event)">
          <div class="form-group">
            <label class="form-label" for="loginEmail">Email Address</label>
            <input type="email" class="form-input" id="loginEmail" placeholder="you@example.com" required autocomplete="email">
          </div>
          <div class="form-group">
            <label class="form-label" for="loginPassword">Password</label>
            <input type="password" class="form-input" id="loginPassword" placeholder="Enter your password" required minlength="6" autocomplete="current-password">
          </div>
          <button type="submit" class="btn btn-primary btn-lg" id="loginBtn">Sign In</button>
        </form>

        <p class="auth-footer">
          Don't have an account? <a onclick="navigateTo('register')">Create one</a>
        </p>
      </div>
    </div>
  `;
}

async function handleLogin(e) {
  e.preventDefault();
  const btn = document.getElementById('loginBtn');
  btn.disabled = true;
  btn.textContent = 'Signing in...';

  try {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const data = await api('/auth/login', {
      method: 'POST',
      body: { email, password }
    });

    setAuth(data.token, data.user);
    showToast(`Welcome back, ${data.user.name}! 👋`, 'success');
    navigateTo('home');
  } catch (error) {
    showToast(error.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Sign In';
  }
}

function renderRegisterPage() {
  const main = document.getElementById('mainContent');
  main.innerHTML = `
    <div class="auth-page">
      <div class="auth-card">
        <h2>Create Account</h2>
        <p class="auth-subtitle">Join NovaBuy for exclusive deals and a seamless experience</p>
        
        <form id="registerForm" onsubmit="handleRegister(event)">
          <div class="form-group">
            <label class="form-label" for="regName">Full Name</label>
            <input type="text" class="form-input" id="regName" placeholder="John Doe" required minlength="2" autocomplete="name">
          </div>
          <div class="form-group">
            <label class="form-label" for="regEmail">Email Address</label>
            <input type="email" class="form-input" id="regEmail" placeholder="you@example.com" required autocomplete="email">
          </div>
          <div class="form-group">
            <label class="form-label" for="regPassword">Password</label>
            <input type="password" class="form-input" id="regPassword" placeholder="At least 6 characters" required minlength="6" autocomplete="new-password">
          </div>
          <div class="form-group">
            <label class="form-label" for="regPasswordConfirm">Confirm Password</label>
            <input type="password" class="form-input" id="regPasswordConfirm" placeholder="Repeat your password" required minlength="6" autocomplete="new-password">
          </div>
          <button type="submit" class="btn btn-primary btn-lg" id="registerBtn">Create Account</button>
        </form>

        <p class="auth-footer">
          Already have an account? <a onclick="navigateTo('login')">Sign in</a>
        </p>
      </div>
    </div>
  `;
}

async function handleRegister(e) {
  e.preventDefault();
  const btn = document.getElementById('registerBtn');

  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regPasswordConfirm').value;

  if (password !== confirm) {
    showToast('Passwords do not match', 'error');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Creating account...';

  try {
    const data = await api('/auth/register', {
      method: 'POST',
      body: { name, email, password }
    });

    setAuth(data.token, data.user);
    showToast(`Welcome to NovaBuy, ${data.user.name}! 🎉`, 'success');
    navigateTo('home');
  } catch (error) {
    showToast(error.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Create Account';
  }
}
