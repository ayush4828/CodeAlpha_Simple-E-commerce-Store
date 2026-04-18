/* ═══════════════════════════════════════════════════════════════
   NovaBuy — Main App (Router, State, Utilities)
   ═══════════════════════════════════════════════════════════════ */

// ─── Global State ───
const state = {
  user: null,
  token: localStorage.getItem('novabuy_token') || null,
  cartCount: 0,
  currentPage: 'home',
  currentParams: {}
};

// ─── API Helper ───
const API_BASE = '/api';

async function api(endpoint, options = {}) {
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options
  };

  if (state.token) {
    config.headers['Authorization'] = `Bearer ${state.token}`;
  }

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
}

// ─── Toast Notifications ───
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || ''}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

// ─── Router ───
function navigateTo(page, params = {}) {
  state.currentPage = page;
  state.currentParams = params;
  
  const main = document.getElementById('mainContent');
  main.scrollTo(0, 0);
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update nav active state
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  const activeNav = document.getElementById(`nav-${page}`);
  if (activeNav) activeNav.classList.add('active');

  // Route to page
  switch (page) {
    case 'home':
      renderHomePage();
      break;
    case 'products':
      renderProductsPage(params);
      break;
    case 'product':
      renderProductDetailPage(params.id);
      break;
    case 'cart':
      renderCartPage();
      break;
    case 'checkout':
      renderCheckoutPage();
      break;
    case 'login':
      renderLoginPage();
      break;
    case 'register':
      renderRegisterPage();
      break;
    case 'orders':
      renderOrdersPage();
      break;
    case 'order':
      renderOrderDetailPage(params.id);
      break;
    default:
      renderHomePage();
  }
}

// ─── Auth State ───
async function checkAuth() {
  if (!state.token) {
    updateUserMenu();
    return;
  }

  try {
    const data = await api('/auth/me');
    state.user = data.user;
    updateUserMenu();
    updateCartBadge();
  } catch {
    logout();
  }
}

function logout() {
  state.token = null;
  state.user = null;
  state.cartCount = 0;
  localStorage.removeItem('novabuy_token');
  updateUserMenu();
  updateCartBadge();
  navigateTo('home');
  showToast('Logged out successfully', 'info');
}

function setAuth(token, user) {
  state.token = token;
  state.user = user;
  localStorage.setItem('novabuy_token', token);
  updateUserMenu();
  updateCartBadge();
}

function requireAuth() {
  if (!state.user) {
    showToast('Please login to continue', 'info');
    navigateTo('login');
    return false;
  }
  return true;
}

// ─── UI Updates ───
function updateUserMenu() {
  const menu = document.getElementById('userMenu');
  const ordersNav = document.getElementById('nav-orders');

  if (state.user) {
    const initials = state.user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    ordersNav.style.display = 'flex';
    
    menu.innerHTML = `
      <div class="user-avatar" onclick="toggleDropdown()" id="userAvatar">${initials}</div>
      <div class="user-dropdown" id="userDropdown">
        <div class="dropdown-item" style="pointer-events:none;opacity:0.7;">
          <span>👤</span>
          <div>
            <div style="font-weight:500;color:var(--text-primary)">${state.user.name}</div>
            <div style="font-size:0.75rem;color:var(--text-muted)">${state.user.email}</div>
          </div>
        </div>
        <div class="dropdown-divider"></div>
        <div class="dropdown-item" onclick="navigateTo('orders');closeDropdown();">
          <span>📋</span> My Orders
        </div>
        <div class="dropdown-divider"></div>
        <div class="dropdown-item" onclick="logout();closeDropdown();">
          <span>🚪</span> Sign Out
        </div>
      </div>
    `;
  } else {
    ordersNav.style.display = 'none';
    menu.innerHTML = `
      <button class="btn btn-primary btn-sm" onclick="navigateTo('login')">Sign In</button>
    `;
  }
}

function toggleDropdown() {
  document.getElementById('userDropdown')?.classList.toggle('show');
}

function closeDropdown() {
  document.getElementById('userDropdown')?.classList.remove('show');
}

// Close dropdown on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.user-menu')) {
    closeDropdown();
  }
});

async function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (!state.user) {
    badge.classList.remove('visible');
    badge.textContent = '0';
    return;
  }

  try {
    const cart = await api('/cart');
    state.cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = state.cartCount;
    badge.classList.toggle('visible', state.cartCount > 0);
  } catch {
    // silently fail
  }
}

// ─── Search ───
function handleSearch() {
  const query = document.getElementById('searchInput').value.trim();
  if (query) {
    navigateTo('products', { search: query });
  }
}

document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSearch();
});

// ─── Header scroll effect ───
window.addEventListener('scroll', () => {
  document.getElementById('header').classList.toggle('scrolled', window.scrollY > 10);
});

// ─── Star Rating Helper ───
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

// ─── Price Formatting ───
function formatPrice(price) {
  return '$' + price.toFixed(2);
}

// ─── Discount Calc ───
function calcDiscount(original, current) {
  return Math.round(((original - current) / original) * 100);
}

// ─── Init ───
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  navigateTo('home');
});
