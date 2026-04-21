import { loadVehicles, filterVehicles, submitAddVehicle } from './vehicles.js';
import { loadBookings, submitNewBooking, populateVehicleSelect, updateEstimate } from './bookings.js';
import { loadRateTable, calculatePrice } from './pricing.js';
import { loadTracking } from './tracking.js';
import { loadDashboard, pushActivity } from './dashboard.js';

// ── AUTHENTICATION ────────────────────────────────────────────────────────────
function initAuth() {
  const authToken = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('user');
  
  if (!authToken || !userStr) {
    // Redirect to login if not authenticated
    window.location.href = 'login.html';
    return false;
  }
  
  try {
    const user = JSON.parse(userStr);
    const userDisplay = document.getElementById('user-display');
    if (userDisplay) {
      userDisplay.textContent = `${user.full_name} (${user.role})`;
    }
  } catch (e) {
    console.error('Error parsing user data:', e);
  }
  
  return true;
}

// Logout button handler
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      const token = localStorage.getItem('auth_token');
      await fetch('http://127.0.0.1:8001/api/auth/logout?token=' + token, {
        method: 'POST'
      });
    } catch (e) {
      console.error('Logout error:', e);
    }
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
  });
}

// Initialize authentication
if (!initAuth()) {
  throw new Error('Authentication failed');
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
export function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.classList.add('hidden'), 300);
  }, 2800);
}

// ── MODALS ────────────────────────────────────────────────────────────────────
export function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
}

export function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

// Close on backdrop click
document.querySelectorAll('.modal-bg').forEach(bg => {
  bg.addEventListener('click', e => {
    if (e.target === bg) bg.classList.add('hidden');
  });
});

// Close buttons
document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.close));
});

// ── TAB ROUTING ───────────────────────────────────────────────────────────────
const TAB_LOADERS = {
  dashboard: loadDashboard,
  vehicles:  loadVehicles,
  bookings:  loadBookings,
  pricing:   loadRateTable,
  tracking:  loadTracking,
};

function showTab(tabId) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tabId)?.classList.add('active');
  document.querySelector(`.nav-tab[data-tab="${tabId}"]`)?.classList.add('active');
  TAB_LOADERS[tabId]?.();
}

document.querySelectorAll('.nav-tab').forEach(btn => {
  btn.addEventListener('click', () => showTab(btn.dataset.tab));
});

// ── VEHICLES TAB WIRING ───────────────────────────────────────────────────────
document.getElementById('btn-add-vehicle').addEventListener('click', () => {
  openModal('modal-add-vehicle');
});

document.getElementById('btn-submit-vehicle').addEventListener('click', submitAddVehicle);

document.getElementById('vehicle-search').addEventListener('input', filterVehicles);
document.getElementById('vehicle-filter').addEventListener('change', filterVehicles);

// ── BOOKINGS TAB WIRING ───────────────────────────────────────────────────────
document.getElementById('btn-new-booking').addEventListener('click', async () => {
  await loadVehicles();          // refresh available list
  populateVehicleSelect();
  // Default dates: today → today+3
  const today = new Date().toISOString().slice(0, 10);
  const later = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);
  document.getElementById('b-from').value = today;
  document.getElementById('b-to').value   = later;
  document.getElementById('b-customer').value = '';
  document.getElementById('b-estimate-wrap').classList.add('hidden');
  openModal('modal-new-booking');
  updateEstimate();
});

document.getElementById('btn-submit-booking').addEventListener('click', submitNewBooking);
document.getElementById('b-vehicle').addEventListener('change', updateEstimate);
document.getElementById('b-from').addEventListener('change', updateEstimate);
document.getElementById('b-to').addEventListener('change', updateEstimate);

// ── PRICING TAB WIRING ────────────────────────────────────────────────────────
document.getElementById('btn-calc-price').addEventListener('click', calculatePrice);

document.getElementById('btn-book-from-price').addEventListener('click', async () => {
  await loadVehicles();
  populateVehicleSelect();
  const today = new Date().toISOString().slice(0, 10);
  const later = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);
  document.getElementById('b-from').value     = today;
  document.getElementById('b-to').value       = later;
  document.getElementById('b-customer').value = '';
  document.getElementById('b-estimate-wrap').classList.add('hidden');
  openModal('modal-new-booking');
  updateEstimate();
});

// ── GLOBAL DATA CHANGE LISTENER ───────────────────────────────────────────────
// When any module fires 'data-changed', refresh the dashboard stats silently
window.addEventListener('data-changed', () => {
  loadDashboard();
});

// ── INITIAL LOAD ──────────────────────────────────────────────────────────────
async function init() {
  await Promise.all([loadVehicles(), loadBookings()]);
  showTab('dashboard');
}

init();
