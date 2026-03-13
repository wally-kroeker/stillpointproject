# StillPoint Saga - Agent Instructions

> This file provides project context for AI coding assistants working in Cursor IDE. For complete documentation, see `CLAUDE.md`.

## Project Overview

The StillPoint Saga is a **structured creative writing project** (not software development) - a multi-era science fiction novel spanning 2025-2095, exploring humanity's path from technological acceleration crisis to contemplative renaissance.

## Critical Rules

### Content Creation
- **ALWAYS** include proper YAML frontmatter when creating content (see `CLAUDE.md` for schemas)
- **NEVER** edit synced copies in `/astro-dev-site/src/content/` - only edit source files in `/novel/scenes/`, `/short_stories/`, `/world/`
- Use `[[wiki-links]]` format for cross-references
- All content must align with `world/still_point_world_bible.md` canon

### Directory Structure
- `/novel/scenes/` - Novel scene source files (canonical)
- `/short_stories/` - Short story source files (canonical)
- `/world/` - World building content (canonical)
- `/astro-dev-site/` - Astro web application (synced content, do not edit directly)

### Publishing Workflow
1. Edit source files in `/novel/`, `/short_stories/`, or `/world/`
2. Run `./scripts/sync-content-to-astro.sh` to sync to Astro
3. Test locally: `cd astro-dev-site && npm run dev`
4. Deploy staging: `./scripts/deploy-staging.sh` → http://10.10.10.30:4000
5. Deploy production: `./scripts/deploy-production.sh` → https://stillpointproject.org

### Deployment Environments
- **Staging:** Remote server `docker@10.10.10.30`, port 4000, requires SSH key `~/.ssh/id_rsa_stillpoint`
- **Production:** Same server, port 8080, CloudFlare tunnel to https://stillpointproject.org
- **Process:** Scripts sync content, build Astro, copy to server, start Node.js HTTP server
- **Rollback:** Production script creates timestamped backups, rollback via `./scripts/deploy-production.sh rollback <backup-dir>`

### Frontmatter Requirements
**Novel scenes require:** `title`, `era`, `location`, `pov_character`, `voice`, `word_count`, `page_count`, `status`

**Stories require:** `title`, `status` (minimum); strongly recommend `type`, `description`, `word_count`, `page_count`, `era`

**World cards require:** `title`, `type`, `status`

See `CLAUDE.md` for complete schemas and valid values.

### MCP Tools
- **Context7:** Use automatically for Astro/TypeScript/React documentation
- **Playwright:** Use automatically for deployment validation and testing

### Specialized Modes
This project uses specialized writing modes (Creative Partner, Scene Weaver, Narrator, Lore Keeper, Editor). See `CLAUDE.md` for complete mode definitions and activation phrases.

## Key Files
- `CLAUDE.md` - Complete project documentation
- `world/still_point_world_bible.md` - Canonical world reference
- `world/outline.md` - Story structure
- `world/workflow.md` - Development workflow

## Current Status
- Production: Astro serving at https://stillpointproject.org
- 10 novel chapters and 13 stories published
- Active Part 1 development (E1C01-E1C07)

