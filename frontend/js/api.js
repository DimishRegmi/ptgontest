// Base URL — change to your FastAPI server address
export const BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * Generic fetch wrapper with error handling.
 * @param {string} path  - API path e.g. '/vehicles/'
 * @param {object} opts  - fetch options override
 */
async function request(path, opts = {}) {
  const url      = BASE_URL + path;
  const defaults = {
    headers: { 'Content-Type': 'application/json' },
  };
  const res = await fetch(url, { ...defaults, ...opts });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  // 204 No Content
  if (res.status === 204) return null;
  return res.json();
}

// ── VEHICLES ──────────────────────────────────────────────────────────────────
export const vehiclesAPI = {
  getAll:      ()       => request('/vehicles/'),
  getAvailable:()       => request('/vehicles/available'),
  getSummary:  ()       => request('/vehicles/summary'),
  getOne:      (id)     => request(`/vehicles/${id}`),
  create:      (data)   => request('/vehicles/',    { method: 'POST',   body: JSON.stringify(data) }),
  update:      (id, data)=> request(`/vehicles/${id}`, { method: 'PATCH',  body: JSON.stringify(data) }),
  remove:      (id)     => request(`/vehicles/${id}`, { method: 'DELETE' }),
};

// ── BOOKINGS ──────────────────────────────────────────────────────────────────
export const bookingsAPI = {
  getAll:    ()     => request('/bookings/'),
  getActive: ()     => request('/bookings/active'),
  getOne:    (id)   => request(`/bookings/${id}`),
  create:    (data) => request('/bookings/',              { method: 'POST',  body: JSON.stringify(data) }),
  cancel:    (id)   => request(`/bookings/${id}/cancel`,  { method: 'PATCH' }),
  complete:  (id)   => request(`/bookings/${id}/complete`,{ method: 'PATCH' }),
};

// ── PRICING ───────────────────────────────────────────────────────────────────
export const pricingAPI = {
  calculate: (data) => request('/pricing/calculate', { method: 'POST', body: JSON.stringify(data) }),
  getRates:  ()     => request('/pricing/rates'),
};

// ── TRACKING ──────────────────────────────────────────────────────────────────
export const trackingAPI = {
  getActive:    () => request('/tracking/active'),
  getDashboard: () => request('/tracking/dashboard'),
};
