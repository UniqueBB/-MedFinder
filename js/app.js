/* =========================================================================
   MedFinder — prototype shell: sidebar, hash router and interactions
   ========================================================================= */

import { icon } from './icons.js';
import { state, medById, getInventory, pharmacies, reservations } from './data.js';
import { authScreens } from './screens-auth.js';
import { patientScreens, suggestionList } from './screens-patient.js';
import { pharmacistScreens } from './screens-pharmacist.js';
import { esc } from './ui.js';

export const SCREENS = { ...authScreens, ...patientScreens, ...pharmacistScreens };

const GROUP_ORDER = ['Onboarding', 'Patient', 'Pharmacist'];
const ROLE_HOME = { patient: 'home', pharmacist: 'pharm-home' };

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* --------------------------------------------------------------- helpers */

/** Verified pharmacies within a radius — used by the live radius slider. */
function livePharmacyCount(km) {
  return pharmacies.filter((p) => p.verified && p.distanceKm <= km).length;
}

/* --------------------------------------------------------------- sidebar */

function buildSidebar() {
  const nav = $('#screen-nav');
  const items = Object.entries(SCREENS)
    .filter(([, s]) => s.role === 'shared' || s.role === state.role);

  nav.innerHTML = GROUP_ORDER
    .map((group) => {
      const inGroup = items.filter(([, s]) => s.group === group);
      if (!inGroup.length) return '';
      const n = GROUP_ORDER.indexOf(group) + 1;
      return `<div class="nav-group">
        <p class="nav-group-title">${n}. ${esc(group)}</p>
        <ul>
          ${inGroup.map(([id, s]) => `
            <li>
              <button class="nav-link" data-nav="${id}" data-screen-link="${id}">
                <span class="num">${String(inGroup.findIndex((x) => x[0] === id) + 1).padStart(2, '0')}</span>
                ${esc(s.title)}
              </button>
            </li>`).join('')}
        </ul>
      </div>`;
    })
    .join('');
}

function syncSidebarActive(id) {
  $$('[data-screen-link]').forEach((b) => {
    const on = b.dataset.screenLink === id;
    b.setAttribute('aria-current', on ? 'page' : 'false');
  });
}

function syncRoleButtons() {
  $$('[data-role-switch]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.roleSwitch === state.role));
  });
}

/* ---------------------------------------------------------------- router */

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [id, arg] = raw.split('/');
  if (!SCREENS[id]) return { id: 'consent', arg: undefined };
  return { id, arg: arg ? decodeURIComponent(arg) : undefined };
}

function navigate(id, arg) {
  if (!SCREENS[id]) return;
  const hash = '#/' + id + (arg ? '/' + encodeURIComponent(arg) : '');
  if (location.hash === hash) render();
  else location.hash = hash;
}

function render() {
  const { id, arg } = parseHash();
  const screen = SCREENS[id];

  // Keep the role switch in step with the screen being viewed.
  if (screen.role !== 'shared' && screen.role !== state.role) {
    state.role = screen.role;
    buildSidebar();
    syncRoleButtons();
  }

  prepareScreen(id);

  const phone = $('#phone-screen');
  phone.innerHTML = screen.render(arg);
  phone.classList.remove('screen-enter');
  void phone.offsetWidth;            // restart the entry animation
  phone.classList.add('screen-enter');

  // Reset scroll for a fresh screen, keep it if only a filter changed.
  const sc = $('.screen-scroll', phone);
  if (sc) sc.scrollTop = 0;

  syncSidebarActive(id);
  $('#stage-title').textContent = screen.title;
  startCountdown();
}

/* --------------------------------------------------------- interactions */

function toast(message, kind = 'success') {
  const wrap = $('.toast-wrap') || (() => {
    const d = document.createElement('div');
    d.className = 'toast-wrap';
    $('#phone-screen').appendChild(d);
    return d;
  })();
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  const ic = kind === 'error' ? 'alert-triangle' : 'check-circle';
  el.innerHTML = `${icon(ic, 18, { stroke: 2.4 })}<span>${esc(message)}</span>`;
  wrap.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity 200ms, transform 200ms';
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    setTimeout(() => el.remove(), 220);
  }, 2600);
}

/** Re-render the current screen, preserving scroll position where possible. */
function refresh(keepScroll = true) {
  const sc = $('.screen-scroll');
  const top = sc ? sc.scrollTop : 0;
  const { id, arg } = parseHash();
  const phone = $('#phone-screen');
  phone.innerHTML = SCREENS[id].render(arg);
  const sc2 = $('.screen-scroll', phone);
  if (keepScroll && sc2) sc2.scrollTop = top;
  startCountdown();
}

function handleAction(action, el) {
  switch (action) {
    case 'toggle-password': {
      const input = $('#login-pass');
      if (input) input.type = input.type === 'password' ? 'text' : 'password';
      break;
    }
    case 'clear-search':
      state.query = '';
      refresh();
      break;
    case 'recenter':
      toast('Recentred on your location');
      break;
    case 'share':
      toast('Link copied to clipboard');
      break;
    case 'open-maps':
      toast('Opening Google Maps…');
      break;
    case 'add-item':
      toast('Medicine picker coming next');
      break;
    case 'save-stock':
      state.lastSavedMin = 0;
      toast('Stock published · freshness reset');
      break;
    case 'pick-csv':
    case 'pick-file':
      toast('File picker — prototype only');
      break;
    case 'upload-csv':
      state.csvUploaded = true;
      refresh();
      toast('Uploaded · 4 rows, 1 needs review', 'error');
      break;
    case 'reply-yes':
      toast('Reply sent: Available');
      setTimeout(() => navigate('pharm-requests'), 700);
      break;
    case 'reply-no':
      toast('Reply sent: Not available');
      setTimeout(() => navigate('pharm-requests'), 700);
      break;
    case 'confirm-reservation':
      toast('Marked as collected');
      break;
    case 'release-reservation':
      toast('Item released back to stock');
      break;
    case 'cancel-reservation':
      state.reservation = null;
      refresh();
      toast('Reservation released');
      break;
    case 'cancel-request':
      toast('Request cancelled');
      setTimeout(() => navigate('requests'), 600);
      break;
    default:
      break;
  }
}

function onClick(e) {
  const actionEl = e.target.closest('[data-action]');
  if (actionEl) {
    if (actionEl.tagName === 'A') e.preventDefault();
    handleAction(actionEl.dataset.action, actionEl);
    return;
  }

  const navEl = e.target.closest('[data-nav]');
  if (navEl) {
    e.preventDefault();
    navigate(navEl.dataset.nav, navEl.dataset.arg);
    return;
  }

  const roleEl = e.target.closest('[data-role]');
  if (roleEl) {
    state.role = roleEl.dataset.role;
    buildSidebar();
    syncRoleButtons();
    navigate(ROLE_HOME[state.role]);
    return;
  }

  const filterEl = e.target.closest('[data-filter]');
  if (filterEl) {
    const key = filterEl.dataset.filter;
    state.filters[key] = !state.filters[key];
    refresh();
    return;
  }

  const toggleEl = e.target.closest('[data-toggle]');
  if (toggleEl) {
    const path = toggleEl.dataset.toggle.split('.');
    state[path[0]][path[1]] = !state[path[0]][path[1]];
    refresh();
    return;
  }

  const stockEl = e.target.closest('[data-stock-set]');
  if (stockEl) {
    const [medId, next] = stockEl.dataset.stockSet.split(':');
    const entry = getInventory()[medId];
    if (entry) {
      entry.state = next;
      entry.updatedMin = 0;
      refresh();
    }
    return;
  }

  const qtyEl = e.target.closest('[data-qty]');
  if (qtyEl) {
    const delta = Number(qtyEl.dataset.qty);
    const onBroadcast = parseHash().id === 'broadcast';
    if (onBroadcast) state.broadcastQty = Math.max(1, (state.broadcastQty || 1) + delta);
    else state.reserveQty = Math.max(1, (state.reserveQty || 1) + delta);
    refresh();
    return;
  }

  const card = e.target.closest('[data-pharmacy]');
  if (card) {
    navigate('pharmacy-detail', card.dataset.pharmacy);
    return;
  }

  // Bottom nav also uses data-nav, but guard the generic segmented control.
  const seg = e.target.closest('.segmented button');
  if (seg) {
    $$('.segmented button', seg.parentElement).forEach((b) => b.setAttribute('aria-pressed', String(b === seg)));
  }
}

function onInput(e) {
  const search = e.target.closest('[data-search]');
  if (search) {
    state.query = search.value;
    const box = $('#suggestions');
    if (box) {
      box.innerHTML = suggestionList(state.query);
      return;
    }
    // Only the home search box jumps straight to results; other screens keep
    // their context so the user is not yanked out of a flow mid-keystroke.
    if (state.query && parseHash().id === 'home') {
      const hit = state.query.trim().toLowerCase();
      const match = Object.values(medById).find((m) => m.name.toLowerCase().startsWith(hit));
      if (match) {
        clearTimeout(search._t);
        search._t = setTimeout(() => navigate('results', match.id), 650);
      }
    }
    return;
  }

  const radius = e.target.closest('[data-radius]');
  if (radius) {
    // Update the labels in place so the drag is never interrupted.
    state.requestRadiusKm = Number(radius.value);
    const km = state.requestRadiusKm;
    const count = Object.values(SCREENS) && livePharmacyCount(km);
    const set = (id, text) => { const el = $('#' + id); if (el) el.textContent = text; };
    set('radius-value', `${km} km`);
    set('radius-count', String(count));
    set('radius-word', count === 1 ? 'pharmacy' : 'pharmacies');
    set('radius-km', String(km));
    set('broadcast-send-label', `Send request to ${count} ${count === 1 ? 'pharmacy' : 'pharmacies'}`);
    return;
  }

  const note = e.target.closest('#res-note');
  if (note) state.reserveNote = note.value;

  const bnote = e.target.closest('#bc-note');
  if (bnote) state.broadcastNote = bnote.value;

  const rnote = e.target.closest('#reply-note');
  if (rnote) state.replyNote = rnote.value;
}

/* ------------------------------------------------------- live countdown */

const parseCountdown = (text) => {
  const h = text.match(/(\d+)h/);
  const mm = text.match(/(\d+)m/);
  return (h ? Number(h[1]) : 0) * 60 + (mm ? Number(mm[1]) : 0);
};
const formatCountdown = (m) => {
  const h = Math.floor(m / 60);
  return h === 0 ? `${m % 60}m` : `${h}h ${String(m % 60).padStart(2, '0')}m`;
};

let countdownTimer = null;
function startCountdown() {
  clearInterval(countdownTimer);
  const els = $$('.rb-countdown');
  if (!els.length) return;

  els.forEach((el) => { el.dataset.remaining = String(parseCountdown(el.textContent)); });

  countdownTimer = setInterval(() => {
    let live = false;
    els.forEach((el) => {
      const left = Math.max(0, Number(el.dataset.remaining) - 1);
      el.dataset.remaining = String(left);
      el.textContent = formatCountdown(left);
      if (left > 0) live = true;
    });
    if (!live) clearInterval(countdownTimer);
  }, 60000);
}

/**
 * Some screens need state prepared before they render — e.g. confirming a
 * reservation has to write the chosen quantity back into the hold.
 */
function prepareScreen(id) {
  if (id === 'reserve-confirmed') {
    const base = reservations[0];
    state.reservation = {
      ...base,
      qty: state.reserveQty || 1,
      holdMinutes: 120,
      elapsedMinutes: 0,
    };
  }
}

/* ----------------------------------------------------------------- boot */

function switchRole(role) {
  state.role = role;
  buildSidebar();
  syncRoleButtons();
  navigate(ROLE_HOME[role]);
}

function init() {
  buildSidebar();
  syncRoleButtons();

  $$('[data-role-switch]').forEach((b) =>
    b.addEventListener('click', () => switchRole(b.dataset.roleSwitch)));

  const phone = $('#phone-screen');
  phone.addEventListener('click', onClick);
  phone.addEventListener('input', onInput);
  phone.addEventListener('submit', (e) => e.preventDefault());

  const toggle = $('#mobile-nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      document.querySelector('.viewer').classList.toggle('mobile-nav-open');
    });
  }

  window.addEventListener('hashchange', render);

  if (!location.hash) location.hash = '#/consent';
  else render();
}

document.addEventListener('DOMContentLoaded', init);
