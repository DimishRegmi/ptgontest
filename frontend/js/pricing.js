import { pricingAPI } from './api.js';
import { showToast, openModal } from './app.js';

export async function loadRateTable() {
  const tbody = document.getElementById('rate-table');
  try {
    const rates = await pricingAPI.getRates();
    tbody.innerHTML = rates.map(r => `
      <tr>
        <td style="text-transform:capitalize">${r.type}</td>
        <td>NPR ${r.base_rate.toLocaleString()}</td>
        <td>NPR ${r.peak_rate.toLocaleString()}</td>
        <td>NPR ${r.offpeak_rate.toLocaleString()}</td>
      </tr>
    `).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="4" class="empty-msg">Failed to load rates: ${e.message}</td></tr>`;
  }
}

export async function calculatePrice() {
  const vehicle_type  = document.getElementById('price-type').value;
  const days          = parseInt(document.getElementById('price-days').value) || 1;
  const season        = document.getElementById('price-season').value;
  const customer_type = document.getElementById('price-customer').value;
  const result        = document.getElementById('price-result');

  try {
    const data = await pricingAPI.calculate({ vehicle_type, days, season, customer_type });
    result.innerHTML = `
      <div class="price-row"><span>Base rate / day</span><span>NPR ${data.base_rate_per_day.toLocaleString()}</span></div>
      <div class="price-row"><span>Days</span><span>${data.days}</span></div>
      <div class="price-row"><span>Season multiplier</span><span>×${data.season_multiplier}</span></div>
      <div class="price-row"><span>Customer multiplier</span><span>×${data.customer_multiplier}</span></div>
      <div class="price-row"><span>Subtotal</span><span>NPR ${data.subtotal.toLocaleString()}</span></div>
      <div class="price-row"><span>VAT (13%)</span><span>NPR ${data.vat.toLocaleString()}</span></div>
      <div class="price-row total"><span>Total</span><span class="price-accent">NPR ${data.total.toLocaleString()}</span></div>
    `;
  } catch (e) {
    result.innerHTML = `<p class="empty-msg" style="padding:0;color:var(--danger-text)">Error: ${e.message}</p>`;
    showToast('Pricing error: ' + e.message);
  }
}
