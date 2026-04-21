import { trackingAPI } from './api.js';

const REV_DATA   = [42, 58, 51, 78, 65, 89, 120];
const REV_LABELS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];

const ACTIVITIES_STATIC = [
  { type: 'green', text: 'New booking confirmed for Anil Sharma',     time: '2 hours ago' },
  { type: 'blue',  text: 'Payment received from Priya Thapa — NPR 33,000', time: '4 hours ago' },
  { type: 'amber', text: 'Honda CR-V returned and marked available',  time: '6 hours ago' },
  { type: 'red',   text: 'Booking cancelled by Sunita Rai',           time: 'Yesterday, 3:00 PM' },
  { type: 'green', text: 'Toyota HiAce maintenance completed',        time: 'Yesterday, 11:00 AM' },
];

export async function loadDashboard() {
  try {
    const summary = await trackingAPI.getDashboard();
    document.getElementById('stat-total').textContent     = summary.total_vehicles;
    document.getElementById('stat-active').textContent    = summary.active_bookings;
    document.getElementById('stat-revenue').textContent   = 'NPR ' + summary.total_revenue.toLocaleString();
    document.getElementById('stat-available').textContent = summary.available;

    // Donut chart
    const total   = summary.total_vehicles || 1;
    const circ    = 2 * Math.PI * 38;
    const availPct = summary.available / total;
    const rentPct  = summary.rented    / total;

    const donutAvail  = document.getElementById('donut-avail');
    const donutRented = document.getElementById('donut-rented');
    const donutLabel  = document.getElementById('donut-label');

    donutAvail.setAttribute('stroke-dasharray', `${(availPct * circ).toFixed(1)} ${circ.toFixed(1)}`);
    donutRented.setAttribute('stroke-dasharray', `${(rentPct * circ).toFixed(1)} ${circ.toFixed(1)}`);
    donutRented.setAttribute('stroke-dashoffset', `${-(availPct * circ + 30).toFixed(1)}`);
    donutLabel.textContent = Math.round(availPct * 100) + '%';

    document.getElementById('leg-avail').textContent  = summary.available;
    document.getElementById('leg-rented').textContent = summary.rented;
    document.getElementById('leg-maint').textContent  = summary.maintenance;
  } catch (e) {
    console.warn('Dashboard stats error:', e.message);
  }

  renderRevChart();
  renderActivity();
}

function renderRevChart() {
  const max   = Math.max(...REV_DATA);
  const chart = document.getElementById('rev-chart');
  chart.innerHTML = REV_DATA.map((v, i) => `
    <div class="bar-wrap">
      <div class="bar" style="height:${Math.round(v / max * 100)}px" title="NPR ${v}K"></div>
      <div class="bar-label">${REV_LABELS[i]}</div>
    </div>
  `).join('');
}

function renderActivity(extra = []) {
  const list = document.getElementById('activity-list');
  const all  = [...extra, ...ACTIVITIES_STATIC];
  list.innerHTML = all.map(a => `
    <div class="activity-item">
      <div class="activity-dot dot-${a.type}"></div>
      <div>
        <div class="activity-text">${a.text}</div>
        <div class="activity-time">${a.time}</div>
      </div>
    </div>
  `).join('');
}

export function pushActivity(type, text) {
  ACTIVITIES_STATIC.unshift({ type, text, time: 'Just now' });
  renderActivity();
}
