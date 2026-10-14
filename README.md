# MedFinder — clickable prototype

A mobile app that shows which nearby pharmacies have the medicine you need, so
you stop going from shop to shop.

This repository holds a **clickable HTML prototype** of the v1 scope in the PRD:
a phone rendered at 390 × 844 with every screen wired together, driven by mock
data. It exists to get the flows and the visual language agreed before any
React Native code is written.

---

## Run it

```bash
npm start          # serves on http://localhost:4173
```

No build step and no runtime dependencies to open it — it is plain HTML, CSS
and ES modules. `npm install` is only needed for the DOM test (jsdom).

| Page | What it is |
| --- | --- |
| `index.html` | The prototype. A phone on the left-nav sidebar; click through it, or jump between the 26 screens listed on the side. |
| `design-system.html` | Colours, type scale, spacing, every component, and the accessibility rules behind them. |

```bash
npm test           # renders every screen, then drives the app in jsdom
```

---

## What is covered

**Onboarding** — NDPA consent screen, login (green header with the wavy curve
into the form), sign-up with a patient/pharmacy role picker.

**Patient** — home with live type-ahead search, results with filter chips,
map view with green/amber/grey pins, pharmacy detail, reserve, reservation
confirmation with a live countdown, directions, and the no-results path that
broadcasts a stock request to pharmacies in a chosen radius, then tracks replies.

**Pharmacist** — dashboard with listing-freshness warnings, stock list with
one-tap in/low/out toggles, CSV upload with a format table and error states,
incoming requests answered in one tap with a price, reservation hold queue,
premises verification for PCN, and the pending-review state.

**Both roles** — floating bottom nav with the active icon in a green rounded
square, and the prescription notice that appears on every listing.

Only PCN-verified pharmacies appear in patient search — the unverified one in
the dataset is deliberately filtered out.

---

## Layout

```
index.html              prototype shell: sidebar, phone frame, hash router
design-system.html      component gallery and token reference
styles/
  tokens.css            every colour, size, radius and shadow — change it here
  base.css              font faces, reset, phone and viewer chrome
  components.css        buttons, chips, cards, badges, banners, bottom nav
  screens.css           per-screen styles (auth wave, map, directions, …)
  docs.css              design system page only
js/
  data.js               mock pharmacies, medicines, requests + mutable state
  icons.js              rounded outline icons on a 24px grid
  ui.js                 shared components (cards, chips, freshness, nav)
  screens-auth.js       consent, login, sign-up
  screens-patient.js    14 patient screens
  screens-pharmacist.js 9 pharmacist screens
  app.js                sidebar, hash router, click handlers, toasts
  docs.js               renders the live examples on the design system page
scripts/
  serve.js              zero-dependency static server
  smoke-test.js         renders every screen in Node
  dom-test.js           drives the real app in jsdom
assets/fonts/           self-hosted Inter and Poppins (woff2, SIL Open Font License)
```

---

## Design notes

- **Green is action, purple is asking.** Purple is reserved for the two moments
  a patient asks a pharmacy for something: *Request stock* and *Reserve*.
- **Every listing carries a freshness label.** Under 6 hours is grey, 6 hours
  to 3 days is amber, beyond that is red and the listing drops down the ranking.
- **Stock state is never colour alone.** Each chip pairs its colour with an
  icon and a word, so it survives greyscale screens, colour blindness and
  direct sunlight.
- **Body copy never drops below 13 px.** Most users are on small, low-brightness
  phones, often outdoors.
- **Small white text sits on `#0B6B38`, not `#12A150`.** White on the primary
  green is about 2.9:1 — fine for 14 px bold, not for a caption.
- **Fonts are self-hosted**, so the prototype renders identically offline and
  does not phone out to a font CDN.

---

## Not in this prototype

Everything the PRD puts out of scope for v1: delivery, in-app payments,
prescription uploads, controlled substances, price comparison, telemedicine.
There is also no backend — Supabase auth, PostGIS distance queries, Expo push
and the SMS fallback for pharmacists on poor data are all still to build.

The data is fictional: the Ibadan pharmacies, PCN numbers, prices and people
exist only to make the flows concrete.

---

## Next

The PRD assumes React Native with Expo and Supabase. The screen modules here
map one-to-one onto Expo Router routes, and `styles/tokens.css` is the source
to port into a theme file. Two things to settle first on the way there:

1. Confirm with PCN whether advertising stock and medicine prices is permitted.
2. Confirm the Supabase region choice satisfies NDPA cross-border transfer
   rules — there is no Nigerian region.
