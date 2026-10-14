/* =========================================================================
   MedFinder — shared UI helpers and components
   ========================================================================= */

import { icon, statusIcons } from './icons.js';
import { medById, pharmacyById, state } from './data.js';

/* -------------------------------------------------------------- utilities */

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const money = (n) =>
  n == null ? '—' : '₦' + Number(n).toLocaleString('en-NG');

/** "Updated 3 hrs ago" — every listing carries one. */
export function freshness(minutes) {
  let label, level = 'fresh';
  if (minutes < 1)        label = 'Updated just now';
  else if (minutes < 60)  label = `Updated ${minutes} min ago`;
  else if (minutes < 1440) {
    const h = Math.round(minutes / 60);
    label = `Updated ${h} hr${h > 1 ? 's' : ''} ago`;
  } else {
    const d = Math.round(minutes / 1440);
    label = `Updated ${d} day${d > 1 ? 's' : ''} ago`;
  }
  if (minutes >= 4320)      level = 'very-stale';   // > 3 days
  else if (minutes >= 360)  level = 'stale';        // > 6 hours
  return { label, level };
}

export function freshnessTag(minutes, opts = {}) {
  const { label, level } = freshness(minutes);
  const ic = level === 'fresh' ? 'clock' : 'alert-triangle';
  return `<span class="freshness ${level}">${icon(ic, 13, { stroke: 2.2 })}<span>${label}</span></span>`;
}

/** Compact "3h 45m" / "1h 45m" style duration. */
export function duration(totalMinutes) {
  const m = Math.max(0, Math.round(totalMinutes));
  const h = Math.floor(m / 60);
  const mm = m % 60;
  if (h === 0) return `${mm}m`;
  if (mm === 0) return `${h}h`;
  return `${h}h ${String(mm).padStart(2, '0')}m`;
}

export function ago(minutes) {
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 1440) return `${Math.round(minutes / 60)} hr ago`;
  const d = Math.round(minutes / 1440);
  return `${d} day${d > 1 ? 's' : ''} ago`;
}

/* ------------------------------------------------------------ stock chips */
export const STOCK = {
  in:      { label: 'In stock',    ic: 'check-circle' },
  low:     { label: 'Low stock',   ic: 'alert-triangle' },
  out:     { label: 'Out of stock',ic: 'circle-minus' },
  unknown: { label: 'Unconfirmed', ic: 'circle-help' },
};

/** Chips always pair colour with an icon AND a word — never colour alone. */
export function stockChip(stateName, opts = {}) {
  const s = STOCK[stateName] || STOCK.unknown;
  const size = opts.lg ? 15 : 12;
  return `<span class="stock-chip ${stateName} ${opts.lg ? 'lg' : ''}">
    ${icon(s.ic, size, { stroke: 2.4 })}<span>${s.label}</span>
  </span>`;
}

/* --------------------------------------------------------- small elements */

export function verifiedBadge(compact = false) {
  return `<span class="badge-verified" title="Registered with the Pharmacists Council of Nigeria">
    ${icon('shield-check', 13, { stroke: 2.6 })}<span>${compact ? 'PCN' : 'PCN verified'}</span>
  </span>`;
}

export function openTag(ph) {
  return ph.open
    ? `<span class="badge-open"><span class="pip"></span>Open · till ${ph.closesAt}</span>`
    : `<span class="badge-open closed"><span class="pip"></span>Closed · opens ${ph.opensAt}</span>`;
}

export const rxNotice = `
  <div class="rx-notice">
    ${icon('info', 14, { stroke: 2.2 })}
    <span>Prescription-only drugs require a valid prescription at the pharmacy. MedFinder does not sell medicine or process payments.</span>
  </div>`;

/* ------------------------------------------------------------ status bar */

export function statusBar(variant = 'light', time = '09:41') {
  return `<div class="status-bar ${variant === 'light' ? '' : 'on-' + variant}">
    <span>${esc(time)}</span>
    <span class="sb-icons">
      ${statusIcons.signal}${statusIcons.wifi}${statusIcons.battery}
    </span>
  </div>`;
}

/* ------------------------------------------------------------- app header */

/* ------------------------------------------------------------- bottom nav */

const NAV = [
  { id: 'home',         label: 'Home',         ic: 'home' },
  { id: 'requests',     label: 'Requests',     ic: 'inbox' },
  { id: 'reservations', label: 'Reservations', ic: 'bookmark' },
  { id: 'profile',      label: 'Profile',      ic: 'user' },
];

/**
 * Floating white pill. The active icon sits in a green rounded square.
 */
export function bottomNav(activeId, opts = {}) {
  const badge = opts.badges || {};
  const items = NAV.map((n) => {
    const isActive = n.id === activeId;
    return `<button class="nav-item ${isActive ? 'active' : ''}"
      data-nav="${n.id}" aria-label="${n.label}"
      aria-current="${isActive ? 'page' : 'false'}">
      <span class="nav-icon-wrap">
        ${icon(n.ic, 22, { stroke: isActive ? 2.4 : 2 })}
      </span>
      <span class="nav-label">${n.label}</span>
      ${badge[n.id] ? `<span class="badge-count">${badge[n.id]}</span>` : ''}
    </button>`;
  }).join('');
  return `<div class="bottom-nav-wrap"><nav class="bottom-nav">${items}</nav></div>`;
}

/* ---------------------------------------------------------- pharmacy card */

/**
 * The core result card: name, distance, open/closed tag, PCN badge,
 * stock chip and a freshness label.
 */
export function pharmacyCard(ph, medId, opts = {}) {
  const entry = medId ? ph.stock[medId] : null;
  const st = entry ? entry.state : 'unknown';
  const fr = entry ? freshness(entry.updatedMin) : { label: 'Never updated', level: 'very-stale' };

  const status = entry
    ? stockChip(st)
    : `<span class="stock-chip unknown">${icon('circle-help', 12)}<span>Not listed</span></span>`;

  return `<article class="pharmacy-card" data-pharmacy="${ph.id}">
    <div class="pc-head">
      <div class="pc-avatar">${icon('store', 22)}</div>
      <div style="flex:1;min-width:0">
        <h3 class="pc-name">${esc(ph.name)}${ph.verified ? verifiedBadge(true) : ''}</h3>
        <div class="pc-meta">
          <span>${icon('map-pin', 13)}</span>
          <span>${ph.distanceKm.toFixed(1)} km · ${esc(ph.area)}</span>
          <span style="opacity:.4">•</span>
          ${openTag(ph)}
        </div>
      </div>
    </div>

    <div class="pc-foot">
      <div>
        ${medId ? `<div class="pc-price">${money(entry && entry.price)}</div>` : ''}
        <div style="margin-top:4px">${entry ? freshnessTag(entry.updatedMin) : `<span class="freshness ${fr.level}">${icon('alert-triangle', 13)}<span>${fr.label}</span></span>`}</div>
      </div>
      <div class="pc-actions">
        ${status}
        ${opts.hideCta ? '' : `<button class="icon-btn" data-nav="pharmacy-detail" data-arg="${ph.id}" aria-label="View ${esc(ph.name)}">${icon('chevron-right', 20)}</button>`}
      </div>
    </div>
  </article>`;
}

/* ----------------------------------------------------------- reservation */

export function reservationBanner(res, opts = {}) {
  if (!res) return '';
  const med = medById[res.medicineId];
  const ph = pharmacyById[res.pharmacyId];
  const left = res.holdMinutes - res.elapsedMinutes;
  return `<section class="reservation-banner">
    <div class="rb-top">${icon('clock', 15)}<span>Held for you · ${esc(ph.name)}</span></div>
    <div class="rb-countdown">${duration(left)}</div>
    <div class="rb-sub">${esc(med.name)} × ${res.qty} · code ${esc(res.code)}</div>
    <div class="rb-actions">
      <button class="btn ${opts.solidDirections ? 'solid' : ''}" data-nav="directions">${icon('navigation', 15)}<span>Directions</span></button>
      <button class="btn" data-nav="pharmacy-detail" data-arg="${ph.id}"><span>View item</span></button>
    </div>
  </section>`;
}

/* ----------------------------------------------------------- misc blocks */

export function sectionHead(title, opts = {}) {
  return `<div class="section-head">
    <h2>${esc(title)}</h2>
    ${opts.link ? `<button class="link" data-nav="${esc(opts.link)}">${esc(opts.linkLabel || 'See all')}</button>` : ''}
  </div>`;
}

export function listRow({ iconName, tone = 'mint', title, sub, right, nav, arg }) {
  return `<button class="list-row" ${nav ? `data-nav="${esc(nav)}" ${arg ? `data-arg="${esc(arg)}"` : ''}` : ''}>
    <span class="lr-icon" style="background:var(--${tone === 'purple' ? 'purple-tint' : 'mint'});color:var(--${tone === 'purple' ? 'purple' : 'green-deep'})">
      ${icon(iconName, 20)}
    </span>
    <span class="lr-body">
      <span class="lr-title">${esc(title)}</span>
      ${sub ? `<span class="lr-sub">${esc(sub)}</span>` : ''}
    </span>
    ${right || `<span class="chev">${icon('chevron-right', 18)}</span>`}
  </button>`;
}

export { state };
