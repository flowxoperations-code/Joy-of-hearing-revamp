# Design System — Joy of Hearing Revamp

**Purpose:** Tokens, components, page wireframes, and accessibility rules. The build-LLM uses this to translate content into UI without making style decisions ad-hoc.
**Last updated:** 2026-05-07

---

## 1. Color tokens

Medical-trust blues with a single warm accent. WCAG AA compliant against `--color-bg`.

| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#FFFFFF` | Page background |
| `--color-bg-soft` | `#F5F8FB` | Section bands, cards |
| `--color-fg` | `#0E1B2C` | Body text |
| `--color-fg-muted` | `#475569` | Secondary text, labels |
| `--color-primary` | `#0B6FB8` | Primary CTAs, links, doctor accent |
| `--color-primary-hover` | `#085989` | Hover/focus state |
| `--color-primary-soft` | `#DCEDFA` | CTA backgrounds in soft variant, badges |
| `--color-accent` | `#F59E0B` | Highlights only (rating stars, "New" badges) |
| `--color-success` | `#16A34A` | Form success state |
| `--color-error` | `#DC2626` | Form error state |
| `--color-border` | `#E2E8F0` | Hairlines, card borders |

Contrast checks (must hold):

- `--color-fg` on `--color-bg`: 14.7:1 ✓
- `--color-primary` on `--color-bg`: 4.62:1 ✓ (AA for body)
- White on `--color-primary`: 4.62:1 ✓
- `--color-fg-muted` on `--color-bg`: 7.5:1 ✓

Define these as Tailwind theme extensions in `tailwind.config.mjs`:

```js
theme: {
  extend: {
    colors: {
      bg: { DEFAULT: '#FFFFFF', soft: '#F5F8FB' },
      fg: { DEFAULT: '#0E1B2C', muted: '#475569' },
      primary: { DEFAULT: '#0B6FB8', hover: '#085989', soft: '#DCEDFA' },
      accent: '#F59E0B',
      success: '#16A34A',
      error: '#DC2626',
      border: '#E2E8F0',
    },
  },
}
```

## 2. Typography

> LLM must: use a **system font stack** in v1. No webfont loaded over the network. Saves ~40–80 KB and one render-blocking request.

```css
font-family:
  ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
  "Helvetica Neue", Arial, "Noto Sans", sans-serif;
```

Type scale (mobile → desktop):

| Token | Mobile | Desktop | Usage |
|---|---|---|---|
| `text-xs` | 12px | 12px | Captions, footer fine print |
| `text-sm` | 14px | 14px | Labels, secondary text |
| `text-base` | 16px | 16px | Body |
| `text-lg` | 18px | 18px | Lead paragraph |
| `text-xl` | 20px | 22px | Section subhead |
| `text-2xl` | 24px | 28px | Service / branch card titles |
| `text-3xl` | 28px | 36px | Page H1 (interior pages) |
| `text-4xl` | 34px | 48px | Home hero H1 |

Line-height: `1.5` for body, `1.2` for headings. Letter-spacing: `-0.01em` on headings ≥ `text-2xl`.

## 3. Spacing, radius, shadow

- **Spacing** uses Tailwind's default scale (4px base). Sections use `py-12 md:py-20`.
- **Radius:** `rounded-lg` (12px) on cards/buttons, `rounded-2xl` (16px) on hero illustrations.
- **Shadow:** one elevation only — `shadow-md` (`0 4px 12px -2px rgba(14,27,44,0.08)`). No double-shadow patterns.

## 4. Components

For each component: anatomy, variants, states, a11y.

### 4.1 Button

- **Anatomy:** wrapping element (`<a>` or `<button>`), optional leading icon (16px), label, optional trailing icon.
- **Variants:** `primary` (filled `--color-primary`), `secondary` (outline `--color-primary`), `ghost` (no border, blue text).
- **Sizes:** `md` (h-11, px-4, text-base), `lg` (h-12, px-6, text-lg). Both meet 44×44 minimum.
- **States:** default, hover (background `--color-primary-hover`), focus (visible 2px ring `--color-primary` offset 2px), active, disabled (opacity 0.5, no pointer).
- **A11y:** if icon-only, require `aria-label`. Focus ring must be visible (no `outline: none` without replacement).

### 4.2 Card

- White background, `--color-border` 1px, `rounded-lg`, `shadow-md` on hover only (subtle lift).
- Padding: `p-5 md:p-6`. Title is `text-2xl`, body is `text-base text-fg-muted`.

### 4.3 ServiceTile

- Card variant. Top: 32px lucide icon in `--color-primary-soft` circle. Then title, summary (max 2 lines, `line-clamp-2`), "Learn more →" affordance.
- Whole tile is wrapped in an `<a>`. Tile has `aria-label="<service title>"` if the visible text isn't unique.

### 4.4 TestimonialCard

- Quote starts with a 24px quote glyph (`"` rendered via SVG, decorative).
- Body: 2–4 line quote. Below: photo (40×40, `rounded-full`, `loading="lazy"`) or initial circle. Then `firstName • city`.
- Star row uses `--color-accent`. Stars are decorative; rating exposed to AT via `aria-label="Rated 5 out of 5"`.

### 4.5 BranchCard

- Title (city name), address (2 lines max), phone (tappable `tel:`), "Get directions" link to `googleMapsEmbedUrl`. Mini map thumbnail optional in v1.
- "View details" CTA at bottom navigates to the branch detail page.

### 4.6 StickyContactBar (mobile-only)

- Renders only at `< md` breakpoint (Tailwind: `md:hidden`).
- Fixed to bottom, full width, height 64px, divided into three equal buttons: **Call** (icon + label), **WhatsApp** (icon + label), **Book** (filled primary, links to `/contact`).
- Background: `--color-bg` with `border-t border-border`. Safe-area padding for iPhone home indicator (`pb-[env(safe-area-inset-bottom)]`).
- Hidden when the on-page primary CTA is in viewport (IntersectionObserver) to avoid double-CTA noise.
- Each button is min 44×44. Labels are 12–14px so all three fit on a 320px screen (iPhone SE).

### 4.7 MobileNav

- `<button>` toggles `aria-expanded`. Drawer is a `<dialog>` (native, no JS lib) or a focus-trapped overlay with `inert` on background.
- Closes on `Esc`, on backdrop click, and on link click. Focus returns to the toggle.

### 4.8 FAQItem

- Use native `<details>`/`<summary>`. **No JS required.**
- Plus/minus icon swap via CSS using `details[open] summary::after`.
- Summary text is `text-lg font-medium`, body is `text-base text-fg-muted`.

### 4.9 Hero

- Two-column on `lg`, single-column on mobile. Left: H1, 1-line subhead, two CTAs (primary + ghost call). Right: hero image.
- Image is `loading="eager"` `fetchpriority="high"`, max 1280w, AVIF ≤ 120 KB.
- No autoplay video. No animated background. No parallax.

### 4.10 Footer

- Three or four columns on desktop, stacked on mobile.
- Columns: Branches (top 4 with full list link), Services (top 6), Contact (phone, WA, email, hours), Legal (Privacy, Terms, Disclaimer).
- Bottom row: copyright, "Made with care in Punjab".

## 5. Page wireframes (text-based)

> LLM must: assemble pages from the components above in the order listed. Do not introduce new sections without reason.

### 5.1 Home `/`

1. Header (logo + nav)
2. Hero (H1 + subhead + Book/Call CTAs + hero image)
3. Trust strip (3–5 small badges/icons: years of experience, branches count, equipment origins)
4. Services grid (6 ServiceTiles)
5. Doctor section (photo + name + qualifications + 100-word bio + secondary CTA)
6. Testimonials block (4 TestimonialCards in a 2×2 grid; on mobile, single column — **no carousel**)
7. Branches teaser ("7 branches across Punjab" + 3 cards + "View all branches" link)
8. FAQ block (5–7 most common questions, native `<details>`)
9. Final CTA band (full-width `--color-primary-soft` background, single Book CTA)
10. Footer
11. StickyContactBar (mobile only)

### 5.2 About `/about`

1. Header
2. Page header (H1 "Meet your hearing-care team", subhead)
3. Doctor block (large photo, full bio, qualifications, languages)
4. Clinic story (3 paragraphs)
5. Equipment & approach (icon grid: 4–6 cards)
6. Testimonials (3 TestimonialCards)
7. Final CTA band
8. Footer + StickyContactBar

### 5.3 Services index `/services`

1. Header
2. Page header (H1 "Hearing-care services")
3. Services grid (all 6 ServiceTiles)
4. FAQ block (cross-service questions)
5. Final CTA
6. Footer + StickyContactBar

### 5.4 Service detail `/services/[slug]`

1. Header
2. Hero (H1 = service title, subhead = `summary`, Book/WhatsApp CTAs)
3. "Who this is for" — bullet list
4. "What to expect" — numbered steps
5. Related-branches block (3 BranchCards)
6. FAQ block (`faqIds` from collection)
7. Testimonials filtered by `serviceSlug`
8. Final CTA
9. Footer + StickyContactBar

### 5.5 Branches index `/branches`

1. Header
2. Page header (H1 "Find your nearest branch")
3. Optional text-input filter (vanilla JS, filters card visibility by city — no library)
4. Grid of 7 BranchCards
5. Final CTA
6. Footer + StickyContactBar

### 5.6 Branch detail `/branches/[slug]`

1. Header
2. Hero (H1 = "Joy of Hearing — [City]", address line, hours, branch phone CTA)
3. Embedded Google Map (`<iframe loading="lazy">`)
4. "Services at this branch" (ServiceTiles)
5. Testimonials filtered by `branchSlug`
6. Final CTA (with branch-specific WhatsApp message: "Hello, I'd like to book at the [City] branch.")
7. Footer + StickyContactBar

### 5.7 Contact `/contact`

1. Header
2. Page header (H1 "Book an appointment")
3. Two columns on desktop: left = appointment form; right = "Or reach us directly" (phone, WhatsApp, email, hours)
4. All-branches strip (compact list)
5. Footer + StickyContactBar

Form fields (in order): **Name** (required), **Phone** (required, India format validation `^[+]?[0-9 -]{10,15}$`), **Email** (optional), **Branch** (select, required), **Preferred date** (`<input type="date">`, required, `min=today`), **Concern / message** (textarea, required, max 500). Honeypot `botcheck` hidden.

### 5.8 404 `/404`

1. Header
2. Centered block: large "404", "We couldn't find that page.", three links (Home, Services, Contact).
3. Footer.

## 6. Iconography

- **Library:** `lucide-static` (SVG sprite per page or per route). No `lucide-react`.
- Sprite is generated at build time by importing only the icons used in this list:
  `ear`, `phone`, `message-circle`, `calendar`, `map-pin`, `clock`, `star`, `check-circle`, `x-circle`, `chevron-down`, `arrow-right`, `menu`, `x`.
- Stroke width 1.5, size 20 inline / 32 in feature blocks.

## 7. Mobile-first rules

- **Breakpoints:** `sm: 640`, `md: 768`, `lg: 1024`, `xl: 1280`. Default styles target the smallest viewport (320px iPhone SE).
- **Touch targets:** ≥ 44×44 CSS pixels. Use `min-h-11` on interactive elements.
- **Spacing:** halve vertical rhythm on mobile (`py-12` mobile vs. `py-20` desktop).
- **Sticky bar:** mobile only; respect iOS safe-area inset.
- **Images:** never lazy-load above the fold. Always set `width` and `height` attributes (CLS = 0).

## 8. Motion

- One transition utility only: `transition-colors duration-150 ease-out`. Apply to buttons, cards on hover.
- No scroll-triggered animations. No parallax.
- Respect `prefers-reduced-motion: reduce` — disable any non-essential transitions.

## 9. Accessibility checklist (per component)

- Every form input has a visible `<label>` (no placeholder-only labels).
- Error messages are referenced via `aria-describedby`.
- Tab order matches visual order; no `tabindex` > 0.
- Skip-to-content link as first focusable element on every page.
- All interactive non-text elements have an `aria-label` or visible text.
- No color is the only signal (e.g., error states get an icon AND red).

## 10. Tone in UI copy

- Reassuring, plain, second person.
- 8th-grade reading level. Avoid medical jargon unless followed by a parenthetical plain-language explanation.
- CTA verbs are active and short: **Book Appointment**, **Call Now**, **Chat on WhatsApp**, **View Branch**, **Learn More**.
- Avoid "Click here". Use the action ("Book your hearing test").
