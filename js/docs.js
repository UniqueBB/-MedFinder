/* =========================================================================
   MedFinder — renders the live component examples on the design system page
   ========================================================================= */

import { icon } from './icons.js';
import { pharmacies, reservations } from './data.js';
import {
  stockChip, verifiedBadge, openTag, freshnessTag, pharmacyCard,
  reservationBanner, bottomNav, rxNotice,
} from './ui.js';

const $ = (sel) => document.querySelector(sel);
const set = (sel, html) => { const el = $(sel); if (el) el.innerHTML = html; };

/* ------------------------------------------------------------- swatches */

const swatch = ({ name, hex, css, use, text = 'on-light' }) => `
  <div class="swatch">
    <div class="swatch-chip ${text}" style="background:${hex}">
      <span>${name}</span>
    </div>
    <div class="swatch-body">
      <div class="swatch-name">${name}</div>
      <div class="swatch-hex">
        <code style="background:none;padding:0">${hex}</code>
        <button class="copy-hex" data-copy="${hex}">${css}</button>
      </div>
      <div class="swatch-use">${use}</div>
    </div>
  </div>`;

set('#swatch-brand', [
  { name: 'Primary green', hex: '#12A150', css: '--green',       use: 'Buttons, active nav, “In stock”', text: 'on-dark' },
  { name: 'Deep green',    hex: '#0B6B38', css: '--green-deep',  use: 'Headers, pressed buttons, hero blocks', text: 'on-deep' },
  { name: 'Mint tint',     hex: '#E3F6EB', css: '--mint',        use: 'Card backgrounds, soft highlights', text: 'on-light' },
  { name: 'Accent purple', hex: '#6D4AFF', css: '--purple',      use: '“Request stock”, reservations, banners', text: 'on-dark' },
  { name: 'Purple tint',   hex: '#EFEBFF', css: '--purple-tint', use: 'Chips and badges', text: 'on-light' },
].map(swatch).join(''));

set('#swatch-neutral', [
  { name: 'Background',    hex: '#F6F8F7', css: '--bg',     use: 'App background behind all cards' },
  { name: 'Surface',       hex: '#FFFFFF', css: '--surface', use: 'Cards, sheets, inputs, bottom nav' },
  { name: 'Text primary',  hex: '#101828', css: '--text',   use: 'Body copy and headings', text: 'on-dark' },
  { name: 'Text secondary',hex: '#98A2B3', css: '--text-2', use: 'Captions, placeholders, freshness', text: 'on-dark' },
  { name: 'Hairline',      hex: '#EAECF0', css: '--border', use: 'Dividers and input outlines' },
].map(swatch).join(''));

set('#swatch-semantic', [
  { name: 'Warning amber', hex: '#F5A524', css: '--amber', use: '“Updated 2 days ago”, low stock', text: 'on-light' },
  { name: 'Error red',     hex: '#E5484D', css: '--red',   use: '“Out of stock” and errors only', text: 'on-dark' },
].map(swatch).join(''));

set('#swatch-stock', [
  { name: 'In stock',    hex: '#12A150', css: 'stock in',      use: 'Green fill on mint tint, with a check icon' },
  { name: 'Low stock',   hex: '#F5A524', css: 'stock low',     use: 'Amber tint, text darkened to #A66A05' },
  { name: 'Out of stock',hex: '#E5484D', css: 'stock out',     use: 'Red on red tint, with a minus icon' },
  { name: 'Unconfirmed', hex: '#98A2B3', css: 'stock unknown', use: 'Neutral grey — pharmacy has not updated' },
].map(swatch).join(''));

/* ------------------------------------------------------------ type scale */

const TYPE = [
  { label: 'Display',  size: 'var(--fs-display)', spec: '24 px / Poppins 700', cls: 'h',  text: 'Find your medicine' },
  { label: 'Title',    size: 'var(--fs-title)',   spec: '20 px / Poppins 600', cls: 'h',  text: 'Ariya Pharmacy' },
  { label: 'Subtitle', size: 'var(--fs-subtitle)',spec: '16 px / Poppins 600', cls: 'h',  text: 'Pharmacies near you' },
  { label: 'Body lg',  size: 'var(--fs-body-lg)', spec: '15 px / Inter 500',   cls: '',   text: 'Metformin 500 mg' },
  { label: 'Body',     size: 'var(--fs-body)',    spec: '14 px / Inter 400',   cls: '',   text: 'Updated 42 min ago · 0.6 km' },
  { label: 'Body sm',  size: 'var(--fs-body-sm)', spec: '13 px / Inter 400',   cls: '',   text: 'Minimum size for body copy' },
  { label: 'Caption',  size: 'var(--fs-caption)', spec: '12 px / Inter 400',   cls: 'c',  text: 'Mon–Sat 8:00–21:00' },
  { label: 'Micro',    size: 'var(--fs-micro)',   spec: '11 px / Inter 600',   cls: 'c',  text: 'PCN VERIFIED' },
];

set('#type-scale', TYPE.map((t) => `
  <div class="type-row">
    <span class="t-label">${t.label}</span>
    <span style="font-family:${t.cls === 'h' ? 'var(--font-heading)' : 'var(--font-body)'};
                 font-size:${t.size};
                 font-weight:${t.cls === 'h' ? 600 : t.cls === 'c' ? 400 : 400};
                 ${t.cls === 'c' ? 'color:var(--text-2)' : ''}">
      ${t.text}
    </span>
    <span class="t-spec">${t.spec}</span>
  </div>`).join(''));

/* ----------------------------------------------------------------- chips */

set('#docs-stock-chips', ['in', 'low', 'out', 'unknown'].map((s) => stockChip(s)).join(''));
set('#docs-stock-chips-lg', ['in', 'low', 'out', 'unknown'].map((s) => stockChip(s, { lg: true })).join(''));

set('#docs-badges', `
  ${verifiedBadge()}
  ${openTag(pharmacies[0])}
  ${openTag(pharmacies[2])}
  <span class="chip chip-tint">Prescription only</span>
  <span class="chip chip-mint">PCN verified</span>`);

set('#docs-freshness', [15, 180, 2880, 10080]
  .map((m) => `<div class="row-between">
      ${freshnessTag(m)}
      <span class="tiny muted tabular">${m} min</span>
    </div>`).join(''));

/* ------------------------------------------------------------ components */

set('#docs-pharmacy-card', pharmacyCard(pharmacies[0], 'm1', { hideCta: true }));
set('#docs-reservation', reservationBanner({ ...reservations[0], elapsedMinutes: 15 }));
set('#docs-bottom-nav', bottomNav('home', { badges: { requests: 3 } }));
set('#docs-rx', rxNotice);

/* ----------------------------------------------------------------- icons */

const ICON_NAMES = [
  'search', 'map-pin', 'home', 'inbox', 'bookmark', 'user', 'store', 'package',
  'pill', 'flask', 'heart-pulse', 'thermometer', 'sparkles', 'megaphone',
  'shield-check', 'check-circle', 'alert-triangle', 'circle-minus', 'circle-help',
  'clock', 'phone', 'navigation', 'crosshair', 'upload', 'file-text', 'camera',
  'lock', 'bell', 'message-square', 'wallet', 'truck', 'filter', 'sliders',
  'refresh-cw', 'pencil', 'log-out', 'star', 'plus', 'minus', 'x', 'check',
];

set('#docs-icons', ICON_NAMES.map((n) => `
  <div class="icon-cell">${icon(n, 22)}<span>${n}</span></div>`).join(''));

/* ----------------------------------------------------------- a11y rules */

const A11Y = [
  { kind: 'pass', mark: '✓', title: 'Small white text sits on deep green, not primary green',
    body: 'White on #12A150 is 2.9:1 — borderline. Any white label under 14 px uses #0B6B38 (5.9:1) instead.' },
  { kind: 'pass', mark: '✓', title: 'Stock state is never colour alone',
    body: 'Each chip pairs its colour with an icon and the words “In / Low / Out of stock / Unconfirmed”.' },
  { kind: 'pass', mark: '✓', title: 'Body copy floor of 13 px',
    body: 'Chosen for small, low-brightness screens. Captions may go to 11–12 px but carry no essential body text.' },
  { kind: 'pass', mark: '✓', title: '48 px primary buttons, 40 px minimum elsewhere',
    body: 'Comfortable on budget Android; the floating nav pill keeps its 40 px icon squares.' },
  { kind: 'warn', mark: '!', title: 'Low-stock amber is darkened for text',
    body: '#F5A524 on the amber tint fails 4.5:1, so labels use #A66A05. The chip background keeps the brand amber.' },
  { kind: 'warn', mark: '!', title: 'Still to verify on a real device',
    body: 'Test at 200% system font scale, in direct sunlight, and with TalkBack on a Tecno or Infinix handset.' },
];

set('#docs-a11y', A11Y.map((a) => `
  <div class="a11y-row ${a.kind}">
    <span class="mark">${a.mark}</span>
    <div>
      <div class="a-title">${a.title}</div>
      <div class="a-body">${a.body}</div>
    </div>
  </div>`).join(''));

/* -------------------------------------------------------- copy a hex code */

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-copy]');
  if (!btn) return;
  const value = btn.dataset.copy;
  const done = () => {
    const old = btn.textContent;
    btn.textContent = 'Copied';
    setTimeout(() => { btn.textContent = old; }, 1200);
  };
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(value).then(done).catch(() => {});
  }
});

/* Make the demo pharmacy card non-interactive on the docs page. */
document.querySelectorAll('.pharmacy-card').forEach((c) => {
  c.style.cursor = 'default';
  c.removeAttribute('data-pharmacy');
});
