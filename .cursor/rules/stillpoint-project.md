# StillPoint Saga Project Rules

## Project Nature
This is a **structured creative writing project**, not a software development project. The StillPoint Saga is a multi-era science fiction novel spanning 2025-2095, exploring humanity's path from technological acceleration crisis to contemplative renaissance.

## Key Reference Files
- `world/still_point_world_bible.md` - Canonical world reference (timeline, characters, locations, lore)
- `world/outline.md` - Complete 40-chapter story structure across three eras
- `world/workflow.md` - Chapter development workflow and status tracking
- `cline_docs/productContext.md` - High-level project vision and goals
- `CLAUDE.md` - Complete project documentation and specialized mode definitions

## Directory Structure
- `/novel/scenes/` - Scene files (E1C01-E1C07 format for Era 1, Chapter 1-7)
- `/short_stories/` - Short story source files
- `/world/characters/` - Character development cards
- `/world/locations/` - Setting descriptions and atmosphere
- `/world/technology/` - Key technology explanations (StillPoint devices, AI systems)
- `/world/lore/` - Philosophical concepts and worldbuilding elements
- `/audio/` - Generated audio renditions of written content
- `/astro-dev-site/` - Astro web application for local development and production deployment

## Content Frontmatter Requirements

**CRITICAL:** All content must include proper YAML frontmatter. Never create content without frontmatter.

### Novel Scenes (`/novel/scenes/`)
**Required fields:**
- `title`, `era`, `location`, `pov_character`, `voice`, `word_count`, `page_count`, `status`

**Status values:** `draft` | `draft-revised` | `revision` | `revised` | `revised_draft_2` | `proofread` | `published` | `canonical`

**Era values:** `"The Cascade"` | `"The Balance War"` | `"Luminous Presence"`

### Short Stories (`/short_stories/`)
**Required fields:**
- `title`, `status`

**Strongly recommended:**
- `type`, `description`, `word_count`, `page_count`, `era`

### World Building (`/world/`)
**Required fields:**
- `title`, `type`, `status`

**Type values:** `character` | `location` | `technology` | `lore` | `timeline` | `philosophy`

See `CLAUDE.md` for complete frontmatter schemas.

## Content Guidelines
- All content must align with `world/still_point_world_bible.md` canon
- Use `[[wiki-links]]` format for cross-references between files
- Character timelines span multiple eras - check character cards for availability windows
- Technology evolution follows the "receding into air" principle across eras
- Themes center on presence, contemplation, and human-AI integration

## Publishing Architecture

### Source-First Workflow
**CRITICAL:** All content originates in `/novel/scenes/`, `/short_stories/`, and `/world/` directories. These are canonical—**never edit synced copies** in `/astro-dev-site/src/content/`.

### Content Sync Process
```bash
# Sync content from source to Astro
./scripts/sync-content-to-astro.sh

# Verify sync
cd astro-dev-site && npm run dev
```

### Deployment Environments

**CRITICAL:** Both staging and production deploy to a remote Linux server. Understand the full process before deploying.

#### Local Development
- **Command:** `cd astro-dev-site && npm run dev`
- **URL:** http://localhost:4321
- **Purpose:** Local testing before deployment

#### Staging Environment
- **Command:** `./scripts/deploy-staging.sh`
- **Server:** `docker@10.10.10.30` (remote Linux host)
- **SSH Key:** `~/.ssh/id_rsa_stillpoint` (required)
- **Staging Directory:** `/home/docker/stillpoint-staging`
- **Port:** 4000
- **URL:** http://10.10.10.30:4000
- **Process:**
  1. Syncs content from source to Astro (`sync-content-to-astro.sh`)
  2. Builds Astro site (`npm run build` in `astro-dev-site/`)
  3. Copies `dist/` to remote server via SCP
  4. Creates/starts Node.js HTTP server on port 4000
  5. Server runs in background via `nohup`
- **Server Logs:** `ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30 'tail -f /home/docker/staging.log'`
- **Purpose:** Test deployment before production

#### Production Environment
- **Command:** `./scripts/deploy-production.sh` (requires confirmation)
- **Server:** `docker@10.10.10.30` (same remote Linux host as staging)
- **SSH Key:** `~/.ssh/id_rsa_stillpoint` (required)
- **Production Directory:** `/home/docker/stillpoint-production`
- **Port:** 8080
- **Public URL:** https://stillpointproject.org (via CloudFlare tunnel)
- **CloudFlare Tunnel:** Already configured to point to localhost:8080 (no changes needed)
- **Process:**
  1. **Backs up current production** to `/home/docker/astro-backup-TIMESTAMP/`
  2. Syncs content from source to Astro
  3. Builds Astro site for production
  4. Stops existing production server
  5. Copies `dist/` to remote server via SCP
  6. Creates/starts Node.js HTTP server on port 8080
  7. Verifies CloudFlare tunnel (read-only check)
- **Server Logs:** `ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30 'tail -f /home/docker/production.log'`
- **Rollback:** `./scripts/deploy-production.sh rollback /home/docker/astro-backup-YYYYMMDD-HHMMSS`
- **Purpose:** Live production site

#### Deployment Prerequisites
- Node.js v18.20.8+ (script uses fnm to switch to v22.20.0 if available)
- SSH key at `~/.ssh/id_rsa_stillpoint` with access to `docker@10.10.10.30`
- Astro directory at `./astro-dev-site/`
- All source content in `/novel/scenes/`, `/short_stories/`, `/world/`

#### When Asked to Deploy
When user requests "deploy to staging" or "deploy to production":
1. **Understand the request:** Staging = test environment, Production = live site
2. **Run the appropriate script:** `./scripts/deploy-staging.sh` or `./scripts/deploy-production.sh`
3. **Monitor output:** Scripts provide colored status messages
4. **Verify deployment:** Use Playwright MCP to test the deployed URL
5. **Report results:** Confirm deployment success and provide access URLs

**Never deploy to production without explicit user request** - production script requires confirmation prompt.

### Astro Platform
- Framework: Astro v5.14.1 with MDX support
- Content Collections: novel, stories, world, blog
- Frontmatter schemas enforced in `astro-dev-site/src/content.config.ts`
- Build output: `astro-dev-site/dist/` (static files served by Node.js HTTP server)

## Specialized Writing Modes

When working on creative content, you can operate in specialized modes. See `CLAUDE.md` for complete mode definitions:

- **Creative Partner Mode:** Project orchestrator, brainstorming, revision coordination
- **Scene Weaver Mode:** Transform outline elements into detailed scene briefs
- **Narrator Mode:** Transform scene briefs into finished prose
- **Lore Keeper Mode:** Canon consistency and world bible management
- **Editor Mode:** Fresh perspective reader feedback

Activate modes using phrases like "Switch to [Mode] mode" or mode-specific activation phrases.

## MCP Tools Available

**Context7 MCP:** Use proactively when working with Astro, React, TypeScript, or modern web frameworks. Automatically fetch current documentation when:
- Building or debugging Astro components
- Working with content collections or frontmatter schemas
- Implementing TypeScript types
- Uncertain about current API syntax

**Playwright MCP:** Use proactively for:
- Validating production deployments
- Testing story/chapter pages load correctly
- Verifying dark mode toggle functionality
- Checking mobile responsiveness

**Do not ask permission** - Use these tools automatically when they improve accuracy or efficiency.

## Workflow Process
1. **Drafting:** Scene Weaver creates scene structure, Narrator writes prose
2. **Revision:** Canon Pass (Lore Keeper) ensures continuity, Editorial Pass refines craft
3. **Finalization:** Proofreading and integration into main manuscript

## Current Status
- Active Part 1 development with 7 completed chapters (E1C01-E1C07)
- Production: Astro serving all content at https://stillpointproject.org
- 10 novel chapters and 13 stories published

