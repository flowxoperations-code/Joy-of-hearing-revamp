# Architecture — Joy of Hearing Revamp

**Purpose:** The technical contract. Stack, repo layout, content model, integrations, build/deploy, and host configuration. Every decision here is justified against the speed budget in [PERFORMANCE_BUDGET.md](./PERFORMANCE_BUDGET.md).
**Last updated:** 2026-05-07

---

## 1. Stack decision

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro 4.x**, `output: 'static'` | Ships 0 KB JS by default; islands only where strictly needed. Static output drops directly into Hostinger `public_html/`. |
| Language | **TypeScript** | Catches schema/content mismatches at build time. |
| Styling | **Tailwind CSS** + `@astrojs/tailwind` | Zero runtime cost; CSS purged to whatever is actually used (~15–25 KB gzipped target). |
| Icons | **lucide-static** (SVG sprite) | No JS lib, tree-shakeable to a single sprite per page. |
| Interactive bits | **Vanilla JS** in Astro `<script>` blocks | Mobile menu toggle, FAQ accordion, sticky-bar IO. No framework. |
| Forms backend | **Web3Forms** | No Node host needed; clinic gets emails directly. |
| Analytics | **Google Analytics 4** via deferred script | Loads after `DOMContentLoaded`; no blocking. |
| Image processing | **Astro `<Image>`** + sharp | AVIF/WebP/JPEG variants, responsive `srcset`, lazy below the fold. |

> LLM must not: introduce React, Vue, Svelte, jQuery, GSAP, Framer Motion, Slick, Swiper, or any other client-side library without first opening a question.

## 2. Hosting

- **Provider:** Hostinger (Premium or Business shared plan).
- **Server:** LiteSpeed Web Server with HTTP/3 and free Cloudflare-style CDN (Hostinger CDN add-on if available, but the site is fast enough without it).
- **TLS:** Hostinger AutoSSL (Let's Encrypt). Force HTTPS via `.htaccess`.
- **Deploy target:** `~/public_html/` for the apex domain; `~/public_html/staging/` for the staging copy during cutover.

## 3. Domain & DNS cutover

1. Domain stays on **GoDaddy**.
2. **Pre-cutover (Day 11):** lower DNS TTL on the existing A/CNAME records to **300s** at GoDaddy. Wait ≥ existing TTL.
3. **Cutover (Day 12):**
   - In GoDaddy, repoint the apex `A` record to Hostinger's IPv4 (from Hostinger hPanel).
   - Repoint `www` `CNAME` to the apex (or to Hostinger's hostname per their docs).
   - Confirm propagation via `dig +trace joyofhearing.net` from at least two regions.
4. **Post-cutover:** in Hostinger, run AutoSSL for both apex and `www`. Add HSTS to `.htaccess` only after **24 hours** of clean SSL (not earlier, to allow rollback without HSTS pinning).

## 4. Repo layout

```
Joy-of-hearing-revamp/
├── .github/workflows/deploy.yml         # CI/CD (lint → typecheck → build → Lighthouse → deploy)
├── public/
│   ├── images/                          # Static images served as-is (logo, OG defaults)
│   ├── robots.txt
│   └── favicon.svg
├── src/
│   ├── assets/images/                   # Source images processed by Astro <Image>
│   ├── components/
│   │   ├── Button.astro
│   │   ├── Card.astro
│   │   ├── Hero.astro
│   │   ├── ServiceTile.astro
│   │   ├── TestimonialCard.astro
│   │   ├── BranchCard.astro
│   │   ├── StickyContactBar.astro       # mobile only, IntersectionObserver
│   │   ├── MobileNav.astro              # toggle via vanilla JS
│   │   ├── FAQItem.astro                # <details>/<summary> (no JS)
│   │   ├── Footer.astro
│   │   ├── SEO.astro                    # title/description/OG/JSON-LD
│   │   └── JsonLd.astro                 # JSON-LD renderer
│   ├── config/
│   │   └── contact.ts                   # SOLE source of truth for phone, WA, email
│   ├── content/
│   │   ├── config.ts                    # Zod schemas for collections (see §5)
│   │   ├── services/                    # one .md per service
│   │   ├── branches/                    # one .md per branch
│   │   ├── testimonials/                # one .md per testimonial
│   │   └── faqs/                        # service-scoped FAQ entries
│   ├── layouts/
│   │   └── BaseLayout.astro             # html shell, meta, sticky bar, footer
│   ├── pages/
│   │   ├── index.astro                  # /
│   │   ├── about.astro                  # /about
│   │   ├── contact.astro                # /contact
│   │   ├── 404.astro
│   │   ├── services/
│   │   │   ├── index.astro              # /services
│   │   │   └── [slug].astro             # /services/<slug>
│   │   └── branches/
│   │       ├── index.astro              # /branches
│   │       └── [slug].astro             # /branches/<slug>
│   └── styles/
│       └── global.css                   # Tailwind directives + a few base styles
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── .env.example                         # PUBLIC_GA4_ID=, PUBLIC_WEB3FORMS_KEY=
```

## 5. Content model

All content lives in Astro Content Collections. The build-LLM must implement these Zod schemas verbatim in `src/content/config.ts`.

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const services = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    slug: z.string(),
    icon: z.string(),                       // lucide icon name, e.g. 'ear'
    summary: z.string().max(160),           // 1-line description for cards + meta
    heroImage: image().optional(),
    heroAlt: z.string().optional(),
    whoFor: z.array(z.string()).min(1),     // bullet list
    whatToExpect: z.array(z.string()).min(1),
    faqIds: z.array(z.string()).default([]),// references to faqs collection
    order: z.number().default(99),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

const branches = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    city: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    pincode: z.string(),
    state: z.string().default('Punjab'),
    country: z.string().default('India'),
    phone: z.string(),                      // E.164: +91...
    whatsapp: z.string().optional(),        // E.164
    hours: z.string().default('Mon–Sat, 10:00–19:00 IST'),
    geo: z.object({ lat: z.number(), lng: z.number() }),
    googleMapsPlaceId: z.string().optional(),
    googleMapsEmbedUrl: z.string().url(),
    gmbReviewUrl: z.string().url().optional(),
    order: z.number().default(99),
  }),
});

const testimonials = defineCollection({
  type: 'content',
  schema: z.object({
    firstName: z.string(),
    city: z.string().optional(),
    branchSlug: z.string().optional(),
    serviceSlug: z.string().optional(),
    quote: z.string().min(20).max(400),
    rating: z.number().min(1).max(5).default(5),
    consent: z.literal(true),               // forces a permission record
    photoCredit: z.string().optional(),
  }),
});

const faqs = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    question: z.string(),
    answer: z.string(),
  }),
});

export const collections = { services, branches, testimonials, faqs };
```

> LLM must: fail the build if any collection entry is missing a required field. Do not silently default values that are meant to be authored.

## 6. Contact configuration (single source of truth)

```ts
// src/config/contact.ts
export const contact = {
  primaryPhone: '+91XXXXXXXXXX',          // resolve from client checklist OQ-3/OQ-1
  whatsapp: '+91XXXXXXXXXX',              // E.164 without spaces
  email: 'appointments@joyofhearing.net',
  hours: 'Mon–Sat, 10:00–19:00 IST',
} as const;

export const telHref = `tel:${contact.primaryPhone}`;
export const waHref = (msg = 'Hello, I would like to book an appointment.') =>
  `https://wa.me/${contact.whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent(msg)}`;
```

> LLM must: reference `contact.ts` from every component that renders a phone or WA link. Never hardcode a number in markup.

## 7. Forms — Web3Forms

- Endpoint: `POST https://api.web3forms.com/submit` with `multipart/form-data`.
- Required fields: `access_key` (from env `PUBLIC_WEB3FORMS_KEY`), `name`, `phone`, `branch`, `preferred_date`, `message`. Optional `email`.
- Honeypot: hidden field `botcheck` per Web3Forms convention.
- Client-side submit: `fetch` with `application/json`, then redirect to `/contact?status=success` on 200, or `/contact?status=error` on non-2xx.
- Success state: render confirmation + a "Continue on WhatsApp" button using `waHref(messageWithFormSummary)`.
- Failure fallback: render a `mailto:` link with the same data prefilled.

```html
<!-- conceptual; LLM implements in Astro -->
<form id="appt" method="POST" action="https://api.web3forms.com/submit">
  <input type="hidden" name="access_key" value={import.meta.env.PUBLIC_WEB3FORMS_KEY} />
  <input type="text" name="botcheck" class="hidden" tabindex="-1" autocomplete="off" />
  <!-- visible fields here -->
</form>
```

## 8. Analytics — GA4

- Loaded **after** `DOMContentLoaded` from a small inline `<script type="module">` placed at the end of `<body>`. (Inline allowed only with a CSP nonce; alternatively use a per-page external script. **Decision: external script with `defer`** to keep the CSP simple.)
- `<script defer async src="https://www.googletagmanager.com/gtag/js?id={PUBLIC_GA4_ID}"></script>` plus a tiny init module. No GTM in v1 (extra weight).
- Event list and parameters: see [EVALUATION_PLAN.md §5](./EVALUATION_PLAN.md#5-instrumentation-ga4-events).

## 9. Image pipeline

- All hero/landscape images authored in `src/assets/images/` and rendered via Astro `<Image>` or `<Picture>`.
- Output formats: AVIF + WebP + JPEG fallback; widths 480, 768, 1280, 1920.
- `loading="lazy"` on everything below the fold; `loading="eager"` + `fetchpriority="high"` on the hero image of the current page.
- Hero source files preprocessed to **≤ 120 KB AVIF** at 1280w.
- Decorative images get `alt=""`. Meaningful images require human-authored `alt`.

## 10. Caching, headers, and `.htaccess`

Drop this `.htaccess` into `public_html/` after deploy (the build tool can copy it from `public/.htaccess`).

```apache
# Joy of Hearing — Hostinger LiteSpeed config
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set Permissions-Policy "geolocation=(), microphone=(), camera=()"
  # HSTS — enable ONLY after 24h clean SSL post-cutover
  # Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
</IfModule>

# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]

# Long-cache hashed assets (Astro fingerprints in /_astro/)
<FilesMatch "\.(?:js|css|woff2?|avif|webp|png|jpg|jpeg|gif|svg)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

# HTML: revalidate every time
<FilesMatch "\.html$">
  Header set Cache-Control "public, max-age=0, must-revalidate"
</FilesMatch>

# Pretty URLs (Astro emits /path/index.html)
DirectoryIndex index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.+)/$ /$1 [R=301,L]

# 301 redirect map (populated from SEO_PLAN.md §6)
# Redirect 301 /old-path.php /new-path
```

> LiteSpeed enables Brotli/Gzip and HTTP/3 by default on Hostinger. No extra config needed.

## 11. Security

- **CSP** (set via `<meta http-equiv>` in `BaseLayout.astro` because Hostinger doesn't always allow custom response headers reliably for HTML; keep restrictive):
  ```
  default-src 'self';
  img-src 'self' data: https://*.googleusercontent.com https://maps.gstatic.com https://maps.googleapis.com;
  script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com;
  connect-src 'self' https://www.google-analytics.com https://api.web3forms.com;
  frame-src https://www.google.com;
  style-src 'self' 'unsafe-inline';
  font-src 'self' data:;
  ```
- No inline `<script>` blocks beyond what Astro emits with hydration nonces.
- Web3Forms key is `PUBLIC_*` (it's safe in client code, but treat the access key as low-sensitivity rate-limited credential).

## 12. Build & deploy pipeline

`.github/workflows/deploy.yml` (sketch — LLM implements):

```yaml
name: deploy
on:
  push:
    branches: [main]
jobs:
  build-test-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run build
        env:
          PUBLIC_GA4_ID: ${{ secrets.PUBLIC_GA4_ID }}
          PUBLIC_WEB3FORMS_KEY: ${{ secrets.PUBLIC_WEB3FORMS_KEY }}
      - name: Lighthouse CI (mobile, perf >=95)
        run: npx @lhci/cli@latest autorun --collect.staticDistDir=dist
      - name: Deploy to Hostinger via lftp
        env:
          FTP_HOST: ${{ secrets.HOSTINGER_FTP_HOST }}
          FTP_USER: ${{ secrets.HOSTINGER_FTP_USER }}
          FTP_PASS: ${{ secrets.HOSTINGER_FTP_PASS }}
        run: |
          sudo apt-get install -y lftp
          lftp -e "mirror -R --delete dist/ public_html/; bye" \
            -u "$FTP_USER","$FTP_PASS" "$FTP_HOST"
```

`lighthouserc.json`:

```json
{
  "ci": {
    "collect": { "staticDistDir": "dist", "url": ["http://localhost/", "http://localhost/services/pediatric-audiology", "http://localhost/branches/jalandhar"] },
    "assert": {
      "preset": "lighthouse:no-pwa",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.95 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2000 }]
      }
    }
  }
}
```

## 13. Local development

```bash
git clone <repo>
cd joy-of-hearing
cp .env.example .env       # fill in PUBLIC_GA4_ID, PUBLIC_WEB3FORMS_KEY (use test values)
npm install
npm run dev                # http://localhost:4321
npm run build && npm run preview
```

## 14. Request-flow diagrams (ASCII)

### Page request

```
  Browser ──HTTPS/HTTP3──▶ Hostinger LiteSpeed ──▶ /public_html/<path>/index.html
                                  │
                                  └─▶ Brotli compress, send
                              (cache: HTML revalidate, static 1y immutable)
```

### Appointment form submit

```
  Browser ──fetch POST──▶ api.web3forms.com/submit ──email──▶ clinic inbox
     │                              │
     │ on 200                       └─▶ (no DB; Web3Forms is the system of record)
     ▼
  /contact?status=success ──▶ render WhatsApp deep link
                              wa.me/<num>?text=<form summary>
```

## 15. What this architecture intentionally does NOT include

- **No Node.js runtime** on Hostinger (would require VPS/Cloud).
- **No database.** Form submissions live in Web3Forms emails; the email is the audit trail.
- **No SSR.** Every page is pre-rendered HTML.
- **No Service Worker / PWA install.** Adds complexity, not clear v1 value.
- **No image CDN beyond Hostinger.** Pre-processed AVIF on disk is enough at this scale.
