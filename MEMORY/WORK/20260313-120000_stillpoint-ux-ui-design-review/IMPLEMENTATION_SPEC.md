# StillPoint Website Redesign - Phased Implementation Spec

**Date:** 2026-03-13
**Source:** DESIGN_REVIEW.md (Comprehensive UX/UI Audit)
**Target:** Transform cyberpunk tech dashboard into contemplative literary reading experience
**Codebase:** `/home/bob/projects/StillPoint/astro-dev-site/`

---

## 1. Architecture Overview

### 1.1 Current State

The Astro site has two competing design systems, a broken mobile nav, and a visual identity that contradicts its literary mission.

**Key structural files:**

| File | Purpose | System |
|------|---------|--------|
| `src/styles/global.css` | Tailwind theme, base styles, reader theme overrides | System B (Cyber) |
| `src/styles/design-tokens.css` | CSS custom properties for inner pages | System A (Bioluminescence) |
| `src/layouts/Layout.astro` | Main layout (loads global.css, Google Fonts: Inter + Crimson Text) | Both |
| `src/layouts/ReaderLayout.astro` | Reader layout (loads global.css, no font loading) | System B |
| `src/components/Navbar.tsx` | React nav, broken mobile menu | System B |
| `src/components/Hero.tsx` | Homepage hero with framer-motion, split bg images | System B |
| `src/components/ErasSection.tsx` | Homepage era cards with framer-motion | System B |
| `src/components/AboutSection.astro` | Homepage about section | System B |
| `src/components/Footer.astro` | Site footer with [CYB_STATUS: STABLE] | System B |
| `src/components/ReaderControls.tsx` | Reader settings FAB (theme/font/size/width) | System B |
| `src/pages/index.astro` | Homepage (loads own global.css import) | System B |
| `src/pages/novel.astro` | Novel index with hero image | System A (scoped) |
| `src/pages/stories.astro` | Stories index with hero image | System A (scoped) |
| `src/pages/novel/[...slug].astro` | Novel reader with duplicated narrative CSS | System A (scoped) |
| `src/pages/stories/[...slug].astro` | Story reader with duplicated narrative CSS | System A (scoped) |
| `src/pages/about.astro` | About page with heavy card treatment | System A (scoped) |
| `src/pages/lore.astro` | Lore page with 18+ content blocks | System A (scoped) |

**Image assets (public/):**

| File | Size | Status |
|------|------|--------|
| `cyber-city-bg.png` | 6.9 MB | Used (homepage left) |
| `forest-bg.png` | 6.5 MB | Used (homepage right) |
| `images/hawthorne_hero.png` | 948 KB | Used (novel index) |
| `images/riverbend_hero.png` | 1.1 MB | Used (stories index) |
| `images/manitou_hero.png` | 904 KB | Used (lore page) |
| `images/about_hero_solarpunk_2100.jpg` | 1.0 MB | Used (about page) |
| `images/about_hero.png` | 712 KB | **UNUSED - delete** |
| `images/about_hero_era3.png` | 768 KB | **UNUSED - delete** |
| `images/lore_hero.png` | 864 KB | **UNUSED - delete** |

### 1.2 Target State

A unified design system where every page shares the same color palette, typography, and visual language. The site feels like a well-typeset contemplative book: serif-forward, warm tones, generous whitespace, zero neon. The reading experience is the primary design goal.

### 1.3 Key Files Affected Per Phase

- **Phase 1:** Navbar.tsx, novel.astro, stories/[...slug].astro, novel/[...slug].astro, Footer.astro, ReaderLayout.astro
- **Phase 2:** design-tokens.css, global.css, Layout.astro, ReaderLayout.astro
- **Phase 3:** index.astro, Hero.tsx, ErasSection.tsx, AboutSection.astro, about.astro, lore.astro, Navbar.tsx
- **Phase 4:** public/images/*, ReaderControls.tsx, novel/[...slug].astro, stories/[...slug].astro

---

## 2. Phase 1: Critical Fixes (Parallel-Safe)

All six tasks touch different files. No conflicts. All can run simultaneously.

### 2.1 Mobile Navigation Fix

**File:** `src/components/Navbar.tsx`
**Priority:** Critical -- users cannot navigate on mobile

**Current state:** The hamburger button at line 34 renders but has no click handler, no state, and no mobile menu panel.

**Changes required:**

1. Add React state for mobile menu open/close:
```tsx
const [mobileOpen, setMobileOpen] = useState(false);
```

2. Add click handler to hamburger button (line 34):
```tsx
<button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
```

3. Add mobile menu panel after the hamburger button, inside the outer nav div:
```tsx
{mobileOpen && (
  <div className="md:hidden absolute top-full left-4 right-4 mt-2 glass-panel rounded-2xl p-6">
    <div className="flex flex-col space-y-4">
      {navLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          className="text-base font-sans text-gray-300 hover:text-accent-gold py-2"
          onClick={() => setMobileOpen(false)}
        >
          {link.name}
        </a>
      ))}
    </div>
  </div>
)}
```

4. Add `useState` import (already imported from React but needs destructuring check).

**Acceptance criteria:**
- Hamburger button opens/closes a dropdown menu on viewports < 768px
- All four nav links (Chapters, Stories, World, About) are visible and clickable
- Clicking a link closes the menu
- Touch targets are at least 44px tall (py-2 on text-base achieves this)
- Menu does not overlap or hide behind content

### 2.2 Reader CSS Defaults

**File:** `src/layouts/ReaderLayout.astro`
**Priority:** High -- prevents layout shift and sets proper reading defaults

**Current state (line 27):**
```html
<div id="reader-content" class="mx-auto px-4 py-12 transition-all duration-300">
```
No max-width set in CSS. No serif default. JS sets these after hydration, causing layout shift.

**Changes required:**

1. Add CSS max-width and serif default to ReaderLayout.astro. Add a `<style>` block at the bottom of the file:
```css
<style>
  #reader-content {
    max-width: 800px;
    font-family: 'Crimson Text', serif;
    font-size: 18px;
    line-height: 1.8;
  }
</style>
```

2. On line 23, change the body class. Replace `text-text-primary` with nothing extra needed, but ensure the reader defaults load before JS.

**Note:** ReaderControls.tsx (line 42-48) will override these values after hydration. The CSS provides sane defaults that prevent layout shift. The JS enhances, not creates.

**Acceptance criteria:**
- On page load (before JS hydration), reader content is centered at 800px max-width
- On page load, text renders in Crimson Text serif at 18px
- No visible layout shift when JS hydrates and applies stored preferences
- Line height is 1.8 for comfortable reading

### 2.3 Visible Chapter Links

**File:** `src/pages/novel.astro`
**Priority:** High -- chapter links invisible on desktop without hover

**Current state (line 189-191):**
```css
.read-link {
    opacity: 0;
    transition: opacity var(--transition-fast);
}
```
The "Read Chapter" text is hidden until hover. Touch/trackpad users never see it.

**Changes required:**

1. Change line 189 from `opacity: 0` to `opacity: 0.7`:
```css
.read-link {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    color: var(--color-accent-1);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.7;
    transition: opacity var(--transition-fast);
}
```

2. Change the hover rule (line 193-195) to full opacity:
```css
.scene-card:hover .read-link {
    opacity: 1;
}
```

3. Remove the mobile override at line 218 (`.read-link { opacity: 1; }`) since it is no longer needed -- the base opacity is already visible.

**Acceptance criteria:**
- "Read Chapter" link is visible at 70% opacity by default on all devices
- On hover, opacity increases to 100%
- No mobile-specific override needed

### 2.4 Story Title Fix

**File:** `src/pages/stories/[...slug].astro`
**Priority:** Medium -- story titles appear as second-class content

**Current state (lines 72-74):**
```css
.story-header h1 {
    color: var(--color-text-muted);
    font-style: italic;
}
```
Story titles are dimmed and italicized, making them look less important than novel chapter titles.

**Changes required:**

Replace lines 72-74 with:
```css
.story-header h1 {
    color: var(--color-heading);
    font-size: 2.5rem;
    line-height: 1.2;
    font-weight: 600;
    font-family: var(--font-serif);
}
```

This matches the novel reader's scene-header h1 styling (novel/[...slug].astro lines 94-100).

**Acceptance criteria:**
- Story titles render in the same color, size, and weight as novel chapter titles
- No italic styling on story titles
- Color is `var(--color-heading)` (#f0f2f5), not `var(--color-text-muted)` (#a0aab5)

### 2.5 Footer Cleanup

**File:** `src/components/Footer.astro`
**Priority:** Medium -- confusing text for new visitors

**Current state (line 8):**
```html
&copy; {currentYear} The StillPoint Project. All rights reserved. [CYB_STATUS: STABLE]
```

**Changes required:**

1. Remove `[CYB_STATUS: STABLE]` from line 8:
```html
&copy; {currentYear} The StillPoint Project. All rights reserved.
```

2. Remove the dead `#` links (Contact, Privacy, Terms) at lines 12-14 since they point nowhere. Replace the entire links div with nothing, or if footer links are desired, leave a comment placeholder:
```html
<!-- Future: Contact, Privacy, Terms links -->
```

3. Change `hover:text-accent-cyber` references (if any links remain) to use the unified palette accent.

**Acceptance criteria:**
- No `[CYB_STATUS: STABLE]` text in the footer
- No dead `#` links that go nowhere
- Footer shows clean copyright line only

### 2.6 Reader Italic Text Fix

**File:** `src/pages/novel/[...slug].astro`
**Priority:** Medium -- italic text is incorrectly dimmed

**Current state (lines 116-119):**
```css
.scene-content :global(em) {
    font-style: italic;
    color: var(--color-text-muted);
}
```
Italics (used for internal thoughts, emphasis) are dimmed to muted color, reducing their narrative impact.

**Changes required:**

Change `color: var(--color-text-muted)` to `color: var(--color-text)`:
```css
.scene-content :global(em) {
    font-style: italic;
    color: var(--color-text);
}
```

Also apply the same fix in `src/pages/stories/[...slug].astro` if an equivalent rule exists there. (The story reader does not have an explicit `em` rule in its scoped CSS, so this is novel-reader-only.)

**Acceptance criteria:**
- Italic text in novel reader renders at the same color as body text (#e8e8e8)
- Italic text is distinguishable by style only, not by dimmed color
- No change to `strong` text styling (it should remain `var(--color-heading)`)

---

## 3. Phase 2: Design System Unification (Sequential)

These tasks have order dependencies. Must be done in sequence within a single agent or carefully staged.

### 3.1 Execution Order

```
Step 1: Define unified design tokens (update design-tokens.css)
Step 2: Consolidate global.css to use design-tokens.css values
Step 3: Consolidate font loading in Layout.astro and ReaderLayout.astro
Step 4: Update homepage components to use unified tokens
```

### 3.2 Step 1: Unified Design Tokens

**File:** `src/styles/design-tokens.css`

**Changes:** Update the `:root` custom properties to the new refined palette. Keep all existing variable names to avoid breaking inner pages.

**New values for dark theme (:root):**

```css
:root {
  /* ===== CORE PALETTE: CONTEMPLATIVE LITERARY ===== */
  /* Backgrounds */
  --color-bg: #0f1a1e;           /* KEEP - good literary dark tone */
  --color-bg-accent: #1a2a2e;    /* KEEP */
  --color-bg-glass: rgba(26, 42, 46, 0.6); /* KEEP */

  /* Text - Warmed from pure gray */
  --color-text: #e0ddd5;          /* CHANGED from #e8e8e8 - warm off-white */
  --color-text-muted: #9ca3af;    /* CHANGED from #a0aab5 - slightly warmer */
  --color-heading: #f0ece4;       /* CHANGED from #f0f2f5 - warm white */

  /* Accents - Softened from trophy gold and neon teal */
  --color-accent-1: #c4a35a;      /* CHANGED from #d4af37 - aged book gold */
  --color-accent-2: #6b9e85;      /* CHANGED from #5a9975 - sage green */
  --color-border: rgba(196, 163, 90, 0.15); /* CHANGED - matches new gold */
  --color-selection: rgba(107, 158, 133, 0.3); /* CHANGED - matches new sage */

  /* Typography - UNCHANGED variable names */
  --font-serif: 'Crimson Text', serif;
  --font-mono: 'Space Mono', monospace;
  --font-sans: 'Inter', sans-serif;

  /* All size, spacing, animation, shadow tokens: UNCHANGED */
  /* All semantic tokens (chat, metric, alert, event): UNCHANGED structure, updated refs */

  /* Chat component borders use accent-2 which is now #6b9e85 */
  --chat-border: var(--color-accent-2);
  /* Alert component borders use accent-1 which is now #c4a35a */
  --alert-border: var(--color-accent-1);
}
```

**Light theme overrides: UNCHANGED** -- they are already well-calibrated.

**Sepia theme overrides: UNCHANGED** -- they are already well-calibrated.

**Acceptance criteria:**
- `--color-text` is `#e0ddd5` (warm off-white)
- `--color-heading` is `#f0ece4` (warm white)
- `--color-accent-1` is `#c4a35a` (aged book gold)
- `--color-accent-2` is `#6b9e85` (sage green)
- All inner pages (novel, stories, about, lore) render with the updated warm palette
- Light and sepia theme overrides unchanged
- All chat/metric/alert/event semantic tokens still resolve correctly

### 3.3 Step 2: Consolidate global.css

**File:** `src/styles/global.css`

**Goal:** Remove the competing Tailwind @theme color/font definitions. Make global.css import and use design-tokens.css values. Remove all neon/cyber colors.

**New global.css (complete replacement):**

```css
@import "tailwindcss";
@import "./design-tokens.css";

@theme {
  /* Map Tailwind theme to design tokens */
  --color-deep-space: var(--color-bg);
  --color-accent-cyber: var(--color-accent-2);   /* Was #00F0FF, now maps to sage */
  --color-accent-bio: var(--color-accent-2);      /* Was #00FF94, now maps to sage */
  --color-accent-gold: var(--color-accent-1);     /* Was #FFD700, now maps to book gold */
  --color-text-primary: var(--color-text);
  --color-glass-surface: var(--color-bg-glass);
  --color-border-glow: var(--color-border);

  --font-serif: var(--font-serif);
  --font-sans: var(--font-sans);
}

/* Prevent horizontal overflow */
html, body {
  overflow-x: hidden;
  max-width: 100%;
}

/* Reader Themes - delegate to design-tokens.css overrides */
:root[data-theme="light"] {
  --color-deep-space: var(--color-bg);
  --color-text-primary: var(--color-text);
  --color-glass-surface: var(--color-bg-glass);
  --color-border-glow: var(--color-border);
}

:root[data-theme="sepia"] {
  --color-deep-space: var(--color-bg);
  --color-text-primary: var(--color-text);
  --color-glass-surface: var(--color-bg-glass);
  --color-border-glow: var(--color-border);
}

/* Utilities */
@utility glass-panel {
  @apply bg-glass-surface backdrop-blur-md border border-border-glow;
}

@utility text-glow {
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.15);
}

/* Base Styles */
@layer base {
  body {
    @apply bg-deep-space text-text-primary font-sans antialiased;
    font-size: 18px;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-serif;
  }
}
```

**Key changes:**
- Removed `--color-accent-cyber: #00F0FF` (mapped to sage)
- Removed `--color-accent-bio: #00FF94` (mapped to sage)
- Removed `--color-accent-gold: #FFD700` (mapped to book gold)
- Removed `--font-serif: "Cinzel"` (mapped to Crimson Text via tokens)
- Removed `--font-sans: "Rajdhani"` references
- Removed `--image-hero-split` gradient
- Removed `glow-cyber` and `glow-bio` utilities (replaced with subdued text-glow)
- Added `@import "./design-tokens.css"` to unify systems
- Set base body font-size to 18px

**IMPORTANT:** The `@import "./design-tokens.css"` at the top of global.css means the design tokens `:root` block will be loaded. However, Tailwind's `@theme` directives use `var()` references to those tokens. The Tailwind Vite plugin processes `@theme` at build time -- we need to verify that `var()` references work inside `@theme` blocks. If they do not (Tailwind 4 may require literal values in `@theme`), then the `@theme` block should use the literal hex values:

```css
@theme {
  --color-deep-space: #0f1a1e;
  --color-accent-cyber: #6b9e85;
  --color-accent-bio: #6b9e85;
  --color-accent-gold: #c4a35a;
  --color-text-primary: #e0ddd5;
  --color-glass-surface: rgba(26, 42, 46, 0.6);
  --color-border-glow: rgba(196, 163, 90, 0.15);
  --font-serif: "Crimson Text", serif;
  --font-sans: "Inter", sans-serif;
}
```

**Acceptance criteria:**
- No reference to `#00F0FF`, `#00FF94`, `#FFD700`, `Cinzel`, `Rajdhani` anywhere in global.css
- Tailwind utility classes (`bg-deep-space`, `text-accent-gold`, etc.) resolve to the new palette
- Homepage and inner pages share the same background color
- Reader theme overrides (light/sepia) still work

### 3.4 Step 3: Consolidate Font Loading

**File:** `src/layouts/Layout.astro` (line 24)

**Current state:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
```
Only loads Inter and Crimson Text. Space Mono (declared in design-tokens.css) is never loaded.

**Changes required:**

1. Add Space Mono to the Google Fonts link:
```html
<link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
```

2. Add the same font link to `src/layouts/ReaderLayout.astro` inside the `<head>` block (currently at line 20, before `</head>`):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
```

3. Add preconnect hints to Layout.astro if not already present (they are, at lines 22-23 -- verify and keep).

**Acceptance criteria:**
- Space Mono renders correctly for monospace elements (system metrics, word counts)
- Crimson Text loads for all serif content across all pages
- Inter loads for UI elements
- No reference to Cinzel or Playfair Display in any font loading
- Both Layout.astro and ReaderLayout.astro load the same font set

### 3.5 Step 4: Update Homepage Components to Unified Tokens

**Files:** `src/pages/index.astro`, `src/components/Hero.tsx`, `src/components/ErasSection.tsx`, `src/components/AboutSection.astro`

This step ensures the homepage components no longer reference the old cyber palette via Tailwind classes. After Step 2 remaps the Tailwind theme, most classes will automatically resolve to new colors. But some hardcoded color values need updating.

**Hero.tsx specific changes:**

1. Remove `text-glow` from h1 (line 35). Replace with no text shadow or a very subtle one.
2. Change `text-accent-bio` and `glow-bio` references in CTA button (line 56) to `text-accent-gold`:
```tsx
className="inline-block px-8 py-4 rounded-full bg-glass-surface border border-accent-gold/30 text-accent-gold font-sans font-bold tracking-widest uppercase hover:bg-accent-gold hover:text-deep-space transition-all duration-300"
```

**ErasSection.tsx specific changes:**

1. Update era color definitions (lines 10-31). Replace:
   - `text-accent-cyber` -> `text-accent-gold` (or remove per-era coloring)
   - `text-accent-bio` -> `text-accent-gold`
   - All `glow` shadow values -> remove (set to empty string)

**AboutSection.astro specific changes:**

1. Line 4: Change `border-t-accent-cyber/20` to `border-t-accent-gold/20`

**Acceptance criteria:**
- No Tailwind class references to `accent-cyber` or `accent-bio` with old meanings remain
- Homepage renders with the same warm palette as inner pages
- No neon glow effects remain on any component

---

## 4. Phase 3: Page Redesigns (Parallel-Safe After Phase 2)

These tasks can run as parallel agents after Phase 2 is complete. Each touches different page files.

### 4.1 Homepage Redesign

**Files owned:** `src/pages/index.astro`, `src/components/Hero.tsx`, `src/components/ErasSection.tsx`, `src/components/AboutSection.astro`

**Design direction:** Replace cyberpunk split-screen hero with contemplative, typography-forward treatment. The homepage should feel like the title page of a beautiful book, not a game landing page.

**Hero.tsx rewrite:**

1. Remove the split background entirely (lines 8-23). Replace with a single solid/gradient background:
```tsx
<div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a1215] via-[#0f1a1e] to-[#0f1a1e]" />
```

2. Remove the center overlay gradient (line 26).

3. Remove all `motion.*` wrappers. Render content immediately (stillness > animation):
```tsx
<div className="relative z-20 text-center px-4 max-w-3xl mx-auto">
  <h1 className="text-5xl md:text-7xl font-serif font-light text-white mb-8 leading-tight tracking-tight">
    The StillPoint
  </h1>
  <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-serif font-light leading-relaxed">
    A story exploring presence in an age of acceleration.
  </p>
  <a
    href="/novel"
    className="inline-block px-8 py-3 border border-accent-gold/40 text-accent-gold font-sans text-sm tracking-wider uppercase hover:bg-accent-gold/10 transition-colors duration-300"
  >
    Begin the Journey
  </a>
</div>
```

4. Reduce hero from `min-h-screen` to `min-h-[70vh]`.

5. Remove `framer-motion` import entirely from Hero.tsx.

**ErasSection.tsx rewrite:**

1. Remove `framer-motion` import and all `motion.*` components
2. Remove `lucide-react` icons (Cpu, Scale, TreeDeciduous, ChevronRight)
3. Simplify to text-only cards with no hover scale animation:
```tsx
<div className="w-full md:w-1/3 p-8 border-t border-accent-gold/20">
  <h3 className="text-xl font-serif mb-4 text-white">{era.title}</h3>
  <p className="text-gray-400 leading-relaxed font-sans text-base">
    {era.description}
  </p>
</div>
```

4. Remove era-specific color coding. All cards use the same subtle treatment.

**AboutSection.astro rewrite:**

1. Remove constellation SVG pattern
2. Remove `glass-panel` class
3. Simplify to clean prose section:
```html
<section class="py-24 px-4">
  <div class="max-w-3xl mx-auto text-center">
    <h2 class="text-3xl font-serif text-white mb-12">What Is This?</h2>
    <div class="text-gray-300 leading-relaxed font-sans text-lg space-y-6 text-left">
      <!-- existing prose paragraphs -->
    </div>
  </div>
</section>
```

**index.astro changes:**

After Hero/Eras/About are rewritten, no changes needed to index.astro itself since it just imports components. However, confirm the `body` class at line 19 no longer needs `overflow-x-hidden` (it was needed for the split background).

**Acceptance criteria:**
- Homepage has no background images (no cyber-city-bg.png, no forest-bg.png referenced)
- No framer-motion animations on homepage
- No lucide-react icons on homepage
- Hero is 70vh max, typography-forward, contemplative
- Era cards are text-only with subtle borders
- About section is clean prose without glass panel
- Color palette matches inner pages exactly
- CTA button is understated (border, not filled)

### 4.2 About Page Simplification

**File owned:** `src/pages/about.astro`

**Design direction:** Remove card-per-section treatment. Use a single prose column with heading hierarchy. Let the content breathe.

**Changes:**

1. Remove the hero section entirely (lines 7-14). Replace with a simple page header:
```html
<header class="page-header">
  <h1>How This Story Is Made</h1>
  <p class="subtitle">A transparent conversation about AI, creativity, and building the future we need</p>
</header>
```

2. Remove `.section` card wrapper from all content sections. Change to simple prose sections:
```css
.section {
  max-width: 65ch;
  margin: 0 auto var(--space-2xl);
  line-height: var(--line-height-relaxed);
  /* NO: background, border, backdrop-filter, border-radius, padding */
}
```

3. Remove ALL hover effects from `.section:hover` (lines 297-301). Static content should not animate.

4. Change `.section strong` color from `var(--color-accent-1)` to `inherit` (line 323). Bold text should be same color, just heavier weight.

5. Keep workflow cards as a grid but remove hover effects from `.workflow-card:hover`.

6. Remove CTA section hover effect (`.cta-section:hover`).

7. Reduce `.about-content` max-width from 1000px to 700px.

**New page-header CSS:**
```css
.page-header {
  text-align: center;
  padding: var(--space-3xl) var(--space-lg) var(--space-2xl);
  max-width: 700px;
  margin: 0 auto;
}

.page-header h1 {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 300;
  color: var(--color-heading);
  margin-bottom: var(--space-md);
}
```

**Acceptance criteria:**
- No hero image on about page
- No glass-panel card wrappers on content sections
- No hover effects on static content
- Bold text is same color as body text
- Content width is 65ch maximum for comfortable reading
- Page header is typography-only (no background image)

### 4.3 Lore Page Information Architecture

**File owned:** `src/pages/lore.astro`

**Design direction:** Add navigation structure. Reduce visual density. Keep content but make it navigable.

**Changes:**

1. Replace hero with simple page header (same pattern as about page).

2. Add a table of contents after the intro section:
```html
<nav class="toc">
  <h2>On This Page</h2>
  <ul>
    <li><a href="#concepts">Core Concepts</a></li>
    <li><a href="#characters">Characters</a></li>
    <li><a href="#eras">Three Eras</a></li>
    <li><a href="#philosophy">Philosophy</a></li>
  </ul>
</nav>
```

3. Add `id` attributes to each section heading for anchor navigation.

4. Remove hover effects from concept cards (`.concept-card:hover` transform).

5. Reduce concept grid to 2 columns max instead of auto-fit:
```css
.concept-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  max-width: 900px;
  margin: 0 auto var(--space-2xl);
  gap: var(--space-lg);
}
```

6. Add `scroll-margin-top: 6rem` to all section headings (for fixed navbar offset).

**Acceptance criteria:**
- Table of contents with working anchor links appears after intro
- No hero image
- Concept cards do not animate on hover
- All anchor links scroll to correct section with proper offset
- Grid is max 2 columns wide

### 4.4 Navbar Redesign

**File owned:** `src/components/Navbar.tsx`

**Design direction:** Replace floating glass pill with a clean fixed bar. Add active page indicator. Rename "Chapters" to "Novel."

**IMPORTANT:** This task depends on Phase 1 Task 2.1 (mobile nav fix) being completed first. If running in Phase 3, build on top of the Phase 1 changes.

**Changes:**

1. Update navLinks array (line 5):
```tsx
const navLinks = [
    { name: 'Novel', href: '/novel' },
    { name: 'Stories', href: '/stories' },
    { name: 'World', href: '/lore' },
    { name: 'About', href: '/about' },
];
```

2. Remove `glass-panel mx-4 mt-4 rounded-full` from the inner div. Replace with:
```tsx
<div className="px-6 py-3 flex items-center justify-between max-w-5xl mx-auto">
```

3. Add active page detection. Accept `currentPath` as a prop or detect from `window.location.pathname`:
```tsx
const [currentPath, setCurrentPath] = useState('');
useEffect(() => {
  setCurrentPath(window.location.pathname);
}, []);
```

4. Add active state to links:
```tsx
className={`text-sm font-sans transition-colors uppercase tracking-wider ${
  currentPath.startsWith(link.href)
    ? 'text-accent-gold border-b border-accent-gold pb-1'
    : 'text-gray-400 hover:text-gray-200'
}`}
```

5. Change nav background from transparent glass to subtle solid:
```tsx
<nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f1a1e]/95 backdrop-blur-sm border-b border-white/5">
```

6. Remove `tracking-widest` from links (change to `tracking-wider`).

**Acceptance criteria:**
- Nav label reads "Novel" not "Chapters"
- No floating pill / rounded-full shape
- Active page has visible indicator (gold underline)
- Nav has subtle solid background, not transparent glass
- Letter spacing is `tracking-wider` not `tracking-widest`
- Mobile nav from Phase 1 still works

---

## 5. Phase 4: Polish & Performance (Parallel-Safe)

### 5.1 Image Optimization

**Files owned:** All files in `public/images/`, `public/cyber-city-bg.png`, `public/forest-bg.png`

**Changes:**

1. Delete unused images:
   - `public/images/about_hero.png`
   - `public/images/about_hero_era3.png`
   - `public/images/lore_hero.png`

2. If homepage redesign (Phase 3) removes split background, delete:
   - `public/cyber-city-bg.png` (6.9 MB)
   - `public/forest-bg.png` (6.5 MB)

3. Convert remaining hero images to WebP:
   - `hawthorne_hero.png` -> `hawthorne_hero.webp`
   - `riverbend_hero.png` -> `riverbend_hero.webp`
   - `manitou_hero.png` -> `manitou_hero.webp`
   - `about_hero_solarpunk_2100.jpg` -> `about_hero_solarpunk_2100.webp`

4. Generate responsive srcset versions (640w, 1024w, 1920w) for each hero image.

5. Update all CSS `background-image` references in `novel.astro`, `stories.astro` to use WebP paths. If hero images are removed by Phase 3 page redesigns, this step becomes a deletion instead.

6. Add `background-attachment: scroll` on all hero sections at mobile widths (fix the missing mobile override on novel.astro and stories.astro):

In `novel.astro` and `stories.astro`, add to the `@media (max-width: 768px)` block:
```css
.hero {
  background-attachment: scroll;
}
```

**Acceptance criteria:**
- No unused images in public/images/
- All remaining hero images are WebP format
- No single image exceeds 300 KB
- `background-attachment: fixed` is overridden to `scroll` on mobile for all pages
- Total image payload reduced by at least 50%

### 5.2 Reading Progress Bar

**Files owned:** New file `src/components/ReadingProgress.tsx`, plus modifications to `src/layouts/ReaderLayout.astro`

**Implementation:**

Create a thin progress bar at the top of the viewport that fills as the user scrolls through content.

```tsx
// src/components/ReadingProgress.tsx
import React, { useState, useEffect } from 'react';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${progress}%`,
        height: '2px',
        backgroundColor: 'var(--color-accent-1)',
        zIndex: 100,
        transition: 'width 0.1s linear',
      }}
    />
  );
}
```

Add to ReaderLayout.astro after the Navbar:
```html
<ReadingProgress client:only="react" />
```

**Acceptance criteria:**
- 2px gold bar at top of viewport on reader pages only
- Fills from 0% to 100% as user scrolls
- Uses `var(--color-accent-1)` (respects theme changes)
- Does not appear on non-reader pages
- Passive scroll listener for performance

### 5.3 Reader Controls Refinement

**File owned:** `src/components/ReaderControls.tsx`

**Changes:**

1. Change default font from `'sans'` to `'serif'` (line 12):
```tsx
const [fontFamily, setFontFamily] = useState<FontFamily>('serif');
```

2. Change localStorage default from `'sans'` to `'serif'` (line 20):
```tsx
const savedFont = localStorage.getItem('reader-font') as FontFamily || 'serif';
```

3. Reduce FAB button prominence (line 74). Change from bright green circle to subtle semi-transparent:
```tsx
className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[var(--color-bg-accent)]/80 text-[var(--color-text-muted)] border border-[var(--color-border)] shadow-md hover:bg-[var(--color-bg-accent)] hover:text-white transition-all"
```

4. Change all `bg-accent-bio` references in the controls panel to `bg-accent-gold`:
   - Theme buttons active state (line 99)
   - Font family buttons active state (lines 113, 119, 125)
   - Width buttons active state (lines 152, 158, 164)
   - Range input accent color (line 142): `accent-accent-gold`

**Acceptance criteria:**
- Default font is serif (Crimson Text), not sans (Inter)
- FAB button is subtle and semi-transparent, not bright green
- All active states in controls panel use gold accent, not green
- Stored user preferences still override defaults correctly

### 5.4 Chapter Numbers and Reading Time

**File owned:** `src/pages/novel.astro`

**Changes:**

1. Add chapter/scene number display to each scene card. The chapter/scene data is available in `scene.data.chapter` and `scene.data.scene` from frontmatter.

Update the card template (lines 30-40):
```html
<article class="scene-card">
  <div class="scene-info">
    <span class="chapter-number">{scene.data.chapter?.replace('E1', 'Ch. ').replace('C', '')}{scene.data.scene?.replace('S', '.')}</span>
    <h3>
      <a href={`/novel/${scene.id}`}>
        {scene.data.title}
      </a>
    </h3>
  </div>
  <div class="scene-meta">
    {scene.data.word_count && (
      <span class="reading-time">{Math.ceil(scene.data.word_count / 250)} min read</span>
    )}
    <span class="read-link">Read Chapter &rarr;</span>
  </div>
</article>
```

2. Add CSS for the new elements:
```css
.chapter-number {
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: var(--color-accent-1);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: block;
  margin-bottom: var(--space-xs);
}

.reading-time {
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-right: var(--space-md);
}
```

**Note:** The chapter/scene frontmatter format is `E1C01`/`S01`. The display transform `E1C01` -> `Ch. 01` is a simple string replacement. If chapter data is not consistently available, fall back to the index position.

**Acceptance criteria:**
- Each scene card shows a chapter number (e.g., "Ch. 01.01")
- Each scene card shows estimated reading time (word_count / 250, rounded up)
- Chapter numbers use monospace font in gold accent
- Reading time uses monospace font in muted color

### 5.5 Shared Reader CSS Extraction

**Files owned:** New file `src/styles/reader-narrative.css`, modifications to `src/pages/novel/[...slug].astro` and `src/pages/stories/[...slug].astro`

**Changes:**

1. Create `src/styles/reader-narrative.css` containing the shared chat/metric/alert/event CSS rules. These are currently duplicated verbatim between novel/[...slug].astro (lines 176-288) and stories/[...slug].astro (lines 79-191).

The shared file uses a generic parent selector:
```css
/* src/styles/reader-narrative.css */
@import './design-tokens.css';

/* Chat message blockquotes */
:global(blockquote[data-type="chat"]) { /* ... all chat rules ... */ }

/* System metrics */
:global(p[data-type="system-metric"]) { /* ... all metric rules ... */ }

/* Alerts */
:global(p[data-type="alert"]) { /* ... all alert rules ... */ }

/* Events */
:global(p[data-type="event"]) { /* ... all event rules ... */ }
```

2. In both novel/[...slug].astro and stories/[...slug].astro, replace the duplicated narrative CSS blocks with a single import:
```css
@import '../../styles/reader-narrative.css';
```

**IMPORTANT:** Astro scoped styles cannot import external files that use `:global()`. This extraction may need to be done as a layout-level stylesheet import in ReaderLayout.astro instead. Test both approaches. If scoped import does not work, add the import to ReaderLayout.astro's style block.

**Acceptance criteria:**
- Chat/metric/alert/event CSS exists in exactly one file
- Both novel and story readers render narrative elements identically
- Changes to narrative styling only need to be made in one place
- No visual regression in any narrative element

---

## 6. Agent Parallelization Map

### Phase 1: 6 Parallel Agents

| Agent | Task | Files Owned | Dependencies |
|-------|------|------------|--------------|
| P1-A | Mobile nav fix | `src/components/Navbar.tsx` | None |
| P1-B | Reader CSS defaults | `src/layouts/ReaderLayout.astro` | None |
| P1-C | Visible chapter links | `src/pages/novel.astro` | None |
| P1-D | Story title fix | `src/pages/stories/[...slug].astro` | None |
| P1-E | Footer cleanup | `src/components/Footer.astro` | None |
| P1-F | Reader italic fix | `src/pages/novel/[...slug].astro` | None |

**No file overlaps. All 6 can run simultaneously.**

### Phase 2: 1 Sequential Agent

| Agent | Task | Files Owned | Dependencies |
|-------|------|------------|--------------|
| P2-A | Design system unification | `design-tokens.css`, `global.css`, `Layout.astro`, `ReaderLayout.astro`, `Hero.tsx`, `ErasSection.tsx`, `AboutSection.astro` | Phase 1 complete (P1-B modified ReaderLayout.astro) |

**Must be single agent -- steps have order dependencies. This agent touches many files because the design system is foundational.**

### Phase 3: 4 Parallel Agents

| Agent | Task | Files Owned | Dependencies |
|-------|------|------------|--------------|
| P3-A | Homepage redesign | `index.astro`, `Hero.tsx`, `ErasSection.tsx`, `AboutSection.astro` | Phase 2 complete |
| P3-B | About page simplification | `about.astro` | Phase 2 complete |
| P3-C | Lore page IA | `lore.astro` | Phase 2 complete |
| P3-D | Navbar redesign | `Navbar.tsx` | Phase 2 complete + Phase 1 P1-A |

**Note:** P3-A and P2-A both touch Hero.tsx/ErasSection.tsx/AboutSection.astro. P3-A must run AFTER P2-A is complete. The Phase 2 agent makes the minimal token-mapping changes; Phase 3 agent P3-A does the full component rewrite.

### Phase 4: 5 Parallel Agents

| Agent | Task | Files Owned | Dependencies |
|-------|------|------------|--------------|
| P4-A | Image optimization | `public/images/*`, `public/*.png` | Phase 3 complete (to know which images survive) |
| P4-B | Reading progress bar | New `ReadingProgress.tsx`, `ReaderLayout.astro` | Phase 2 complete |
| P4-C | Reader controls refinement | `ReaderControls.tsx` | Phase 2 complete |
| P4-D | Chapter numbers + reading time | `novel.astro` | Phase 1 P1-C complete |
| P4-E | Shared reader CSS extraction | New `reader-narrative.css`, `novel/[...slug].astro`, `stories/[...slug].astro` | Phase 1 P1-D and P1-F complete |

**File conflict note:** P4-B and Phase 2 both touch ReaderLayout.astro. P4-B should run after Phase 2.

### Total Agent Counts

| Phase | Agents | Can Parallelize? | Estimated Time |
|-------|--------|-------------------|----------------|
| Phase 1 | 6 | Yes (all) | 15-30 min each |
| Phase 2 | 1 | No (sequential) | 45-90 min |
| Phase 3 | 4 | Yes (all) | 30-60 min each |
| Phase 4 | 5 | Yes (all) | 20-45 min each |
| **Total** | **16 agent-tasks** | | |

---

## 7. Design Tokens Appendix

### 7.1 Complete Color Palette

**Dark theme (default):**

| Token | Current Value | New Value | Usage |
|-------|---------------|-----------|-------|
| `--color-bg` | `#0f1a1e` | `#0f1a1e` | Page background |
| `--color-bg-accent` | `#1a2a2e` | `#1a2a2e` | Card/panel background |
| `--color-bg-glass` | `rgba(26,42,46,0.6)` | `rgba(26,42,46,0.6)` | Glassmorphism |
| `--color-text` | `#e8e8e8` | **`#e0ddd5`** | Body text |
| `--color-text-muted` | `#a0aab5` | **`#9ca3af`** | Secondary text, labels |
| `--color-heading` | `#f0f2f5` | **`#f0ece4`** | Headings |
| `--color-accent-1` | `#d4af37` | **`#c4a35a`** | Primary accent (gold) |
| `--color-accent-2` | `#5a9975` | **`#6b9e85`** | Secondary accent (sage) |
| `--color-border` | `rgba(212,175,55,0.2)` | **`rgba(196,163,90,0.15)`** | Borders |
| `--color-selection` | `rgba(90,153,117,0.3)` | **`rgba(107,158,133,0.3)`** | Text selection |

**Tailwind theme mappings (global.css):**

| Tailwind Token | Maps To | Hex Value |
|----------------|---------|-----------|
| `--color-deep-space` | `--color-bg` | `#0f1a1e` |
| `--color-accent-cyber` | `--color-accent-2` | `#6b9e85` |
| `--color-accent-bio` | `--color-accent-2` | `#6b9e85` |
| `--color-accent-gold` | `--color-accent-1` | `#c4a35a` |
| `--color-text-primary` | `--color-text` | `#e0ddd5` |
| `--color-glass-surface` | `--color-bg-glass` | `rgba(26,42,46,0.6)` |
| `--color-border-glow` | `--color-border` | `rgba(196,163,90,0.15)` |

**REMOVED colors (no longer in any file):**

| Color | Old Value | Reason |
|-------|-----------|--------|
| Cyber cyan | `#00F0FF` | Too aggressive for literary site |
| Bio green | `#00FF94` | Too aggressive for literary site |
| Pure gold | `#FFD700` | Too bright, replaced with `#c4a35a` |

**Light theme: UNCHANGED from current design-tokens.css**

**Sepia theme: UNCHANGED from current design-tokens.css**

### 7.2 Typography Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--font-serif` | `'Crimson Text', serif` | Headings, reading content (default) |
| `--font-sans` | `'Inter', sans-serif` | UI elements, nav, labels |
| `--font-mono` | `'Space Mono', monospace` | System metrics, code, word counts |
| `--font-size-xs` | `0.75rem` (12px) | Labels, meta |
| `--font-size-sm` | `0.875rem` (14px) | Small text, nav |
| `--font-size-base` | `1rem` (16px) | UI base |
| `--font-size-lg` | `1.125rem` (18px) | Reader default, large UI |
| `--font-size-xl` | `1.25rem` (20px) | Sub-headings |
| `--font-size-2xl` | `1.5rem` (24px) | Section headings |
| `--font-size-3xl` | `1.875rem` (30px) | Page headings |
| `--font-size-4xl` | `2.25rem` (36px) | Hero sub-text |
| `--font-size-5xl` | `3rem` (48px) | Hero title |

**Body font-size:** `18px` set on `body` in global.css base layer.

**Reader content font-size:** `18px` default via CSS, overridable by ReaderControls (14-32px range).

**Reader content line-height:** `1.8` (increased from 1.7).

**Google Fonts loaded:**
```
Crimson Text: 400, 400i, 600
Inter: 300, 400, 500, 600
Space Mono: 400, 700
```

**Fonts REMOVED:** Cinzel, Playfair Display, Rajdhani (never properly loaded, now officially removed from all declarations).

### 7.3 Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `0.5rem` (8px) | Tight gaps |
| `--space-sm` | `0.75rem` (12px) | Small gaps |
| `--space-md` | `1rem` (16px) | Default spacing |
| `--space-lg` | `1.5rem` (24px) | Section padding |
| `--space-xl` | `2rem` (32px) | Major section gaps |
| `--space-2xl` | `3rem` (48px) | Page section breaks |
| `--space-3xl` | `4rem` (64px) | Hero/footer padding |

**No changes to spacing scale.** Current values are well-calibrated.

### 7.4 Component-Specific Tokens

**Cards (concept, story, scene):**

| Property | Current | New |
|----------|---------|-----|
| border-left | `4px solid --color-accent-1` | `3px solid --color-accent-1` |
| border-radius | `12px` | `8px` |
| hover transform | `translateY(-4px)` | **Remove** (no hover animation on cards) |
| hover box-shadow | `--shadow-lg` | **Remove** |
| backdrop-filter | `blur(10px)` | **Remove** (unnecessary visual complexity) |

**Navigation:**

| Property | Current | New |
|----------|---------|-----|
| Container | `glass-panel rounded-full mx-4 mt-4` | `bg-[#0f1a1e]/95 backdrop-blur-sm border-b border-white/5` |
| Link style | `text-sm tracking-widest uppercase` | `text-sm tracking-wider uppercase` |
| Active state | None | `text-accent-gold border-b border-accent-gold` |
| Logo font | `font-serif font-bold text-2xl` | `font-serif font-light text-xl tracking-tight` |

**Reader FAB:**

| Property | Current | New |
|----------|---------|-----|
| Background | `bg-accent-bio` (bright green) | `bg-[--color-bg-accent]/80` (subtle dark) |
| Text color | `text-deep-space` | `text-[--color-text-muted]` |
| Size | `p-4` | `p-3` |
| Border | None | `border border-[--color-border]` |

**Reader Controls Panel:**

| Property | Current | New |
|----------|---------|-----|
| Active toggle bg | `bg-accent-bio` (bright green) | `bg-accent-gold` (warm gold) |
| Active toggle text | `text-deep-space` | `text-deep-space` (unchanged) |
| Slider accent | `accent-accent-bio` | `accent-accent-gold` |

---

## Summary of All File Modifications

| File | Phase | Changes |
|------|-------|---------|
| `src/components/Navbar.tsx` | P1, P3 | Mobile menu (P1), redesign (P3) |
| `src/layouts/ReaderLayout.astro` | P1, P2, P4 | CSS defaults (P1), fonts (P2), progress bar (P4) |
| `src/pages/novel.astro` | P1, P4 | Visible links (P1), chapter numbers (P4) |
| `src/pages/stories/[...slug].astro` | P1, P4 | Title fix (P1), shared CSS (P4) |
| `src/components/Footer.astro` | P1 | Cleanup |
| `src/pages/novel/[...slug].astro` | P1, P4 | Italic fix (P1), shared CSS (P4) |
| `src/styles/design-tokens.css` | P2 | Unified palette |
| `src/styles/global.css` | P2 | Consolidated with tokens |
| `src/layouts/Layout.astro` | P2 | Font loading |
| `src/components/Hero.tsx` | P2, P3 | Token mapping (P2), full rewrite (P3) |
| `src/components/ErasSection.tsx` | P2, P3 | Token mapping (P2), full rewrite (P3) |
| `src/components/AboutSection.astro` | P2, P3 | Token mapping (P2), simplification (P3) |
| `src/pages/index.astro` | P3 | Homepage restructure |
| `src/pages/about.astro` | P3 | Simplification |
| `src/pages/lore.astro` | P3 | Information architecture |
| `src/components/ReaderControls.tsx` | P4 | Default font, FAB styling |
| `src/components/ReadingProgress.tsx` | P4 | **NEW FILE** |
| `src/styles/reader-narrative.css` | P4 | **NEW FILE** |
| `public/images/*` | P4 | WebP conversion, dead asset removal |
| `public/*.png` | P4 | Deletion (cyber-city-bg, forest-bg) |
