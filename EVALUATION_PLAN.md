# Evaluation Plan — Joy of Hearing Revamp

**Purpose:** Define what success means after launch, what we measure, how we measure it, when we review, and what triggers iteration. The build-LLM instruments to this spec; the project owner uses it to report outcomes to the client.
**Last updated:** 2026-05-07

---

## 1. Why this matters

A pretty redesign is not a successful redesign. The proposal sold the client on **more inquiries, faster site, better trust** — this doc is how we prove (or disprove) we delivered that.

## 2. Hypotheses

| ID | Hypothesis | Falsifiable as |
|---|---|---|
| H1 | The redesign reduces mobile bounce rate by ≥ 20% (relative). | Mobile bounce rate p7d after launch vs. baseline. Fail if reduction < 10% after 30 days. |
| H2 | Visible WhatsApp + Call CTAs increase weekly inquiries (form + call + WA clicks) by ≥ 30% vs. baseline. | Sum of `cta_click` + `form_submit` events / week vs. baseline. |
| H3 | Branch landing pages improve local-pack visibility within 60 days. | Search Console queries containing a branch city + impressions on the branch page. |
| H4 | Mobile p75 LCP drops from baseline (est. 4–6s) to ≤ 2.0s. | CrUX p75 LCP after 28 days of traffic. |
| H5 | The first-paint subjective experience is dramatically better. | Soft signal — the client comments unprompted at UAT (TC-UAT-1). |

## 3. Baseline measurement (capture before cutover)

> LLM must: capture these into `BASELINE.md` next to the docs **on Day 0 of the roadmap** so we have a frozen comparison snapshot.

| Metric | Source | Notes |
|---|---|---|
| Weekly inquiries (estimate) | Client recall + (if possible) historical email count | Soft baseline; the current site has no analytics linked to inquiries. |
| Mobile p75 LCP | WebPageTest from Mumbai, Slow 4G, current site, 3 runs | Required. |
| Mobile p75 FCP / TTFB | WebPageTest | Required. |
| Mobile bounce rate (current site) | If GA exists on current site, pull last 30 days; otherwise note "no analytics — assumed 70%+" | Capture whatever exists. |
| Top 10 pages by traffic (current site) | If GA exists | For the redirect map's priority. |
| GMB profile state per branch | GMB insights for last 30 days | "Searches", "Direction requests", "Calls". Required for H3. |
| Search Console impressions / clicks (current site) | If verified | For H3 baseline. |

## 4. Primary KPIs

These are the numbers we report monthly.

| KPI | Target | Measurement | Cadence |
|---|---|---|---|
| Weekly inquiries (form + call + WA) | +30% in 60 days | GA4 events `form_submit` (success) + `cta_click` (type ∈ {call, wa}) | Weekly |
| Mobile bounce rate | ≤ 55% | GA4 | Weekly |
| Mobile p75 LCP | ≤ 2.0s | CrUX (when available) + GA4 `web_vitals` event | Weekly (lab) / monthly (field) |
| Organic clicks (Search Console) | +25% in 60 days | GSC | Weekly |

## 5. Instrumentation — GA4 events

> LLM must: implement these events with these exact names and parameters. The evaluation reports depend on them.

### 5.1 `cta_click`

Fired when a user taps any visible Call, WhatsApp, or Book CTA.

| Param | Type | Values |
|---|---|---|
| `cta_type` | string | `call` \| `wa` \| `book` |
| `cta_location` | string | `hero` \| `sticky_bar` \| `service_detail` \| `branch_detail` \| `final_band` \| `footer` \| `header` |
| `branch_slug` | string (optional) | branch slug if context-bound |
| `service_slug` | string (optional) | service slug if context-bound |

### 5.2 `form_submit`

Fired on the `/contact` form submission attempt, both success and failure.

| Param | Type | Values |
|---|---|---|
| `form_name` | string | `appointment` |
| `status` | string | `success` \| `error` |
| `branch_slug` | string | the selected branch |
| `error_code` | string (optional) | only on `error` (e.g., `web3forms_5xx`, `validation_failed`) |

### 5.3 `branch_select`

Fired when a user clicks a BranchCard or selects a branch in the form.

| Param | Type |
|---|---|
| `branch_slug` | string |
| `source` | string — `branches_index` \| `home_teaser` \| `service_detail` \| `form_select` |

### 5.4 `service_view`

Fired on Service detail pageview (sent **once** per session per service).

| Param | Type |
|---|---|
| `service_slug` | string |

### 5.5 `web_vitals`

Fired by a tiny inline web-vitals listener (≤ 2 KB; LLM may use the `web-vitals` library v4 dynamically imported with `client:idle` *only* on the BaseLayout — count the bytes against the per-page JS budget).

| Param | Type |
|---|---|
| `metric` | string — `LCP` \| `INP` \| `CLS` \| `FCP` \| `TTFB` |
| `value` | number — milliseconds for time metrics, unitless for CLS |
| `rating` | string — `good` \| `needs-improvement` \| `poor` |
| `navigation_type` | string — from `PerformanceNavigationTiming` |

### 5.6 GA4 setup notes

- IP anonymization is on by default in GA4. Do not enable any extra demographic or remarketing toggles.
- Connect GA4 to Search Console (Admin → Product links → Search Console links) post-launch.
- Mark `form_submit` (status=success) as a **conversion** in GA4.
- Mark `cta_click` (type=call or type=wa) as a conversion.

## 6. Secondary KPIs

Tracked but not reported monthly to the client; useful for diagnosing primary movement.

| KPI | Target | Why |
|---|---|---|
| Pages per session (mobile) | ≥ 2.0 | Tells us if the journeys are working. |
| Avg session duration (mobile) | ≥ 60s | Engagement signal. |
| Branches index → Branch detail click rate | ≥ 25% | Proves the branches index isn't a dead-end. |
| Service detail WhatsApp click rate | ≥ 8% of service-detail sessions | Direct conversion signal. |
| FAQ accordion open rate | ≥ 20% on Service detail | Tells us whether content depth is being used. |
| GMB "calls" per branch | +15% in 60 days | Measures local-SEO halo from new branch pages. |

## 7. Reporting cadence

| Frequency | Audience | Contents |
|---|---|---|
| Daily (week 1 only) | Internal | Smoke check: events firing? Search Console errors? Coverage drops? |
| Weekly (weeks 2–8) | Internal | KPI snapshot, anomaly flags. |
| Monthly | Client (and internal) | All primary KPIs vs. target, key learnings, recommendations. |
| Day +60 | Client | Hypothesis verdict (H1–H4). Recommendations for v1.1 / v2. |

Use a simple GA4 Explore + a one-page email summary for the monthly. No dashboard tool dependency in v1.

## 8. Decision rules — when to iterate, when to leave it alone

| Trigger | Action |
|---|---|
| Lab Lighthouse perf < 95 on `main` | Block deploy. Fix before merge. |
| Field LCP p75 > 2.5s for 7 consecutive days | Image audit + TTFB check. Roll back the offending change if traceable. |
| Mobile bounce > 70% for 14 consecutive days | A/B the hero copy and primary CTA wording (see §9). |
| Form success rate < 80% | Investigate Web3Forms 5xx, network errors, validation traps. |
| Conversion drop on a specific service or branch page > 30% week-over-week | Roll back content edits to that page; investigate. |
| Rich result loss in Search Console | Re-validate JSON-LD; resubmit URL. |
| Sustained 4xx on a previously redirected URL | Add to `.htaccess` redirect map. |

## 9. A/B test backlog (post-launch, not v1)

Run only one at a time. Use GA4 audiences + a single boolean URL param (`?v=b`) gated by a tiny inline script — **no SDK**.

1. **Hero H1 variant.** "Hear better. Live fuller." vs. "Trusted hearing care across Punjab."
2. **Primary CTA wording.** "Book Appointment" vs. "Get a Hearing Test" vs. "Talk to an Audiologist".
3. **Sticky bar order.** Call/WA/Book vs. WA/Call/Book vs. WA/Book/Call. WhatsApp-first hypothesis: lower friction in this market.
4. **Service tile order.** Pediatric-first vs. Hearing-aids-first.
5. **Doctor block placement.** Above testimonials vs. below.

For each test: write a single hypothesis, define the success metric in advance (use one of the KPIs in §4 or §6), and run for at least 14 days or 1000 mobile sessions per variant.

## 10. Verdict at Day +60 (a template the report should fill)

```
Hypothesis | Result        | Evidence
-----------+---------------+--------------------------------------------------
H1         | Confirmed/...  | Mobile bounce 67% → 51% (-24% relative)
H2         | Confirmed/...  | Inquiries 6/wk → 9/wk (+50%); CTA clicks +60%
H3         | Inconclusive   | Branch impressions +18% (target +25%); 60d small
H4         | Confirmed      | Mobile p75 LCP 4.8s → 1.7s
H5         | Confirmed      | Client unprompted: "It opens immediately."
```

Anything not confirmed → recommendation in the report (next experiment, content fix, or "leave alone, keep monitoring").

## 11. What we explicitly do not measure in v1

- **Heatmaps / session recording.** Adds JS weight and a privacy footprint. Defer.
- **Funnel attribution to paid sources.** No paid traffic in v1.
- **Patient outcome metrics.** Out of scope (clinic-side data).
- **Competitor benchmarks.** Out of scope; not a useful signal for a clinic.
