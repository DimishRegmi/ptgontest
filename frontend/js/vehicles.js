import { vehiclesAPI } from './api.js';
import { showToast, openModal, closeModal } from './app.js';

const ICONS = { Car: '🚗', Motorcycle: '🏍️', SUV: '🚙', Van: '🚐' };

let allVehicles = [];

export async function loadVehicles() {
  const grid = document.getElementById('vehicle-grid');
  try {
    allVehicles = await vehiclesAPI.getAll();
    renderGrid(allVehicles);
  } catch (e) {
    grid.innerHTML = `<p class="empty-msg">Failed to load vehicles: ${e.message}</p>`;
  }
}

function renderGrid(vehicles) {
  const grid = document.getElementById('vehicle-grid');
  if (!vehicles.length) {
    grid.innerHTML = '<p class="empty-msg">No vehicles found.</p>';
    return;
  }
  grid.innerHTML = vehicles.map(v => `
    <div class="vehicle-card">
      <span class="vehicle-icon">${v.icon || ICONS[v.type] || '🚗'}</span>
      <div class="vehicle-name">${v.name}</div>
      <div class="vehicle-type">${v.type} · ${v.plate}</div>
      <div class="vehicle-price">NPR ${v.daily_rate.toLocaleString()}<span> /day</span></div>
      <div class="vehicle-meta">
        <span class="badge badge-${v.status}">${v.status}</span>
        <button class="btn-sm btn-danger" data-delete="${v.id}">Remove</button>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => deleteVehicle(Number(btn.dataset.delete)));
  });
}

export function filterVehicles() {
  const search = document.getElementById('vehicle-search').value.toLowerCase();
  const type   = document.getElementById('vehicle-filter').value;
  const result = allVehicles.filter(v =>
    (!search || v.name.toLowerCase().includes(search) || v.type.toLowerCase().includes(search)) &&
    (!type   || v.type === type)
  );
  renderGrid(result);
}

async function deleteVehicle(id) {
  try {
    await vehiclesAPI.remove(id);
    allVehicles = allVehicles.filter(v => v.id !== id);
    renderGrid(allVehicles);
    showToast('Vehicle removed from fleet');
    window.dispatchEvent(new Event('data-changed'));
  } catch (e) {
    showToast('Error: ' + e.message);
  }
}

export async function submitAddVehicle() {
  const name   = document.getElementById('v-name').value.trim();
  const type   = document.getElementById('v-type').value;
  const rate   = parseFloat(document.getElementById('v-rate').value);
  const plate  = document.getElementById('v-plate').value.trim();
  const status = document.getElementById('v-status').value;

  if (!name)  { showToast('Please enter vehicle name');  return; }
  if (!rate)  { showToast('Please enter a valid daily rate'); return; }
  if (!plate) { showToast('Please enter plate number');  return; }

  try {
    const v = await vehiclesAPI.create({
      name, type, daily_rate: rate, plate, status,
      icon: ICONS[type] || '🚗',
    });
    allVehicles.unshift(v);
    renderGrid(allVehicles);
    closeModal('modal-add-vehicle');
    showToast('Vehicle added to fleet');
    window.dispatchEvent(new Event('data-changed'));
    // Clear form
    ['v-name','v-rate','v-plate'].forEach(id => { document.getElementById(id).value = ''; });
  } catch (e) {
    showToast('Error: ' + e.message);
  }
}

export function getAvailableVehicles() {
  return allVehicles.filter(v => v.status === 'available');
}
