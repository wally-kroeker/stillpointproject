# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The StillPoint Saga is a multi-era science fiction novel project spanning 2025-2095, exploring humanity's path from technological acceleration crisis to contemplative renaissance. This is a structured creative writing project that publishes as it's created, using an Astro-based web platform.

## Key Reference Files

- `world/still_point_world_bible.md` - Canonical world reference covering timeline, characters, locations, and lore
- `world/outline.md` - Complete 40-chapter story structure across three eras
- `world/workflow.md` - Chapter development workflow and status tracking
- `cline_docs/productContext.md` - High-level project vision and goals
- `astro-dev-site/src/content.config.ts` - Content schemas and validation rules

## Content Architecture

### Story Structure
- **Era 1 (2029-2036):** The Cascade - Near-future crisis and StillPoint device invention
- **Era 2 (2037-2060):** The Balance War - Societal transition and conflict
- **Era 3 (2061+):** Luminous Presence - Integrated contemplative society

### Directory Organization
- `/novel/` - Scene files (canonical source)
- `/short_stories/` - Short story files (canonical source)
- `/world/` - World building content (canonical source)
- `/astro-dev-site/` - Astro web application (publishing platform)
- `/scripts/` - Sync and deployment utilities

## Development Workflow

### Prerequisites
- Node.js v18.20.8+ (v22.20.0 recommended)
- SSH key at `~/.ssh/id_rsa_stillpoint` (for deployment)

### Common Commands
- **Sync content:** `./scripts/sync-content-to-astro.sh` (Source -> Astro)
- **Start dev server:** `cd astro-dev-site && npm run dev` (http://localhost:4321)
- **Build site:** `cd astro-dev-site && npm run build`
- **Deploy staging:** `./scripts/deploy-staging.sh`
- **Deploy production:** `./scripts/deploy-production.sh` (https://stillpointproject.org)

### Content Workflow (CRITICAL)
Always edit source files, NEVER synced copies.

1. **Edit:** `/novel/scenes/*.md` or `/short_stories/*.md`
2. **Audio (optional):** `./scripts/generate-audio.sh <file>` then add `audio_file` to frontmatter
3. **Sync:** `./scripts/sync-content-to-astro.sh`
4. **Preview:** `cd astro-dev-site && npm run dev`
5. **Deploy:** `./scripts/deploy-staging.sh` then `./scripts/deploy-production.sh`

## Content Standards

All content must use YAML frontmatter. See `astro-dev-site/src/content.config.ts` for strict schemas.

### Novel Scenes (`/novel/scenes/`)
```yaml
---
title: "Scene Title"
era: "The Cascade"
location: "Location Name"
pov_character: "Character Name"
voice: "Narrative voice description"
word_count: 1500
page_count: 6
status: "draft" | "proofread" | "published"
chapter: "E1C01"
scene: "S01"
---
```

### Short Stories (`/short_stories/`)
```yaml
---
title: "Story Title"
status: "draft" | "published"
type: "short_story"
---
```

## Creative Partner Role

When working in the StillPoint project, Bob IS the creative partner. No separate agent needed — this role is built into the primary assistant. The creative partner handles brainstorming, story architecture, scene brief production, and orchestration of the writing agents.

### Canon Grounding (Before Any Significant Work)

Before brainstorming, producing scene briefs, or making story decisions:
1. Read `world/still_point_world_bible.md` for canonical reference
2. Glob `world/**/*.md` to discover available canon cards
3. Read relevant character cards from `world/characters/`
4. Read relevant location cards from `world/locations/`
5. Read relevant technology cards from `world/technology/`
6. Check `world/outline.md` for narrative context and chapter structure

### Scene Brief Production

Scene briefs are the handoff document between creative partner and narrator. Every brief must contain:

- **Core Tension:** The central conflict or question driving the scene
- **Emotional Arc:** Where the POV character starts emotionally → where they end
- **Sensory Palette:** 3-5 specific sensory cues (sights, sounds, textures, smells, tastes) grounding the scene
- **Key Beats (6-12):** Crucial moments that must occur, written as specific causal actions (not vague summaries)
- **Thematic Resonance:** How this scene connects to the saga's deeper themes

### Quality Gate for Narrator Handoff

A scene brief is ready for the narrator when ALL of these are true:
- Intent is clear (the reader should feel X by the end)
- Stakes are concrete (something specific is at risk)
- Beats are causal (each beat follows logically from the previous)
- 3+ sensory cues are specific to this scene (not generic "it was dark")
- POV character's emotional start and end states are distinct

### Era-Specific Brief Awareness

Briefs should reflect the era's tone:
- **The Cascade (2029-2036):** Urgency, acceleration, fracture. Tech as unstoppable force.
- **The Balance War (2037-2060):** Political tension, institutional language cracking. Measured pacing with sudden disruptions.
- **Luminous Presence (2061+):** Contemplative, spacious. Natural rhythm. Silence matters.

### Anti-Cliche Beat Writing

Beats must be specific and causal, never generic:
- BAD: "Jonah realizes the truth"
- GOOD: "Jonah finds Mira's handwritten note tucked inside the device prototype — the calibration numbers match the ones she told him were impossible"

### Orchestration Protocol

After creative work, route to the appropriate agent:
- **READY** → Narrator agent (scene brief is complete and passes quality gate)
- **NEEDS LORE** → Lore Keeper agent (new canon elements need cards or consistency checks)
- **NEEDS EDIT** → Editor agent (existing prose needs craft feedback)

### Output Rules

- **Never use `[[wiki-links]]` in any output.** Canon awareness comes from reading world files, not embedding link syntax. Wiki-links pollute the published website.
- Reference characters, locations, and technology by name in prose and briefs.

## Writing Agents

Three specialized agents handle distinct phases of the writing process:
- **Narrator** (`.claude/agents/narrator.md`): Transforms scene briefs into finished prose. Canon-grounded.
- **Editor** (`.claude/agents/editor-mode-agent.md`): Craft feedback from a fresh reader perspective. Deliberately canon-blind.
- **Lore Keeper** (`.claude/agents/lore-keeper.md`): Canon guardian. Creates cards, audits consistency, manages world bible.
