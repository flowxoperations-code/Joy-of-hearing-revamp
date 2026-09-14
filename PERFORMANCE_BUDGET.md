# Performance Budget — Joy of Hearing Revamp

**Purpose:** Lock the speed contract. Concrete Core Web Vitals targets, per-page asset budgets, the optimization checklist, the anti-pattern list, and how we verify. **First-paint speed is the project's #1 success criterion.**
**Last updated:** 2026-05-07

---

## 1. Core Web Vitals targets — mobile p75

Measured via CrUX once we have ≥ 28 days of data; pre-launch estimated via WebPageTest from a Mumbai location with a Moto G Power on Slow 4G.

| Metric | Target | Hard fail at |
|---|---|---|
| LCP (Largest Contentful Paint) | **≤ 2.0s** | > 2.5s |
| INP (Interaction to Next Paint) | **≤ 200ms** | > 500ms |
| CLS (Cumulative Layout Shift) | **≤ 0.05** | > 0.1 |
| FCP (First Contentful Paint) | **≤ 1.2s** | > 1.8s |
| TTFB (Time to First Byte) | **≤ 0.6s** | > 1.0s |
| TBT (Total Blocking Time, lab) | **≤ 100ms** | > 200ms |

**Lighthouse mobile (lab):**

| Category | Target |
|---|---|
| Performance | **≥ 95** |
| Accessibility | **≥ 95** |
| Best Practices | **≥ 95** |
| SEO | **≥ 95** |

These are gates in CI (`lighthouserc.json`).

## 2. Asset budgets per page

> LLM must: keep every page under these. CI fails the build if Lighthouse total weight reports otherwise on Home, a Service detail, or a Branch detail.

| Bucket | Budget (gzipped) | Notes |
|---|---|---|
| **Total page weight on first paint** | ≤ **500 KB** | Includes HTML + critical CSS + hero image + above-fold JS |
| HTML | ≤ 30 KB | Tailwind purges; Astro static is small |
| CSS | ≤ 30 KB | Inline critical, defer rest if needed |
| JS (above the fold) | ≤ 10 KB | Just the mobile menu toggle and IO observer |
| JS (total per page) | ≤ 30 KB | Including deferred GA4 init module |
| Hero image | ≤ 120 KB | AVIF, 1280w, served via `<Image>` |
| Below-fold images (each) | ≤ 80 KB | AVIF, lazy-loaded |
| Web fonts | **0 KB** | System stack only in v1 |
| 3rd-party scripts | ≤ 60 KB | GA4 only (~50 KB transferred) |
| Sum of cookies on first request | ≤ 0 KB | We set no first-party cookies until GA4 fires post-load |

## 3. The optimization checklist

> LLM must: tick every one of these before declaring DoD on perf.

### 3.1 HTML

- [ ] `<html lang="en">`, `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- [ ] `<link rel="preload" as="image" href="..." imagesrcset="..." imagesizes="..." fetchpriority="high">` for the hero image of the current page.
- [ ] `<link rel="preconnect" href="https://www.googletagmanager.com" crossorigin>` only if GA4 is enabled.
- [ ] No render-blocking inline `<script>`.
- [ ] No `<style>` blobs > 5 KB inline (split via CSS layers if needed).

### 3.2 Images

- [ ] All images use Astro `<Image>` or `<Picture>` (no raw `<img>` for processed assets).
- [ ] Hero image: `loading="eager"`, `fetchpriority="high"`, AVIF + WebP + JPEG fallback.
- [ ] Below-fold images: `loading="lazy"`, `decoding="async"`.
- [ ] Every `<img>` has explicit `width` and `height` to reserve space (CLS = 0).
- [ ] No image is more than 2× its rendered CSS size (the `srcset` keeps this honest).
- [ ] Decorative images use `alt=""`. Meaningful images use authored alt text.

### 3.3 Fonts

- [ ] System font stack is the default. No `@font-face` in v1.
- [ ] If a brand font is later added: `font-display: swap`, `<link rel="preload" as="font" type="font/woff2" crossorigin>`, single weight maximum.

### 3.4 JavaScript

- [ ] No top-level `<script>` without `defer` or `type="module"`.
- [ ] GA4 is loaded with `defer async` and the init module also uses `defer`.
- [ ] No third-party scripts beyond GA4 in v1.
- [ ] Astro components are server-rendered unless interactive — interactive ones use `client:idle` or `client:visible`, never `client:load`.
- [ ] Mobile menu and FAQ accordion use the smallest possible code (`<details>` for FAQ → 0 JS; mobile menu → ≤ 1 KB JS).

### 3.5 Network / server

- [ ] Brotli enabled (LiteSpeed default).
- [ ] HTTP/3 enabled (LiteSpeed default).
- [ ] Static assets `Cache-Control: public, max-age=31536000, immutable`.
- [ ] HTML `Cache-Control: public, max-age=0, must-revalidate`.
- [ ] HSTS header **only after** 24h clean SSL post-cutover.

### 3.6 Third-party iframes

- [ ] Google Maps iframes: `loading="lazy"` and only on Branches index + Branch detail. Never on Home.
- [ ] No YouTube embeds in v1. If a doctor video is added in v2, use a click-to-load thumbnail.

### 3.7 CLS

- [ ] Reserve space for the sticky mobile bar (`padding-bottom: 64px` on `<body>` at `< md`).
- [ ] No late-injected banners (cookie notice is a static footer line, not an overlay).
- [ ] No web-font swap shift (system stack avoids this entirely).

### 3.8 INP

- [ ] No long tasks > 50ms in the main thread on hover/click of CTAs.
- [ ] Form validation runs synchronously on `submit`, not on every `input`.

## 4. Anti-patterns — explicitly forbidden in v1

> LLM must not: introduce any of these.

- ❌ React, Vue, Svelte runtime in the bundle.
- ❌ jQuery.
- ❌ Carousel libraries (Slick, Swiper, Glide, etc.). Use static grids; if a horizontal scroll list is genuinely needed, use CSS scroll-snap.
- ❌ Animation libraries (GSAP, Framer Motion, anime.js). CSS `transition` only.
- ❌ Lottie. Use SVG illustrations or nothing.
- ❌ Web fonts loaded over the network in v1.
- ❌ Autoplay video or audio.
- ❌ Chat widget (Intercom, Tawk, etc.). The WhatsApp link is the chat.
- ❌ Cookie banner with accept/reject buttons (single-line footer disclosure is enough).
- ❌ Hero/section background videos.
- ❌ A/B test SDKs (Optimizely, VWO).
- ❌ Tag managers (GTM). GA4 is loaded directly.
- ❌ Captcha widgets on the form (Web3Forms honeypot is enough; reCAPTCHA adds 200+ KB).
- ❌ Avatar/Gravatar lookups on testimonials.
- ❌ Background image sliders.

If a future requirement seems to need one of these, the LLM should open a question rather than add it silently.

## 5. Verification methodology

### 5.1 Lab measurement (before every deploy)

- **Lighthouse CI** in GitHub Actions on Home, a Service detail, a Branch detail. Thresholds in `lighthouserc.json` (see [ARCHITECTURE.md §12](./ARCHITECTURE.md#12-build--deploy-pipeline)).
- **WebPageTest** profile: Moto G Power, 4G Slow, Mumbai test location, 3 runs, take median. Save filmstrip + waterfall to PR description.
- **Bundle audit:** after `npm run build`, run `du -sh dist` and inspect top files. Anything > 100 KB unexpected gets investigated.

### 5.2 Field measurement (post-launch)

- **CrUX** (Chrome User Experience Report): the official p75 source. Available 28 days after enough traffic.
- **GA4 Web Vitals events:** the build emits `web_vitals` events with `metric` and `value`. Set up a GA4 explore for p75 by metric.
- **Search Console Core Web Vitals report:** monitor weekly post-launch.

### 5.3 Decision rules

- If lab Lighthouse drops below 95 on `main`, **block the deploy** until fixed.
- If field LCP p75 exceeds 2.5s for 7 consecutive days, **trigger a perf audit** (start with image weight and TTFB).
- If CLS p75 exceeds 0.1, **trigger a layout audit** (check for late-injected DOM).

## 6. Per-page perf checklist (used during build)

Quick reference the LLM can run through after assembling each page.

```
[ ] viewport meta present
[ ] hero image preloaded with fetchpriority=high
[ ] no images above the fold are lazy
[ ] every img has width + height
[ ] no client:load components
[ ] no inline <script> (excluding Astro hydration nonces)
[ ] GA4 script is defer
[ ] map iframes are loading=lazy and only where allowed
[ ] CSS bundle for this route < 30 KB gzipped (lighthouse-ci will check)
[ ] JS bundle for this route < 30 KB gzipped
[ ] Lighthouse mobile perf >= 95 (lighthouse-ci will check)
[ ] Total transfer < 500 KB
```
