# Product Requirements Document — Joy of Hearing Revamp

**Purpose:** Define what the new website must do, for whom, and how we will know it succeeded. The build-LLM uses this to decide what to build; the evaluation plan uses this to decide whether it worked.
**Last updated:** 2026-05-07
**Owner:** Product (FlowX) — Sunith
**Stakeholder:** Joy of Hearing (clinic owner / lead audiologist)

---

## 1. Problem statement

The current `joyofhearing.net` site informs but does not convert. Specifically:

- It is **slow on first paint**, especially on mobile over 4G/3G connections common in Punjab. First-time visitors lose interest before content loads.
- It is **passive**: no clear next action, no prominent call/WhatsApp affordance, no booking flow.
- It is **weak on trust**: the lead audiologist is barely visible (no bio, no credentials, no photo), testimonials are thin and unattributed.
- It is **not mobile-first**: layout breaks on small screens; tap targets are too small.
- It is **stuck on dated tech** (PHP templates, unoptimized PNG banners) which compounds the speed problem.

The site must move from "online brochure" to **lead-generation tool** without compromising — in fact, while improving — load speed.

## 2. Goals (in scope for v1)

- **G1.** Reduce mobile p75 LCP from current (estimated 4–6s on Slow 4G) to **≤ 2.0s**.
- **G2.** Make appointment inquiry the path of least resistance from any page via Call, WhatsApp, or a 5-field form.
- **G3.** Establish trust through a doctor section, real testimonials, and clear service descriptions.
- **G4.** Surface all 7 branches with individually optimized landing pages for local SEO.
- **G5.** Ship in 10–12 calendar days.

## 3. Non-goals (explicitly out of scope for v1)

To prevent scope creep:

- E-commerce (selling hearing aids online).
- Online payment / deposit collection.
- Patient portal, login, or any authenticated experience.
- Real-time chat widget (WhatsApp link replaces this).
- Multilingual support (Hindi/Punjabi). v2 candidate.
- Active blog with content production. A single placeholder page is acceptable.
- Telehealth / video consultations.
- Hearing-test self-screening tool. v2 candidate.
- App-store apps.

## 4. Personas

### 4.1 Priya — Parent of a child with hearing concerns

- **Age** 30–42, mother in a tier-2/3 Punjab town.
- **Mobile-first**, often on 4G, sometimes 3G. Reads English comfortably.
- **Goal:** Find a trusted clinic that handles pediatric hearing assessment, newborn screening, and cochlear implants if needed.
- **Anxiety:** "Will my child be okay? Is this clinic safe? Will the doctor be patient with kids?"
- **Action we want:** Tap WhatsApp from the Pediatric Services page within 30 seconds of arrival.

### 4.2 Harpreet — Adult with progressive hearing loss

- **Age** 45–65, working professional or shopkeeper.
- **Goal:** Get a hearing assessment, learn about hearing aid options, find a nearby branch.
- **Anxiety:** Cost, stigma ("will I look old wearing one?"), trust in the clinic.
- **Action we want:** Tap Call or Book Appointment from the Branches page or a Service detail page.

### 4.3 Manpreet — Adult child researching for an elderly parent

- **Age** 28–45, often researching from another city.
- **Goal:** Find the nearest branch to the parent's home, understand if home visits are available, share information with the parent.
- **Anxiety:** Logistics, parent's mobility, can the clinic come to them.
- **Action we want:** Tap WhatsApp from the Branches page or share a branch link to the parent.

## 5. User journeys

Each journey ends in one of three conversion events: **Call** (`tel:`), **WhatsApp** (`wa.me`), or **Form submit** (Web3Forms).

### Journey 1 — Priya, mobile, organic search

1. Google: "hearing test for child Jalandhar" → lands on `/services/pediatric-audiology` or `/branches/jalandhar`.
2. Reads H1 + 1 paragraph. Sees doctor name + photo + 2 trust badges.
3. Sees sticky bottom CTA bar: **Call** | **WhatsApp** | **Book**.
4. Taps WhatsApp. Pre-filled message: "Hello, I'd like to book a hearing test for my child."
5. **Conversion: WhatsApp click event fires.**

### Journey 2 — Harpreet, desktop, GMB / Maps

1. Clicks website link from Google Maps listing for the Pathankot branch → lands on `/branches/pathankot`.
2. Sees address + map + branch hours + branch-specific phone.
3. Scrolls; reads testimonials from this branch's patients.
4. Clicks "Call this branch" header CTA.
5. **Conversion: Call click event fires.**

### Journey 3 — Manpreet, mobile, paid traffic (future)

1. Lands on `/` from a paid ad.
2. Sees hero with single primary CTA: "Book an appointment in 30 seconds."
3. Taps; reaches `/contact`.
4. Fills 5-field form (name, phone, branch, preferred date, concern).
5. Form posts to Web3Forms; success screen offers a one-tap WhatsApp message to the clinic with their booking summary.
6. **Conversion: form_submit + (optional) wa_click events fire.**

## 6. Functional requirements

| ID | Requirement |
|---|---|
| FR-1 | Top nav with: Home, About, Services, Branches, Contact. Hamburger on mobile. Logo links to `/`. |
| FR-2 | Hero on home page: H1, 1-line subhead, primary CTA (Book Appointment), secondary CTA (Call). Hero image preloaded. |
| FR-3 | Services grid on home and `/services`: 6 service cards with icon, title, 1-line description, link to detail page. |
| FR-4 | Service detail page template: hero, what-it-is, who-it-is-for, what-to-expect, FAQ accordion, related-branches block, sticky CTA. |
| FR-5 | Doctor section on home + dedicated About: photo, name, qualifications, 100-word bio, languages spoken. |
| FR-6 | Testimonials block: at least 4 quotes with first name + city + (optional) photo. Static, no carousel. |
| FR-7 | Branches index `/branches`: list of all branches with city, address, phone, "View details" link. Optional simple text-input filter (no JS lib). |
| FR-8 | Branch detail page template: name, full address, phone, hours, embedded Google Map (lazy `<iframe>`), branch-specific testimonials if available, CTAs. |
| FR-9 | Contact page `/contact`: appointment form (name, phone, email optional, branch select, preferred date, message), clinic phone, WhatsApp, hours, all branches map block. |
| FR-10 | Sticky bottom contact bar on **mobile only** (≤ md breakpoint): Call ⏐ WhatsApp ⏐ Book. Always visible above the fold. |
| FR-11 | 404 page with helpful links back to Home, Services, Contact. |
| FR-12 | XML sitemap auto-generated; `robots.txt` allowing all crawlers. |
| FR-13 | All `tel:` and `wa.me` links source from a single config (`src/config/contact.ts`). Updating one number updates the whole site. |
| FR-14 | Appointment form posts to Web3Forms; on success, displays a confirmation and a tappable "Continue on WhatsApp" deep link. On failure, falls back to a `mailto:` link with the same data. |
| FR-15 | Every service and every branch is reachable in **≤ 2 clicks from home**. |
| FR-16 | GA4 fires the events listed in [EVALUATION_PLAN.md §5](./EVALUATION_PLAN.md#5-instrumentation-ga4-events). |
| FR-17 | 301 redirects from every old `.php` URL to its new clean URL (see [SEO_PLAN.md §6](./SEO_PLAN.md#6-migration-301-redirect-map)). |

## 7. Non-functional requirements

### 7.1 Performance

- Mobile p75 LCP ≤ 2.0s; INP ≤ 200ms; CLS ≤ 0.05; FCP ≤ 1.2s; TTFB ≤ 0.6s.
- Lighthouse mobile perf ≥ 95 on Home, a Service detail, a Branch detail.
- Per-page asset budgets in [PERFORMANCE_BUDGET.md §2](./PERFORMANCE_BUDGET.md#2-asset-budgets-per-page).

### 7.2 Accessibility

- WCAG 2.1 AA conformant.
- axe-core 0 violations.
- Keyboard navigation works on every interactive element.
- Color contrast ≥ 4.5:1 (body text), ≥ 3:1 (large text and UI components).
- Touch targets ≥ 44×44 CSS pixels.

### 7.3 SEO

- Every page has unique `<title>` and `<meta name="description">`.
- Schema.org JSON-LD per [SEO_PLAN.md §3](./SEO_PLAN.md#3-schemaorg-jsonld).
- Open Graph + Twitter Card tags on every page.
- Sitemap submitted to Google Search Console post-launch.

### 7.4 Browser & device support

- **Browsers (last 2 versions):** Chrome, Safari, Firefox, Edge on desktop; Chrome on Android; Safari on iOS.
- **Devices:** iPhone SE (smallest current iPhone), iPhone 14, Pixel 6, Moto G Power (low-end Android benchmark), iPad, desktop 1366×768 and 1920×1080.

### 7.5 Security & privacy

- HTTPS-only post-cutover. HSTS header.
- Strict-ish CSP that forbids inline scripts (only Astro hydration nonces allowed).
- Privacy policy page with GA4 + Web3Forms data flows disclosed.
- No third-party trackers beyond GA4 in v1.

### 7.6 Internationalization

- English only. Routes are `/path` not `/en/path` to keep v2 i18n clean (Astro's i18n routing can be added later without breaking URLs).

## 8. Success metrics

### Primary

| Metric | Baseline (estimate) | Target | Measurement |
|---|---|---|---|
| Appointment inquiries / week (form + WA + call clicks) | unknown — capture pre-cutover | **+30% within 60 days post-launch** | GA4 events + Web3Forms count |
| Mobile bounce rate | likely 70%+ | **≤ 55%** | GA4 |
| Mobile p75 LCP | est. 4–6s | **≤ 2.0s** | CrUX / GA4 web-vitals |

### Secondary

- WhatsApp click-through rate from Service pages (target ≥ 8%).
- Branches index → Branch detail click rate (target ≥ 25% of sessions reaching `/branches`).
- Organic impressions in Search Console (target +25% in 60 days vs. pre-launch baseline).

## 9. Assumptions the build-LLM should treat as ground truth

> Unless the user explicitly overrides one of these, treat them as fixed:

1. The clinic has a single primary booking phone number and a single WhatsApp number, both India-format (+91-...).
2. Hours are uniform across branches: Mon–Sat, 10:00–19:00 IST. (To be re-confirmed in client checklist.)
3. The doctor is a single primary audiologist (name TBD by client) — the site can mention support staff without naming them.
4. There are 7 branches matching the current site: Nawanshahr, Jalandhar, Hoshiarpur, Pathankot, Gurdaspur, Tarn Taran, Faridkot. (Final list and addresses to be confirmed in client checklist.)
5. The clinic does not currently run paid ads; Journey 3 is a v2 traffic source, not a v1 dependency.
6. Existing testimonials may be reused if attributed; if attribution is missing, request fresh ones via the client checklist rather than inventing.
7. There is no existing brand color palette; design will propose medical-trust blues with a warm accent (see [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md#1-color-tokens)).

## 10. Open questions for the client (track and resolve before Day 9 UAT)

| # | Question | Owner | Needed by |
|---|---|---|---|
| OQ-1 | Doctor's full name, qualifications, headshot? | Client | Day 2 |
| OQ-2 | 3–5 fresh testimonials with permission? | Client | Day 5 |
| OQ-3 | Verified address + phone + GMB link for each of the 7 branches? | Client | Day 3 |
| OQ-4 | Logo file (SVG preferred) and any brand colors already in use? | Client | Day 1 |
| OQ-5 | Web3Forms account and access key, GA4 property created? | Client | Day 8 |
| OQ-6 | Hostinger account access (or are we creating one on their behalf)? | Client | Day 11 |
| OQ-7 | Any compliance / medical-claims wording legal wants reviewed? | Client | Day 10 |
