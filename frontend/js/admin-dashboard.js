// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', () => {
  initAdminDashboard();
});

function initAdminDashboard() {
  // Check authentication
  const authToken = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('user');
  
  if (!authToken || !userStr) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const user = JSON.parse(userStr);
    
    // Check if user is admin
    if (user.role !== 'admin') {
      alert('Access denied. Admin only.');
      window.location.href = 'customer-dashboard.html';
      return;
    }

    // Display user info
    const userDisplay = document.getElementById('user-display');
    if (userDisplay) {
      userDisplay.textContent = `${user.full_name} (Admin)`;
    }
  } catch (e) {
    console.error('Error parsing user data:', e);
  }

  // Setup tab navigation
  setupTabNavigation();
  
  // Load initial data
  loadDashboardData();
  loadFleetData();
  loadBookingsData();
  loadUsersData();

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
        loadDashboardData();
      } else if (tabName === 'vehicles') {
        loadFleetData();
      } else if (tabName === 'bookings') {
        loadBookingsData();
      } else if (tabName === 'users') {
        loadUsersData();
      } else if (tabName === 'reports') {
        loadReportsData();
      }
    });
  });
}

async function loadDashboardData() {
  try {
    // Mock data for demo
    document.getElementById('stat-revenue').textContent = '₨45,50,000';
    document.getElementById('stat-revenue-change').textContent = '+12% from last month';
    
    document.getElementById('stat-bookings').textContent = '342';
    document.getElementById('stat-bookings-change').textContent = '+8% from last month';
    
    document.getElementById('stat-vehicles').textContent = '45';
    document.getElementById('stat-vehicles-active').textContent = '38 active';
    
    document.getElementById('stat-users').textContent = '156';
    document.getElementById('stat-users-active').textContent = '89 active';

    // Fleet status
    document.getElementById('fleet-available').textContent = '28';
    document.getElementById('fleet-rented').textContent = '14';
    document.getElementById('fleet-maintenance').textContent = '3';

    // Booking status
    document.getElementById('booking-pending').textContent = '5';
    document.getElementById('booking-confirmed').textContent = '18';
    document.getElementById('booking-completed').textContent = '312';

    // Load recent bookings
    loadRecentBookings();
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
}

async function loadRecentBookings() {
  const tbody = document.getElementById('recent-bookings');
  if (!tbody) return;

  const mockBookings = [
    { id: 'BK001', customer: 'John Doe', vehicle: 'Tesla Model 3', from: '2026-04-20', to: '2026-04-22', amount: '₨4,800', status: 'confirmed' },
    { id: 'BK002', customer: 'Jane Smith', vehicle: 'Hyundai Creta', from: '2026-04-21', to: '2026-04-25', amount: '₨7,200', status: 'confirmed' },
    { id: 'BK003', customer: 'Mike Johnson', vehicle: 'Toyota Fortuner', from: '2026-04-22', to: '2026-04-24', amount: '₨5,400', status: 'pending' },
  ];

  tbody.innerHTML = mockBookings.map(booking => `
    <tr>
      <td>${booking.id}</td>
      <td>${booking.customer}</td>
      <td>${booking.vehicle}</td>
      <td>${booking.from} → ${booking.to}</td>
      <td>${booking.amount}</td>
      <td><span class="status-badge ${booking.status}">${booking.status}</span></td>
      <td>
        <button class="action-btn">View</button>
        <button class="action-btn">Edit</button>
      </td>
    </tr>
  `).join('');
}

async function loadFleetData() {
  try {
    const grid = document.getElementById('vehicle-grid');
    if (!grid) return;

    const mockVehicles = [
      { id: 1, name: 'Tesla Model 3', type: 'Car', plate: 'KA-01-AB-1234', dailyRate: '₨1,200', status: 'available', icon: '🔌' },
      { id: 2, name: 'Hyundai Creta', type: 'SUV', plate: 'KA-02-CD-5678', dailyRate: '₨1,800', status: 'rented', icon: '🏎️' },
      { id: 3, name: 'Royal Enfield', type: 'Motorcycle', plate: 'KA-03-EF-9012', dailyRate: '₨500', status: 'available', icon: '🏍️' },
    ];

    if (mockVehicles.length === 0) {
      grid.innerHTML = '<p class="empty-msg">No vehicles found</p>';
      return;
    }

    grid.innerHTML = mockVehicles.map(vehicle => `
      <div class="vehicle-card">
        <div class="vehicle-icon">${vehicle.icon}</div>
        <div class="vehicle-info">
          <div class="vehicle-name">${vehicle.name}</div>
          <div class="vehicle-plate">${vehicle.plate}</div>
          <div class="vehicle-type">${vehicle.type}</div>
        </div>
        <div class="vehicle-price">${vehicle.dailyRate}</div>
        <div class="vehicle-status ${vehicle.status}">${vehicle.status}</div>
        <div class="vehicle-actions">
          <button class="action-btn">Edit</button>
          <button class="action-btn">Delete</button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading fleet data:', error);
  }
}

async function loadBookingsData() {
  try {
    const tbody = document.getElementById('all-bookings');
    if (!tbody) return;

    const mockBookings = [
      { id: 'BK001', customer: 'John Doe', vehicle: 'Tesla Model 3', from: '2026-04-20', to: '2026-04-22', amount: '₨4,800', status: 'confirmed' },
      { id: 'BK002', customer: 'Jane Smith', vehicle: 'Hyundai Creta', from: '2026-04-21', to: '2026-04-25', amount: '₨7,200', status: 'confirmed' },
      { id: 'BK003', customer: 'Mike Johnson', vehicle: 'Toyota Fortuner', from: '2026-04-22', to: '2026-04-24', amount: '₨5,400', status: 'pending' },
      { id: 'BK004', customer: 'Sarah Lee', vehicle: 'Honda City', from: '2026-04-19', to: '2026-04-20', amount: '₨2,400', status: 'completed' },
    ];

    tbody.innerHTML = mockBookings.map(booking => `
      <tr>
        <td>${booking.id}</td>
        <td>${booking.customer}</td>
        <td>${booking.vehicle}</td>
        <td>${booking.from} → ${booking.to}</td>
        <td>${booking.amount}</td>
        <td><span class="status-badge ${booking.status}">${booking.status}</span></td>
        <td>
          <button class="action-btn">View</button>
          <button class="action-btn">Edit</button>
          <button class="action-btn danger">Cancel</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading bookings data:', error);
  }
}

async function loadUsersData() {
  try {
    const tbody = document.getElementById('users-list');
    if (!tbody) return;

    const mockUsers = [
      { id: 1, username: 'admin', email: 'admin@drivenow.com', name: 'Admin User', role: 'admin', status: 'active', joined: '2026-01-15' },
      { id: 2, username: 'johndoe', email: 'john@example.com', name: 'John Doe', role: 'customer', status: 'active', joined: '2026-02-20' },
      { id: 3, username: 'janesmith', email: 'jane@example.com', name: 'Jane Smith', role: 'customer', status: 'active', joined: '2026-03-10' },
      { id: 4, username: 'mike123', email: 'mike@example.com', name: 'Mike Johnson', role: 'customer', status: 'inactive', joined: '2026-01-25' },
    ];

    tbody.innerHTML = mockUsers.map(user => `
      <tr>
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.name}</td>
        <td><span class="badge">${user.role}</span></td>
        <td><span class="status-badge ${user.status}">${user.status}</span></td>
        <td>${user.joined}</td>
        <td>
          <button class="action-btn">Edit</button>
          <button class="action-btn danger">Deactivate</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading users data:', error);
  }
}

async function loadReportsData() {
  // Reports data loading
  console.log('Loading reports...');
}

function setupEventListeners() {
  const addVehicleBtn = document.getElementById('btn-add-vehicle');
  if (addVehicleBtn) {
    addVehicleBtn.addEventListener('click', () => {
      alert('Add Vehicle feature coming soon!');
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
