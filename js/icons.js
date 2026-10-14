/* =========================================================================
   MedFinder — icons
   Rounded outline icons on a 24x24 grid, stroke 2, round caps/joins.
   Filled variants are used only for the active state.
   ========================================================================= */

const P = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20.5 20.5-4.3-4.3"/>',
  'map-pin': '<path d="M20 10c0 5-5.5 10.2-7.4 11.8a1 1 0 0 1-1.2 0C9.5 20.2 4 15 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  home: '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 22V12h6v10"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  'chevron-left': '<path d="m15 18-6-6 6-6"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  'check-circle': '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  navigation: '<path d="m3 11 19-9-9 19-2-8-8-2z"/>',
  filter: '<path d="M3 6h18"/><path d="M7 12h10"/><path d="M11 18h2"/>',
  sliders: '<path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/><path d="M1 14h6"/><path d="M9 8h6"/><path d="M17 16h6"/>',
  'alert-triangle': '<path d="m21.7 18-8-14a2 2 0 0 0-3.5 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  minus: '<path d="M5 12h14"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  'file-text': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M9 13h6"/><path d="M9 17h6"/><path d="M9 9h1"/>',
  package: '<path d="m7.5 4.3 9 5.2"/><path d="M21 8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  flask: '<path d="M10 2v7.3"/><path d="M14 9.3V2"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.5 16h13"/>',
  store: '<path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2-5h14l2 5"/><path d="M9 21v-6h6v6"/>',
  'shield-check': '<path d="M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  'shield-alert': '<path d="M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  'message-square': '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  star: '<path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9Z"/>',
  'external-link': '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  copy: '<rect width="13" height="13" x="8" y="8" rx="2"/><path d="M4 16a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z"/><circle cx="12" cy="13" r="3.5"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  'shopping-bag': '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  list: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',
  grid: '<rect width="7" height="7" x="3" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="14" rx="1.5"/><rect width="7" height="7" x="3" y="14" rx="1.5"/>',
  'arrow-up-down': '<path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/>',
  'refresh-cw': '<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M8 16H3v5"/>',
  'heart-pulse': '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/><path d="M3.2 12H9l1.5-2.5L13 15l2-4 1.5 2.5h4.3"/>',
  pill: '<path d="M10.5 20.5 19 12a4.95 4.95 0 1 0-7-7l-8.5 8.5a4.95 4.95 0 1 0 7 7Z"/><path d="m5 12 7 7"/>',
  thermometer: '<path d="M14 14.8V3.5a2.5 2.5 0 0 0-5 0v11.3a4.5 4.5 0 1 0 5 0Z"/><path d="M11.5 7.5v5"/>',
  sparkles: '<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2Z"/><path d="M19 3v4"/><path d="M17 5h4"/>',
  megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  crosshair: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/>',
  'more-vertical': '<circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/>',
  pencil: '<path d="M17 3a2.8 2.8 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',
  'log-out': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  truck: '<path d="M14 18V6a1 1 0 0 0-1-1H2v13h12Z"/><path d="M14 9h4l4 4v5h-8"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>',
  'circle-dot': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5" fill="currentColor" stroke="none"/>',
  'circle-alert': '<circle cx="12" cy="12" r="9"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
  'circle-minus': '<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>',
  'circle-help': '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 1 1 3.6 2.4c-.7.4-1.2 1-1.2 1.8"/><path d="M12 17h.01"/>',
  'clipboard-list': '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M8 11h8"/><path d="M8 15h8"/><path d="M8 19h5"/>',
  building: '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/>',
  'trending-up': '<path d="M22 7 13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/>',
  wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  'help-circle': '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 1 1 3.6 2.4c-.7.4-1.2 1-1.2 1.8"/><path d="M12 17h.01"/>',
  'file-check': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/>',
  'map': '<path d="M14.1 3.5 21 6l-6.9 2.5"/><path d="M3 6l7-2.5v15"/><path d="m3 6 6.9 2.5"/><path d="M21 6v15l-7-2.5"/><path d="m14 18-7-2.5"/>',
  layers: '<path d="m12.8 2.6 8 4.4a1 1 0 0 1 0 1.8l-8 4.4a1 1 0 0 1-1.6 0l-8-4.4a1 1 0 0 1 0-1.8l8-4.4a1 1 0 0 1 1.6 0Z"/><path d="m3.4 12.6 7.8 4.3a1 1 0 0 0 1.6 0l7.8-4.3"/><path d="m3.4 17 7.8 4.3a1 1 0 0 0 1.6 0l7.8-4.3"/>',
  'wifi-off': '<path d="m1 1 22 22"/><path d="M16.7 12.7a6 6 0 0 0-5.7-1.7"/><path d="M5 12.5a10 10 0 0 1 3-1.9"/><path d="M2 8.8A16 16 0 0 1 7 5.4"/><path d="M10.3 18.7a1.9 1.9 0 0 1 3.4 0"/><path d="M8.5 16.2a6 6 0 0 1 2.5-1.4"/>',
  signal: '<path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 20V4"/>',
};

/**
 * Render an icon.
 * @param {string} name  key in P
 * @param {number} size  px, defaults to 20
 * @param {{stroke?:number, cls?:string, fill?:boolean, style?:string}} [opt]
 */
export function icon(name, size = 20, opt = {}) {
  const d = P[name];
  if (!d) {
    if (typeof console !== 'undefined') console.warn('unknown icon:', name);
    return '';
  }
  const sw = opt.stroke ?? 2;
  return `<svg class="icon ${opt.cls || ''}" width="${size}" height="${size}" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="${sw}"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
    ${opt.style ? `style="${opt.style}"` : ''}>${d}</svg>`;
}

/** Status bar glyphs — drawn inline so they stay crisp at 12px. */
export const statusIcons = {
  signal: `<svg width="17" height="11" viewBox="0 0 17 11" aria-hidden="true">
    <rect x="0" y="8" width="3" height="3" rx="1" fill="currentColor"/>
    <rect x="4.5" y="5.5" width="3" height="5.5" rx="1" fill="currentColor"/>
    <rect x="9" y="3" width="3" height="8" rx="1" fill="currentColor"/>
    <rect x="13.5" y="0" width="3" height="11" rx="1" fill="currentColor" opacity="0.4"/>
  </svg>`,
  wifi: `<svg width="15" height="11" viewBox="0 0 15 11" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
    <path d="M1 3.6a10 10 0 0 1 13 0"/><path d="M3.6 6.3a6.2 6.2 0 0 1 7.8 0"/><circle cx="7.5" cy="9.3" r="1.1" fill="currentColor" stroke="none"/>
  </svg>`,
  battery: `<svg width="25" height="12" viewBox="0 0 25 12" aria-hidden="true">
    <rect x="0.6" y="0.6" width="21" height="10.8" rx="3" fill="none" stroke="currentColor" stroke-opacity="0.45" stroke-width="1.2"/>
    <rect x="2.4" y="2.4" width="14" height="7.2" rx="1.8" fill="currentColor"/>
    <path d="M23.4 4.2v3.6a2.2 2.2 0 0 0 0-3.6Z" fill="currentColor" fill-opacity="0.45"/>
  </svg>`,
};
