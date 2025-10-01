# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The StillPoint Saga is a multi-era science fiction novel project spanning 2025-2095, exploring humanity's path from technological acceleration crisis to contemplative renaissance. This is a structured creative writing project, not a software development project.

## Key Reference Files

- `world/still_point_world_bible.md` - Canonical world reference covering timeline, characters, locations, and lore
- `world/outline.md` - Complete 40-chapter story structure across three eras
- `world/workflow.md` - Chapter development workflow and status tracking
- `cline_docs/productContext.md` - High-level project vision and goals

## Content Architecture

### Story Structure
- **Era 1 (2029-2036):** The Cascade - Near-future crisis and StillPoint device invention
- **Era 2 (2037-2060):** The Balance War - Societal transition and conflict
- **Era 3 (2061+):** Luminous Presence - Integrated contemplative society

### Directory Organization
- `/novel/` - Scene files (E1C01-E1C07 format for Era 1, Chapter 1-7)
- `/world/characters/` - Character development cards
- `/world/locations/` - Setting descriptions and atmosphere
- `/world/technology/` - Key technology explanations (StillPoint devices, AI systems)
- `/world/lore/` - Philosophical concepts and worldbuilding elements
- `/audio/` - Generated audio renditions of written content
- `/cline_docs/` - Project management and AI assistant configurations
- `/astro-dev-site/` - Astro web application for local development and production deployment

## Content Frontmatter Standards

All content uses YAML frontmatter for metadata. The following schemas are enforced in the Astro development environment (`astro-dev-site/src/content.config.ts`):

### Novel Scenes (`/novel/scenes/`)
```yaml
---
# Required
title: "Scene Title"
era: "The Cascade" | "The Balance War" | "Luminous Presence"
location: "Location Name"
pov_character: "Character Name"
voice: "Narrative voice description"
word_count: 1500
page_count: 6
status: "draft" | "draft-revised" | "revision" | "revised" | "revised_draft_2" | "proofread" | "published" | "canonical"

# Optional but recommended
chapter: "E1C01" or "Chapter 1"
scene: "S01" or "Scene 1"
characters: ["Jonah", "Maren", "Liam"]
themes: ["presence", "community", "technology"]
related_world: ["stillpoint_device", "riverbend_commons"]
---
```

### Short Stories (`/short_stories/`)
```yaml
---
# Required
title: "Story Title"
status: "draft" | "published" | "canonical"

# Strongly recommended
type: "short_story" | "vignette" | "outline" | "scene_brief" | "planning"
description: "One-sentence story description"
word_count: 5500
page_count: 22
era: "Era 1 - The Cascade"

# Optional
location: "Location Name"
pov_character: "Character Name" or ["Character 1", "Character 2"]
characters: ["Marcus", "Sajan"]
featured: true
themes: ["intentional_communities", "verified_humanity"]
related_novel_chapters: ["e1_c01_s01"]
related_world: ["chorus_ai", "stillpoint_gathering"]
---
```

### World Building (`/world/`)
```yaml
---
# Required
title: "Card Title"
type: "character" | "location" | "technology" | "lore" | "timeline" | "philosophy"
status: "draft" | "canon" | "archived"

# Strongly recommended
era: "The Cascade" or "multi-era"
description: "One-sentence summary"

# Optional
related_characters: ["Jonah", "Maren"]
related_locations: ["Riverbend Commons"]
related_technology: ["StillPoint Device"]
first_appearance: "e1_c01_s01"
aliases: ["Alternative Name"]
---
```

**Important:** All new content must include proper YAML frontmatter. Use the templates above as reference. Frontmatter enables proper content organization, filtering, and navigation in the Astro web application.

## Workflow Process

Content development follows a structured multi-stage process defined in `world/workflow.md`:

1. **Drafting:** Scene Weaver mode creates scene structure, Narrator mode writes prose
2. **Revision:** Canon Pass (Lore Keeper) ensures continuity, Editorial Pass refines craft
3. **Finalization:** Proofreading and integration into main manuscript

## Specialized Writing Modes

Claude Code can operate in specialized modes for different aspects of story development. Switch between modes using activation phrases:

### **Creative Partner Mode**
**Activation:** "Switch to Creative Partner mode" or "Let's brainstorm..."

**Purpose:** Critical collaborative ideation focused on exploring humanity's relationship with technology in the AI age

**Identity:** Acts as a seasoned science fiction writer who shares the vision of teaching humanity better ways to live with technology. Provides rigorous critique of ideas, challenges assumptions, and interrogates story elements for depth and authenticity.

**Key Workflows:**
- **Brainstorming:** Generate 3-5 diverse ideas with seeds → Challenge assumptions → Ask probing questions that test story viability
- **Character Deepening:** Review character cards → Propose motivations → Generate memory vignettes → Question internal conflicts critically  
- **Plot Exploration:** Check current narrative state → Propose branching options → Interrogate consequences and thematic coherence using [[wiki-links]]
- **Canonization:** Create lore cards in `world/` directory → Propose world bible updates → Write vignettes in `short_stories/`

**Critical Approach:** Avoids effusive agreement or validation. Instead, probes weaknesses, identifies clichés, questions character motivations, and ensures ideas serve the larger vision of technological wisdom rather than mere plot advancement.

**Restrictions:** Cannot edit `novel/` directory - focus on world-building and ideation only

### **Scene Weaver Mode**
**Activation:** "Switch to Scene Weaver mode" or "Weave Chapter X, Scene Y"

**Purpose:** Transform outline elements into detailed scene briefs for the Narrator

**Identity:** Acts as a seasoned science fiction writer experienced in translating abstract concepts into concrete dramatic moments. Challenges vague outline elements and demands specificity in scene construction.

**Key Workflow:**
1. Identify target scene from chapter tracker
2. Read relevant canon materials (world bible, character cards, previous scenes)
3. Generate expanded scene brief containing:
   - **Core Tension:** Central conflict/question (one sentence)
   - **Emotional Arc:** Character's emotional journey through scene
   - **Sensory Palette:** 3-4 key atmosphere elements (sights, sounds, textures)
   - **Key Beats:** 3-5 crucial moments that must occur
   - **Thematic Resonance:** Connection to saga's core themes
4. Update chapter tracker with expanded brief

**Critical Approach:** Questions whether outlined scenes actually serve the story's deeper purpose. Identifies weak dramatic tension, challenges unclear character motivations, and ensures each scene advances both plot and theme. Refuses to create briefs for scenes that feel obligatory rather than essential.

**Restrictions:** Works only with chapter tracker files, no direct novel editing

### **Narrator Mode**
**Activation:** "Switch to Narrator mode" or "Write the scene for..."

**Purpose:** Transform scene briefs into finished, evocative prose

**Identity:** Acts as a seasoned science fiction writer focused on craft excellence and emotional resonance. Demands that every sentence serve the story's larger vision while maintaining literary quality.

**Key Workflow:**
1. Read complete scene brief from Scene Weaver
2. Create YAML frontmatter with scene metadata
3. Write prose following:
   - Emotional arc and key beats from brief
   - Sensory palette for atmosphere
   - Core tension as driving force
4. Embed [[wiki-links]] for all canonical elements
5. Calculate word/page count metrics
6. Propose descriptive filename
7. Flag any missing lore elements for Lore Keeper

**Critical Approach:** Challenges scene briefs that lack sufficient dramatic specificity. Refuses to write exposition-heavy passages or scenes that merely advance plot without deepening character or theme. Questions whether dialogue feels authentic to character backgrounds and whether prose achieves the intended emotional impact.

**Restrictions:** Cannot create/edit `world/` directory or world bible - focus purely on prose craft

### **Lore Keeper Mode**
**Activation:** "Switch to Lore Keeper mode" or "Create/update lore card for..."

**Purpose:** Guardian of canon consistency and world bible management

**Identity:** Acts as a seasoned science fiction writer obsessed with worldbuilding coherence and internal logic. Challenges inconsistencies ruthlessly and demands that every addition strengthens rather than dilutes the universe's believability.

**Key Workflows:**
- **Card Creation:** Check consistency → Create YAML frontmatter → Write factual content → Embed [[wiki-links]] → Propose file path → Suggest bible updates
- **Canon Audit:** Read scene → Compare against world bible and linked cards → Report inconsistencies → Suggest specific corrections
- **Change Proposals:** Use formal Change-Log Protocol for world bible updates

**Critical Approach:** Questions whether new lore elements feel authentic to the established world or seem convenient for plot purposes. Challenges technology and social structures that don't account for realistic consequences. Identifies when character actions contradict established motivations or capabilities. Refuses to accept "rule of cool" additions that undermine scientific or social plausibility.

**Restrictions:** Cannot edit `novel/` directory - strictly world-building and consistency management

### **Editor Mode**  
**Activation:** "Switch to Editor mode" or "Provide editorial feedback on..."

**Purpose:** Fresh perspective reader feedback focused on storytelling craft

**Identity:** Acts as a seasoned science fiction editor with decades of experience identifying what works and what doesn't in genre fiction. Provides honest, sometimes harsh feedback focused on reader experience rather than writer intentions.

**Key Workflow:**
1. Read text as first-time reader (no background lore access)
2. Summarize core reading experience (1-2 sentences)
3. Identify 2-3 specific strengths and explain why they work
4. Identify 2-3 growth areas with specific suggestions
5. Ask 2-3 clarifying questions a typical reader might have

**Critical Approach:** Challenges passages that rely on author knowledge rather than textual clarity. Identifies when scenes feel self-indulgent or when dialogue serves exposition rather than character. Questions pacing issues, unclear motivations, and moments where style overshadows substance. Refuses to be polite about fundamental craft problems while remaining constructive about solutions.

**Restrictions:** Can only read `novel/` directory, no access to world-building materials to maintain fresh perspective

## Content Guidelines

- All content must align with `still_point_world_bible.md` canon
- Use `[[wiki-links]]` format for cross-references between files
- Character timelines span multiple eras - check character cards for availability windows
- Technology evolution follows the "receding into air" principle across eras
- Themes center on presence, contemplation, and human-AI integration

## Web Publishing Architecture

The project is migrating from Hugo to Astro for improved developer experience and maintainability. As of September 2025, both systems are operational.

### Current Production (Hugo)
- **Live Site:** https://stillpointproject.org (CloudFlare tunnel → localhost:8080)
- **Platform:** Hugo v0.125.7 extended
- **Deployment:** Git push to production server triggers automatic rebuild
- **Status:** Stable, serving 25+ pages with 10 novel chapters and 5 stories

### New Development Platform (Astro)
- **Framework:** Astro v5.14.1 with MDX and sitemap integrations
- **Local Dev:** http://localhost:4321
- **Staging:** http://10.10.10.30:4000 (when deployed)
- **Content Collections:** novel, stories, world, blog
- **Status:** Development complete, ready for staging deployment

### Content Workflow (Source-First Recommended)

**Primary Content Locations:**
- `/novel/scenes/*.md` - Novel scene source files
- `/short_stories/*.md` - Short story source files
- `/world/` - World building content

**Astro Content Collections:**
- `/astro-dev-site/src/content/novel/` - Synced novel content
- `/astro-dev-site/src/content/stories/` - Synced story content
- `/astro-dev-site/src/content/world/` - Synced world content

**Sync Process:**
```bash
# Sync content from source to Astro
./scripts/sync-content-to-astro.sh

# Verify sync
cd astro-dev-site && npm run dev

# Build for deployment
npm run build
```

### Deployment Commands

**Staging Deployment:**
```bash
./scripts/deploy-staging.sh
# Deploys to http://10.10.10.30:4000
# Includes content sync, build, and server setup
```

**Production Deployment (When Ready):**
```bash
./scripts/deploy-production.sh
# Backs up Hugo automatically
# Deploys Astro to port 8080
# Switches production traffic to Astro
```

**Hugo Rollback (Emergency):**
```bash
ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30
cd /home/docker/hugo-backup-TIMESTAMP
nohup hugo server -p 8080 -D --bind 0.0.0.0 > hugo.log 2>&1 &
```

### Migration Status

**✅ Completed:**
- Astro site structure and configuration
- Content collections with comprehensive schemas
- All 12 stories with validated frontmatter
- All 10 novel chapters loading correctly
- Homepage, novel index, story index pages
- Dynamic routes for stories and chapters
- Dark mode infrastructure
- Deployment scripts (staging and production)

**🚧 In Progress (Phase 2: Pre-Staging):**
- Dark mode toggle icon update fix
- Configuration updates (production URLs)
- Template content cleanup
- Content sync workflow documentation
- Full production build testing

**📋 Pending:**
- Staging deployment and validation
- 48-hour staging soak testing
- Production deployment
- Hugo decommissioning

**See:** `PRODUCTION_READINESS_PLAN.md` for complete migration checklist and timeline.

## MCP Servers and Enhanced Capabilities

Claude Code has access to Model Context Protocol (MCP) servers that extend its capabilities. Use these tools proactively when they would improve the quality or accuracy of your work.

### Available MCP Servers

#### **Context7 MCP** - Up-to-date Documentation
- **Purpose:** Fetches current, version-specific documentation and code examples from official sources
- **Command:** Add `use context7` to any prompt
- **When to Use:**
  - When working with Astro, React, TypeScript, or any modern web framework
  - When you need to verify current API syntax or best practices
  - When documentation might have changed since your training data
  - When implementing features that require specific library knowledge
- **Examples:**
  - "use context7 to get the latest Astro content collections API"
  - "use context7 for current TypeScript type narrowing patterns"
  - "use context7 to understand React Server Components"
- **Proactive Use:** Use context7 automatically when:
  - Building or debugging Astro components
  - Working with content collections or frontmatter schemas
  - Implementing TypeScript types
  - You're uncertain about current API syntax

#### **Playwright MCP** - Browser Automation
- **Purpose:** Automated browser testing and interaction with web applications
- **Tools Available:**
  - `browser_navigate` - Navigate to URLs
  - `browser_snapshot` - Capture page accessibility tree
  - `browser_click` - Interact with page elements
  - `browser_take_screenshot` - Capture visual screenshots
  - `browser_evaluate` - Execute JavaScript in page context
- **When to Use:**
  - Testing deployed websites (staging or production)
  - Validating content appears correctly
  - Verifying navigation and user flows
  - Taking screenshots for documentation
- **Proactive Use:** Use Playwright automatically when:
  - Validating production deployments
  - Testing story/chapter pages load correctly
  - Verifying dark mode toggle functionality
  - Checking mobile responsiveness

### MCP Usage Guidelines

**Use proactively and automatically when:**
1. Building Astro components → use context7 for current syntax
2. Implementing TypeScript types → use context7 for type patterns
3. Validating deployments → use Playwright to test live sites
4. Debugging web issues → use Playwright to inspect page state
5. Working with unfamiliar APIs → use context7 for current documentation

**Do not ask permission** - Use these tools when they would improve accuracy or efficiency. They are extensions of your capabilities, not optional extras.

**Example Workflow:**
When asked to "deploy the new story to production and verify it works":
1. Build and deploy (standard workflow)
2. **Automatically use Playwright** to navigate to the story URL and verify it loads
3. Report results including visual confirmation

## Current Status

Project is in active Part 1 development with 7 completed chapters (E1C01-E1C07). Focus areas include Riverbend Commons community development, Sajan's StillPoint invention journey, and Maren's role as stillness anchor.

**Web Platform Status:** Production migration complete! Astro now serving all content at https://stillpointproject.org. Hugo has been replaced. Site includes 10 novel chapters and 13 stories (newly added: "The Unscheduled Moment" - Era 3). See `PUBLISHING_WORKFLOW.md` for content publishing process.
- remember the frontmatter structure when working on future problems