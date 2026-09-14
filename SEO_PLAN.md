# SEO Plan — Joy of Hearing Revamp

**Purpose:** Keyword strategy, on-page rules, schema.org markup, local SEO, and the migration redirect map. The build-LLM uses this to make every page indexable, locally relevant, and aligned with searcher intent.
**Last updated:** 2026-05-07

---

## 1. Keyword strategy

Indian audiology searches skew **local + transactional + symptom-driven**. Primary intent buckets:

### 1.1 Local + service intent (highest priority)

For each branch city × each service:

- "audiologist in Jalandhar" / "hearing test in Jalandhar"
- "hearing aid in Pathankot"
- "cochlear implant Punjab"
- "speech therapy for child Hoshiarpur"
- "tinnitus treatment Gurdaspur"
- "newborn hearing screening Punjab"

### 1.2 Symptom / question intent

- "ringing in ears treatment"
- "child not responding to sound"
- "hearing loss old age"
- "best hearing aid for elderly"
- "how much does a hearing test cost"

### 1.3 Brand intent

- "joy of hearing"
- "joy of hearing Punjab"
- "joy of hearing [city]"

> LLM must: target 1.1 keywords on **branch detail** pages and **service detail** pages (cross). Target 1.2 in service-detail body copy and the Home FAQ block. 1.3 is owned by the homepage and About.

## 2. On-page rules

### 2.1 Title tag templates

| Page type | Template | Max length |
|---|---|---|
| Home | `Joy of Hearing — Audiologist & Hearing Care in Punjab` | 60 chars |
| About | `About Joy of Hearing — Trusted Hearing Care in Punjab` | 60 |
| Services index | `Hearing Care Services — Joy of Hearing` | 50 |
| Service detail | `{ServiceTitle} in Punjab — Joy of Hearing` | 60 |
| Branches index | `Find a Branch — Joy of Hearing` | 40 |
| Branch detail | `Hearing Care in {City}, Punjab — Joy of Hearing` | 60 |
| Contact | `Book an Appointment — Joy of Hearing` | 45 |

### 2.2 Meta description templates

- **Home:** "Trusted hearing-care across 7 branches in Punjab. Hearing tests, hearing aids, cochlear implants, speech therapy, and more. Book online or call now." (155 chars)
- **Service:** "{One-line summary from collection}. Compassionate care, modern equipment, and 7 branches across Punjab. Book your {service} today."
- **Branch:** "Visit Joy of Hearing in {City}, Punjab. Hearing tests, hearing aids, and full audiology care. {Address}. Call {phone} or book online."
- **About:** "Meet the team behind Joy of Hearing — decades of experience in audiology, cochlear implants, and speech therapy across Punjab."

### 2.3 H1/H2 rules

- One `<h1>` per page (the page title-equivalent).
- `<h2>` opens each major section.
- `<h3>` for sub-points. Never skip a level (no `<h2>` straight to `<h4>`).

### 2.4 Internal linking map

| From | To | Anchor text idiom |
|---|---|---|
| Home | each service detail | descriptive, e.g. "Pediatric audiology" |
| Home | branches index | "All 7 branches across Punjab" |
| Service detail | 3 nearest branches | "Visit our {City} branch" |
| Service detail | related services (where genuinely related, e.g. cochlear implant ↔ speech therapy) | service title |
| Branch detail | services index | "All services at this branch" |
| Branch detail | other 2–3 branches | "Other branches near {City}" |
| Footer (every page) | top 6 services + top 4 branches + Privacy + Terms + Disclaimer | descriptive |

### 2.5 URL rules

- Lowercase kebab-case. No trailing slash on browser-facing canonical (`/services/hearing-aids` not `/services/hearing-aids/`).
- No query strings in canonical URLs.
- No date or category prefixes.

## 3. Schema.org JSON-LD

> LLM must: emit JSON-LD via the `<JsonLd />` component documented in [ARCHITECTURE.md §4](./ARCHITECTURE.md#4-repo-layout). Validate every page on https://validator.schema.org/ before launch.

### 3.1 `MedicalClinic` on Home

```json
{
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  "name": "Joy of Hearing",
  "url": "https://www.joyofhearing.net/",
  "logo": "https://www.joyofhearing.net/logo.svg",
  "image": "https://www.joyofhearing.net/og-default.jpg",
  "medicalSpecialty": ["Audiology", "Otolaryngology"],
  "telephone": "{contact.primaryPhone}",
  "email": "{contact.email}",
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "Punjab",
    "addressCountry": "IN"
  },
  "department": [
    /* one PostalAddress-bearing MedicalBusiness per branch — generated from branches collection */
  ],
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    "opens": "10:00",
    "closes": "19:00"
  }]
}
```

### 3.2 `MedicalBusiness` on each branch page

```json
{
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "Joy of Hearing — {City}",
  "url": "https://www.joyofhearing.net/branches/{slug}",
  "telephone": "{branch.phone}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{addressLine1}{, addressLine2 if present}",
    "addressLocality": "{city}",
    "postalCode": "{pincode}",
    "addressRegion": "Punjab",
    "addressCountry": "IN"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": "{geo.lat}", "longitude": "{geo.lng}" },
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    "opens": "10:00",
    "closes": "19:00"
  }],
  "medicalSpecialty": "Audiology"
}
```

### 3.3 `Person` on About (the lead audiologist)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "{doctor.name}",
  "jobTitle": "Lead Audiologist",
  "image": "{doctor.headshotUrl}",
  "worksFor": { "@type": "MedicalClinic", "name": "Joy of Hearing" },
  "alumniOf": "{qualifications, if applicable}",
  "knowsLanguage": ["en", "hi", "pa"]
}
```

### 3.4 `FAQPage` on pages with FAQs

Emit a single `FAQPage` per page that contains FAQs (Home, Service detail). Use the `Question`/`Answer` pattern. Don't emit one if there are zero questions.

### 3.5 `BreadcrumbList` on all interior pages

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.joyofhearing.net/" },
    { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://www.joyofhearing.net/services" },
    { "@type": "ListItem", "position": 3, "name": "{Service title}" }
  ]
}
```

### 3.6 `Review` / `AggregateRating`

Only if **all** testimonials have explicit consent and a real rating. Otherwise, omit. We do not fabricate ratings.

## 4. Open Graph & Twitter Card

Defaults set in `BaseLayout.astro`, overridable per page:

```html
<meta property="og:site_name" content="Joy of Hearing" />
<meta property="og:type" content="website" />
<meta property="og:title" content="{title}" />
<meta property="og:description" content="{description}" />
<meta property="og:image" content="{ogImage}" />
<meta property="og:url" content="{canonical}" />
<meta name="twitter:card" content="summary_large_image" />
```

`og:image` defaults: `/og-default.jpg`, 1200×630, ≤ 200 KB. Per-service and per-branch pages may override.

## 5. Local SEO

> LLM must: produce one branch landing page per branch with **unique** intro copy (not boilerplate-substitute). Google deduplicates near-identical local landing pages.

### 5.1 NAP consistency

The branch's **Name, Address, Phone** on the site must match the GMB listing **exactly** — including punctuation. Ask the client (checklist C-5) for the literal GMB strings.

### 5.2 GMB optimization checklist for the client

After launch, the client should:

- [ ] Update each GMB listing's website to the new URL (`/branches/{slug}`).
- [ ] Confirm category is "Audiologist" or "Hearing aid store" as appropriate.
- [ ] Add 5+ photos per listing (interior, equipment, exterior, doctor).
- [ ] Confirm hours match site.
- [ ] Enable messaging if WhatsApp is the preferred channel.
- [ ] Solicit a review from the next 5 satisfied patients per branch.

### 5.3 Branch page uniqueness rules

- First paragraph is branch-specific (mention the city's neighborhood, the kind of patients common at that branch — e.g., a higher pediatric load — landmarks if useful).
- Testimonials filtered to the branch.
- Photos branch-specific where possible.

## 6. Migration 301 redirect map

Capture the existing site's URL inventory via the scrape (see [CONTENT_PLAN.md §3](./CONTENT_PLAN.md#3-scrape-directives--extract-from-joyofhearingnet)) and crawl `sitemap.xml` if present. Then map every old URL to its new home:

| Old URL (likely) | New URL | Notes |
|---|---|---|
| `/index.php` | `/` | Apex |
| `/about-us.php` | `/about` | |
| `/contact.php` | `/contact` | |
| `/services.php` | `/services` | |
| `/hearing-assessment.php` | `/services/hearing-assessment` | |
| `/cochlear-implant.php` | `/services/cochlear-implant` | |
| `/newborn-screening.php` | `/services/pediatric-audiology` | Consolidated |
| `/speech-therapy.php` | `/services/speech-therapy` | |
| `/tinnitus.php` | `/services/tinnitus-management` | |
| `/hearing-aid.php` | `/services/hearing-aids` | |
| `/branch-jalandhar.php` | `/branches/jalandhar` | Repeat per branch |
| `/blog.php` (if exists) | `/blog` | |
| `*.php` (any unmapped) | `/` | Catch-all, low priority |

> LLM must: confirm the actual `.php` URL list during scrape and update this table before deploy. Any old URL not mapped → 301 to `/` rather than 404, to preserve link equity.

Implement in `.htaccess` under the snippet noted in [ARCHITECTURE.md §10](./ARCHITECTURE.md#10-caching-headers-and-htaccess):

```apache
Redirect 301 /index.php /
Redirect 301 /about-us.php /about
Redirect 301 /contact.php /contact
Redirect 301 /services.php /services
Redirect 301 /hearing-assessment.php /services/hearing-assessment
# ... etc
```

## 7. `sitemap.xml` and `robots.txt`

- **Sitemap:** generated by `@astrojs/sitemap`. Excludes `/404` and `/blog` (placeholder) until v2.
- **Robots:** allow all. Disallow nothing in v1.
  ```
  User-agent: *
  Allow: /
  Sitemap: https://www.joyofhearing.net/sitemap-index.xml
  ```

## 8. Post-launch SEO checklist

- [ ] Verify property in **Google Search Console** for both `https://joyofhearing.net` and `https://www.joyofhearing.net` (or pick one canonical and 301 the other).
- [ ] Submit `sitemap-index.xml`.
- [ ] Submit a URL inspection for the top 10 pages (Home, Services index, all 7 branches, top 2 services).
- [ ] Confirm GA4 + Search Console linked.
- [ ] Monitor Coverage report daily for the first 7 days; weekly thereafter for 30 days. Triage 404s immediately by adding to the redirect map.
- [ ] Run **Mobile-Friendly Test** on Home + Service + Branch.
- [ ] Run **Rich Results Test** on each schema type.
