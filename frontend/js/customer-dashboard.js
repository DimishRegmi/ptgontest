// Customer Dashboard JavaScript

document.addEventListener('DOMContentLoaded', () => {
  initCustomerDashboard();
});

function initCustomerDashboard() {
  // Check authentication
  const authToken = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('user');
  
  if (!authToken || !userStr) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const user = JSON.parse(userStr);
    
    // Check if user is customer
    if (user.role !== 'customer' && user.role !== 'admin') {
      alert('Access denied.');
      window.location.href = 'login.html';
      return;
    }

    // Display user info
    const userDisplay = document.getElementById('user-display');
    if (userDisplay) {
      userDisplay.textContent = user.full_name;
    }

    const customerName = document.getElementById('customer-name');
    if (customerName) {
      customerName.textContent = user.full_name.split(' ')[0];
    }
  } catch (e) {
    console.error('Error parsing user data:', e);
  }

  // Setup tab navigation
  setupTabNavigation();
  
  // Load initial dashboard data
  loadCustomerDashboard();

  // Setup logout
  setupLogout();
  
  // Setup event listeners
  setupEventListeners();
}

function setupTabNavigation() {
  const tabs = document.querySelectorAll('.nav-tab');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active panel
      panels.forEach(p => p.classList.remove('active'));
      document.getElementById('tab-' + tabName)?.classList.add('active');

      // Load tab-specific data
      if (tabName === 'dashboard') {
        loadCustomerDashboard();
      } else if (tabName === 'browse') {
        loadBrowseVehicles();
      } else if (tabName === 'my-bookings') {
        loadMyBookings();
      } else if (tabName === 'calculator') {
        loadCalculator();
      }
    });
  });
}

async function loadCustomerDashboard() {
  try {
    // Load stats
    document.getElementById('stat-total-bookings').textContent = '3';
    document.getElementById('stat-active-booking').textContent = '1';
    document.getElementById('stat-active-info').textContent = 'Hyundai Creta';
    document.getElementById('stat-total-spent').textContent = '₨14,400';
    document.getElementById('stat-loyalty').textContent = '450';

    // Load recent bookings
    loadRecentBookingsForCustomer();

    // Setup quick action buttons
    setupQuickActions();
  } catch (error) {
    console.error('Error loading customer dashboard:', error);
  }
}

async function loadRecentBookingsForCustomer() {
  const container = document.getElementById('recent-bookings');
  if (!container) return;

  const mockBookings = [
    { vehicle: 'Hyundai Creta', from: '2026-04-21', to: '2026-04-25', status: 'confirmed' },
    { vehicle: 'Tesla Model 3', from: '2026-04-20', to: '2026-04-22', status: 'completed' },
    { vehicle: 'Honda City', from: '2026-04-15', to: '2026-04-17', status: 'completed' },
  ];

  container.innerHTML = mockBookings.map(booking => `
    <div class="booking-card">
      <div class="booking-info">
        <div class="booking-vehicle">${booking.vehicle}</div>
        <div class="booking-dates">${booking.from} → ${booking.to}</div>
      </div>
      <span class="booking-status ${booking.status}">${booking.status}</span>
    </div>
  `).join('');
}

function setupQuickActions() {
  const actions = {
    'btn-browse-vehicles': () => switchTab('browse'),
    'btn-quick-browse': () => switchTab('browse'),
    'btn-quick-book': () => switchTab('my-bookings'),
    'btn-quick-calculate': () => switchTab('calculator'),
    'btn-quick-profile': () => alert('Profile settings coming soon!')
  };

  Object.entries(actions).forEach(([id, callback]) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', callback);
  });
}

function switchTab(tabName) {
  const tabs = document.querySelectorAll('.nav-tab');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(t => {
    if (t.dataset.tab === tabName) {
      t.click();
    }
  });
}

async function loadBrowseVehicles() {
  try {
    const grid = document.getElementById('vehicle-grid');
    if (!grid) return;

    const mockVehicles = [
      { id: 1, name: 'Tesla Model 3', type: 'Car', dailyRate: '₨1,200', icon: '🔌', available: true },
      { id: 2, name: 'Hyundai Creta', type: 'SUV', dailyRate: '₨1,800', icon: '🚙', available: false },
      { id: 3, name: 'Royal Enfield', type: 'Motorcycle', dailyRate: '₨500', icon: '🏍️', available: true },
      { id: 4, name: 'Honda City', type: 'Car', dailyRate: '₨900', icon: '🚗', available: true },
    ];

    grid.innerHTML = mockVehicles.map(vehicle => `
      <div class="vehicle-card">
        <div class="vehicle-icon">${vehicle.icon}</div>
        <div class="vehicle-name">${vehicle.name}</div>
        <div class="vehicle-type">${vehicle.type}</div>
        <div class="vehicle-price">${vehicle.dailyRate}</div>
        <div class="vehicle-availability ${vehicle.available ? 'available' : 'unavailable'}">
          ${vehicle.available ? '✓ Available' : '✗ Unavailable'}
        </div>
        <button class="btn-primary btn-block" ${!vehicle.available ? 'disabled' : ''}>
          ${vehicle.available ? 'Book Now' : 'Check Dates'}
        </button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading vehicles:', error);
  }
}

async function loadMyBookings() {
  try {
    const container = document.getElementById('bookings-container');
    if (!container) return;

    const mockBookings = [
      { id: 'BK001', vehicle: 'Hyundai Creta', from: '2026-04-21', to: '2026-04-25', amount: '₨7,200', status: 'confirmed' },
      { id: 'BK002', vehicle: 'Tesla Model 3', from: '2026-04-20', to: '2026-04-22', amount: '₨4,800', status: 'completed' },
      { id: 'BK003', vehicle: 'Honda City', from: '2026-04-15', to: '2026-04-17', amount: '₨2,700', status: 'completed' },
    ];

    container.innerHTML = mockBookings.map(booking => `
      <div class="booking-item">
        <div class="booking-header">
          <span class="booking-id">Booking #${booking.id}</span>
          <span class="booking-status-badge ${booking.status}">${booking.status}</span>
        </div>
        <div class="booking-vehicle-name">${booking.vehicle}</div>
        <div class="booking-detail">
          <span class="booking-detail-label">From:</span>
          <span class="booking-detail-value">${booking.from}</span>
        </div>
        <div class="booking-detail">
          <span class="booking-detail-label">To:</span>
          <span class="booking-detail-value">${booking.to}</span>
        </div>
        <div class="booking-detail">
          <span class="booking-detail-label">Amount:</span>
          <span class="booking-detail-value">${booking.amount}</span>
        </div>
      </div>
    `).join('');

    // Setup booking tab filter
    setupBookingFilters();
  } catch (error) {
    console.error('Error loading bookings:', error);
  }
}

function setupBookingFilters() {
  const tabs = document.querySelectorAll('.booking-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      // Reload bookings with filter
      loadMyBookings();
    });
  });
}

async function loadCalculator() {
  try {
    const calculateBtn = document.getElementById('btn-calculate');
    if (calculateBtn) {
      calculateBtn.addEventListener('click', calculatePrice);
    }

    const proceedBtn = document.getElementById('btn-proceed-booking');
    if (proceedBtn) {
      proceedBtn.addEventListener('click', () => {
        alert('Proceeding to booking...');
        switchTab('my-bookings');
      });
    }
  } catch (error) {
    console.error('Error loading calculator:', error);
  }
}

function calculatePrice() {
  try {
    const vehicleType = document.getElementById('calc-vehicle-type').value;
    const startDate = document.getElementById('calc-start-date').value;
    const endDate = document.getElementById('calc-end-date').value;

    if (!vehicleType || !startDate || !endDate) {
      alert('Please fill all fields');
      return;
    }

    // Calculate days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      alert('End date must be after start date');
      return;
    }

    // Pricing
    const rates = {
      car: 800,
      motorcycle: 400,
      suv: 1800,
      van: 2000
    };

    const dailyRate = rates[vehicleType] || 0;
    const subtotal = dailyRate * days;
    const insurance = subtotal * 0.1;
    const total = subtotal + insurance;

    // Display result
    const resultDiv = document.getElementById('calc-result');
    resultDiv.style.display = 'block';
    
    document.getElementById('result-days').textContent = days;
    document.getElementById('result-rate').textContent = '₨' + dailyRate;
    document.getElementById('result-subtotal').textContent = '₨' + subtotal.toLocaleString();
    document.getElementById('result-insurance').textContent = '₨' + insurance.toLocaleString();
    document.getElementById('result-total').textContent = '₨' + total.toLocaleString();

    // Update daily rate input
    document.getElementById('calc-daily-rate').value = '₨' + dailyRate;
  } catch (error) {
    console.error('Error calculating price:', error);
    alert('Error calculating price');
  }
}

function setupEventListeners() {
  const newBookingBtn = document.getElementById('btn-new-booking');
  if (newBookingBtn) {
    newBookingBtn.addEventListener('click', () => {
      switchTab('browse');
    });
  }
}

function setupLogout() {
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
}
