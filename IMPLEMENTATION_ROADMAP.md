# Implementation Roadmap — Joy of Hearing Revamp

**Purpose:** A day-by-day plan for the 10–12 day build window, with deliverables and a definition-of-done per phase. The build-LLM uses this as its execution sequence; the project owner uses it to track risk.
**Last updated:** 2026-05-07
**Window:** 12 calendar days from kickoff to live traffic.

---

## At-a-glance Gantt

```
Day:   1   2   3   4   5   6   7   8   9   10  11  12
Phase: Set Cnt Cnt Bld Bld Bld SEO Wir Prf UAT Stg Cut
Risk:  client-content delivery (C-1..C-5) is the critical path
```

## The single biggest risk

**Client content delivery.** Every single launch I have seen that misses its date misses because the doctor's headshot or the testimonials arrived late. So:

- The client checklist (see [CONTENT_PLAN.md §4](./CONTENT_PLAN.md#4-client-content-checklist)) is sent on **Day 1**, not later.
- A daily check-in on outstanding items, even a 30-second WhatsApp ping, is more valuable than working harder on the build.
- The build proceeds with realistic placeholders so we never block on content for components that already work.

## Roles

| Role | Owns |
|---|---|
| Project owner (FlowX) | Client communications, content collection, UAT facilitation, post-launch monitoring. |
| Build-LLM / dev | All code, all schema, all performance work, deploy. |
| Client | All items in [CONTENT_PLAN.md §4](./CONTENT_PLAN.md#4-client-content-checklist), GMB updates, Hostinger access, sign-off. |

---

## Day 1 — Kickoff & scaffolding

**Deliverables**

- [ ] Repo initialized: `npm create astro@latest`, TypeScript on, Tailwind via `@astrojs/tailwind`.
- [ ] `astro.config.mjs` with `output: 'static'`, `@astrojs/sitemap`.
- [ ] Tailwind theme with tokens from [DESIGN_SYSTEM.md §1](./DESIGN_SYSTEM.md#1-color-tokens).
- [ ] `src/config/contact.ts` stub with placeholder numbers.
- [ ] `src/content/config.ts` with all four collection schemas pasted from [ARCHITECTURE.md §5](./ARCHITECTURE.md#5-content-model).
- [ ] `BaseLayout.astro` with `<SEO />` slot and a placeholder `<StickyContactBar />`.
- [ ] `.github/workflows/deploy.yml` (skeleton — not yet active).
- [ ] **Client checklist sent.** All 14 items in [CONTENT_PLAN.md §4](./CONTENT_PLAN.md#4-client-content-checklist), with explicit ship-blocking flags and "needed by" dates.
- [ ] `BASELINE.md` started — capture current site Lighthouse + WebPageTest results before any work invalidates them.

**DoD:** `npm run dev` shows a tokenized homepage shell at `http://localhost:4321`.

---

## Day 2–3 — Content acquisition & population

**Deliverables**

- [ ] Scrape current site per [CONTENT_PLAN.md §3](./CONTENT_PLAN.md#3-scrape-directives--extract-from-joyofhearingnet). Save raw extracts to a private `notes/` folder.
- [ ] `src/content/services/*.md` populated with draft body for all 6 services. Bodies use the structure from [CONTENT_PLAN.md §2.4](./CONTENT_PLAN.md#24-service-detail-template-servicesslug).
- [ ] `src/content/branches/*.md` with verified address from client (or scrape, marked `verified: false`). Once client returns C-5, switch to `verified: true`.
- [ ] `src/content/testimonials/*.md` — only the ones with `consent: true`. Anything else stays out of `src/`.
- [ ] `src/content/faqs/*.json` — 5–7 cross-cutting + 3–5 per-service.
- [ ] Source images dropped into `src/assets/images/`. Hero images preprocessed (≤ 120 KB AVIF, 1280w).
- [ ] First copy review with project owner.

**DoD:** Content collections type-check cleanly. Building `npm run build` succeeds with placeholder pages still.

---

## Day 4–6 — Build the pages

Order — Home first because it dominates the hypothesis (H5: first-paint feel), then the wide service template, then branches, then small pages.

### Day 4 — Home + components

- [ ] Header / nav + MobileNav (drawer).
- [ ] Hero, Button, Card, ServiceTile.
- [ ] StickyContactBar (mobile-only, with IO observer to hide on primary CTA visibility).
- [ ] Doctor block.
- [ ] TestimonialCard (no carousel; static grid).
- [ ] Footer.
- [ ] `/` page assembled from these per [DESIGN_SYSTEM.md §5.1](./DESIGN_SYSTEM.md#51-home-).
- [ ] Run Lighthouse mobile on `/` — must be ≥ 95.

**DoD:** Home looks correct on iPhone SE (DevTools), passes initial Lighthouse run.

### Day 5 — Services (index + detail) + Branches (index)

- [ ] `/services` page.
- [ ] `/services/[slug].astro` template with all six pages rendering.
- [ ] FAQItem (`<details>`) tested.
- [ ] BranchCard.
- [ ] `/branches` page with text-input filter (vanilla JS, ≤ 1 KB).

**DoD:** Six service pages render. Branches index renders 7 cards.

### Day 6 — Branch detail + About + Contact + 404

- [ ] `/branches/[slug].astro` template with embedded lazy `<iframe>` map.
- [ ] `/about` page.
- [ ] `/contact` page with the form (no Web3Forms wiring yet; static markup).
- [ ] `/404` page.
- [ ] `/blog` placeholder.
- [ ] `/privacy`, `/terms`, `/disclaimer` from outlines in [CONTENT_PLAN.md §7](./CONTENT_PLAN.md#7-legal-page-outlines).

**DoD:** Every page in [CONTENT_PLAN.md §1](./CONTENT_PLAN.md#1-sitemap) renders. `linkinator dist` passes.

---

## Day 7 — SEO, schema, redirects

**Deliverables**

- [ ] `<SEO />` and `<JsonLd />` components implementing the templates in [SEO_PLAN.md §2.1, §2.2, §3](./SEO_PLAN.md#2-on-page-rules).
- [ ] `MedicalClinic` JSON-LD on Home; `MedicalBusiness` on every branch; `Person` on About; `BreadcrumbList` on every interior; `FAQPage` where applicable.
- [ ] `@astrojs/sitemap` configured with the right exclude list.
- [ ] `public/robots.txt`.
- [ ] `.htaccess` skeleton dropped into `public/` from [ARCHITECTURE.md §10](./ARCHITECTURE.md#10-caching-headers-and-htaccess).
- [ ] 301 redirect map populated based on actual scraped URLs from Day 2.
- [ ] SEO smoke script (`scripts/seo-check.mjs`) implemented and passing in CI.

**DoD:** Every page validates on https://validator.schema.org/. SEO smoke script green.

---

## Day 8 — Forms, analytics, sticky bar, accessibility pass

**Deliverables**

- [ ] Web3Forms wired with `PUBLIC_WEB3FORMS_KEY` from env. Honeypot field present. Success/error states implemented per [ARCHITECTURE.md §7](./ARCHITECTURE.md#7-forms--web3forms).
- [ ] On success, the WhatsApp deep link is generated from form fields.
- [ ] Failure fallback: `mailto:` with prefilled body.
- [ ] GA4 wired with `PUBLIC_GA4_ID`, deferred load. All five events from [EVALUATION_PLAN.md §5](./EVALUATION_PLAN.md#5-instrumentation--ga4-events) firing.
- [ ] `web-vitals` import via `client:idle`, byte budget verified.
- [ ] StickyContactBar IO observer fully working — hides when primary CTA is in viewport.
- [ ] Full axe-core run; resolve every violation.
- [ ] Manual keyboard-only run-through per [TESTING_PLAN.md §5.1](./TESTING_PLAN.md#51-keyboard-only-run-through).
- [ ] iOS VoiceOver spot-check on Home + a service + the form.

**DoD:** axe-core 0 violations. GA4 DebugView shows all 5 event names. Form submit sends a real test inquiry to a temp inbox.

---

## Day 9 — Performance pass

**Deliverables**

- [ ] Image audit: every image ≤ its budget, every below-fold image lazy, every above-fold image preloaded.
- [ ] CSS audit: purged Tailwind, ≤ 30 KB gzipped per route.
- [ ] JS audit: ≤ 30 KB gzipped per route. Verify no `client:load`.
- [ ] Lighthouse CI green on three routes with thresholds in `lighthouserc.json`.
- [ ] WebPageTest run from Mumbai, Slow 4G, Moto G Power on Home + a service + a branch. Filmstrip captured. LCP candidate is the hero image, not a lazy element.
- [ ] CLS verified at 0 on every page.
- [ ] Per-page perf checklist from [PERFORMANCE_BUDGET.md §6](./PERFORMANCE_BUDGET.md#6-per-page-perf-checklist-used-during-build) ticked.

**DoD:** All Core Web Vitals targets met in lab. PR description has WebPageTest filmstrip evidence.

---

## Day 10 — UAT with client

**Deliverables**

- [ ] Staging deploy is live (subdomain on Hostinger, e.g., `staging.joyofhearing.net` or temporary Hostinger preview URL).
- [ ] Run [TESTING_PLAN.md §7 UAT script](./TESTING_PLAN.md#7-uat-script-day-10-with-client-30-minutes) with the client on their phone, on mobile data.
- [ ] Capture every comment in `TESTING_RESULTS.md`.
- [ ] Triage corrections into "must fix today" vs. "post-launch v1.1".
- [ ] Apply must-fix corrections same day.
- [ ] Client sign-off.

**DoD:** Written client sign-off (WhatsApp message screenshot saved, or email).

---

## Day 11 — Hostinger setup + DNS pre-cutover

**Deliverables**

- [ ] Hostinger plan provisioned. SSH/SFTP credentials stored in GitHub Secrets.
- [ ] CI deploy pipeline activated (was skeleton on Day 1). First production deploy to Hostinger `public_html/` succeeds via `lftp`.
- [ ] AutoSSL active for the staging subdomain (or provisional Hostinger hostname).
- [ ] **DNS TTL lowered** at GoDaddy to 300s for both `apex` and `www`. Wait at least the previous TTL value before next steps.
- [ ] Final Lighthouse CI run on the production-like Hostinger URL (using its temporary hostname or staging subdomain).
- [ ] Old site backup taken (full file dump from current AWS host) and stored offline.
- [ ] Rollback plan written: "revert A record at GoDaddy → wait TTL → done."

**DoD:** Site renders correctly from Hostinger. Old AWS host backup is in cold storage.

---

## Day 12 — Cutover + post-launch verification

**Schedule the cutover for early in a working day** (e.g., 10:00 IST), so the team is awake to fix anything for the next 8 hours.

**Deliverables**

- [ ] Repoint apex `A` record at GoDaddy to Hostinger's IP. Repoint `www` `CNAME`. Save the previous values for rollback.
- [ ] Wait for propagation. Verify with `dig +trace joyofhearing.net` from at least two regions and from a third-party tool (e.g., `dnschecker.org`).
- [ ] On Hostinger, run AutoSSL for the apex + `www`.
- [ ] Verify `https://www.joyofhearing.net/` and `https://joyofhearing.net/` both serve the new site with valid SSL.
- [ ] Run [TESTING_PLAN.md §10 pre-launch checklist](./TESTING_PLAN.md#10-pre-launch-checklist-day-12-before-flipping-dns) end-to-end on production.
- [ ] Submit `sitemap-index.xml` to Search Console.
- [ ] Confirm GA4 sees production traffic in DebugView and Realtime.
- [ ] Spot-check 10 old `.php` URLs and confirm they 301 to the right new URL.
- [ ] Update each branch's GMB website URL to the new branch detail page.
- [ ] Notify the client: launch is live, here's the URL, here's the next-30-day monitoring plan.
- [ ] Schedule HSTS enable for **Day 13** (24h after clean SSL).

**DoD:** Production live, monitored, signed off.

---

## Day 13–14 buffer (if 12-day path slips)

If client content arrives late or UAT surfaces non-trivial corrections, day-by-day fall-back:

- Day 13: hold cutover; finish content corrections; re-run UAT light.
- Day 14: cutover.

If we still slip past Day 14, escalate to project owner — almost certainly a content problem; pulling forward more dev work won't help.

## Post-launch (covered in detail in [EVALUATION_PLAN.md §7](./EVALUATION_PLAN.md#7-reporting-cadence))

- **Day +1:** enable HSTS; verify 24h SSL clean; daily Search Console + GA4 checks for 7 days.
- **Day +7 to Day +30:** weekly KPI snapshot; triage any 404s into the redirect map.
- **Day +30:** first monthly KPI report to client.
- **Day +60:** hypothesis verdict per [EVALUATION_PLAN.md §10](./EVALUATION_PLAN.md#10-verdict-at-day-60-a-template-the-report-should-fill).

## Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Doctor headshot late | High | High (trust block hollow) | Send checklist Day 1; daily ping; high-quality stock placeholder approved by client as a fallback (clearly noted as temporary). |
| Testimonials lack consent | Med | Med | Default `consent: false`; schema enforces `consent: true` to ship. Reuse current site's quotes only with client written sign-off. |
| Hostinger access delayed | Med | High | Project owner provisions on the client's behalf if approved; otherwise pre-buy a personal Hostinger plan and migrate ownership at handoff. |
| GMB write access not available | Med | Low (for v1) | Send a one-page instruction to the client; the new branch URLs work regardless. |
| DNS propagation slower than expected | Low | Med | Lowered TTL on Day 11 prevents this. Worst case 1–2 hours of mixed serving — acceptable. |
| WebP/AVIF not supported by an old browser | Very low | Low | Astro `<Picture>` ships JPEG fallback. |
| LCP regression after a content edit | Med | Med | Lighthouse CI gate blocks the merge. |
| Client requests a feature mid-build (chat widget, slider) | High | High | Politely decline; reference [PERFORMANCE_BUDGET.md §4](./PERFORMANCE_BUDGET.md#4-anti-patterns--explicitly-forbidden-in-v1) anti-patterns; offer the v2 list. |

## Out of scope for this 12-day build (revisit in v1.1 / v2)

- Multilingual (Hindi/Punjabi).
- Hearing self-assessment quiz.
- Patient portal / appointment status.
- Active blog content production.
- Telehealth / video consult.
- E-commerce (selling hearing aids).
- Heatmaps / session recording.
