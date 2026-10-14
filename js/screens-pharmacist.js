/* =========================================================================
   MedFinder — pharmacist screens
   ========================================================================= */

import { icon } from './icons.js';
import {
  state, pharmacyById, medById, medicines,
  pharmacistInbox, pharmacistReservations, getInventory,
} from './data.js';
import {
  esc, money, freshnessTag, stockChip, verifiedBadge, rxNotice,
  statusBar, bottomNav, sectionHead, listRow, duration, ago, freshness,
} from './ui.js';

const MY_ID = 'p1';
const me = () => pharmacyById[MY_ID];

/* Statistic tile used on the pharmacist dashboard. */
const stat = ({ label, value, sub, tone = 'mint', iconName }) => `
  <div class="card" style="padding:var(--sp-3)">
    <div class="row" style="gap:var(--sp-2);margin-bottom:var(--sp-2)">
      <span class="lr-icon" style="width:28px;height:28px;border-radius:8px;background:var(--${tone === 'purple' ? 'purple-tint' : 'mint'});color:var(--${tone === 'purple' ? 'purple' : 'green-deep'})">
        ${icon(iconName, 15)}
      </span>
      <span class="tiny muted">${esc(label)}</span>
    </div>
    <div style="font-family:var(--font-heading);font-weight:700;font-size:var(--fs-title);line-height:1.1">${esc(value)}</div>
    ${sub ? `<div class="tiny muted" style="margin-top:2px">${esc(sub)}</div>` : ''}
  </div>`;

/* -------------------------------------------------------------- dashboard */

function pharmHome() {
  const ph = me();
  const inv = getInventory();
  const stale = Object.values(inv).filter((e) => e.updatedMin >= 1440).length;
  const low = Object.values(inv).filter((e) => e.state === 'low').length;
  const out = Object.values(inv).filter((e) => e.state === 'out').length;
  const pending = pharmacistInbox.filter((q) => q.status === 'new').length;
  const holds = pharmacistReservations.filter((r) => r.status === 'held').length;

  return `
  ${statusBar('green', '10:02')}
  <div class="app-header on-green" style="padding-top:0">
    <div class="hrow">
      <div style="flex:1;min-width:0">
        <p style="margin:0;opacity:.8;font-size:var(--fs-caption)">${ph.verified ? verifiedBadge() : ''}</p>
        <h1 style="font-size:var(--fs-title);margin-top:6px">${esc(ph.name)}</h1>
        <p style="margin:4px 0 0;opacity:.85;font-size:var(--fs-caption)">${esc(ph.area)}, Ibadan · ${ph.open ? 'Open till ' + ph.closesAt : 'Closed'}</p>
      </div>
      <button class="icon-btn on-green" data-nav="pharm-profile" aria-label="Pharmacy profile">${icon('user', 20)}</button>
    </div>
  </div>

  <div class="screen-scroll" style="padding-top:var(--sp-5)">
    ${stale ? `
      <div class="section">
        <div class="banner banner-amber">
          ${icon('alert-triangle', 20, { cls: 'banner-icon' })}
          <div style="flex:1">
            <div class="banner-title">${stale} item${stale > 1 ? 's' : ''} not updated today</div>
            <div class="banner-body">Patients trust fresher listings. A quick update keeps you at the top of search.</div>
          </div>
        </div>
      </div>` : ''}

    <div class="section">
      ${sectionHead('Today')}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-3)">
        ${stat({ label: 'Profile views', value: '48', sub: '+12 vs yesterday', iconName: 'trending-up' })}
        ${stat({ label: 'Stock requests', value: String(pending), sub: 'awaiting a reply', tone: 'purple', iconName: 'inbox' })}
        ${stat({ label: 'Active holds', value: String(holds), sub: 'reserved for pickup', iconName: 'bookmark' })}
        ${stat({ label: 'Listed items', value: String(Object.keys(inv).length), sub: `${low} low · ${out} out`, iconName: 'package' })}
      </div>
    </div>

    <div class="section">
      ${sectionHead('Quick actions')}
      <div class="stack-2">
        ${listRow({ iconName: 'package', title: 'Update my stock', sub: 'Tap items in or out of stock', nav: 'pharm-stock' })}
        ${listRow({ iconName: 'upload', tone: 'purple', title: 'Upload a CSV', sub: 'Bulk update your whole list', nav: 'pharm-csv' })}
        ${listRow({ iconName: 'inbox', tone: 'purple', title: 'Answer stock requests', sub: `${pending} waiting`, nav: 'pharm-requests' })}
      </div>
    </div>

    <div class="section">
      ${sectionHead('Latest requests', { link: 'pharm-requests', linkLabel: 'See all' })}
      ${pharmacistInbox.slice(0, 2).map((q) => `
        <button class="card card-click" style="width:100%;text-align:left;margin-bottom:var(--sp-3)" data-nav="pharm-request-detail" data-arg="${q.id}">
          <div class="row-between" style="margin-bottom:var(--sp-2)">
            <span class="chip-tint" style="height:24px;padding:0 10px;font-size:var(--fs-micro);display:inline-flex;align-items:center;border-radius:999px">New request</span>
            <span class="tiny muted">${ago(q.minute)}</span>
          </div>
          <div class="strong">${esc(medById[q.medicineId].name)}</div>
          <div class="small muted" style="margin-top:2px">${esc(q.requester)} · ${q.distanceKm.toFixed(1)} km away · qty ${q.qty}</div>
        </button>`).join('')}
    </div>

    <div class="section">
      ${sectionHead('Hold queue')}
      <div class="stack-2">
        ${pharmacistReservations.filter((r) => r.status === 'held').map((r) => `
          <div class="list-row">
            <span class="lr-icon" style="background:var(--purple-tint);color:var(--purple)">${icon('bookmark', 20)}</span>
            <span class="lr-body">
              <span class="lr-title">${esc(medById[r.medicineId].name)} × ${r.qty}</span>
              <span class="lr-sub">${esc(r.patient)} · ${duration(r.remainingMinutes)} left · ${esc(r.code)}</span>
            </span>
            <span class="chip chip-tint" style="height:26px;font-size:var(--fs-micro)">Held</span>
          </div>`).join('')}
      </div>
    </div>

    <div class="section" style="padding-bottom:var(--sp-6)">
      ${rxNotice}
    </div>
  </div>

  ${bottomNav('home', { badges: { requests: pending } })}`;
}

/* -------------------------------------------------------------- inventory */

const TOGGLES = [
  { key: 'in',  label: 'In',  ic: 'check' },
  { key: 'low', label: 'Low', ic: 'alert-triangle' },
  { key: 'out', label: 'Out', ic: 'circle-minus' },
];

function stockToggle(medId, current) {
  return `<div class="stock-toggle" role="group" aria-label="Stock status">
    ${TOGGLES.map((t) => `
      <button data-stock-set="${medId}:${t.key}" data-state="${t.key}"
        aria-pressed="${current === t.key}" title="${t.label}">
        ${icon(t.ic, 12, { stroke: 2.6 })}<span>${t.label}</span>
      </button>`).join('')}
  </div>`;
}

function pharmStock() {
  const inv = getInventory();
  const entries = Object.entries(inv).map(([mid, e]) => ({ mid, ...e }));
  const lastSaved = state.lastSavedMin ?? 42;

  return `
  ${statusBar('light', '10:05')}
  <div class="app-header" style="padding-top:0">
    <div class="hrow" style="margin-bottom:var(--sp-3)">
      <button class="icon-btn plain" data-nav="pharm-home" aria-label="Back">${icon('chevron-left', 22)}</button>
      <div style="flex:1;min-width:0">
        <h1 style="font-size:var(--fs-title)">My stock list</h1>
        <p class="small muted" style="margin:2px 0 0">${entries.length} items · saved ${freshness(lastSaved).label.toLowerCase()}</p>
      </div>
      <button class="icon-btn" data-nav="pharm-csv" aria-label="Upload CSV">${icon('upload', 20)}</button>
    </div>
    <div class="searchbar">
      ${icon('search', 20, { stroke: 2.2 })}
      <input type="search" placeholder="Search medicine" aria-label="Search my stock">
    </div>
  </div>

  <div class="screen-scroll" style="padding:var(--sp-4) var(--sp-5) var(--sp-6)">
    <div class="banner banner-mint" style="margin-bottom:var(--sp-4)">
      ${icon('clock', 20, { cls: 'banner-icon' })}
      <div>
        <div class="banner-title">Patients see how fresh your list is</div>
        <div class="banner-body">Every card shows “${freshness(42).label}”. Update before you open to rank higher.</div>
      </div>
    </div>

    ${entries.map((e) => {
      const m = medById[e.mid];
      const fr = freshness(e.updatedMin);
      return `<div class="inventory-row">
        <span class="lr-icon" style="background:var(--mint);color:var(--green-deep)">${icon('pill', 20)}</span>
        <span class="lr-body" style="flex:1;min-width:0">
          <span class="iv-name">${esc(m.name)}</span>
          <span class="iv-sub">${money(e.price)} · <span style="color:${fr.level === 'fresh' ? 'var(--text-2)' : fr.level === 'stale' ? '#A66A05' : 'var(--red)'}">${fr.label.toLowerCase()}</span></span>
        </span>
        ${stockToggle(e.mid, e.state)}
      </div>`;
    }).join('')}

    <button class="btn btn-outline btn-block" style="margin-top:var(--sp-4)" data-action="add-item">
      ${icon('plus', 18)} Add a medicine
    </button>

    <div style="margin-top:var(--sp-5)">
      ${rxNotice}
      <p class="tiny muted" style="margin-top:var(--sp-3)">Controlled substances are never listed on MedFinder.</p>
    </div>
  </div>

  <div class="action-bar">
    <button class="btn btn-primary btn-block" data-action="save-stock">
      ${icon('check', 18)} Save and publish
    </button>
  </div>`;
}

/* -------------------------------------------------------------------- csv */

function pharmCsv() {
  const rows = [
    ['Metformin 500 mg', 'in', '3200'],
    ['Amlodipine 5 mg', 'in', '2800'],
    ['Paracetamol 500 mg', 'in', '700'],
    ['Amoxicillin 500 mg', 'out', '3400'],
  ];
  return `
  ${statusBar('light', '10:07')}
  <div class="app-header" style="padding-top:0">
    <div class="hrow">
      <button class="icon-btn plain" data-nav="pharm-stock" aria-label="Back">${icon('chevron-left', 22)}</button>
      <h1 style="font-size:var(--fs-subtitle)">Upload a CSV</h1>
    </div>
  </div>

  <div class="screen-scroll" style="padding:var(--sp-2) var(--sp-5) var(--sp-6)">
    <div class="dropzone" data-action="pick-csv" style="margin-bottom:var(--sp-5)">
      <div class="dropzone-ill">${icon('upload', 30, { stroke: 2 })}</div>
      <div class="strong" style="font-size:var(--fs-body-lg)">Choose a CSV file</div>
      <p class="small muted" style="margin:var(--sp-2) 0 var(--sp-4)">or drag it here · .csv up to 2 MB</p>
      <button class="btn btn-purple btn-sm">Select file</button>
    </div>

    <p class="field-label">Expected format</p>
    <div class="card" style="padding:0;overflow:hidden;margin-bottom:var(--sp-4)">
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:var(--fs-caption)">
          <thead>
            <tr style="background:var(--mint);color:var(--green-deep);text-align:left">
              <th style="padding:8px 12px;font-weight:600">medicine</th>
              <th style="padding:8px 12px;font-weight:600">status</th>
              <th style="padding:8px 12px;font-weight:600">price_ngn</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map((r) => `<tr style="border-top:1px solid var(--border)">
              <td style="padding:8px 12px">${esc(r[0])}</td>
              <td style="padding:8px 12px"><code>${esc(r[1])}</code></td>
              <td style="padding:8px 12px" class="tabular">${esc(r[2])}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="card" style="margin-bottom:var(--sp-4)">
      <div class="row-between" style="margin-bottom:var(--sp-2)">
        <span class="strong small">Status values</span>
      </div>
      <div class="row" style="gap:var(--sp-2);flex-wrap:wrap">
        ${stockChip('in')}${stockChip('low')}${stockChip('out')}${stockChip('unknown')}
      </div>
      <p class="field-hint" style="margin-top:var(--sp-3)">Anything else in the status column is treated as <strong>Unconfirmed</strong>.</p>
    </div>

    <div class="banner banner-purple" style="margin-bottom:var(--sp-5)">
      ${icon('file-text', 20, { cls: 'banner-icon' })}
      <div>
        <div class="banner-title">${state.csvUploaded ? 'Last upload: 4 rows, 1 error' : 'Not sure where to start?'}</div>
        <div class="banner-body">Download the template, fill it in Excel, then upload it here.</div>
      </div>
    </div>

    ${state.csvUploaded ? `
      <div class="banner banner-red" style="margin-bottom:var(--sp-4)">
        ${icon('alert-triangle', 20, { cls: 'banner-icon' })}
        <div>
          <div class="banner-title">1 row needs attention</div>
          <div class="banner-body">Row 4: “Amoxycillin 500mg” did not match a registered product. Did you mean Amoxicillin 500 mg?</div>
        </div>
      </div>` : ''}

    ${listRow({ iconName: 'download', title: 'Download template', sub: 'medfinder-template.csv' })}
  </div>

  <div class="action-bar">
    <button class="btn btn-outline" style="flex:0 0 auto" data-nav="pharm-stock">Cancel</button>
    <button class="btn btn-primary" data-action="upload-csv">${icon('check', 18)} Upload and publish
    </button>
  </div>`;
}

/* ------------------------------------------------------- incoming requests */

function pharmRequests() {
  const pending = pharmacistInbox.filter((q) => q.status === 'new');
  return `
  ${statusBar('light', '10:09')}
  <div class="app-header white" style="padding-top:0;padding-bottom:var(--sp-4)">
    <div class="hrow">
      <div style="flex:1">
        <h1 style="font-size:var(--fs-display)">Requests</h1>
        <p class="small muted" style="margin:2px 0 0">${pending.length} waiting for your reply</p>
      </div>
      <button class="icon-btn plain" aria-label="Filter">${icon('filter', 20)}</button>
    </div>
  </div>

  <div class="screen-scroll" style="padding-top:var(--sp-2)">
    <div class="section">
      <div class="banner banner-purple" style="margin-bottom:var(--sp-4)">
        ${icon('megaphone', 20, { cls: 'banner-icon' })}
        <div>
          <div class="banner-title">Reply in one tap</div>
          <div class="banner-body">Patients nearby are waiting. “Available” with a price takes about 5 seconds.</div>
        </div>
      </div>

      ${pharmacistInbox.map((q) => {
        const m = medById[q.medicineId];
        return `<div class="card" style="margin-bottom:var(--sp-3)">
          <div class="row-between" style="margin-bottom:var(--sp-3)">
            <div style="min-width:0">
              <div class="strong" style="font-size:var(--fs-body-lg)">${esc(m.name)}</div>
              <div class="small muted">${esc(q.requester)} · ${q.distanceKm.toFixed(1)} km · qty ${q.qty}</div>
            </div>
            <span class="chip-tint" style="height:24px;padding:0 10px;font-size:var(--fs-micro);display:inline-flex;align-items:center;border-radius:999px">
              ${ago(q.minute)}
            </span>
          </div>
          ${q.note ? `<p class="small" style="margin:0 0 var(--sp-3);background:var(--grey-tint);padding:var(--sp-3);border-radius:var(--r-input)">“${esc(q.note)}”</p>` : ''}
          <div class="row" style="gap:var(--sp-2)">
            <button class="btn btn-primary btn-sm" style="flex:1" data-nav="pharm-request-detail" data-arg="${q.id}">
              ${icon('check', 16)} Available
            </button>
            <button class="btn btn-outline btn-sm" style="flex:1" data-nav="pharm-request-detail" data-arg="${q.id}">
              ${icon('circle-minus', 16)} Not available
            </button>
          </div>
        </div>`;
      }).join('')}
    </div>

    <div class="section" style="padding-bottom:var(--sp-6)">
      ${sectionHead('Answered today')}
      <div class="stack-2">
        <div class="list-row" style="cursor:default">
          <span class="lr-icon" style="background:var(--mint);color:var(--green-deep)">${icon('check', 20)}</span>
          <span class="lr-body">
            <span class="lr-title">Salbutamol inhaler — Available</span>
            <span class="lr-sub">Tunde K. · replied 22 min ago · ₦6,800</span>
          </span>
        </div>
        <div class="list-row" style="cursor:default">
          <span class="lr-icon" style="background:var(--grey-tint);color:var(--text-2)">${icon('circle-minus', 20)}</span>
          <span class="lr-body">
            <span class="lr-title">Insulin Mixtard 30 — Not available</span>
            <span class="lr-sub">Ngozi O. · replied 1 hr ago</span>
          </span>
        </div>
      </div>
    </div>
  </div>

  ${bottomNav('requests', { badges: { requests: pending.length } })}`;
}

/* --------------------------------------------------------- request detail */

function pharmRequestDetail(arg) {
  const q = pharmacistInbox.find((x) => x.id === arg) || pharmacistInbox[0];
  const m = medById[q.medicineId];
  const mine = getInventory()[q.medicineId];
  const suggested = mine && mine.price ? mine.price : 4000;

  return `
  ${statusBar('light', '10:10')}
  <div class="app-header" style="padding-top:0">
    <div class="hrow">
      <button class="icon-btn plain" data-nav="pharm-requests" aria-label="Back">${icon('chevron-left', 22)}</button>
      <h1 style="font-size:var(--fs-subtitle)">Stock request</h1>
    </div>
  </div>

  <div class="screen-scroll" style="padding:var(--sp-2) var(--sp-5) var(--sp-6)">
    <div class="card" style="margin-bottom:var(--sp-4)">
      <div class="row-between" style="margin-bottom:var(--sp-3)">
        <span class="chip-tint" style="height:24px;padding:0 10px;font-size:var(--fs-micro);display:inline-flex;align-items:center;border-radius:999px">
          ${icon('clock', 12)} ${ago(q.minute)}
        </span>
        <span class="small muted">${q.distanceKm.toFixed(1)} km away</span>
      </div>
      <div style="font-family:var(--font-heading);font-weight:600;font-size:var(--fs-title)">${esc(m.name)}</div>
      <div class="small muted" style="margin-top:2px">${esc(m.generic)} · ${esc(m.form)} · qty ${q.qty}</div>
      ${q.note ? `<p class="small" style="margin:var(--sp-3) 0 0;background:var(--grey-tint);padding:var(--sp-3);border-radius:var(--r-input)">“${esc(q.note)}”</p>` : ''}
    </div>

    <div class="card ${mine ? 'card-mint' : ''}" style="margin-bottom:var(--sp-5)">
      <div class="row-between">
        <span class="small muted">Your current listing</span>
        ${mine ? stockChip(mine.state) : `<span class="stock-chip unknown">${icon('circle-help', 12)} Not listed</span>`}
      </div>
      <div class="row-between" style="margin-top:var(--sp-2)">
        <span class="strong">${money(mine && mine.price)}</span>
        ${mine ? freshnessTag(mine.updatedMin) : '<span class="tiny muted">—</span>'}
      </div>
    </div>

    <div class="field">
      <label class="field-label" for="reply-price">Price for this request (₦)</label>
      <div class="input-affix">
        <span class="affix-left" style="font-weight:600;color:var(--text)">₦</span>
        <input class="input" id="reply-price" type="number" inputmode="numeric" value="${suggested}">
      </div>
      <p class="field-hint">Shown to the patient if you answer “Available”.</p>
    </div>

    <div class="field">
      <label class="field-label" for="reply-note">Note <span class="muted">(optional)</span></label>
      <textarea class="textarea" id="reply-note" placeholder="e.g. Two packs left. Ask for the pharmacist on duty.">${esc(state.replyNote || '')}</textarea>
    </div>

    <div class="banner banner-mint" style="margin-bottom:var(--sp-5)">
      ${icon('message-square', 20, { cls: 'banner-icon' })}
      <div>
        <div class="banner-title">No data? Reply by SMS</div>
        <div class="banner-body">You can also text AVAIL or NO to the short code in your notification.</div>
      </div>
    </div>

    ${rxNotice}
  </div>

  <div class="action-bar">
    <button class="btn btn-outline" data-action="reply-no">${icon('circle-minus', 18)} Not available</button>
    <button class="btn btn-primary" data-action="reply-yes">${icon('check', 18)} Available
    </button>
  </div>`;
}

/* ----------------------------------------------------------- reservations */

function pharmReservations() {
  const held = pharmacistReservations.filter((r) => r.status === 'held');
  const past = pharmacistReservations.filter((r) => r.status !== 'held');

  return `
  ${statusBar('light', '10:12')}
  <div class="app-header white" style="padding-top:0;padding-bottom:var(--sp-4)">
    <div class="hrow">
      <div style="flex:1">
        <h1 style="font-size:var(--fs-display)">Reservations</h1>
        <p class="small muted" style="margin:2px 0 0">${held.length} items held on your shelf</p>
      </div>
    </div>
  </div>

  <div class="screen-scroll" style="padding-top:var(--sp-2)">
    <div class="section">
      ${held.map((r) => `
        <div class="reservation-banner" style="margin-bottom:var(--sp-3)">
          <div class="rb-top">${icon('bookmark', 15)}<span>${esc(r.patient)} · ${esc(r.code)}</span></div>
          <div class="rb-countdown">${duration(r.remainingMinutes)}</div>
          <div class="rb-sub">${esc(medById[r.medicineId].name)} × ${r.qty} · requested ${ago(r.minute)}</div>
          <div class="rb-actions">
            <button class="btn solid" data-action="confirm-reservation">${icon('check', 15)}<span>Collected</span></button>
            <button class="btn" data-action="release-reservation">${icon('x', 15)}<span>Release</span></button>
          </div>
        </div>`).join('')}
    </div>

    <div class="section" style="padding-bottom:var(--sp-6)">
      ${sectionHead('Closed today')}
      <div class="stack-2">
        ${past.map((r) => `
          <div class="list-row" style="cursor:default">
            <span class="lr-icon" style="background:${r.status === 'collected' ? 'var(--mint)' : 'var(--grey-tint)'};color:${r.status === 'collected' ? 'var(--green-deep)' : 'var(--text-2)'}">
              ${icon(r.status === 'collected' ? 'check' : 'clock', 20)}
            </span>
            <span class="lr-body">
              <span class="lr-title">${esc(medById[r.medicineId].name)} × ${r.qty}</span>
              <span class="lr-sub">${esc(r.patient)} · ${esc(r.code)} · ${ago(r.minute)}</span>
            </span>
            <span class="chip ${r.status === 'collected' ? 'chip-mint' : ''}" style="height:26px;font-size:var(--fs-micro)">
              ${r.status === 'collected' ? 'Collected' : 'Released'}
            </span>
          </div>`).join('')}
      </div>
    </div>
  </div>

  ${bottomNav('reservations')}`;
}

/* ------------------------------------------------------------ verification */

function pharmVerify() {
  return `
  ${statusBar('light', '10:14')}
  <div class="app-header" style="padding-top:0">
    <div class="hrow">
      <button class="icon-btn plain" data-nav="pharm-home" aria-label="Back">${icon('chevron-left', 22)}</button>
      <h1 style="font-size:var(--fs-subtitle)">Premises verification</h1>
    </div>
  </div>

  <div class="screen-scroll" style="padding:var(--sp-2) var(--sp-5) var(--sp-6)">
    <div class="banner banner-purple" style="margin-bottom:var(--sp-5)">
      ${icon('shield-check', 20, { cls: 'banner-icon' })}
      <div>
        <div class="banner-title">Only verified pharmacies are visible</div>
        <div class="banner-body">Patients see a PCN-verified badge. You will not appear in search until this is approved.</div>
      </div>
    </div>

    <div class="steps" style="margin-bottom:var(--sp-6)">
      <div class="step-line done">
        <span class="sl-dot">${icon('check', 12, { stroke: 3 })}</span>
        <div><div class="sl-title">Create account</div><div class="sl-sub">Completed</div></div>
      </div>
      <div class="step-connector"></div>
      <div class="step-line current">
        <span class="sl-dot">2</span>
        <div><div class="sl-title">Submit premises registration</div><div class="sl-sub">In progress</div></div>
      </div>
      <div class="step-connector"></div>
      <div class="step-line">
        <span class="sl-dot">3</span>
        <div><div class="sl-title">PCN check</div><div class="sl-sub">Usually 1–2 working days</div></div>
      </div>
      <div class="step-connector"></div>
      <div class="step-line">
        <span class="sl-dot">4</span>
        <div><div class="sl-title">Go live</div><div class="sl-sub">Appear in patient search</div></div>
      </div>
    </div>

    <div class="field">
      <label class="field-label" for="v-pcn">PCN registration number</label>
      <input class="input" id="v-pcn" placeholder="PCN/2019/04512" value="PCN/2019/04512">
      <p class="field-hint">Found on your Pharmacists Council of Nigeria certificate.</p>
    </div>

    <div class="field">
      <label class="field-label" for="v-prem">Premises licence number</label>
      <input class="input" id="v-prem" placeholder="OY/PH/2019/0881" value="OY/PH/2019/0881">
    </div>

    <div class="field">
      <label class="field-label" for="v-super">Superintendent pharmacist</label>
      <input class="input" id="v-super" placeholder="Full name">
    </div>

    <div class="field">
      <label class="field-label">Upload your PCN certificate</label>
      <div class="dropzone" data-action="pick-file" style="padding:var(--sp-6) var(--sp-4)">
        <div class="dropzone-ill" style="width:56px;height:56px;margin-bottom:var(--sp-3)">${icon('camera', 24)}</div>
        <div class="strong small">Take a photo or choose a file</div>
        <p class="tiny muted" style="margin:var(--sp-1) 0 0">JPG, PNG or PDF · up to 5 MB</p>
      </div>
    </div>

    <div class="field">
      <label class="field-label" for="v-addr">Premises address</label>
      <textarea class="textarea" id="v-addr" placeholder="Street, area, city">12 Liberty Road, Bodija, Ibadan</textarea>
    </div>

    <button class="check-row ${state.consent.location ? 'checked' : ''}" style="width:100%;margin-bottom:var(--sp-5)">
      <span class="check-box">${icon('check', 13, { stroke: 3 })}</span>
      <span>I confirm the premises is registered with PCN and the details above are accurate.</span>
    </button>
  </div>

  <div class="action-bar">
    <button class="btn btn-primary btn-block" data-nav="pharm-verify-pending">
      ${icon('upload', 18)} Submit for verification
    </button>
  </div>`;
}

function pharmVerifyPending() {
  return `
  ${statusBar('light', '10:16')}
  <div class="screen-scroll">
    <div style="padding:var(--sp-10) var(--sp-5) 0;text-align:center">
      <div style="width:88px;height:88px;margin:0 auto var(--sp-5);border-radius:50%;background:var(--purple-tint);color:var(--purple);display:grid;place-items:center">
        ${icon('shield-check', 42, { stroke: 2 })}
      </div>
      <h1 style="font-size:var(--fs-display)">Under review</h1>
      <p class="muted" style="margin:var(--sp-2) auto 0;max-width:290px;font-size:var(--fs-body-sm)">
        We are checking your PCN registration. Most premises are approved within 1–2 working days.
      </p>
    </div>

    <div style="padding:var(--sp-8) var(--sp-5) 0">
      <div class="card">
        <div class="step-line done">
          <span class="sl-dot">${icon('check', 12, { stroke: 3 })}</span>
          <div><div class="sl-title">Details submitted</div><div class="sl-sub">Just now</div></div>
        </div>
        <div class="step-connector"></div>
        <div class="step-line current">
          <span class="sl-dot">2</span>
          <div><div class="sl-title">PCN register check</div><div class="sl-sub">In progress · we will SMS you</div></div>
        </div>
        <div class="step-connector"></div>
        <div class="step-line">
          <span class="sl-dot">3</span>
          <div><div class="sl-title">Approved and visible</div><div class="sl-sub">Not yet</div></div>
        </div>
      </div>

      <div class="banner banner-amber" style="margin-top:var(--sp-5)">
        ${icon('info', 20, { cls: 'banner-icon' })}
        <div>
          <div class="banner-title">You can prepare while you wait</div>
          <div class="banner-body">Add your stock now. It goes live the moment verification completes.</div>
        </div>
      </div>

      <button class="btn btn-outline btn-block" style="margin-top:var(--sp-4)" data-nav="pharm-stock">
        ${icon('package', 18)} Add my stock
      </button>
      <button class="btn btn-ghost btn-block" style="margin-top:var(--sp-2)" data-nav="pharm-home">
        Back to dashboard
      </button>
    </div>
  </div>`;
}

/* ----------------------------------------------------------- pharm profile */

function pharmProfile() {
  const ph = me();
  return `
  ${statusBar('green', '10:18')}
  <div class="profile-head" style="padding-top:0">
    <div style="height:var(--sp-2)"></div>
    <div class="row" style="margin-bottom:var(--sp-4)">
      <div class="profile-avatar" style="border-radius:var(--r-card)">${icon('store', 30)}</div>
      <div style="flex:1;min-width:0">
        <div style="font-family:var(--font-heading);font-weight:600;font-size:var(--fs-title)">${esc(ph.name)}</div>
        <div class="small" style="opacity:.85">${esc(ph.address)}</div>
      </div>
      <button class="icon-btn on-green" aria-label="Edit">${icon('pencil', 20)}</button>
    </div>
    <div class="row" style="gap:var(--sp-2)">
      <span class="chip" style="background:rgba(255,255,255,.16);color:#fff;border:0;height:30px">
        ${icon('shield-check', 14)} PCN verified
      </span>
      <span class="chip" style="background:rgba(255,255,255,.16);color:#fff;border:0;height:30px">
        ${icon('star', 14)} ${ph.rating} (${ph.reviews})
      </span>
    </div>
  </div>

  <div class="screen-scroll" style="padding-top:var(--sp-5)">
    <div class="section">
      ${sectionHead('Listing')}
      <div class="stack-2">
        ${listRow({ iconName: 'package', title: 'My stock list', sub: '6 items · last saved 42 min ago', nav: 'pharm-stock' })}
        ${listRow({ iconName: 'upload', tone: 'purple', title: 'CSV upload', sub: 'Bulk update', nav: 'pharm-csv' })}
        ${listRow({ iconName: 'bookmark', tone: 'purple', title: 'Reservations', sub: '2 held now', nav: 'pharm-reservations' })}
        ${listRow({ iconName: 'inbox', title: 'Stock requests', sub: '3 waiting', nav: 'pharm-requests' })}
      </div>
    </div>

    <div class="section">
      ${sectionHead('Premises')}
      <div class="stack-2">
        ${listRow({ iconName: 'shield-check', title: 'PCN registration', sub: esc(ph.pcn), nav: 'pharm-verify' })}
        ${listRow({ iconName: 'clock', title: 'Opening hours', sub: esc(ph.hours) })}
        ${listRow({ iconName: 'phone', title: 'Phone', sub: esc(ph.phone) })}
        ${listRow({ iconName: 'map-pin', title: 'Location', sub: esc(ph.area) + ', Ibadan' })}
      </div>
    </div>

    <div class="section" style="padding-bottom:var(--sp-6)">
      <div class="row" style="gap:var(--sp-3);margin-bottom:var(--sp-4)">
        <button class="btn btn-outline" style="flex:1" data-role="patient">
          ${icon('user', 18)} Switch to patient
        </button>
      </div>
      <button class="btn btn-ghost btn-block" data-nav="login">${icon('log-out', 18)} Log out</button>
      <p class="tiny muted center" style="margin-top:var(--sp-4)">MedFinder prototype · sample data only</p>
    </div>
  </div>

  ${bottomNav('profile')}`;
}

export const pharmacistScreens = {
  'pharm-home':            { title: 'Pharmacy dashboard',   group: 'Pharmacist', role: 'pharmacist', render: pharmHome },
  'pharm-stock':           { title: 'Stock list',           group: 'Pharmacist', role: 'pharmacist', render: pharmStock },
  'pharm-csv':             { title: 'CSV upload',           group: 'Pharmacist', role: 'pharmacist', render: pharmCsv },
  'pharm-requests':        { title: 'Incoming requests',    group: 'Pharmacist', role: 'pharmacist', render: pharmRequests },
  'pharm-request-detail':  { title: 'Reply to request',     group: 'Pharmacist', role: 'pharmacist', render: pharmRequestDetail },
  'pharm-reservations':    { title: 'Manage reservations',  group: 'Pharmacist', role: 'pharmacist', render: pharmReservations },
  'pharm-verify':          { title: 'Premises verification',group: 'Pharmacist', role: 'pharmacist', render: pharmVerify },
  'pharm-verify-pending':  { title: 'Verification pending', group: 'Pharmacist', role: 'pharmacist', render: pharmVerifyPending },
  'pharm-profile':         { title: 'Pharmacy profile',     group: 'Pharmacist', role: 'pharmacist', render: pharmProfile },
};
