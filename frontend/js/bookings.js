import { bookingsAPI } from './api.js';
import { showToast, closeModal } from './app.js';
import { getAvailableVehicles, loadVehicles } from './vehicles.js';

let allBookings = [];

export async function loadBookings() {
  const tbody = document.getElementById('bookings-body');
  try {
    allBookings = await bookingsAPI.getAll();
    renderTable(allBookings);
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="8" class="empty-msg">Failed to load bookings: ${e.message}</td></tr>`;
  }
}

function renderTable(bookings) {
  const tbody = document.getElementById('bookings-body');
  if (!bookings.length) {
    tbody.innerHTML = '<tr><td colspan="8" class="empty-msg">No bookings found.</td></tr>';
    return;
  }
  tbody.innerHTML = bookings.map(b => `
    <tr>
      <td style="font-family:monospace;font-size:12px">#${b.id}</td>
      <td>${b.customer}</td>
      <td>${b.vehicle_name || '—'}</td>
      <td>${b.from_date}</td>
      <td>${b.to_date}</td>
      <td style="font-weight:500">NPR ${b.total_amount.toLocaleString()}</td>
      <td><span class="badge badge-${b.status}">${b.status}</span></td>
      <td>
        ${b.status === 'confirmed'
          ? `<button class="btn-sm btn-danger" data-cancel="${b.id}">Cancel</button>`
          : '—'}
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('[data-cancel]').forEach(btn => {
    btn.addEventListener('click', () => cancelBooking(Number(btn.dataset.cancel)));
  });
}

async function cancelBooking(id) {
  try {
    await bookingsAPI.cancel(id);
    await loadBookings();
    await loadVehicles();
    showToast(`Booking #${id} cancelled`);
    window.dispatchEvent(new Event('data-changed'));
  } catch (e) {
    showToast('Error: ' + e.message);
  }
}

export function populateVehicleSelect() {
  const sel    = document.getElementById('b-vehicle');
  const avail  = getAvailableVehicles();
  sel.innerHTML = avail.length
    ? avail.map(v => `<option value="${v.id}">${v.name} — NPR ${v.daily_rate.toLocaleString()}/day</option>`).join('')
    : '<option disabled>No vehicles available</option>';
  updateEstimate();
}

export function updateEstimate() {
  const vid   = parseInt(document.getElementById('b-vehicle').value);
  const from  = new Date(document.getElementById('b-from').value);
  const to    = new Date(document.getElementById('b-to').value);
  const wrap  = document.getElementById('b-estimate-wrap');
  if (!vid || isNaN(from) || isNaN(to) || to <= from) { wrap.classList.add('hidden'); return; }
  const avail = getAvailableVehicles();
  const v     = avail.find(x => x.id === vid);
  if (!v) { wrap.classList.add('hidden'); return; }
  const days  = Math.round((to - from) / 86400000);
  const total = Math.round(v.daily_rate * days * 1.13);
  document.getElementById('b-est-total').textContent = `NPR ${total.toLocaleString()} (${days} day${days > 1 ? 's' : ''}, inc. VAT)`;
  wrap.classList.remove('hidden');
}

export async function submitNewBooking() {
  const customer   = document.getElementById('b-customer').value.trim();
  const vehicle_id = parseInt(document.getElementById('b-vehicle').value);
  const from_date  = document.getElementById('b-from').value;
  const to_date    = document.getElementById('b-to').value;

  if (!customer)           { showToast('Please enter customer name'); return; }
  if (!vehicle_id)         { showToast('Please select a vehicle');    return; }
  if (!from_date||!to_date){ showToast('Please select dates');        return; }
  if (new Date(to_date) <= new Date(from_date)) { showToast('End date must be after start date'); return; }

  try {
    await bookingsAPI.create({ customer, vehicle_id, from_date, to_date });
    closeModal('modal-new-booking');
    await loadBookings();
    await loadVehicles();
    document.getElementById('b-customer').value = '';
    showToast('Booking confirmed!');
    window.dispatchEvent(new Event('data-changed'));
  } catch (e) {
    showToast('Error: ' + e.message);
  }
}

export function getActiveCount() {
  return allBookings.filter(b => b.status === 'confirmed').length;
}
