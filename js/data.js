/* =========================================================================
   MedFinder — mock data and app state
   Everything here is fictional sample data for the prototype. Ibadan, Oyo
   State is used as the pilot city, per the PRD.
   ========================================================================= */

/* ------------------------------------------------------------- medicines */
export const medicines = [
  { id: 'm1',  name: 'Metformin 500 mg',       generic: 'Metformin hydrochloride', brand: 'Glucophage', rx: true,  form: 'Tablet' },
  { id: 'm2',  name: 'Amlodipine 5 mg',        generic: 'Amlodipine besylate',     brand: 'Norvasc',    rx: true,  form: 'Tablet' },
  { id: 'm3',  name: 'Salbutamol inhaler',     generic: 'Salbutamol sulfate',      brand: 'Ventolin',   rx: true,  form: 'Inhaler' },
  { id: 'm4',  name: 'Artemether/Lumefantrine',generic: 'Artemether 20/120 mg',    brand: 'Coartem',    rx: false, form: 'Tablet' },
  { id: 'm5',  name: 'Amoxicillin 500 mg',     generic: 'Amoxicillin trihydrate',  brand: 'Amoxil',     rx: true,  form: 'Capsule' },
  { id: 'm6',  name: 'Paracetamol 500 mg',     generic: 'Paracetamol',             brand: 'Panadol',    rx: false, form: 'Tablet' },
  { id: 'm7',  name: 'Lisinopril 10 mg',       generic: 'Lisinopril',              brand: 'Zestril',    rx: true,  form: 'Tablet' },
  { id: 'm8',  name: 'Insulin Mixtard 30',     generic: 'Human insulin 30/70',     brand: 'Mixtard',    rx: true,  form: 'Vial' },
  { id: 'm9',  name: 'Vitamin C 1000 mg',      generic: 'Ascorbic acid',           brand: 'Redoxon',    rx: false, form: 'Tablet' },
  { id: 'm10', name: 'Azithromycin 500 mg',    generic: 'Azithromycin',            brand: 'Zithromax',  rx: true,  form: 'Tablet' },
  { id: 'm11', name: 'Omeprazole 20 mg',       generic: 'Omeprazole',              brand: 'Losec',      rx: true,  form: 'Capsule' },
  { id: 'm12', name: 'Ferrous sulfate + Folic',generic: 'Ferrous sulfate 200 mg',  brand: 'Fefol',      rx: false, form: 'Tablet' },
  { id: 'm13', name: 'Losartan 50 mg',         generic: 'Losartan potassium',      brand: 'Cozaar',     rx: true,  form: 'Tablet' },
  { id: 'm14', name: 'Cetirizine 10 mg',       generic: 'Cetirizine hydrochloride',brand: 'Zyrtec',     rx: false, form: 'Tablet' },
  { id: 'm15', name: 'Glibenclamide 5 mg',     generic: 'Glibenclamide',           brand: 'Daonil',     rx: true,  form: 'Tablet' },
  { id: 'm16', name: 'Furosemide 40 mg',       generic: 'Furosemide',              brand: 'Lasix',      rx: true,  form: 'Tablet' },
  { id: 'm17', name: 'Atorvastatin 20 mg',     generic: 'Atorvastatin calcium',     brand: 'Lipitor',    rx: true,  form: 'Tablet' },
  { id: 'm18', name: 'Doxycycline 100 mg',     generic: 'Doxycycline hyclate',     brand: 'Vibramycin', rx: true,  form: 'Capsule' },
];

export const medById = Object.fromEntries(medicines.map((m) => [m.id, m]));

/* ------------------------------------------------------------- pharmacies */
/* `stock` maps medicine id -> { state, price, updatedMin }
   state: 'in' | 'low' | 'out' | 'unknown'
   `map` is an x/y percentage position on the stylised map canvas.          */
export const pharmacies = [
  {
    id: 'p1', name: 'Ariya Pharmacy', area: 'Bodija',
    distanceKm: 0.6, open: true, closesAt: '21:00', opensAt: '08:00',
    pcn: 'PCN/2019/04512', verified: true,
    phone: '+234 803 123 4567',
    address: '12 Liberty Road, Bodija, Ibadan',
    hours: 'Mon–Sat 8:00–21:00 · Sun 10:00–18:00',
    rating: 4.6, reviews: 128, map: { x: 34, y: 30 },
    stock: {
      m1:  { state: 'in',  price: 3200, updatedMin: 42 },
      m2:  { state: 'in',  price: 2800, updatedMin: 42 },
      m6:  { state: 'in',  price: 700,  updatedMin: 15 },
      m7:  { state: 'low', price: 4100, updatedMin: 180 },
      m9:  { state: 'in',  price: 2500, updatedMin: 15 },
      m12: { state: 'out', price: 1900, updatedMin: 300 },
    },
  },
  {
    id: 'p2', name: 'Ireti Pharmacy', area: 'Samonda',
    distanceKm: 1.2, open: true, closesAt: '20:00', opensAt: '08:30',
    pcn: 'PCN/2020/11877', verified: true,
    phone: '+234 705 998 2211',
    address: '4 Awolowo Avenue, Samonda, Ibadan',
    hours: 'Mon–Sat 8:30–20:00 · Closed Sun',
    rating: 4.3, reviews: 74, map: { x: 62, y: 20 },
    stock: {
      m1:  { state: 'in',  price: 3500, updatedMin: 8 },
      m3:  { state: 'in',  price: 6800, updatedMin: 8 },
      m6:  { state: 'in',  price: 750,  updatedMin: 120 },
      m8:  { state: 'low', price: 14500, updatedMin: 2880 },
      m14: { state: 'in',  price: 1800, updatedMin: 2880 },
      m15: { state: 'unknown', price: null, updatedMin: 4300 },
    },
  },
  {
    id: 'p3', name: 'Alafia Chemists', area: 'Mokola',
    distanceKm: 1.9, open: false, closesAt: '18:00', opensAt: '08:00',
    pcn: 'PCN/2018/00231', verified: true,
    phone: '+234 802 445 7710',
    address: '88 Oyo Road, Mokola Hill, Ibadan',
    hours: 'Mon–Sat 8:00–18:00 · Closed Sun',
    rating: 4.1, reviews: 56, map: { x: 22, y: 62 },
    stock: {
      m1:  { state: 'in',  price: 3000, updatedMin: 2880 },
      m2:  { state: 'in',  price: 2650, updatedMin: 2880 },
      m4:  { state: 'in',  price: 2200, updatedMin: 2880 },
      m5:  { state: 'out', price: 3400, updatedMin: 5760 },
      m11: { state: 'in',  price: 2900, updatedMin: 5760 },
    },
  },
  {
    id: 'p4', name: 'Oreoluwa Pharmacy', area: 'Jericho',
    distanceKm: 2.4, open: true, closesAt: '22:00', opensAt: '07:00',
    pcn: 'PCN/2021/09034', verified: true,
    phone: '+234 706 332 8890',
    address: '3 Queen Elizabeth Road, Jericho, Ibadan',
    hours: 'Daily 7:00–22:00',
    rating: 4.8, reviews: 212, map: { x: 72, y: 50 },
    stock: {
      m1:  { state: 'low', price: 3300, updatedMin: 25 },
      m3:  { state: 'in',  price: 7200, updatedMin: 25 },
      m7:  { state: 'in',  price: 4300, updatedMin: 25 },
      m10: { state: 'in',  price: 5600, updatedMin: 700 },
      m13: { state: 'in',  price: 4800, updatedMin: 700 },
      m17: { state: 'unknown', price: null, updatedMin: 10080 },
    },
  },
  {
    id: 'p5', name: 'Gracefield Pharmacy', area: 'Dugbe',
    distanceKm: 3.1, open: true, closesAt: '19:00', opensAt: '09:00',
    pcn: 'PCN/2022/16720', verified: true,
    phone: '+234 803 776 1122',
    address: '21 Ogunpa Street, Dugbe, Ibadan',
    hours: 'Mon–Sat 9:00–19:00 · Sun 12:00–17:00',
    rating: 4.0, reviews: 39, map: { x: 50, y: 74 },
    stock: {
      m6:  { state: 'in',  price: 680,  updatedMin: 60 },
      m9:  { state: 'in',  price: 2400, updatedMin: 60 },
      m12: { state: 'in',  price: 1850, updatedMin: 60 },
      m14: { state: 'in',  price: 1750, updatedMin: 1440 },
      m18: { state: 'low', price: 2950, updatedMin: 1440 },
    },
  },
  {
    id: 'p6', name: 'Sango Medicine Store', area: 'Sango',
    distanceKm: 4.5, open: true, closesAt: '20:30', opensAt: '08:00',
    pcn: 'PCN/2017/08810', verified: true,
    phone: '+234 805 214 3390',
    address: '7 Sango–Ijokodo Road, Ibadan',
    hours: 'Mon–Sun 8:00–20:30',
    rating: 3.9, reviews: 91, map: { x: 15, y: 42 },
    stock: {
      m2:  { state: 'in',  price: 2750, updatedMin: 45 },
      m4:  { state: 'in',  price: 2100, updatedMin: 45 },
      m5:  { state: 'in',  price: 3600, updatedMin: 45 },
      m6:  { state: 'in',  price: 650,  updatedMin: 200 },
      m16: { state: 'out', price: 1500, updatedMin: 4320 },
    },
  },
  {
    id: 'p7', name: 'Ojoo Community Pharmacy', area: 'Ojoo',
    distanceKm: 6.8, open: true, closesAt: '19:00', opensAt: '08:00',
    pcn: 'PCN/2023/22145', verified: true,
    phone: '+234 701 555 9034',
    address: 'Ojoo Roundabout, Oyo Road, Ibadan',
    hours: 'Mon–Sat 8:00–19:00 · Sun 10:00–16:00',
    rating: 4.2, reviews: 47, map: { x: 84, y: 26 },
    stock: {
      m1:  { state: 'in',  price: 3100, updatedMin: 95 },
      m8:  { state: 'in',  price: 13900, updatedMin: 95 },
      m11: { state: 'in',  price: 2700, updatedMin: 95 },
      m15: { state: 'in',  price: 1250, updatedMin: 2200 },
    },
  },
  {
    id: 'p8', name: 'Bola Chemists (unverified)', area: 'Apata',
    distanceKm: 5.2, open: true, closesAt: '20:00', opensAt: '08:00',
    pcn: null, verified: false,
    phone: '+234 802 111 4455',
    address: '9 Apata Road, Ibadan',
    hours: 'Mon–Sat 8:00–20:00',
    rating: 3.6, reviews: 18, map: { x: 40, y: 88 },
    stock: {
      m1: { state: 'in', price: 2900, updatedMin: 30 },
      m6: { state: 'in', price: 620,  updatedMin: 30 },
    },
  },
];

export const pharmacyById = Object.fromEntries(pharmacies.map((p) => [p.id, p]));

/* -------------------------------------------------------------- requests */
/* Stock requests the patient has broadcast, with pharmacist replies.       */
export const requests = [
  {
    id: 'r1', medicineId: 'm8', qty: 2, radiusKm: 5, note: 'Urgent — needed today.',
    createdMin: 26, status: 'replied', replies: [
      { pharmacyId: 'p7', available: true,  price: 13900, minute: 18, note: 'Two vials in the fridge. Bring a cooler bag.' },
      { pharmacyId: 'p2', available: false, price: null,  minute: 22, note: 'Out of stock till Monday.' },
      { pharmacyId: 'p1', available: false, price: null,  minute: 25, note: 'We do not stock insulin.' },
    ],
  },
  {
    id: 'r2', medicineId: 'm10', qty: 1, radiusKm: 3, note: '',
    createdMin: 190, status: 'sent', replies: [
      { pharmacyId: 'p4', available: true, price: 5600, minute: 150, note: 'Available. Ask for the pharmacist on duty.' },
    ],
  },
];

/* ---------------------------------------------------------- reservations */
export const reservations = [
  {
    id: 'v1', medicineId: 'm1', pharmacyId: 'p1', qty: 2,
    holdMinutes: 120, elapsedMinutes: 15, status: 'held',
    code: 'MF-4821', createdMin: 15,
  },
];

/* ------------------------------------------- pharmacist-side inbox items */
export const pharmacistInbox = [
  {
    id: 'q1', requester: 'Adebayo A.', medicineId: 'm13', qty: 1,
    distanceKm: 1.4, minute: 4, radiusKm: 5, status: 'new',
    note: 'Need Losartan for my father. Can pick up within the hour.',
  },
  {
    id: 'q2', requester: 'Ngozi O.', medicineId: 'm8', qty: 2,
    distanceKm: 0.9, minute: 11, radiusKm: 5, status: 'new',
    note: '',
  },
  {
    id: 'q3', requester: 'Tunde K.', medicineId: 'm3', qty: 1,
    distanceKm: 2.2, minute: 47, radiusKm: 5, status: 'new',
    note: 'Asthma inhaler. Please confirm before I come.',
  },
];

export const pharmacistReservations = [
  { id: 'pr1', patient: 'Adebayo A.', medicineId: 'm1', qty: 2, remainingMinutes: 63,  status: 'held',     code: 'MF-4821', minute: 57 },
  { id: 'pr2', patient: 'Halima I.',  medicineId: 'm6', qty: 3, remainingMinutes: 18,  status: 'held',     code: 'MF-3310', minute: 102 },
  { id: 'pr3', patient: 'Segun D.',   medicineId: 'm9', qty: 1, remainingMinutes: 0,   status: 'collected',code: 'MF-2904', minute: 340 },
  { id: 'pr4', patient: 'Bisi F.',    medicineId: 'm2', qty: 1, remainingMinutes: 0,   status: 'released', code: 'MF-2755', minute: 420 },
];

/* -------------------------------------------------------------- categories */
export const categories = [
  { id: 'c1', label: 'Chronic care', icon: 'heart-pulse', tint: 'mint',   med: 'm1' },
  { id: 'c2', label: 'Antibiotics',  icon: 'pill',        tint: 'purple', med: 'm5' },
  { id: 'c3', label: 'Pain & fever', icon: 'thermometer', tint: 'mint',   med: 'm6' },
  { id: 'c4', label: 'Vitamins',     icon: 'sparkles',    tint: 'purple', med: 'm9' },
];

/* ------------------------------------------------------------ recent buys */
export const recentSearches = [
  { id: 'm1',  label: 'Metformin 500 mg',     when: '2 days ago' },
  { id: 'm16', label: 'Furosemide 40 mg',     when: 'last week' },
  { id: 'm3',  label: 'Salbutamol inhaler',   when: 'last week' },
  { id: 'm11', label: 'Omeprazole 20 mg',     when: '3 weeks ago' },
];

/* --------------------------------------------------------- notifications */
export const activity = [
  { id: 'a1', kind: 'reply',    title: 'Ojoo Community Pharmacy replied', body: 'Insulin Mixtard 30 is available — ₦13,900.', minute: 4 },
  { id: 'a2', kind: 'reserve',  title: 'Reservation confirmed',           body: 'Ariya Pharmacy is holding Metformin 500 mg.', minute: 15 },
  { id: 'a3', kind: 'stock',    title: 'Back in stock nearby',            body: 'Ireti Pharmacy updated Salbutamol inhaler.', minute: 52 },
  { id: 'a4', kind: 'expired',  title: 'Reservation expired',            body: 'Gracefield Pharmacy released your Furosemide.', minute: 1500 },
];

/* =========================================================================
   Mutable app state — this is what makes the prototype clickable.
   ========================================================================= */
export const state = {
  role: 'patient',           // 'patient' | 'pharmacist'
  query: '',
  filters: { openNow: false, nearest: true, inStock: false },
  selectedMedId: null,       // medicine being searched / requested
  selectedPharmacyId: null,
  requestRadiusKm: 5,
  broadcastQty: 1,           // quantity on the broadcast screen
  reserveQty: 1,             // quantity on the reserve screen
  broadcast: null,           // in-flight broadcast
  consent: { data: true, location: true, marketing: false },
  reservation: reservations[0],
  inventory: null,           // lazily cloned pharmacy stock for editing
  lastSavedMin: 42,          // pharmacist "stock last published" freshness
  csvUploaded: false,
  verified: 'verified',      // pharmacist verification status
  toast: null,
};

/** Deep-ish clone of a pharmacy's stock, for the pharmacist editor. */
export function getInventory(pharmacyId = 'p1') {
  if (!state.inventory) {
    state.inventory = JSON.parse(JSON.stringify(pharmacyById[pharmacyId].stock));
  }
  return state.inventory;
}
