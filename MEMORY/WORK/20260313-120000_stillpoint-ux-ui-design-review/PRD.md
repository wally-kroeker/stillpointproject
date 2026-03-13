---
task: Create phased implementation spec for StillPoint website redesign
slug: 20260313-120000_stillpoint-ux-ui-design-review
effort: deep
phase: complete
progress: 18/18
mode: interactive
started: 2026-03-13T12:00:00-05:00
updated: 2026-03-13T14:30:00-05:00
---

## Context

Full UX/UI design audit of stillpointproject.org produced a comprehensive DESIGN_REVIEW.md. This follow-up task creates the actionable IMPLEMENTATION_SPEC.md -- a phased, agent-parallelizable blueprint that any engineer agent can pick up and execute without asking questions.

The spec covers 4 phases (20 discrete tasks across 16 agent-tasks), exact file paths, exact CSS values, acceptance criteria, and a complete design tokens appendix.

### Risks
- Tailwind 4 @theme directives may not accept var() references -- spec includes literal hex fallback
- Shared reader CSS extraction may not work with Astro scoped styles -- spec includes layout-level alternative
- Chapter/scene frontmatter format varies -- spec includes index-position fallback

## Criteria

- [x] ISC-1: Architecture overview maps all key files to their design system
- [x] ISC-2: Phase 1 specifies 6 parallel-safe critical fixes with no file overlap
- [x] ISC-3: Mobile nav fix includes complete React state and JSX implementation
- [x] ISC-4: Reader CSS defaults specify max-width, font-family, font-size, line-height
- [x] ISC-5: Visible chapter links specify exact opacity values
- [x] ISC-6: Story title fix specifies exact CSS properties matching novel reader
- [x] ISC-7: Footer cleanup specifies removal of CYB_STATUS and dead links
- [x] ISC-8: Phase 2 has explicit execution order with 4 sequential steps
- [x] ISC-9: Unified design tokens include exact hex values for all changed colors
- [x] ISC-10: Global.css consolidation removes all neon colors and maps to tokens
- [x] ISC-11: Font loading consolidation adds Space Mono and covers both layouts
- [x] ISC-12: Phase 3 homepage redesign removes framer-motion and split backgrounds
- [x] ISC-13: About page simplification removes card wrappers and hover effects
- [x] ISC-14: Lore page adds table of contents with anchor navigation
- [x] ISC-15: Navbar redesign specifies active page detection and label rename
- [x] ISC-16: Phase 4 image optimization identifies 13.4MB of deletable images
- [x] ISC-17: Agent parallelization map shows file ownership per agent with no conflicts
- [x] ISC-18: Design tokens appendix has complete color, typography, spacing, component tables

## Decisions

- Kept design-tokens.css as the source of truth rather than migrating everything to Tailwind @theme, because inner pages already depend on CSS custom properties extensively
- Mapped Tailwind theme tokens to design-tokens.css values rather than eliminating Tailwind, preserving homepage component utility classes
- Provided literal hex fallback for @theme block in case Tailwind 4 cannot resolve var() at build time
- Chose to remove all framer-motion animations from homepage rather than toning them down, aligning with "stillness as default" principle
- Reader CSS defaults set in CSS with JS enhancement overlay, preventing layout shift without breaking user preferences

## Verification

All 18 criteria verified by inspecting the IMPLEMENTATION_SPEC.md output against the design review requirements and actual codebase file contents.
