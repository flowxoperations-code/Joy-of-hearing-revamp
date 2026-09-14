# Joy of Hearing — Website Revamp

Modern, high-performance web platform for **Joy of Hearing**, a premier hearing care clinic network operating across Punjab, India (Ludhiana, Jalandhar, Amritsar, Bathinda, and regional centers).

Designed for speed, patient trust, seamless lead generation, and local SEO dominance.

---

## 🌟 What Has Happened So Far

This repository represents the full revamp of `joyofhearing.net`, transitioning from legacy static/PHP hosting to a modern, ultra-fast Astro-powered architecture.

### 1. Architecture & Design System Setup
- **Framework:** Built with [Astro 6.x](https://astro.build/) with static site generation (`output: 'static'`) for instantaneous page loads and zero hydration overhead where interactive components are not required.
- **Styling:** Modern styling using **Tailwind CSS v4** with a clean medical/clinical design system, high-contrast accessible typography, and custom clinic tokens.
- **Micro-Interactions & React Islands:** Integrated React 19 + Framer Motion for high-touch interactive elements without bloating the rest of the static pages.

### 2. Content Architecture & Collections (Type-Safe with Zod)
Built robust content collections located in `src/content/`:
- **`branches/`**: Clinic location data across Punjab (Ludhiana, Jalandhar, Amritsar, Bathinda, Moga, Hoshiarpur, etc.) including operating hours, Google Maps embeds, phone numbers, WhatsApp links, and specialist details.
- **`services/`**: Detailed service catalogs covering Comprehensive Audiometry, Hearing Aid Dispensing, Tinnitus Management, Pediatric Hearing, Speech Therapy, and Cochlear Implant Rehabilitation.
- **`blogs/`**: Over 50+ fully researched, SEO-optimized articles covering hearing health, hearing aid maintenance, tinnitus relief, and pediatric audiometry.
- **`faqs/` & `testimonials/`**: Verified patient success stories and answers to common patient concerns.

### 3. Core Features Built
- **Interactive Multi-Age Assessment Quiz (`AssessmentQuiz.tsx`):**
  - Interactive self-screening quiz tailored for 4 key demographics:
    - Children (2–12 Years) - Speech & Language milestones
    - Teenagers & Young Adults (13–18 Years)
    - Adults (19–59 Years)
    - Senior Citizens (60+ Years)
  - Provides instant risk classification and automated appointment lead routing.
- **Dynamic Blog Engine with Client-Side Filtering (`BlogControls.tsx`):**
  - Real-time client-side search across titles, descriptions, and tags.
  - Category filters and clean pagination (`[...page].astro`).
- **Local Branch Directory & Service Landing Pages:**
  - Dynamic `branches/[slug].astro` pages featuring click-to-call, WhatsApp scheduling, and directions.
  - Comprehensive service pages with detailed medical FAQs and pricing/procedure breakdowns.
- **Conversion-Optimized Layouts:**
  - Sticky mobile contact bar for instant one-tap calling (`tel:`) or WhatsApp chat (`wa.me`).
  - Web3Forms lead capture with direct WhatsApp confirmation fallback.

### 4. SEO & Performance Optimizations
- **Structured Data / JSON-LD:** Schemas for `MedicalClinic`, `MedicalBusiness`, `FAQPage`, `BreadcrumbList`, and `Article` on every page.
- **Asset Optimization:** Integrated `sharp` and automated image compression script (`compress-images.mjs`) reducing page weight below 500 KB on initial paint.
- **Automated Sitemap & Robots:** Generated dynamic sitemap (`sitemap-index.xml`) and canonical headers.

---

## 📁 Repository Structure

```text
Joy-of-hearing-revamp/
├── src/
│   ├── assets/              # Raw and optimized images/icons
│   ├── components/          # Astro & React UI components
│   │   ├── AssessmentQuiz.tsx   # Interactive patient screening quiz
│   │   ├── BlogControls.tsx     # Blog search & filtering
│   │   ├── Header.astro         # Desktop & mobile navigation
│   │   ├── Footer.astro         # Clinic footer with legal & branch links
│   │   └── StickyContactBar.astro # Mobile persistent CTA bar
│   ├── config/              # Site configuration, contact details & navigation
│   ├── content/             # Type-safe content collections
│   │   ├── blogs/           # 50+ Markdown/MDX articles
│   │   ├── branches/        # Clinic branch data
│   │   ├── faqs/            # Patient FAQ entries
│   │   ├── services/        # Clinic service definitions
│   │   └── testimonials/    # Patient reviews
│   ├── layouts/             # Root and page layouts with SEO meta tags
│   ├── pages/               # File-based routing (Static SSR)
│   └── styles/              # Global CSS & Tailwind configuration
├── public/                  # Public static assets (favicons, robots.txt, etc.)
├── scripts/ & tools/
│   ├── compress-images.mjs  # Image compression utility
│   ├── extract_5a_5b.py     # Content parsing utility
│   └── update_seo.cjs       # Automated SEO updater
├── docs/ (Reference Plans)
│   ├── ARCHITECTURE.md      # Technical architecture & content model
│   ├── PRD.md               # Product Requirements Document
│   ├── DESIGN_SYSTEM.md     # Color tokens & typography guidelines
│   ├── CONTENT_PLAN.md      # Content mapping & page specs
│   ├── SEO_PLAN.md          # Redirect map & JSON-LD schema guidelines
│   └── PERFORMANCE_BUDGET.md# Web Vitals targets & asset budgets
├── astro.config.mjs         # Astro framework configuration
├── package.json             # NPM dependencies & scripts
└── tsconfig.json            # TypeScript configuration
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js `22.12.0` or higher
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/flowxoperations-code/Joy-of-hearing-revamp.git
   cd Joy-of-hearing-revamp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Copy `.env.example` to `.env` and fill in your keys:
   ```bash
   cp .env.example .env
   ```
   - `PUBLIC_WEB3FORMS_KEY`: Access key for Web3Forms contact submission.

4. Start development server:
   ```bash
   npm run dev
   ```
   Site will be live at `http://localhost:4321`.

---

## 🚀 Build & Deployment

To build the static distribution for production:
```bash
npm run build
```

The production assets will be generated in `./dist/`.

### Hostinger / Apache Shared Hosting Deployment
1. Run `npm run build`.
2. Upload the contents of the `dist/` directory into your server's `public_html/` root.
3. Ensure the `.htaccess` file is copied to preserve clean URLs and HTTP cache-control headers.

---

## 📚 Documentation Reference

Detailed specifications and architectural decisions can be reviewed in the project documents:
- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Technical stack, schemas, and hosting architecture.
- **[PRD.md](./PRD.md)**: Patient personas, user journeys, and core requirements.
- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)**: Color tokens, accessibility standards, and UI components.
- **[CONTENT_PLAN.md](./CONTENT_PLAN.md)**: Content strategy, page headings, and scraping notes.
- **[SEO_PLAN.md](./SEO_PLAN.md)**: Schema.org templates, meta guidelines, and 301 redirects.
- **[PERFORMANCE_BUDGET.md](./PERFORMANCE_BUDGET.md)**: Performance metrics and asset size limits.
- **[TESTING_PLAN.md](./TESTING_PLAN.md)**: QA checklists, device matrix, and UAT criteria.
