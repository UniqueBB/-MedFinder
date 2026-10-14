#!/usr/bin/env node
/* Loads both pages in a real DOM and drives the prototype: routes to every
   screen, fires the main interactions and asserts nothing leaks or throws.

   Needs jsdom:  npm install
   Skips cleanly if it is not installed, so `npm test` stays fast. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

let JSDOM;
try {
  ({ JSDOM } = await import('jsdom'));
} catch {
  console.log('jsdom not installed — skipping DOM test (run `npm install` to enable it).');
  process.exit(0);
}

const errors = [];
let failures = 0;

function makeDom(page) {
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
  const dom = new JSDOM(html, {
    url: 'http://localhost:4173/' + page,
    resources: 'usable', runScripts: 'dangerously', pretendToBeVisual: true,
  });
  const w = dom.window;
  w.addEventListener('error', (e) => errors.push(`[${page}] ${e.message}`));
  w.addEventListener('unhandledrejection', (e) => errors.push(`[${page}] ${e.reason}`));

  global.window = w;
  global.document = w.document;
  global.location = w.location;
  global.Event = w.Event;
  global.HTMLElement = w.HTMLElement;
  try {
    Object.defineProperty(global, 'navigator', { value: w.navigator, configurable: true });
  } catch { /* node 22 defines navigator as a getter */ }
  return dom;
}

const check = (label, ok, detail = '') => {
  if (!ok) failures++;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label}${detail ? ' — ' + detail : ''}`);
};

/* ------------------------------------------------------------ index.html */

console.log('index.html — routing');
const d1 = makeDom('index.html');
const { SCREENS } = await import(path.join(ROOT, 'js/app.js'));
d1.window.document.dispatchEvent(new d1.window.Event('DOMContentLoaded'));
await new Promise((r) => setTimeout(r, 50));

const phone = d1.window.document.getElementById('phone-screen');
const go = (hash) => {
  d1.window.location.hash = hash;
  d1.window.dispatchEvent(new d1.window.Event('hashchange'));
};

check('sidebar lists every screen for the active role',
  d1.window.document.querySelectorAll('[data-screen-link]').length > 0,
  d1.window.document.querySelectorAll('[data-screen-link]').length + ' links');

const ARGS = {
  results: 'm1', 'pharmacy-detail': 'p1', 'no-results': 'm8',
  broadcast: 'm8', 'broadcast-sent': 'm8', 'request-detail': 'r1',
  'pharm-request-detail': 'q1',
};

for (const id of Object.keys(SCREENS)) {
  go('#/' + id + (ARGS[id] ? '/' + ARGS[id] : ''));
  const html = phone.innerHTML;
  const leak = html.match(/undefined|NaN|\[object Object\]/);
  check(id.padEnd(22), html.length > 200 && !leak, leak ? leak[0] : html.length + ' chars');
}

/* ------------------------------------------------------- interactions */

console.log('\nindex.html — interactions');

const click = (sel) => {
  const el = phone.querySelector(sel);
  if (!el) { check(`element ${sel}`, false, 'not found'); return null; }
  el.dispatchEvent(new d1.window.MouseEvent('click', { bubbles: true }));
  return el;
};

go('#/results/m1');
click('[data-filter="inStock"]');
check('filter chip toggles', phone.querySelector('[data-filter="inStock"]').classList.contains('active'));

click('[data-filter="nearest"]');
check('sort chip switches to Freshest',
  /Freshest/.test(phone.querySelector('[data-filter="nearest"]').textContent));

go('#/pharm-stock');
click('[data-stock-set="m1:out"]');
check('stock toggle sets state',
  phone.querySelector('[data-stock-set="m1:out"]').getAttribute('aria-pressed') === 'true');

go('#/home');
const search = phone.querySelector('[data-search]');
search.value = 'met';
search.dispatchEvent(new d1.window.Event('input', { bubbles: true }));
check('type-ahead shows matches',
  phone.querySelectorAll('#suggestions .list-row').length > 0,
  phone.querySelectorAll('#suggestions .list-row').length + ' hits');

go('#/broadcast/m8');
const radius = phone.querySelector('[data-radius]');
radius.value = '10';
radius.dispatchEvent(new d1.window.Event('input', { bubbles: true }));
check('radius slider updates the count live',
  phone.querySelector('#radius-count').textContent === '7',
  phone.querySelector('#radius-count').textContent + ' pharmacies');

go('#/home');
click('[data-nav="requests"]');
check('bottom nav navigates', d1.window.location.hash === '#/requests', d1.window.location.hash);

go('#/consent');
click('[data-toggle="consent.marketing"]');
check('consent checkbox toggles',
  phone.querySelector('[data-toggle="consent.marketing"]').getAttribute('aria-checked') === 'true');

go('#/pharm-reservations');
check('countdowns render', phone.querySelectorAll('.rb-countdown').length > 0,
  phone.querySelectorAll('.rb-countdown').length + ' timers');

/* -------------------------------------------------- design-system.html */

console.log('\ndesign-system.html');
const d2 = makeDom('design-system.html');
await import(path.join(ROOT, 'js/docs.js') + '?t=' + Date.now());

for (const sel of [
  '#swatch-brand', '#swatch-neutral', '#swatch-semantic', '#swatch-stock',
  '#type-scale', '#docs-stock-chips', '#docs-badges', '#docs-freshness',
  '#docs-pharmacy-card', '#docs-reservation', '#docs-bottom-nav', '#docs-rx',
  '#docs-icons', '#docs-a11y',
]) {
  const el = d2.window.document.querySelector(sel);
  check(sel.padEnd(24), !!el && el.innerHTML.length > 50, el ? el.innerHTML.length + ' chars' : 'missing');
}

/* ------------------------------------------------------------- result */

console.log('');
if (errors.length) {
  failures += errors.length;
  console.log('JavaScript errors:');
  errors.slice(0, 20).forEach((e) => console.log('  ' + e));
}
console.log(failures ? `\nFAILED — ${failures} problem(s)` : '\nAll DOM checks passed.');
process.exit(failures ? 1 : 0);
