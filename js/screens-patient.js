/* =========================================================================
   MedFinder — patient screens
   ========================================================================= */

import { icon } from './icons.js';
import {
  state, pharmacies, pharmacyById, medById, medicines,
  requests, reservations, categories, recentSearches, activity,
} from './data.js';
import {
  esc, money, freshnessTag, stockChip, verifiedBadge, openTag, rxNotice,
  statusBar, bottomNav, pharmacyCard, reservationBanner, sectionHead,
  listRow, duration, ago, freshness,
} from './ui.js';

/* Only PCN-verified pharmacies are visible to patients. */
export const visible = () => pharmacies.filter((p) => p.verified);

/** Pharmacies that list a medicine, sorted by distance, with filters applied. */
export function resultsFor(medId) {
  const f = state.filters;
  let list = visible()
    .map((p) => ({ p, entry: p.stock[medId] }))
    .filter((r) => r.entry);

  if (f.openNow) list = list.filter((r) => r.p.open);
  if (f.inStock) list = list.filter((r) => r.entry.state === 'in' || r.entry.state === 'low');

  // "Nearest" sorts by distance; toggling it off sorts by how fresh the
  // listing is, which is the other thing patients care about.
  list.sort((a, b) => (f.nearest
    ? a.p.distanceKm - b.p.distanceKm
    : a.entry.updatedMin - b.entry.updatedMin));
  return list;
}

/* ---------------------------------------------------------------- search */
const searchBar = (value = '') => `
  <div class="searchbar">
    ${icon('search', 20, { stroke: 2.2 })}
    <input type="search" data-search placeholder="Search medicine" aria-label="Search medicine"
           value="${esc(value)}" autocomplete="off">
    ${value ? `<button class="clear" data-action="clear-search" aria-label="Clear">${icon('x', 13, { stroke: 2.6 })}</button>` : ''}
  </div>`;

export function suggestionList(query) {
  const q = query.trim().toLowerCase();
  if (!q) return '';
  const wrap = (inner) => `<div style="margin-top:var(--sp-2)">${inner}</div>`;
  const hits = medicines
    .filter((m) => m.name.toLowerCase().includes(q) || m.generic.toLowerCase().includes(q) || (m.brand || '').toLowerCase().includes(q))
    .slice(0, 6);
  if (!hits.length) {
    return wrap(`<div class="card" style="padding:var(--sp-4);text-align:center">
      <p class="small muted" style="margin:0 0 var(--sp-3)">No medicine matches “${esc(query)}”.</p>
      <button class="btn btn-purple btn-sm btn-block" data-nav="no-results" data-arg="__query__">
        ${icon('megaphone', 16)} Request it from pharmacies
      </button>
    </div>`);
  }
  return wrap(`<div class="card" style="padding:var(--sp-2)">${hits.map((m) => `
    <button class="list-row" style="box-shadow:none" data-nav="results" data-arg="${m.id}">
      <span class="lr-icon" style="background:var(--mint);color:var(--green-deep)">${icon('pill', 20)}</span>
      <span class="lr-body">
        <span class="lr-title">${esc(m.name)}</span>
        <span class="lr-sub">${esc(m.generic)}${m.brand ? ' · ' + esc(m.brand) : ''}</span>
      </span>
      ${m.rx ? `<span class="chip-tint" style="height:22px;padding:0 8px;font-size:10px;display:inline-flex;align-items:center;border-radius:999px">Rx</span>` : ''}
    </button>`).join('')}</div>`);
}

/* ------------------------------------------------------------------ home */

function home() {
  const med = state.selectedMedId ? medById[state.selectedMedId] : null;
  const nearby = visible().slice().sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 3);

  return `
  <div class="status-bar on-green"><span>09:41</span>
    <span class="sb-icons">
      <svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="8" width="3" height="3" rx="1" fill="#fff"/><rect x="4.5" y="5.5" width="3" height="5.5" rx="1" fill="#fff"/><rect x="9" y="3" width="3" height="8" rx="1" fill="#fff"/><rect x="13.5" y="0" width="3" height="11" rx="1" fill="#fff" opacity=".4"/></svg>
      <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"><path d="M1 3.6a10 10 0 0 1 13 0"/><path d="M3.6 6.3a6.2 6.2 0 0 1 7.8 0"/><circle cx="7.5" cy="9.3" r="1.1" fill="#fff" stroke="none"/></svg>
      <svg width="25" height="12" viewBox="0 0 25 12"><rect x=".6" y=".6" width="21" height="10.8" rx="3" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.2"/><rect x="2.4" y="2.4" width="14" height="7.2" rx="1.8" fill="#fff"/><path d="M23.4 4.2v3.6a2.2 2.2 0 0 0 0-3.6Z" fill="#fff" fill-opacity=".45"/></svg>
    </span>
  </div>

  <div class="home-hero">
    <p class="greeting">Good morning, Adebayo</p>
    <h1>What do you need today?</h1>
    <div class="loc-row">${icon('map-pin', 14)}<span>Bodija, Ibadan · using current location</span></div>
    <div style="margin-top:var(--sp-4)">${searchBar(state.query)}</div>
    <div id="suggestions">${suggestionList(state.query)}</div>
  </div>

  <div class="screen-scroll" style="padding-top:var(--sp-5)">
    ${state.reservation ? `<div class="section">${reservationBanner(state.reservation)}</div>` : ''}

    <div class="section">
      ${sectionHead('Browse by need')}
      <div class="cat-grid">
        ${categories.map((c) => `
          <button class="cat" data-nav="results" data-arg="${c.med}">
            <span class="cat-icon ${c.tint === 'purple' ? 'purple' : ''}">${icon(c.icon, 26)}</span>
            <span class="cat-label">${esc(c.label)}</span>
          </button>`).join('')}
      </div>
    </div>

    <div class="section">
      ${sectionHead('Refill something again?', { link: 'results', linkLabel: 'See all' })}
      <div class="stack-2">
        ${recentSearches.map((r) => listRow({
          iconName: 'refresh-cw', title: r.label, sub: `Last searched ${r.when}`,
          nav: 'results', arg: r.id,
        })).join('')}
      </div>
    </div>

    <div class="section">
      ${sectionHead('Pharmacies near you', { link: 'map', linkLabel: 'Map view' })}
      <div class="stack">
        ${nearby.map((p) => pharmacyCard(p, med ? med.id : null)).join('')}
      </div>
    </div>

    <div class="section" style="padding-bottom:var(--sp-6)">
      ${rxNotice}
    </div>
  </div>

  ${bottomNav('home', { badges: { requests: 1 } })}`;
}

/* --------------------------------------------------------------- results */

function results(arg) {
  const medId = arg || state.selectedMedId || 'm1';
  state.selectedMedId = medId;
  const med = medById[medId];
  const rows = resultsFor(medId);
  const inStockCount = rows.filter((r) => r.entry.state === 'in' || r.entry.state === 'low').length;
  const f = state.filters;

  return `
  ${statusBar('light', '09:42')}
  <div class="app-header" style="padding-top:0">
    <div class="hrow" style="margin-bottom:var(--sp-3)">
      <button class="icon-btn plain" data-nav="home" aria-label="Back">${icon('chevron-left', 22)}</button>
      <div style="flex:1;min-width:0">
        <h1 style="font-size:var(--fs-title)">${esc(med.name)}</h1>
        <p class="small muted" style="margin:2px 0 0">${esc(med.generic)}${med.brand ? ' · ' + esc(med.brand) : ''}</p>
      </div>
      <button class="icon-btn" data-nav="map" aria-label="Map view">${icon('map', 20)}</button>
    </div>
    ${searchBar(med.name)}
  </div>

  <div class="screen-scroll" style="padding-top:var(--sp-4)">
    <div class="section" style="margin-bottom:var(--sp-4)">
      <div class="chips">
        <button class="chip ${f.openNow ? 'active' : ''}" data-filter="openNow">
          ${icon('clock', 15)} Open now
        </button>
        <button class="chip ${f.nearest ? 'active' : ''}" data-filter="nearest"
                aria-pressed="${f.nearest}" title="Sort by distance or by how recently the stock was updated">
          ${icon('arrow-up-down', 15)} ${f.nearest ? 'Nearest' : 'Freshest'}
        </button>
        <button class="chip ${f.inStock ? 'active' : ''}" data-filter="inStock">
          ${icon('check-circle', 15)} In stock
        </button>
        <button class="chip" data-nav="map">${icon('map-pin', 15)} Map</button>
      </div>
    </div>

    <div class="section" style="margin-bottom:var(--sp-3)">
      <p class="small muted" style="margin:0">
        <strong style="color:var(--text)">${rows.length}</strong> PCN-verified pharmac${rows.length === 1 ? 'y' : 'ies'}
        list ${esc(med.name)} · <strong style="color:var(--green-deep)">${inStockCount}</strong> with stock
      </p>
    </div>

    <div class="section">
      ${rows.length
        ? `<div class="stack">${rows.map((r) => pharmacyCard(r.p, medId)).join('')}</div>`
        : `<div class="empty">
             <div class="empty-ill">${icon('package', 52, { stroke: 1.6 })}</div>
             <h3>No one lists this yet</h3>
             <p>None of the verified pharmacies near you have updated their stock for ${esc(med.name)}.</p>
             <button class="btn btn-purple btn-block" style="margin-top:var(--sp-5)" data-nav="no-results" data-arg="${medId}">
               ${icon('megaphone', 18)} Request it from pharmacies
             </button>
           </div>`}
    </div>

    <div class="section" style="padding-bottom:var(--sp-6)">
      ${rxNotice}
      ${med.rx ? `<p class="tiny muted" style="margin:var(--sp-3) 0 0;text-align:center">Prescription-only medicine. Bring a valid prescription to the pharmacy.</p>` : ''}
    </div>
  </div>

  ${bottomNav('home', { badges: { requests: 1 } })}`;
}

/* ------------------------------------------------------------------- map */

function pinSvg(color, glyph) {
  return `<div class="pin-body">
    <svg width="40" height="50" viewBox="0 0 40 50" aria-hidden="true">
      <path d="M20 48.5C20 48.5 36 31 36 19.5A16 16 0 1 0 4 19.5C4 31 20 48.5 20 48.5Z"
            fill="${color}" stroke="#FFFFFF" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="20" cy="19" r="7.5" fill="#FFFFFF"/>
      ${glyph}
    </svg>
  </div>`;
}

const PIN_GLYPH = {
  in:      '<circle cx="20" cy="19" r="3.4" fill="#12A150"/>',
  low:     '<path d="M20 15.4v5" stroke="#F5A524" stroke-width="2.4" stroke-linecap="round"/><circle cx="20" cy="22.4" r="1.2" fill="#F5A524"/>',
  out:     '<path d="M16.6 19h6.8" stroke="#E5484D" stroke-width="2.4" stroke-linecap="round"/>',
  unknown: '<circle cx="20" cy="19" r="3.4" fill="#98A2B3"/>',
};
const PIN_COLOR = { in: '#12A150', low: '#F5A524', out: '#E5484D', unknown: '#98A2B3' };

function mapCanvas() {
  const medId = state.selectedMedId || 'm1';
  const rows = visible().map((p) => ({ p, entry: p.stock[medId] }));

  const pins = rows.map((r, i) => {
    const s = r.entry ? r.entry.state : 'unknown';
    return `<button class="map-pin" data-nav="pharmacy-detail" data-arg="${r.p.id}"
      style="left:${r.p.map.x}%;top:${r.p.map.y}%;animation-delay:${i * 55}ms"
      aria-label="${esc(r.p.name)} — ${s}">
      ${pinSvg(PIN_COLOR[s], PIN_GLYPH[s])}
    </button>`;
  }).join('');

  return `
  <div class="map-canvas">
    <div class="map-grid"></div>
    <div class="map-road h" style="left:0;right:0;top:36%"></div>
    <div class="map-road h" style="left:0;right:0;top:70%"></div>
    <div class="map-road v" style="top:0;bottom:0;left:48%"></div>
    <div class="map-road v" style="top:0;bottom:0;left:18%"></div>
    <div class="map-block" style="left:6%;top:6%;width:26%;height:20%"></div>
    <div class="map-block" style="left:56%;top:42%;width:32%;height:22%"></div>
    <div class="map-block" style="left:24%;top:78%;width:20%;height:16%"></div>
    <div class="map-water" style="left:60%;top:2%;width:38%;height:16%"></div>
    <div class="map-user" style="left:30%;top:44%"></div>
    ${pins}
  </div>`;
}

function map() {
  const medId = state.selectedMedId || 'm1';
  const med = medById[medId];
  const rows = visible().map((p) => ({ p, e: p.stock[medId] })).filter((r) => r.e);
  const sel = rows.find((r) => r.p.id === state.selectedPharmacyId) ||
              rows.filter((r) => r.e.state === 'in').sort((a, b) => a.p.distanceKm - b.p.distanceKm)[0] || rows[0];

  return `
  <div class="screen" style="position:absolute;inset:0">
    ${mapCanvas()}

    <div class="map-top">
      <div class="hrow">
        <button class="icon-btn" data-nav="results" data-arg="${medId}" aria-label="Back to list">${icon('chevron-left', 22)}</button>
        <div style="flex:1">${searchBar(med.name)}</div>
      </div>
      <div class="chips" style="margin-top:var(--sp-2)">
        <button class="chip ${state.filters.openNow ? 'active' : ''}" data-filter="openNow">${icon('clock', 15)} Open now</button>
        <button class="chip ${state.filters.inStock ? 'active' : ''}" data-filter="inStock">${icon('check-circle', 15)} In stock</button>
      </div>
    </div>

    <div class="map-legend">
      <span class="legend-row"><span class="legend-dot" style="background:var(--stock-in)"></span> In stock</span>
      <span class="legend-row"><span class="legend-dot" style="background:var(--stock-low)"></span> Low stock</span>
      <span class="legend-row"><span class="legend-dot" style="background:var(--stock-out)"></span> Out of stock</span>
      <span class="legend-row"><span class="legend-dot" style="background:var(--stock-unknown)"></span> Unconfirmed</span>
    </div>

    ${sel ? `<div class="map-card">${pharmacyCard(sel.p, medId)}</div>` : ''}

    <button class="icon-btn" style="position:absolute;right:var(--sp-4);bottom:calc(var(--bottom-nav-h) + 140px);z-index:6"
      data-action="recenter" aria-label="Recenter on my location">${icon('crosshair', 20)}</button>

    ${bottomNav('home', { badges: { requests: 1 } })}
  </div>`;
}

/* -------------------------------------------------------- pharmacy detail */

function pharmacyDetail(arg) {
  const id = arg || state.selectedPharmacyId || 'p1';
  state.selectedPharmacyId = id;
  const ph = pharmacyById[id];
  const medId = state.selectedMedId || 'm1';
  const med = medById[medId];
  const entry = ph.stock[medId];

  const others = Object.entries(ph.stock)
    .filter(([k]) => k !== medId)
    .slice(0, 4);

  return `
  ${statusBar('light', '09:44')}
  <div class="app-header" style="padding-top:0;padding-bottom:var(--sp-3)">
    <div class="hrow">
      <button class="icon-btn plain" data-nav="results" data-arg="${medId}" aria-label="Back">${icon('chevron-left', 22)}</button>
      <h1 style="font-size:var(--fs-subtitle)">Pharmacy</h1>
      <button class="icon-btn plain" data-action="share" aria-label="Share">${icon('external-link', 20)}</button>
    </div>
  </div>

  <div class="screen-scroll">
    <div class="detail-hero">
      <div class="row" style="margin-bottom:var(--sp-3)">
        <div class="detail-avatar">${icon('store', 30, { stroke: 1.8 })}</div>
        <div style="flex:1;min-width:0">
          <h2 class="detail-name">${esc(ph.name)}</h2>
          <div style="margin-top:var(--sp-2)">${ph.verified ? verifiedBadge() : `<span class="chip" style="height:24px">Not verified</span>`}</div>
        </div>
      </div>
      <div class="detail-hero-meta">
        <span style="display:inline-flex;align-items:center;gap:5px">${icon('map-pin', 13)} ${ph.distanceKm.toFixed(1)} km · ${esc(ph.area)}</span>
        <span style="display:inline-flex;align-items:center;gap:5px">${icon('star', 13)} ${ph.rating} (${ph.reviews})</span>
      </div>
      <div style="margin-top:var(--sp-3)">${openTag(ph)}</div>
    </div>

    <div style="padding:var(--sp-5) var(--sp-5) 0">
      <div class="card ${entry && entry.state === 'in' ? 'card-mint' : ''}" style="margin-bottom:var(--sp-5)">
        <div class="row-between" style="margin-bottom:var(--sp-2)">
          <span class="small muted">Your search</span>
          ${entry ? stockChip(entry.state, { lg: true }) : `<span class="stock-chip unknown lg">${icon('circle-help', 14)} Not listed</span>`}
        </div>
        <div style="font-family:var(--font-heading);font-weight:600;font-size:var(--fs-body-lg)">${esc(med.name)}</div>
        <div class="row-between" style="margin-top:var(--sp-2)">
          <span class="strong" style="font-size:var(--fs-title)">${money(entry && entry.price)}</span>
          ${entry ? freshnessTag(entry.updatedMin) : '<span class="freshness very-stale">Never updated</span>'}
        </div>
        ${med.rx ? `<p class="tiny" style="margin:var(--sp-3) 0 0;color:#3F6B52">Prescription required at pickup.</p>` : ''}
      </div>

      ${sectionHead('Pharmacy details')}
      <div class="card" style="margin-bottom:var(--sp-5)">
        <div class="info-row">${icon('clock', 18, { cls: 'ir-icon' })}
          <div><div class="ir-label">Opening hours</div><div class="ir-value">${esc(ph.hours)}</div></div>
        </div>
        <div class="info-row">${icon('phone', 18, { cls: 'ir-icon' })}
          <div><div class="ir-label">${esc(ph.phone)}</div><div class="ir-value">Tap to call</div></div>
        </div>
        <div class="info-row">${icon('map-pin', 18, { cls: 'ir-icon' })}
          <div><div class="ir-label">${esc(ph.address)}</div><div class="ir-value">${ph.distanceKm.toFixed(1)} km from you</div></div>
        </div>
        <div class="info-row">${icon('shield-check', 18, { cls: 'ir-icon' })}
          <div><div class="ir-label">PCN registration ${esc(ph.pcn)}</div><div class="ir-value">Verified with the Pharmacists Council of Nigeria</div></div>
        </div>
      </div>

      ${others.length ? `
        ${sectionHead('Also listed here')}
        <div style="margin-bottom:var(--sp-5)">
          ${others.map(([mid, e]) => `
            <div class="stock-row">
              <div style="flex:1;min-width:0">
                <div class="sr-name">${esc(medById[mid].name)}</div>
                <div class="sr-sub">${money(e.price)} · ${freshness(e.updatedMin).label.toLowerCase()}</div>
              </div>
              ${stockChip(e.state)}
            </div>`).join('')}
        </div>` : ''}

      <div style="padding-bottom:var(--sp-5)">${rxNotice}</div>
    </div>
  </div>

  <div class="action-bar">
    <a class="btn btn-outline" href="tel:${esc(ph.phone.replace(/\s/g, ''))}" style="flex:0 0 56px;padding:0">
      ${icon('phone', 20)}<span class="sr-only">Call pharmacy</span>
    </a>
    <button class="btn btn-purple" data-nav="reserve" ${!entry || entry.state === 'out' ? 'disabled' : ''}>
      ${icon('bookmark', 18)} Reserve
    </button>
    <button class="btn btn-primary" data-nav="directions">${icon('navigation', 18)} Directions
    </button>
  </div>`;
}

/* ---------------------------------------------------------------- reserve */

function reserve() {
  const ph = pharmacyById[state.selectedPharmacyId || 'p1'];
  const medId = state.selectedMedId || 'm1';
  const med = medById[medId];
  const entry = ph.stock[medId];
  const qty = state.reserveQty || 1;

  return `
  ${statusBar('light', '09:45')}
  <div class="app-header" style="padding-top:0">
    <div class="hrow">
      <button class="icon-btn plain" data-nav="pharmacy-detail" data-arg="${ph.id}" aria-label="Back">${icon('chevron-left', 22)}</button>
      <h1 style="font-size:var(--fs-subtitle)">Reserve for pickup</h1>
    </div>
  </div>

  <div class="screen-scroll" style="padding:var(--sp-2) var(--sp-5) var(--sp-5)">
    <div class="banner banner-purple" style="margin-bottom:var(--sp-5)">
      ${icon('clock', 20, { cls: 'banner-icon' })}
      <div>
        <div class="banner-title">Held for 2 hours</div>
        <div class="banner-body">The pharmacy sets your pack aside for 2 hours. Pay at the counter — MedFinder never takes payment.</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:var(--sp-4)">
      <div class="row-between">
        <div>
          <div class="strong">${esc(med.name)}</div>
          <div class="small muted">${esc(med.generic)} · ${esc(med.form)}</div>
        </div>
        ${stockChip(entry ? entry.state : 'unknown')}
      </div>
      <div class="divider" style="margin:var(--sp-3) 0"></div>
      <div class="row-between">
        <span class="small muted">${esc(ph.name)} · ${ph.distanceKm.toFixed(1)} km</span>
        <span class="strong">${money(entry && entry.price)}</span>
      </div>
      ${entry ? `<div style="margin-top:var(--sp-2)">${freshnessTag(entry.updatedMin)}</div>` : ''}
    </div>

    <div class="card" style="margin-bottom:var(--sp-4)">
      <div class="row-between">
        <span class="field-label" style="margin:0">Quantity</span>
        <div class="row" style="gap:var(--sp-3)">
          <button class="icon-btn" data-qty="-1" aria-label="Decrease quantity" ${qty <= 1 ? 'disabled style="opacity:.4"' : ''}>${icon('minus', 18)}</button>
          <span class="strong tabular" style="min-width:20px;text-align:center;font-size:var(--fs-subtitle)">${qty}</span>
          <button class="icon-btn" data-qty="1" aria-label="Increase quantity">${icon('plus', 18)}</button>
        </div>
      </div>
      <div class="divider" style="margin:var(--sp-3) 0"></div>
      <div class="row-between">
        <span class="muted">Estimated total</span>
        <span class="strong" style="font-size:var(--fs-title)">${money((entry && entry.price || 0) * qty)}</span>
      </div>
    </div>

    <div class="field">
      <label class="field-label" for="res-note">Note for the pharmacist <span class="muted">(optional)</span></label>
      <textarea class="textarea" id="res-note" placeholder="e.g. I will arrive in 30 minutes with my prescription.">${esc(state.reserveNote || '')}</textarea>
    </div>

    ${med.rx ? `
      <div class="banner banner-amber" style="margin-bottom:var(--sp-4)">
        ${icon('alert-triangle', 20, { cls: 'banner-icon' })}
        <div>
          <div class="banner-title">Bring your prescription</div>
          <div class="banner-body">${esc(med.name)} is prescription-only. The pharmacist cannot release it without a valid prescription.</div>
        </div>
      </div>` : ''}

    ${rxNotice}
  </div>

  <div class="action-bar">
    <button class="btn btn-purple btn-block" data-nav="reserve-confirmed">${icon('bookmark', 18)} Confirm reservation
    </button>
  </div>`;
}

/* ------------------------------------------------------- reserve success */

function reserveConfirmed() {
  const ph = pharmacyById[state.selectedPharmacyId || 'p1'];
  const med = medById[state.selectedMedId || 'm1'];
  const res = state.reservation;

  return `
  ${statusBar('light', '09:46')}
  <div class="screen-scroll">
    <div style="padding:var(--sp-8) var(--sp-5) 0;text-align:center">
      <div style="width:88px;height:88px;margin:0 auto var(--sp-5);border-radius:50%;background:var(--purple-tint);color:var(--purple);display:grid;place-items:center">
        ${icon('check', 44, { stroke: 3 })}
      </div>
      <h1 style="font-size:var(--fs-display)">It is held for you</h1>
      <p class="muted" style="margin:var(--sp-2) auto 0;max-width:280px;font-size:var(--fs-body-sm)">
        ${esc(ph.name)} has set aside ${esc(med.name)} × ${res.qty}. Show code <strong style="color:var(--text)">${esc(res.code)}</strong> at the counter.
      </p>
    </div>

    <div style="padding:var(--sp-6) var(--sp-5) 0">
      ${reservationBanner(res, { solidDirections: true })}
    </div>

    <div style="padding:var(--sp-5)">
      <div class="card">
        <div class="info-row" style="padding-top:0">${icon('map-pin', 18, { cls: 'ir-icon' })}
          <div><div class="ir-label">${esc(ph.name)}</div><div class="ir-value">${esc(ph.address)}</div></div>
        </div>
        <div class="info-row">${icon('clock', 18, { cls: 'ir-icon' })}
          <div><div class="ir-label">Pickup before 11:46</div><div class="ir-value">${esc(ph.hours)}</div></div>
        </div>
        <div class="info-row">${icon('wallet', 18, { cls: 'ir-icon' })}
          <div><div class="ir-label">Pay at the pharmacy</div><div class="ir-value">${money((ph.stock[state.selectedMedId || 'm1'] || {}).price)} · cash or transfer</div></div>
        </div>
      </div>

      <div class="row" style="gap:var(--sp-3);margin-top:var(--sp-4)">
        <button class="btn btn-outline" style="flex:1" data-nav="requests">${icon('message-square', 18)} Message
        </button>
        <button class="btn btn-outline" style="flex:1" data-action="cancel-reservation">${icon('x', 18)} Release
        </button>
      </div>

      <div style="margin-top:var(--sp-5)">${rxNotice}</div>
    </div>
  </div>

  <div class="action-bar">
    <button class="btn btn-primary btn-block" data-nav="directions">${icon('navigation', 18)} Get directions
    </button>
  </div>`;
}

/* ------------------------------------------------------------- directions */

function directions() {
  const ph = pharmacyById[state.selectedPharmacyId || 'p1'];
  const mins = Math.round(ph.distanceKm * 4.5) + 3;

  return `
  <div class="screen" style="position:absolute;inset:0">
    <div class="directions-map">
      <div class="map-grid"></div>
      <div class="map-road h" style="left:0;right:0;top:44%"></div>
      <div class="map-road v" style="top:0;bottom:0;left:30%"></div>
      <div class="map-road v" style="top:0;bottom:0;left:66%"></div>
      <div class="map-block" style="left:38%;top:52%;width:24%;height:26%"></div>
      <div class="map-water" style="left:6%;top:4%;width:28%;height:14%"></div>

      <svg class="route-svg" viewBox="0 0 370 400" preserveAspectRatio="none" aria-hidden="true">
        <path class="route-casing" d="M111 176 L111 236 L244 236 L244 120"/>
        <path class="route-path"  d="M111 176 L111 236 L244 236 L244 120"/>
      </svg>

      <div class="map-user" style="left:30%;top:44%"></div>
      <div class="map-pin" style="left:66%;top:30%">
        ${pinSvg(PIN_COLOR.in, PIN_GLYPH.in)}
      </div>
    </div>

    <div style="position:absolute;top:var(--sp-3);left:var(--sp-4);right:var(--sp-4);z-index:6">
      <div class="hrow">
        <button class="icon-btn" data-nav="pharmacy-detail" data-arg="${ph.id}" aria-label="Back">${icon('chevron-left', 22)}</button>
        <div style="flex:1"></div>
        <button class="icon-btn" data-action="recenter" aria-label="Recenter">${icon('crosshair', 20)}</button>
      </div>
    </div>

    <div class="card" style="position:absolute;left:var(--sp-4);right:var(--sp-4);bottom:calc(var(--sp-3) + var(--safe-bottom));z-index:6;padding:var(--sp-4);margin:0">
      <div class="row-between" style="margin-bottom:var(--sp-3)">
        <div>
          <div class="strong">${esc(ph.name)}</div>
          <div class="small muted">${ph.distanceKm.toFixed(1)} km · ${esc(ph.area)}</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-heading);font-weight:700;font-size:var(--fs-title);color:var(--green-deep)">${mins} min</div>
          <div class="tiny muted">walking</div>
        </div>
      </div>

      <div style="background:var(--bg);border-radius:var(--r-input);padding:var(--sp-2) 0">
        <div class="step-row" style="padding:var(--sp-2) var(--sp-3)">
          <span class="step-num">1</span>
          <div><div class="step-text">Head south on Oyo Road</div><div class="step-dist">260 m</div></div>
        </div>
        <div class="step-row" style="padding:var(--sp-2) var(--sp-3)">
          <span class="step-num">2</span>
          <div><div class="step-text">Turn left at the Total filling station</div><div class="step-dist">700 m</div></div>
        </div>
        <div class="step-row" style="padding:var(--sp-2) var(--sp-3)">
          <span class="step-num">3</span>
          <div><div class="step-text">Arrive at ${esc(ph.area)} — destination on your right</div><div class="step-dist">120 m</div></div>
        </div>
      </div>

      <button class="btn btn-primary btn-block" style="margin-top:var(--sp-3)" data-action="open-maps">
        ${icon('navigation', 18)} Start navigation
      </button>
    </div>
  </div>`;
}

/* ------------------------------------------------------------- no results */

function noResults(arg) {
  const medId = arg && arg !== '__query__' ? arg : state.selectedMedId || 'm8';
  state.selectedMedId = medId;
  const med = medById[medId];
  const nearby = visible().slice(0, 4);

  return `
  ${statusBar('light', '09:47')}
  <div class="app-header" style="padding-top:0">
    <div class="hrow">
      <button class="icon-btn plain" data-nav="results" data-arg="${medId}" aria-label="Back">${icon('chevron-left', 22)}</button>
      <h1 style="font-size:var(--fs-subtitle)">No stock found</h1>
    </div>
  </div>

  <div class="screen-scroll">
    <div class="empty" style="padding-top:var(--sp-6)">
      <div class="empty-ill" style="background:var(--purple-tint);color:var(--purple)">${icon('megaphone', 52, { stroke: 1.6 })}</div>
      <h3>No pharmacy lists ${esc(med.name)}</h3>
      <p>None of the ${visible().length} PCN-verified pharmacies near you have this in stock right now. Ask them directly — replies usually arrive in a few minutes.</p>
    </div>

    <div style="padding:0 var(--sp-5)">
      <div class="card" style="margin-bottom:var(--sp-5)">
        <div class="row-between">
          <span class="small muted">What happens next</span>
        </div>
        <div class="steps" style="margin-top:var(--sp-3)">
          <div class="step-line done">
            <span class="sl-dot">${icon('check', 12, { stroke: 3 })}</span>
            <div><div class="sl-title">You send one request</div><div class="sl-sub">To every verified pharmacy within your chosen radius</div></div>
          </div>
          <div class="step-connector"></div>
          <div class="step-line current">
            <span class="sl-dot">2</span>
            <div><div class="sl-title">Pharmacists reply in one tap</div><div class="sl-sub">“Available” with a price, or “Not available”</div></div>
          </div>
          <div class="step-connector"></div>
          <div class="step-line">
            <span class="sl-dot">3</span>
            <div><div class="sl-title">You reserve and collect</div><div class="sl-sub">Hold for 2 hours, then pick up and pay at the counter</div></div>
          </div>
        </div>
      </div>

      <p class="field-label">Nearby pharmacies that will be notified</p>
      <div class="stack-2" style="margin-bottom:var(--sp-4)">
        ${nearby.map((p) => `
          <div class="list-row" style="cursor:default">
            <span class="lr-icon" style="background:var(--purple-tint);color:var(--purple)">${icon('store', 20)}</span>
            <span class="lr-body">
              <span class="lr-title">${esc(p.name)}</span>
              <span class="lr-sub">${p.distanceKm.toFixed(1)} km · ${esc(p.area)} ${p.open ? '· Open now' : '· Closed'}</span>
            </span>
            ${icon('bell', 16, { style: 'color:var(--purple)' })}
          </div>`).join('')}
      </div>

      ${rxNotice}
    </div>
  </div>

  <div class="action-bar">
    <button class="btn btn-outline" style="flex:0 0 auto" data-nav="results" data-arg="${medId}">Search again</button>
    <button class="btn btn-purple" data-nav="broadcast" data-arg="${medId}">${icon('megaphone', 18)} Request stock
    </button>
  </div>`;
}

/* ------------------------------------------------------------- broadcast */

function broadcast(arg) {
  const medId = arg || state.selectedMedId || 'm8';
  state.selectedMedId = medId;
  const med = medById[medId];
  const km = state.requestRadiusKm;
  const count = visible().filter((p) => p.distanceKm <= km).length;

  return `
  ${statusBar('light', '09:48')}
  <div class="app-header" style="padding-top:0">
    <div class="hrow">
      <button class="icon-btn plain" data-nav="no-results" data-arg="${medId}" aria-label="Back">${icon('chevron-left', 22)}</button>
      <h1 style="font-size:var(--fs-subtitle)">Request stock</h1>
    </div>
  </div>

  <div class="screen-scroll" style="padding:var(--sp-2) var(--sp-5) var(--sp-5)">
    <div style="text-align:center;margin-bottom:var(--sp-5)">
      <div class="broadcast-ring">
        <span></span><span></span><span></span>
        <span class="broadcast-core">${icon('megaphone', 34, { stroke: 2 })}</span>
      </div>
    </div>

    <div class="card" style="margin-bottom:var(--sp-4)">
      <div class="row-between">
        <div>
          <div class="strong">${esc(med.name)}</div>
          <div class="small muted">${esc(med.generic)} · ${esc(med.form)}</div>
        </div>
        <span class="chip-tint" style="height:26px;padding:0 10px;font-size:var(--fs-micro);display:inline-flex;align-items:center;border-radius:999px">
          ${med.rx ? 'Prescription only' : 'Over the counter'}
        </span>
      </div>
      <div class="divider" style="margin:var(--sp-3) 0"></div>
      <div class="row" style="justify-content:space-between">
        <span class="small muted">Quantity needed</span>
        <div class="row" style="gap:var(--sp-3)">
          <button class="icon-btn" data-qty="-1" aria-label="Decrease">${icon('minus', 18)}</button>
          <span class="strong tabular" style="min-width:18px;text-align:center">${state.broadcastQty || 1}</span>
          <button class="icon-btn" data-qty="1" aria-label="Increase">${icon('plus', 18)}</button>
        </div>
      </div>
    </div>

    <div class="radius-picker" style="margin-bottom:var(--sp-4)">
      <div class="row-between">
        <span class="field-label" style="margin:0">Broadcast radius</span>
        <span class="radius-value" id="radius-value">${km} km</span>
      </div>
      <input class="range" type="range" min="1" max="15" step="1" value="${km}"
             data-radius aria-label="Broadcast radius in kilometres">
      <div class="range-ticks"><span>1 km</span><span>8 km</span><span>15 km</span></div>
      <div class="banner banner-purple" style="margin-top:var(--sp-3);padding:var(--sp-3)">
        ${icon('store', 18)}
        <div class="banner-body" style="margin:0">
          <strong style="font-size:var(--fs-body-sm)" id="radius-count">${count}</strong>
          verified <span id="radius-word">pharmac${count === 1 ? 'y' : 'ies'}</span> within
          <span id="radius-km">${km}</span> km will be notified.
        </div>
      </div>
    </div>

    <div class="field">
      <label class="field-label" for="bc-note">Anything pharmacists should know? <span class="muted">(optional)</span></label>
      <textarea class="textarea" id="bc-note" placeholder="e.g. Urgent — needed today. Brand substitute is fine.">${esc(state.broadcastNote || '')}</textarea>
    </div>

    <div class="banner banner-mint">
      ${icon('message-square', 20, { cls: 'banner-icon' })}
      <div>
        <div class="banner-title">We also send an SMS</div>
        <div class="banner-body">Pharmacists on poor data connections get your request by SMS, so replies still come through.</div>
      </div>
    </div>
  </div>

  <div class="action-bar">
    <button class="btn btn-purple btn-block" data-nav="broadcast-sent" data-arg="${medId}" id="broadcast-send">
      ${icon('megaphone', 18)} <span id="broadcast-send-label">Send request to ${count} pharmac${count === 1 ? 'y' : 'ies'}</span>
    </button>
  </div>`;
}

/* -------------------------------------------------------- broadcast sent */

function broadcastSent(arg) {
  const medId = arg || state.selectedMedId || 'm8';
  const med = medById[medId];
  const km = state.requestRadiusKm;
  const targets = visible().filter((p) => p.distanceKm <= km);
  const replied = targets.slice(0, 2);

  return `
  ${statusBar('purple', '09:49')}
  <div class="app-header on-green" style="background:var(--purple);padding-top:0">
    <div class="hrow">
      <div style="flex:1">
        <h1 style="font-size:var(--fs-title)">Request sent</h1>
        <p style="margin:4px 0 0;opacity:.85;font-size:var(--fs-body-sm)">Waiting for replies</p>
      </div>
      <span class="chip" style="background:rgba(255,255,255,.18);color:#fff;border:0">
        ${icon('clock', 14)} 2 min ago
      </span>
    </div>
  </div>

  <div class="screen-scroll" style="padding:var(--sp-5)">
    <div class="card" style="margin-bottom:var(--sp-5)">
      <div class="row-between" style="margin-bottom:var(--sp-3)">
        <span class="strong">${esc(med.name)}</span>
        <span class="small muted">within ${km} km</span>
      </div>
      <div class="row" style="gap:var(--sp-2);flex-wrap:wrap">
        <span class="chip chip-mint" style="height:28px">${icon('check-circle', 14)} ${targets.length} notified</span>
        <span class="chip chip-mint" style="height:28px">${icon('message-square', 14)} ${replied.length} replied</span>
        <span class="chip" style="height:28px">${icon('clock', 14)} ${targets.length - replied.length} pending</span>
      </div>
    </div>

    <p class="field-label">Replies so far</p>
    <div class="stack" style="margin-bottom:var(--sp-5)">
      ${replied.map((p, i) => `
        <div class="reply-card ${i === 0 ? 'available' : 'unavailable'}">
          <div class="row-between">
            <div>
              <div class="strong">${esc(p.name)}</div>
              <div class="small muted">${p.distanceKm.toFixed(1)} km · ${esc(p.area)} · replied ${i === 0 ? '1 min' : '2 min'} ago</div>
            </div>
            ${i === 0
              ? stockChip('in')
              : `<span class="stock-chip out">${icon('circle-minus', 12)} Not available</span>`}
          </div>
          ${i === 0
            ? `<div class="row-between" style="margin-top:var(--sp-3)">
                 <span class="strong" style="font-size:var(--fs-subtitle)">${money(p.stock[medId] ? p.stock[medId].price : 13900)}</span>
                 <button class="btn btn-purple btn-sm" data-nav="reserve">${icon('bookmark', 15)} Reserve</button>
               </div>`
            : `<p class="small muted" style="margin:var(--sp-2) 0 0">Try again next week — restock is on the way.</p>`}
        </div>`).join('')}
      <div class="card" style="box-shadow:none;background:var(--grey-tint)">
        <div class="row">
          <span class="lr-icon" style="background:var(--surface);color:var(--text-2)">${icon('clock', 18)}</span>
          <span class="lr-body">
            <span class="lr-title">${targets.length - replied.length} pharmac${targets.length - replied.length === 1 ? 'y' : 'ies'} still to reply</span>
            <span class="lr-sub">We will notify you as answers come in</span>
          </span>
        </div>
      </div>
    </div>

    ${rxNotice}
  </div>

  <div class="action-bar">
    <button class="btn btn-outline" style="flex:0 0 auto" data-nav="home">Done</button>
    <button class="btn btn-purple" data-nav="requests">${icon('inbox', 18)} Track request
    </button>
  </div>`;
}

/* --------------------------------------------------------------- requests */

function requestsScreen() {
  const items = requests;
  return `
  ${statusBar('light', '09:50')}
  <div class="app-header white" style="padding-top:0;padding-bottom:var(--sp-4)">
    <div class="hrow">
      <h1 style="font-size:var(--fs-display)">Requests</h1>
      <button class="icon-btn plain" data-nav="profile" aria-label="Notifications">${icon('bell', 22)}</button>
    </div>
  </div>

  <div class="screen-scroll" style="padding-top:var(--sp-2)">
    <div class="section">
      <div class="segmented" style="margin-bottom:var(--sp-4)">
        <button aria-pressed="true">Active</button>
        <button aria-pressed="false">Closed</button>
      </div>

      ${items.map((r) => {
        const med = medById[r.medicineId];
        const yes = r.replies.filter((x) => x.available).length;
        return `
        <button class="card card-click" style="margin-bottom:var(--sp-3);text-align:left;width:100%" data-nav="request-detail" data-arg="${r.id}">
          <div class="row-between" style="margin-bottom:var(--sp-2)">
            <span class="chip-tint" style="height:24px;padding:0 10px;font-size:var(--fs-micro);display:inline-flex;align-items:center;border-radius:999px">
              ${r.status === 'replied' ? 'Replies in' : 'Awaiting replies'}
            </span>
            <span class="tiny muted">${ago(r.createdMin)}</span>
          </div>
          <div class="strong" style="font-size:var(--fs-body-lg)">${esc(med.name)}</div>
          <div class="small muted" style="margin-top:2px">${r.qty} × · within ${r.radiusKm} km</div>
          <div class="row" style="gap:var(--sp-2);margin-top:var(--sp-3);flex-wrap:wrap">
            <span class="chip ${yes ? 'chip-mint' : ''}" style="height:28px">
              ${icon('check-circle', 14)} ${yes} available
            </span>
            <span class="chip" style="height:28px">
              ${icon('message-square', 14)} ${r.replies.length} of ${visible().length} replied
            </span>
          </div>
        </button>`;
      }).join('')}

      <button class="btn btn-purple btn-block" style="margin-top:var(--sp-2)" data-nav="no-results" data-arg="m8">
        ${icon('megaphone', 18)} New stock request
      </button>
    </div>

    <div class="section" style="padding-bottom:var(--sp-6)">
      <p class="field-label">Recent activity</p>
      <div class="stack-2">
        ${activity.slice(0, 3).map((a) => listRow({
          iconName: a.kind === 'reply' ? 'message-square' : a.kind === 'reserve' ? 'bookmark' : a.kind === 'stock' ? 'package' : 'clock',
          tone: a.kind === 'reply' ? 'purple' : 'mint',
          title: a.title, sub: a.body, right: `<span class="tiny muted nowrap">${ago(a.minute)}</span>`,
        })).join('')}
      </div>
    </div>
  </div>

  ${bottomNav('requests')}`;
}

/* --------------------------------------------------------- request detail */

function requestDetail(arg) {
  const r = requests.find((x) => x.id === arg) || requests[0];
  const med = medById[r.medicineId];
  const yes = r.replies.filter((x) => x.available);

  return `
  ${statusBar('light', '09:51')}
  <div class="app-header" style="padding-top:0">
    <div class="hrow">
      <button class="icon-btn plain" data-nav="requests" aria-label="Back">${icon('chevron-left', 22)}</button>
      <h1 style="font-size:var(--fs-subtitle)">Request</h1>
    </div>
  </div>

  <div class="screen-scroll" style="padding:var(--sp-2) var(--sp-5) var(--sp-5)">
    <div class="card" style="margin-bottom:var(--sp-5)">
      <div class="row-between" style="margin-bottom:var(--sp-3)">
        <div>
          <div class="strong" style="font-size:var(--fs-body-lg)">${esc(med.name)}</div>
          <div class="small muted">${esc(med.generic)} · qty ${r.qty}</div>
        </div>
        <span class="chip-tint" style="height:26px;padding:0 10px;font-size:var(--fs-micro);display:inline-flex;align-items:center;border-radius:999px">
          ${r.radiusKm} km
        </span>
      </div>
      ${r.note ? `<div style="background:var(--grey-tint);border-radius:var(--r-input);padding:var(--sp-3);font-size:var(--fs-body-sm)">“${esc(r.note)}”</div>` : ''}
      <div class="row" style="gap:var(--sp-2);margin-top:var(--sp-3);flex-wrap:wrap">
        <span class="chip chip-mint" style="height:28px">${icon('check-circle', 14)} ${yes.length} available</span>
        <span class="chip" style="height:28px">${icon('clock', 14)} Sent ${ago(r.createdMin)}</span>
      </div>
    </div>

    <p class="field-label">${r.replies.length} replies</p>
    <div class="stack" style="margin-bottom:var(--sp-5)">
      ${r.replies.map((x) => {
        const ph = pharmacyById[x.pharmacyId];
        return `<div class="reply-card ${x.available ? 'available' : 'unavailable'}">
          <div class="row-between">
            <div style="min-width:0">
              <div class="strong">${esc(ph.name)}</div>
              <div class="small muted">${ph.distanceKm.toFixed(1)} km · ${esc(ph.area)} · ${ago(x.minute)}</div>
            </div>
            ${x.available ? stockChip('in') : `<span class="stock-chip out">${icon('circle-minus', 12)} Not available</span>`}
          </div>
          ${x.note ? `<p class="small" style="margin:var(--sp-2) 0 0">“${esc(x.note)}”</p>` : ''}
          ${x.available ? `<div class="row-between" style="margin-top:var(--sp-3)">
              <span class="strong" style="font-size:var(--fs-subtitle)">${money(x.price)}</span>
              <button class="btn btn-purple btn-sm" data-nav="reserve">${icon('bookmark', 15)} Reserve</button>
            </div>` : ''}
        </div>`;
      }).join('')}
    </div>

    ${rxNotice}
  </div>

  <div class="action-bar">
    <button class="btn btn-outline" style="flex:0 0 auto" data-action="cancel-request">Cancel request</button>
    <button class="btn btn-primary" data-nav="results" data-arg="${r.medicineId}">See all listings
    </button>
  </div>`;
}

/* ------------------------------------------------------------ reservations */

function reservationsScreen() {
  // `state.reservation` is what the reserve flow writes to, so releasing a
  // hold in the app makes it disappear here too.
  const active = state.reservation ? [state.reservation] : [];
  const past = [
    { id: 'v2', medicineId: 'm16', pharmacyId: 'p5', qty: 1, status: 'collected', code: 'MF-2210', when: '3 days ago' },
    { id: 'v3', medicineId: 'm9',  pharmacyId: 'p4', qty: 2, status: 'expired',   code: 'MF-1988', when: 'last week' },
  ];

  return `
  ${statusBar('light', '09:52')}
  <div class="app-header white" style="padding-top:0;padding-bottom:var(--sp-4)">
    <div class="hrow"><h1 style="font-size:var(--fs-display)">Reservations</h1></div>
  </div>

  <div class="screen-scroll" style="padding-top:var(--sp-2)">
    <div class="section">
      ${active.length ? `
        ${sectionHead('Active')}
        ${active.map((r) => reservationBanner(r)).join('')}
      ` : `<div class="empty" style="padding:var(--sp-8) 0">
             <div class="empty-ill" style="background:var(--purple-tint);color:var(--purple)">${icon('bookmark', 48, { stroke: 1.6 })}</div>
             <h3>No active holds</h3>
             <p>When you reserve a medicine it will appear here with a countdown.</p>
           </div>`}
    </div>

    <div class="section" style="padding-bottom:var(--sp-6)">
      ${sectionHead('History')}
      <div class="stack-2">
        ${past.map((r) => {
          const ph = pharmacyById[r.pharmacyId];
          const med = medById[r.medicineId];
          return `<div class="list-row" style="cursor:default">
            <span class="lr-icon" style="background:${r.status === 'collected' ? 'var(--mint)' : 'var(--grey-tint)'};color:${r.status === 'collected' ? 'var(--green-deep)' : 'var(--text-2)'}">
              ${icon(r.status === 'collected' ? 'check' : 'clock', 20)}
            </span>
            <span class="lr-body">
              <span class="lr-title">${esc(med.name)} × ${r.qty}</span>
              <span class="lr-sub">${esc(ph.name)} · ${r.when} · ${esc(r.code)}</span>
            </span>
            <span class="chip ${r.status === 'collected' ? 'chip-mint' : ''}" style="height:26px;font-size:var(--fs-micro)">
              ${r.status === 'collected' ? 'Collected' : 'Expired'}
            </span>
          </div>`;
        }).join('')}
      </div>
    </div>
  </div>

  ${bottomNav('reservations')}`;
}

/* ---------------------------------------------------------------- profile */

function profile() {
  return `
  ${statusBar('green', '09:53')}
  <div class="profile-head" style="padding-top:0">
    <div style="height:var(--sp-2)"></div>
    <div class="row" style="margin-bottom:var(--sp-4)">
      <div class="profile-avatar">AA</div>
      <div style="flex:1;min-width:0">
        <div style="font-family:var(--font-heading);font-weight:600;font-size:var(--fs-title)">Adebayo Adeyemi</div>
        <div class="small" style="opacity:.85">+234 803 123 4567 · Ibadan</div>
      </div>
      <button class="icon-btn on-green" data-nav="profile" aria-label="Edit profile">${icon('pencil', 20)}</button>
    </div>
    <div class="row" style="gap:var(--sp-2)">
      <span class="chip" style="background:rgba(255,255,255,.16);color:#fff;border:0;height:30px">
        ${icon('heart-pulse', 14)} Chronic: hypertension
      </span>
      <span class="chip" style="background:rgba(255,255,255,.16);color:#fff;border:0;height:30px">
        ${icon('check-circle', 14)} Verified
      </span>
    </div>
  </div>

  <div class="screen-scroll" style="padding-top:var(--sp-5)">
    <div class="section">
      ${sectionHead('Saved')}
      <div class="stack-2">
        ${listRow({ iconName: 'bookmark', tone: 'purple', title: 'My medicines', sub: 'Metformin, Furosemide', nav: 'reservations' })}
        ${listRow({ iconName: 'map-pin', title: 'Home address', sub: '12 Liberty Road, Bodija', nav: 'profile' })}
        ${listRow({ iconName: 'inbox', tone: 'purple', title: 'My stock requests', sub: '2 active', nav: 'requests' })}
      </div>
    </div>

    <div class="section">
      ${sectionHead('Privacy & legal')}
      <div class="stack-2">
        ${listRow({ iconName: 'shield-check', title: 'Privacy notice (NDPA)', sub: 'What we collect and why', nav: 'consent' })}
        ${listRow({ iconName: 'lock', title: 'Data & permissions', sub: 'Location, SMS alerts', nav: 'consent' })}
        ${listRow({ iconName: 'file-text', title: 'Terms of use', sub: 'Pay at the pharmacy only', nav: 'consent' })}
      </div>
    </div>

    <div class="section">
      ${sectionHead('Support')}
      <div class="stack-2">
        ${listRow({ iconName: 'help-circle', title: 'Help centre', sub: 'How reserving works' })}
        ${listRow({ iconName: 'message-square', title: 'Contact MedFinder', sub: 'support@medfinder.ng' })}
      </div>
    </div>

    <div class="section" style="padding-bottom:var(--sp-6)">
      <div class="row" style="gap:var(--sp-3);margin-bottom:var(--sp-4)">
        <button class="btn btn-outline" style="flex:1" data-role="pharmacist">
          ${icon('store', 18)} Switch to pharmacy
        </button>
      </div>
      <button class="btn btn-ghost btn-block" data-nav="login">${icon('log-out', 18)} Log out</button>
      <p class="tiny muted center" style="margin-top:var(--sp-4)">MedFinder prototype · sample data only</p>
    </div>
  </div>

  ${bottomNav('profile')}`;
}

export const patientScreens = {
  home:              { title: 'Home — search',        group: 'Patient', role: 'patient', render: home },
  results:           { title: 'Search results',       group: 'Patient', role: 'patient', render: results },
  map:               { title: 'Map view',             group: 'Patient', role: 'patient', render: map },
  'pharmacy-detail': { title: 'Pharmacy detail',      group: 'Patient', role: 'patient', render: pharmacyDetail },
  reserve:           { title: 'Reserve item',         group: 'Patient', role: 'patient', render: reserve },
  'reserve-confirmed': { title: 'Reservation held',   group: 'Patient', role: 'patient', render: reserveConfirmed },
  directions:        { title: 'Directions',           group: 'Patient', role: 'patient', render: directions },
  'no-results':      { title: 'No results → request', group: 'Patient', role: 'patient', render: noResults },
  broadcast:         { title: 'Request stock',        group: 'Patient', role: 'patient', render: broadcast },
  'broadcast-sent':  { title: 'Request tracking',     group: 'Patient', role: 'patient', render: broadcastSent },
  requests:          { title: 'My requests',          group: 'Patient', role: 'patient', render: requestsScreen },
  'request-detail':  { title: 'Request + replies',    group: 'Patient', role: 'patient', render: requestDetail },
  reservations:      { title: 'Reservations',         group: 'Patient', role: 'patient', render: reservationsScreen },
  profile:           { title: 'Profile',              group: 'Patient', role: 'patient', render: profile },
};
