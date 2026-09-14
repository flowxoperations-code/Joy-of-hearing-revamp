# Testing Plan — Joy of Hearing Revamp

**Purpose:** Define what we test, how we test it, on what devices, with what tools, and what blocks launch. The build-LLM uses this to know what "tested" means; the project owner uses it to verify before cutover.
**Last updated:** 2026-05-07

---

## 1. Test types and where they live

| Type | Where | Gate? |
|---|---|---|
| Type checking | `npm run typecheck` (CI) | Yes |
| Lint | `npm run lint` (CI) | Yes |
| Build smoke | `npm run build` (CI) | Yes |
| Unit / component | None in v1 (no logic complex enough to warrant) | n/a |
| End-to-end smoke | Manual + Lighthouse CI URLs covers it | n/a |
| Accessibility (automated) | `@axe-core/cli` against `dist/` (CI) | Yes — 0 violations |
| Accessibility (manual) | Keyboard, VoiceOver, NVDA per matrix below | Yes |
| Performance (lab) | Lighthouse CI on 3 routes | Yes — perf ≥ 95 |
| Performance (field, p75) | CrUX + GA4 web-vitals post-launch | Monitor only |
| Link checking | `linkinator` against `dist/` (CI) | Yes — 0 broken |
| Schema validation | `validator.schema.org` per page (manual) | Yes |
| Cross-browser / device | Manual on the matrix in §3 | Yes — happy path on all |
| Form submission | Manual + Web3Forms test endpoint | Yes |
| SEO smoke | Sitemap parses, robots, titles unique (script in `scripts/seo-check.mjs`) | Yes |
| UAT | Manual with client (Day 10) | Yes |
| Pre-launch | Checklist in §10 | Yes |

## 2. Automated test stack

### 2.1 Lighthouse CI

Already specified in [ARCHITECTURE.md §12](./ARCHITECTURE.md#12-build--deploy-pipeline). Three routes: `/`, `/services/pediatric-audiology`, `/branches/jalandhar`.

### 2.2 axe-core

```bash
npx @axe-core/cli http://localhost:4321/ \
  http://localhost:4321/about \
  http://localhost:4321/services \
  http://localhost:4321/services/hearing-assessment \
  http://localhost:4321/branches \
  http://localhost:4321/branches/jalandhar \
  http://localhost:4321/contact \
  http://localhost:4321/404 \
  --exit
```

> LLM must: run this in CI and fail on any violation. Address violations rather than suppressing them.

### 2.3 linkinator (broken link check)

```bash
npx linkinator dist --recurse --skip "wa.me|tel:|mailto:"
```

Skip `wa.me` and `tel:` (those are not HTTP). Resolve any 4xx/5xx hits.

### 2.4 SEO smoke script

`scripts/seo-check.mjs` (LLM implements). Walks `dist/`, parses each `index.html`, asserts:

- Unique `<title>` across all pages.
- Unique `<meta name="description">`.
- Exactly one `<h1>` per page.
- A canonical link tag exists and equals the page URL.
- A JSON-LD block exists where required (Home, services, branches).

## 3. Manual test matrix

### 3.1 Devices

| Device | Why it's in the matrix |
|---|---|
| iPhone SE (smallest current iPhone, 320–375 width) | Catches sticky-bar overflow; smallest viewport |
| iPhone 14 (375–390) | Common iOS Safari |
| Pixel 6 (393) | Common Android Chrome |
| Moto G Power (low-end Android) | Performance reality check; matches WebPageTest profile |
| iPad (768) | md-breakpoint behavior |
| Desktop 1366×768 | Most common desktop |
| Desktop 1920×1080 | Full hero treatment |

### 3.2 Browsers

| Browser | Versions |
|---|---|
| Chrome (desktop) | last 2 |
| Safari (desktop) | last 2 |
| Firefox (desktop) | last 2 |
| Edge (desktop) | last 2 |
| Chrome (Android) | last 2 |
| Safari (iOS) | last 2 |

If a real device isn't on hand, BrowserStack / equivalent. Document any tester substitutes used.

## 4. Functional test cases

> LLM must: create a `TESTING_RESULTS.md` next to this file when running UAT, with a row per test case marked Pass/Fail/Notes.

| ID | Page | Step | Expected |
|---|---|---|---|
| TC-001 | Any | Open page on a 320px viewport | No horizontal scroll. Sticky bar visible. |
| TC-002 | Any (mobile) | Tap the menu icon | Drawer opens, focus moves into drawer, `Esc` closes, focus returns to button. |
| TC-003 | Any (mobile) | Sticky bar — tap **Call** | Native dialer opens with the configured number prefilled. |
| TC-004 | Any (mobile) | Sticky bar — tap **WhatsApp** | WhatsApp opens with the configured number and prefilled greeting. |
| TC-005 | Any (mobile) | Sticky bar — tap **Book** | Navigates to `/contact`. |
| TC-006 | Home | Hero CTA "Book Appointment" | Navigates to `/contact`. |
| TC-007 | Home | Hero CTA "Call Now" | Native dialer opens. |
| TC-008 | Home | Tab through with a keyboard from the top | Skip-to-content link is the first focusable. Focus order matches visual order. All interactive elements are reachable. |
| TC-009 | Home | Inspect DOM | Exactly one `<h1>`. Heading levels do not skip. |
| TC-010 | Home | Inspect Network | Hero image preloaded; total transfer ≤ 500 KB. |
| TC-011 | Services index | Click each ServiceTile | Navigates to the right detail page. |
| TC-012 | Service detail | Open FAQ | `<details>` toggles open/closed without JS errors. |
| TC-013 | Service detail | Inspect JSON-LD | Validates on schema.org. `MedicalProcedure`/`MedicalTest`/`MedicalTherapy` present per the table in [CONTENT_PLAN.md §2.4](./CONTENT_PLAN.md#24-service-detail-template-servicesslug). |
| TC-014 | Branches index | Type a city in the filter | Cards filter correctly. Empty state shows "No branches match." |
| TC-015 | Branch detail | Tap "Call this branch" | Native dialer opens with **branch-specific** number. |
| TC-016 | Branch detail | Open Google Map | Iframe loads only after scroll into view (lazy). |
| TC-017 | Branch detail | Inspect JSON-LD | `MedicalBusiness` validates with full address + geo + hours. |
| TC-018 | Contact | Submit form with all fields valid | Posts to Web3Forms. Success page shows confirmation + WhatsApp deep link. GA4 fires `form_submit` with `status=success`. |
| TC-019 | Contact | Submit with empty Name | Browser-native + custom validation prevents submit; error message visible. |
| TC-020 | Contact | Submit with invalid Phone | Error: "Please enter a valid 10-digit phone number." |
| TC-021 | Contact | Mock Web3Forms 500 (block in DevTools) | Error UI shown with `mailto:` fallback. GA4 fires `form_submit` with `status=error`. |
| TC-022 | 404 | Visit a non-existent URL | 404 page renders with three links. |
| TC-023 | Any | View source | No inline `<script>` blocks (only Astro hydration). |
| TC-024 | Any | View `/.htaccess` (via Hostinger panel) | Long-cache headers + redirects in place. |
| TC-025 | Old URL | Visit `https://www.joyofhearing.net/about-us.php` post-cutover | 301 redirect to `/about`. |
| TC-026 | Any | Inspect cookies on first request | Zero first-party cookies until GA4 fires post-load. |
| TC-027 | Any | Run axe-core | 0 violations. |
| TC-028 | Any | Run Lighthouse mobile | Perf ≥ 95, A11y ≥ 95, BP ≥ 95, SEO ≥ 95. |
| TC-029 | Sitemap | Visit `/sitemap-index.xml` | XML parses cleanly, every page listed except 404 and `/blog`. |
| TC-030 | Robots | Visit `/robots.txt` | 200 OK, allows crawl, sitemap line present. |
| TC-031 | Mobile | Toggle `prefers-reduced-motion: reduce` | All non-essential transitions disabled. |
| TC-032 | Any | DNS check from two regions post-cutover | Resolves to Hostinger IP. |
| TC-033 | Any (HTTP) | Hit `http://www.joyofhearing.net/` | 301 to `https://...`. |
| TC-034 | Any | Test SSL with `curl -vI` | Valid certificate, no mixed content. |

## 5. Accessibility test detail

### 5.1 Keyboard-only run-through

1. Tab from the address bar.
2. Skip link → main content.
3. Through the nav, hero CTAs, every visible link/button to the footer.
4. `Esc` closes any open menu/modal.
5. Form: tab through fields, submit with `Enter`.

Pass condition: every interactive element is reachable, every focus state is visible (≥ 2px ring contrasting with the background).

### 5.2 Screen reader spot-checks

- **iOS VoiceOver:** Home, a service detail, the form. Listen to landmark navigation (`H1`, navigation, main, contentinfo).
- **NVDA on Windows:** repeat on Chrome and Edge.

Pass condition: every interactive element is announced with role + accessible name. Form errors are announced when triggered.

### 5.3 Color & contrast

- Run axe-core (already in CI). Manual check with a contrast-checker on tokens in [DESIGN_SYSTEM.md §1](./DESIGN_SYSTEM.md#1-color-tokens).
- Verify no information conveyed by color alone (error states need an icon AND red).

## 6. Performance verification — manual

In addition to Lighthouse CI:

- **WebPageTest:** profile **"Moto G Power, 4G Slow, Mumbai"**, 3 runs each on `/`, a service, a branch. Capture filmstrip; LCP candidate must be the hero image, not a lazy element.
- **Bundle inspection:** after build, list the largest 10 files in `dist/_astro/`. Anything unexpected (>100 KB) gets investigated before deploy.

## 7. UAT script (Day 10, with client, ~30 minutes)

> The client opens the staging URL on their personal phone over mobile data, not Wi-Fi.

1. **First-paint feel.** Open `/`. Stop talking for 3 seconds. The client should comment positively on speed unprompted.
2. **Doctor check.** Scroll to the doctor section. Confirm name, qualifications, photo are correct.
3. **Branch correctness.** Walk through each branch. Confirm address, phone, hours, GMB link.
4. **Testimonials.** Confirm they are the approved ones with permission.
5. **WhatsApp tap.** Tap the sticky-bar WhatsApp from a branch page. Confirm the prefilled message names that branch.
6. **Form submit.** Submit a real test inquiry. Confirm the email arrives at the clinic inbox.
7. **Search a page on Google (post-launch only).** Search `joy of hearing pathankot` and confirm the new branch page is what shows.
8. **Anything that surprises them.** Capture in `TESTING_RESULTS.md` with a row per item.

## 8. Mobile-only tests (the highest-stakes path)

These get one extra pass because mobile is where the project lives or dies.

- Slow 4G throttling in DevTools → `/` loads usable in ≤ 3s.
- iPhone SE (320 width) → no overflow on any page.
- Hand-held drag from off-screen → no jank or layout shift.
- Form input focus → does not zoom (input font ≥ 16px to prevent iOS zoom-on-focus).
- WhatsApp prefilled message → wraps cleanly in WhatsApp's preview.

## 9. Negative tests (must work safely under failure)

| Scenario | Expected |
|---|---|
| Web3Forms is down | Form falls back to a `mailto:` with prefilled body. |
| GA4 is blocked by an ad blocker | Site renders normally; no JS errors. |
| User has JS disabled | All content readable. Mobile menu uses a checkbox-toggle CSS pattern as a graceful degradation (open question: confirm during DESIGN_SYSTEM build whether to invest in this; for v1, JS-disabled is a low-volume but not zero edge). |
| Map iframe blocked | Below the iframe, a fallback "Open in Google Maps" link still works. |
| Image format unsupported | Astro `<Picture>` provides JPEG fallback. |

## 10. Pre-launch checklist (Day 12, before flipping DNS)

- [ ] CI is green on `main`.
- [ ] Lighthouse mobile perf ≥ 95 on Home, a service, a branch.
- [ ] axe-core 0 violations on all routes.
- [ ] linkinator 0 broken links.
- [ ] All 7 branches have correct phone + address + GMB link verified by client.
- [ ] Doctor section has real name, real photo, real bio.
- [ ] All testimonials have a `consent: true` flag (the schema enforces this; no slipping a `false` past it).
- [ ] Web3Forms key configured in environment, test submission received in clinic inbox.
- [ ] GA4 measurement ID configured, DebugView shows `cta_click` and `form_submit` events firing.
- [ ] `.htaccess` deployed with redirects + cache headers.
- [ ] Sitemap and robots accessible at expected URLs.
- [ ] TLS cert active for both `apex` and `www`.
- [ ] DNS TTL is at 300s for ≥ 24h prior.
- [ ] Old site backup taken (file dump from current AWS host).
- [ ] Rollback plan written (revert DNS TTL change → revert A record).
- [ ] Search Console property created and verified for new URL.
- [ ] Client signed off on UAT.

## 11. Post-launch monitoring (week 1)

- Daily check Search Console Coverage report → triage any 404s into the redirect map.
- Daily check GA4 → events firing, no zero-traffic anomalies.
- Daily quick Lighthouse run on `/` from a phone to spot regressions.
- Day +1: enable HSTS in `.htaccess` after 24h clean SSL.
- Day +7: switch to weekly cadence.
