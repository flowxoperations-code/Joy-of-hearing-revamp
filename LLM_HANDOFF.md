# LLM Handoff Brief — Joy of Hearing Revamp

**Purpose:** Single entry point for the LLM that will build this site. Everything you absolutely must know is on this page; everything else is one click away.
**Last updated:** 2026-05-07

---

## Mission (5 lines)

Build a fast, trust-building lead-generation website for **Joy of Hearing**, a multi-branch hearing-care clinic in Punjab, India. Replace the current site at `joyofhearing.net`. Stack is **Astro static → Hostinger shared hosting**. English only. No CMS — content lives in the repo. The non-negotiable: **first-paint speed**.

## Hard constraints (do not violate)

> LLM must:

- **Performance:** mobile p75 **LCP ≤ 2.0s**, **INP ≤ 200ms**, **CLS ≤ 0.05**, **FCP ≤ 1.2s**, **TTFB ≤ 0.6s**, Lighthouse mobile perf **≥ 95**.
- **Asset budget per page:** total weight ≤ 500 KB on first paint, hero image ≤ 120 KB AVIF, total JS ≤ 30 KB gzipped, total CSS ≤ 30 KB gzipped, fonts: 0 KB (system stack) — see [PERFORMANCE_BUDGET.md](./PERFORMANCE_BUDGET.md).
- **Stack:** Astro 4.x with `output: 'static'`, TypeScript, Tailwind CSS, vanilla JS islands only. **No React. No Vue. No Svelte runtime in v1.** No jQuery. No carousel libraries. No client-side animation libraries. No chat widgets.
- **Hosting:** Hostinger shared (LiteSpeed). The build is `npm run build` → `dist/` → upload to `public_html/`.
- **Forms:** Web3Forms only. No Node backend. WhatsApp deep link as the success-path side effect.
- **Pages in v1:** Home, About Us, Services (index + 6 service detail pages), Branches (index + per-branch pages), Contact, 404. Blog is a placeholder page in v1 (no posts).
- **Languages:** English only.
- **Accessibility:** WCAG 2.1 AA. axe-core: 0 violations on every page.
- **SEO:** every page has unique `<title>` and `meta description`; JSON-LD must validate against schema.org.

> LLM must not:

- Add pages, features, or dependencies not listed here without flagging the deviation in the PR description.
- Use inline `<script>` blocks (CSP forbids them).
- Lazy-load the hero image, main heading, or primary CTA.
- Block render with custom web fonts. Default to a system font stack.
- Ship untyped content (every collection entry must conform to the Zod schema in [ARCHITECTURE.md](./ARCHITECTURE.md#content-model)).
- Auto-play any video or audio.
- Add a cookie banner unless GA4 is enabled, and even then keep it ≤ 2 KB and never block render.
- Push secrets (Web3Forms access key, GA4 measurement ID) into the repo. Use environment variables.

## Order of operations

Follow [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md). Day-by-day summary:

1. **Day 1** — Scaffold Astro+Tailwind+TS, design tokens, contact config, content-collection Zod schemas. Send the client checklist (see [CONTENT_PLAN.md](./CONTENT_PLAN.md#client-content-checklist)).
2. **Day 2–3** — Scrape current site per [CONTENT_PLAN.md](./CONTENT_PLAN.md#scrape-directives), populate collections, draft copy, optimize images.
3. **Day 4–6** — Build pages in this order: Home → Services index → Service detail template → Branches index → Branch detail template → About → Contact → 404. Components in parallel.
4. **Day 7** — Schema.org JSON-LD, SEO meta, sitemap, robots, 301 redirect map.
5. **Day 8** — Web3Forms wiring, GA4 (deferred), sticky mobile CTA bar, accessibility pass.
6. **Day 9** — Perf pass: image audit, Lighthouse CI green, WebPageTest verification from Mumbai.
7. **Day 10** — UAT with client, content corrections.
8. **Day 11** — Hostinger setup, deploy to staging subdomain, lower DNS TTL.
9. **Day 12** — DNS cutover, post-launch smoke, Search Console + GA4 confirmation, handoff.

## Pointer index — where to look when you need a specific thing

| Need | Where |
|---|---|
| Personas, journeys, requirements list | [PRD.md](./PRD.md) |
| Repo layout, content schemas, deploy pipeline, `.htaccess` | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Color tokens, components, page wireframes | [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) |
| What to scrape, what to ask client for, page H1s | [CONTENT_PLAN.md](./CONTENT_PLAN.md) |
| Title/meta templates, JSON-LD blocks, redirects | [SEO_PLAN.md](./SEO_PLAN.md) |
| Optimization checklist, anti-patterns | [PERFORMANCE_BUDGET.md](./PERFORMANCE_BUDGET.md) |
| Test cases, device matrix, UAT, pre-launch | [TESTING_PLAN.md](./TESTING_PLAN.md) |
| KPIs, GA4 events, hypotheses | [EVALUATION_PLAN.md](./EVALUATION_PLAN.md) |
| Daily plan + DoD | [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) |

## Definition of done

The build is "done" only when **all** of these are true:

- [ ] All 6 page types render with content from collections.
- [ ] Lighthouse mobile perf ≥ 95 on Home, a Service detail page, a Branch detail page (CI gate enforces).
- [ ] axe-core reports 0 violations across all routes.
- [ ] Every page has unique `<title>` and `meta description`.
- [ ] JSON-LD validates on `validator.schema.org` for `MedicalClinic`, `MedicalBusiness`, `FAQPage`, `Person`, `BreadcrumbList`, and `Review` where applicable.
- [ ] All `tel:` and `wa.me` links open the correct app on iOS and Android (manual test).
- [ ] Appointment form: happy path success + missing-field validation + `mailto:` fallback all verified.
- [ ] 301 redirect map from old `.php` URLs to new clean URLs is live (`.htaccess` shipped).
- [ ] Sitemap and robots.txt accessible and parse cleanly.
- [ ] GA4 events firing (verified via DebugView): `cta_click`, `form_submit`, `branch_select`, `service_view`, `web_vitals`.
- [ ] DNS cutover complete, SSL active, HSTS header set after 24h soak.
- [ ] Search Console verified, new sitemap submitted.

## Anti-instruction footer

If you find yourself wanting to add a feature, library, page, or animation that is not in this doc set: **stop**. Open a question to the user (or in the PR description) before doing it. Scope creep is the #1 risk to the speed budget and the 10–12 day timeline.
