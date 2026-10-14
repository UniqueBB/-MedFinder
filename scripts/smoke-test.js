#!/usr/bin/env node
/* Renders every prototype screen in Node to catch runtime errors and
   unresolved template values before they reach a browser. */

import { authScreens } from '../js/screens-auth.js';
import { patientScreens } from '../js/screens-patient.js';
import { pharmacistScreens } from '../js/screens-pharmacist.js';
import { state } from '../js/data.js';

const SCREENS = { ...authScreens, ...patientScreens, ...pharmacistScreens };

/* Screens that read an argument give it a sensible default. */
const ARGS = {
  results: 'm1',
  'pharmacy-detail': 'p1',
  'no-results': 'm8',
  broadcast: 'm8',
  'broadcast-sent': 'm8',
  'request-detail': 'r1',
  'pharm-request-detail': 'q1',
};

/* Things that must never leak into the markup. */
const FORBIDDEN = [/undefined/, /NaN/, /\[object Object\]/, /unknown icon/];

let failures = 0;
let total = 0;

for (const role of ['patient', 'pharmacist']) {
  state.role = role;
  for (const [id, screen] of Object.entries(SCREENS)) {
    if (screen.role !== 'shared' && screen.role !== role) continue;
    total++;
    try {
      const html = screen.render(ARGS[id]);
      if (typeof html !== 'string' || html.length < 200) {
        throw new Error(`suspiciously short output (${html?.length ?? 0} chars)`);
      }
      for (const re of FORBIDDEN) {
        const hit = html.match(re);
        if (hit) throw new Error(`output contains ${hit[0]}`);
      }
      console.log(`  ok  ${role.padEnd(10)} ${id}`);
    } catch (err) {
      failures++;
      console.error(`  FAIL ${role.padEnd(10)} ${id} — ${err.message}`);
    }
  }
}

console.log(`\n${total - failures}/${total} screens rendered cleanly.`);
process.exit(failures ? 1 : 0);
