# The StillPoint Saga

A multi-era science fiction novel project spanning 2025-2095, exploring humanity's path from technological acceleration crisis to contemplative renaissance.

**Live Site:** https://stillpointproject.org

## Project Overview

The StillPoint Saga is a structured creative writing project that tells the story of humanity navigating AI-powered change while staying rooted in presence, community, and wisdom. The project is written transparently as a human-AI collaboration, publishing as it's created.

### Story Structure

- **Era 1 (2029-2036):** The Cascade - Near-future crisis and StillPoint device invention
- **Era 2 (2037-2060):** The Balance War - Societal transition and conflict
- **Era 3 (2061+):** Luminous Presence - Integrated contemplative society

## Project Structure

```
StillPoint/
├── novel/                  # Novel scene source files (canonical)
│   ├── briefs/            # Scene briefs
│   ├── interludes/        # Interlude scenes
│   └── scenes/            # Main scene files
├── short_stories/         # Short story source files (canonical)
├── world/                 # World building content (canonical)
│   ├── characters/        # Character development cards
│   ├── locations/         # Setting descriptions
│   ├── technology/        # Technology explanations
│   └── lore/              # Philosophical concepts
├── astro-dev-site/        # Astro web application
├── scripts/               # Deployment and sync scripts
├── cline_docs/            # AI prompts and tracking
├── _archive/              # Archived legacy files
├── CLAUDE.md              # Complete project documentation
├── AGENTS.md              # Agent instructions
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Node.js v18.20.8+ (v22.20.0 recommended)
- SSH key at `~/.ssh/id_rsa_stillpoint` for deployment
- Git

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd StillPoint
   ```

2. **Install dependencies:**
   ```bash
   cd astro-dev-site
   npm install
   ```

3. **Sync content to Astro:**
   ```bash
   cd ..
   ./scripts/sync-content-to-astro.sh
   ```

4. **Start development server:**
   ```bash
   cd astro-dev-site
   npm run dev
   ```
   
   Visit http://localhost:4321

### Content Workflow

**CRITICAL:** Always edit source files, never edit synced copies.

1. **Edit source content:**
   - Novel scenes: `/novel/scenes/`
   - Short stories: `/short_stories/`
   - World building: `/world/`

2. **Sync to Astro:**
   ```bash
   ./scripts/sync-content-to-astro.sh
   ```

3. **Test locally:**
   ```bash
   cd astro-dev-site && npm run dev
   ```

4. **Deploy:**
   - Staging: `./scripts/deploy-staging.sh`
   - Production: `./scripts/deploy-production.sh`

## Deployment

### Staging Environment

- **URL:** http://10.10.10.30:4000
- **Command:** `./scripts/deploy-staging.sh`
- **Purpose:** Test changes before production

### Production Environment

- **URL:** https://stillpointproject.org
- **Command:** `./scripts/deploy-production.sh`
- **Server:** `docker@10.10.10.30:8080`
- **Tunnel:** CloudFlare tunnel (already configured)

### Deployment Process

The deployment scripts automatically:
1. Sync content from source to Astro
2. Build the Astro site
3. Copy files to remote server
4. Start Node.js HTTP server
5. Verify deployment

**Rollback:** Production deployments create timestamped backups. Rollback with:
```bash
./scripts/deploy-production.sh rollback /home/docker/astro-backup-YYYYMMDD-HHMMSS
```

## Content Standards

All content must include proper YAML frontmatter. See `CLAUDE.md` for complete schemas.

### Novel Scenes
**Required:** `title`, `era`, `location`, `pov_character`, `voice`, `word_count`, `page_count`, `status`

### Short Stories
**Required:** `title`, `status`  
**Recommended:** `type`, `description`, `word_count`, `page_count`, `era`

### World Building
**Required:** `title`, `type`, `status`

## Key Documentation

- **`CLAUDE.md`** - Complete project documentation, specialized modes, and workflows
- **`AGENTS.md`** - Quick reference for AI coding assistants
- **`world/still_point_world_bible.md`** - Canonical world reference
- **`world/outline.md`** - Complete 40-chapter story structure
- **`world/workflow.md`** - Chapter development workflow

## Technology Stack

- **Framework:** Astro v5.14.1
- **Content:** Markdown with MDX support
- **Styling:** Tailwind CSS v4
- **Deployment:** Node.js HTTP server on remote Linux host
- **CDN:** CloudFlare tunnel

## Changelog

### 2025-12-04 - Chapter Visibility Update

**Content Changes:**
- ✅ **Unpublished Later Chapters:** Changed status to "draft" for chapters 3-7 (7 scene files)
- ✅ **Published Chapters:** Only 3 chapters now visible on site (Chapters 1-2: The Daydream, The Severance, The Unstruck Note)
- ✅ **Novel Index Filter:** Updated to exclude draft and revision status from published view
- ✅ **Source Files Preserved:** All 10 scene files remain in source, ready for future publication

**Technical:**
- Updated `novel.astro` to filter content by status
- Draft chapters remain in source files and can be republished by changing status

### 2025-12-04 - Production Migration Complete

**Major Changes:**
- ✅ **Hugo to Astro Migration:** Successfully migrated from Hugo to Astro framework
- ✅ **Production Deployment:** Astro site now live at https://stillpointproject.org
- ✅ **Hugo Service Disabled:** Stopped and disabled `hugo-stillpoint.service` systemd service
- ✅ **Project Cleanup:** Organized project structure, archived legacy files

**New Features:**
- New solarpunk 2100 hero image for about page
- Automated deployment scripts for staging and production
- Content sync script with frontmatter validation and auto-fixing

**Infrastructure:**
- Production server running Node.js HTTP server on port 8080
- CloudFlare tunnel configured and verified
- Automated backup system for production deployments

**Project Organization:**
- Created `_archive/` directory for legacy files
- Archived Hugo site, audio files, and planning documents
- Moved vision document to `world/stillpoint_answers.md`
- Cleaned up temporary files and empty directories

**Content:**
- 3 novel chapters published (Chapters 1-2), 7 in draft (Chapters 3-7)
- 9 short stories published
- Complete world bible and character cards

### 2025-11-XX - Pre-Migration

**Previous State:**
- Hugo-based site serving at https://stillpointproject.org
- Manual content publishing workflow
- Hugo systemd service managing production server

## Contributing

This is a personal creative project. For questions or feedback, see the [About page](https://stillpointproject.org/about).

## License

Copyright © 2025 The StillPoint Project. All rights reserved.

---

**Status:** Active development - Part 1 (E1C01-E1C02 published, E1C03-E1C07 in draft)

