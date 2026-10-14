/* =========================================================================
   MedFinder — onboarding, consent (NDPA) and sign-in screens
   ========================================================================= */

import { icon } from './icons.js';
import { state } from './data.js';
import { esc, statusBar } from './ui.js';

/** The wavy white curve where the green header meets the form. */
const wave = `
  <div class="auth-curve">
    <svg viewBox="0 0 390 56" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0,26 C65,56 130,2 195,20 C260,38 325,6 390,28 L390,56 L0,56 Z"
            fill="#F6F8F7"/>
    </svg>
  </div>`;

/* --------------------------------------------------------------- consent */
function consent() {
  const c = state.consent;
  return `${statusBar('green', '09:38')}
  <div class="auth-wrap">
    <div class="auth-header">
      <div class="auth-brand">
        <span class="mark">${icon('map-pin', 24, { stroke: 2.4 })}</span>
        <span>
          <span class="name">MedFinder</span>
          <span class="tag" style="display:block">Find your medicine nearby</span>
        </span>
      </div>
      <h2 class="auth-title">Before you start</h2>
      <p class="auth-sub">Here is how we handle your data under the Nigeria Data Protection Act (NDPA), 2023.</p>
      ${wave}
    </div>

    <div class="auth-body">
      <div class="consent-block" style="margin-bottom:var(--sp-4)">
        <div class="consent-item">
          ${icon('lock', 18, { stroke: 2.2 })}
          <span><strong>What we collect.</strong> Your phone number, your location while the app is open, and the medicines you search for.</span>
        </div>
        <div class="consent-item">
          ${icon('shield-check', 18, { stroke: 2.2 })}
          <span><strong>Why.</strong> To show you nearby pharmacies that have your medicine. We never sell your data.</span>
        </div>
        <div class="consent-item">
          ${icon('building', 18, { stroke: 2.2 })}
          <span><strong>Where it is stored.</strong> On Supabase servers outside Nigeria. Cross-border transfers are covered by standard contractual safeguards.</span>
        </div>
        <div class="consent-item">
          ${icon('trash', 18, { stroke: 2.2 })}
          <span><strong>Your rights.</strong> You can ask us to export or delete your data at any time from Profile → Privacy.</span>
        </div>
      </div>

      <div class="stack-2">
        <button class="check-row ${c.data ? 'checked' : ''}" data-toggle="consent.data" role="checkbox" aria-checked="${c.data}">
          <span class="check-box">${icon('check', 13, { stroke: 3 })}</span>
          <span>I consent to MedFinder processing my personal data as described above. <span class="muted">(required)</span></span>
        </button>
        <button class="check-row ${c.location ? 'checked' : ''}" data-toggle="consent.location" role="checkbox" aria-checked="${c.location}">
          <span class="check-box">${icon('check', 13, { stroke: 3 })}</span>
          <span>Allow location access so I can see pharmacies near me. <span class="muted">(required for search)</span></span>
        </button>
        <button class="check-row ${c.marketing ? 'checked' : ''}" data-toggle="consent.marketing" role="checkbox" aria-checked="${c.marketing}">
          <span class="check-box">${icon('check', 13, { stroke: 3 })}</span>
          <span>Send me SMS alerts when a requested medicine is found. <span class="muted">(optional)</span></span>
        </button>
      </div>

      <p class="field-hint" style="margin-top:var(--sp-4)">
        Read the full <a href="#" onclick="return false">Privacy Notice</a>.
      </p>
    </div>

    <div class="auth-foot" style="padding-top:0">
      <button class="btn btn-primary btn-block" data-nav="login"
        ${c.data && c.location ? '' : 'disabled'}>
        Accept and continue
      </button>
    </div>
  </div>`;
}

/* ----------------------------------------------------------------- login */
function login() {
  return `${statusBar('green', '09:39')}
  <div class="auth-wrap">
    <div class="auth-header" style="padding-top:var(--sp-2)">
      <div class="auth-brand">
        <span class="mark">${icon('map-pin', 24, { stroke: 2.4 })}</span>
        <span>
          <span class="name">MedFinder</span>
          <span class="tag" style="display:block">Find your medicine nearby</span>
        </span>
      </div>
      <h2 class="auth-title">Welcome back</h2>
      <p class="auth-sub">Sign in to see which pharmacies near you have your medicine in stock.</p>
      ${wave}
    </div>

    <div class="auth-body" style="padding-top:var(--sp-5)">
      <div class="field">
        <label class="field-label" for="login-phone">Phone number</label>
        <div class="input-affix">
          <span class="affix-left">${icon('phone', 18)}</span>
          <input class="input" id="login-phone" type="tel" inputmode="tel"
                 placeholder="0803 123 4567" value="0803 123 4567">
        </div>
      </div>

      <div class="field">
        <label class="field-label" for="login-pass">Password</label>
        <div class="input-affix">
          <span class="affix-left">${icon('lock', 18)}</span>
          <input class="input" id="login-pass" type="password" value="password123">
          <button class="affix-right" data-action="toggle-password" aria-label="Show password"
                  style="color:var(--text-2);display:grid;place-items:center">
            ${icon('eye', 18)}
          </button>
        </div>
        <a class="forgot" href="#" onclick="return false">Forgot password?</a>
      </div>

      <button class="btn btn-primary btn-block" data-nav="home">Log in</button>

      <div class="row" style="margin:var(--sp-5) 0 var(--sp-4);color:var(--text-2);font-size:var(--fs-caption)">
        <span class="divider" style="flex:1"></span>
        <span style="padding:0 var(--sp-3)">or</span>
        <span class="divider" style="flex:1"></span>
      </div>

      <button class="btn btn-outline btn-block" data-nav="home">
        ${icon('phone', 18)} Continue with WhatsApp code
      </button>
    </div>

    <div class="auth-foot">
      New to MedFinder? <a href="#" data-nav="signup">Create an account</a>
    </div>
  </div>`;
}

/* ---------------------------------------------------------------- signup */
function signup() {
  const role = state.role;
  return `${statusBar('light', '09:40')}
  <div class="auth-wrap">
    <div class="app-header" style="padding-bottom:var(--sp-2)">
      <div class="hrow">
        <button class="icon-btn plain" data-nav="login" aria-label="Back to login">${icon('chevron-left', 22)}</button>
        <h1 style="font-size:var(--fs-subtitle)">Create account</h1>
      </div>
    </div>

    <div class="auth-body" style="padding-top:var(--sp-2)">
      <p class="field-label">I am a…</p>
      <div style="margin-bottom:var(--sp-5)">
        <button class="role-card ${role === 'patient' ? 'checked' : ''}" data-role="patient">
          <span class="rc-icon" style="background:var(--mint);color:var(--green-deep)">${icon('user', 24)}</span>
          <span>
            <span class="rc-title">Patient or caregiver</span>
            <span class="rc-sub" style="display:block">Search nearby pharmacies, request stock and reserve for pickup.</span>
          </span>
        </button>
        <button class="role-card ${role === 'pharmacist' ? 'checked' : ''}" data-role="pharmacist">
          <span class="rc-icon" style="background:var(--purple-tint);color:var(--purple)">${icon('store', 24)}</span>
          <span>
            <span class="rc-title">Pharmacy</span>
            <span class="rc-sub" style="display:block">List your stock, reply to requests and manage reservations.</span>
          </span>
        </button>
      </div>

      <div class="field">
        <label class="field-label" for="su-name">${role === 'pharmacist' ? 'Pharmacy name' : 'Full name'}</label>
        <input class="input" id="su-name" type="text" placeholder="${role === 'pharmacist' ? 'Ariya Pharmacy' : 'Adebayo Adeyemi'}">
      </div>
      <div class="field">
        <label class="field-label" for="su-phone">Phone number</label>
        <div class="input-affix">
          <span class="affix-left">${icon('phone', 18)}</span>
          <input class="input" id="su-phone" type="tel" placeholder="0803 123 4567">
        </div>
        <p class="field-hint">We send a 6-digit code by SMS to verify this number.</p>
      </div>
      <div class="field">
        <label class="field-label" for="su-pass">Password</label>
        <div class="input-affix">
          <span class="affix-left">${icon('lock', 18)}</span>
          <input class="input" id="su-pass" type="password" placeholder="At least 8 characters">
        </div>
      </div>

      <button class="btn btn-primary btn-block" data-nav="${role === 'pharmacist' ? 'pharm-verify' : 'home'}">
        Create account
      </button>

      <p class="field-hint" style="text-align:center;margin-top:var(--sp-4)">
        By continuing you agree to our <a href="#" onclick="return false">Terms</a> and
        <a href="#" onclick="return false">Privacy Notice</a>.
      </p>
    </div>
  </div>`;
}

export const authScreens = {
  consent: { title: 'Consent & privacy (NDPA)', group: 'Onboarding', role: 'shared', render: consent },
  login:   { title: 'Login',                    group: 'Onboarding', role: 'shared', render: login },
  signup:  { title: 'Sign up / role picker',    group: 'Onboarding', role: 'shared', render: signup },
};
