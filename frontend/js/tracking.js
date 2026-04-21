import { trackingAPI } from './api.js';

export async function loadTracking() {
  const container = document.getElementById('tracking-cards');
  try {
    const rentals = await trackingAPI.getActive();
    if (!rentals.length) {
      container.innerHTML = '<p class="empty-msg">No active rentals at the moment.</p>';
      return;
    }
    container.innerHTML = rentals.map(r => `
      <div class="tracking-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
          <div>
            <div style="font-weight:500;font-size:14px">${r.customer}</div>
            <div style="font-size:12px;color:var(--text3);margin-top:2px">
              ${r.vehicle_name} · ${r.vehicle_plate} · Booking #${r.booking_id}
            </div>
          </div>
          <span class="badge badge-confirmed">Active</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text2);margin-bottom:8px">
          <span>From: ${r.from_date}</span>
          <span>To: ${r.to_date}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${r.progress_pct}%"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text3);margin-top:6px">
          <span>Day ${r.elapsed_days} of ${r.total_days} (${r.progress_pct}% complete)</span>
          <span>NPR ${r.total_amount.toLocaleString()}</span>
        </div>
      </div>
    `).join('');
  } catch (e) {
    container.innerHTML = `<p class="empty-msg">Failed to load tracking: ${e.message}</p>`;
  }
}
