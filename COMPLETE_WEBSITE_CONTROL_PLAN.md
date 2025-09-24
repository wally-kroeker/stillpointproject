# Complete Website Control Implementation Plan

## Current Gap Analysis

### What We Have Locally ❌
- Novel content (`novel/` directory)
- World building materials (`world/` directory)
- Publishing script for novel content only

### What's Missing From Local Control ❌
- **Landing page** (`content/_index.md`) - Project vision and reader invitation
- **Hugo configuration** (`config.toml`) - Site settings and theme config
- **Story content** (`content/stories/`) - 3 additional stories
- **Custom layouts** (`layouts/`) - Templates for different page types
- **Static assets** (`static/css/`) - Styling and visual design
- **Themes** (`themes/`) - Complete theme structures (PaperMod, ananke)
- **Complete local Hugo environment** - No local preview capability

## Implementation Strategy

### Phase 1: Download Complete Website Structure
```bash
# Create local Hugo site structure
mkdir -p site/{content,layouts,static,themes,archetypes,data}

# Download all website content from production
scp -r docker@10.10.10.30:/home/docker/stillpoint-project/site/* ./site/

# Organize in git with proper .gitignore
```

### Phase 2: Set Up Local Hugo Development
```bash
# Install Hugo locally (if needed)
# Set up local development server: hugo server
# Enable live reload for immediate preview
# Test complete site locally before publishing
```

### Phase 3: Expand Git Workflow for Complete Site
- **Current:** Only novel content under version control
- **Target:** Entire website under version control
- **Changes:** Sync entire `site/` directory, not just novel processing

### Phase 4: Enhanced Publishing Workflow
```bash
# New capabilities:
./publish.sh                    # Publish complete site changes
./publish.sh --preview          # Run local Hugo server
./publish.sh --novel-only       # Legacy novel-only publishing
./publish.sh --site-only        # Publish layout/config changes only
```

## Directory Structure (Target)

```
The StillPoint Project/
├── .git/                           (version control)
├── publish.sh                      (enhanced publisher)
├── novel/                          (source content)
├── world/                          (world building)
└── site/                           (complete Hugo site - NEW)
    ├── config.toml                 (Hugo configuration)
    ├── content/
    │   ├── _index.md               (landing page)
    │   ├── stories/                (additional story content)
    │   └── novel/                  (generated from ../novel/)
    ├── layouts/
    │   ├── _default/               (base templates)
    │   ├── novel/                  (novel-specific layouts)
    │   ├── partials/               (reusable components)
    │   └── index.html              (homepage template)
    ├── static/
    │   └── css/
    │       └── stillpoint.css      (custom styling)
    ├── themes/
    │   ├── PaperMod/               (primary theme)
    │   └── ananke/                 (secondary theme)
    └── public/                     (generated - ignored by git)
```

## Enhanced Workflow Capabilities

### 1. Local Development Server
```bash
cd site
hugo server --bind 0.0.0.0 --port 1313
# Live preview at http://localhost:1313
# Auto-refresh on file changes
```

### 2. Complete Site Control
- **Landing page editing** - Update project vision locally
- **Story management** - Add/edit stories in `content/stories/`
- **Layout customization** - Modify templates and styling
- **Theme configuration** - Switch themes, customize appearance
- **Site structure** - Add new sections, reorganize content

### 3. Staging and Production
```bash
# Local development and preview
hugo server

# Publish to production
./publish.sh "Update landing page and add new story"

# Rollback if needed
git revert HEAD && ./publish.sh
```

## Implementation Steps

### Step 1: Download Production Website
```bash
# Download complete Hugo site structure
mkdir -p site
scp -r docker@10.10.10.30:/home/docker/stillpoint-project/site/* ./site/

# Exclude generated content from git
echo "site/content/novel/" >> .gitignore
echo "site/public/" >> .gitignore
echo "site/resources/" >> .gitignore
```

### Step 2: Install Hugo Locally
```bash
# Install Hugo for local development (platform-specific)
# Windows: winget install Hugo.Hugo.Extended
# Linux: apt install hugo (or snap install hugo)
# Test: hugo version
```

### Step 3: Adapt Publishing Workflow
- Modify `scripts/process-content.sh` to work with local site structure
- Update `publish.sh` to sync complete site directory
- Add local preview capabilities to publish script
- Maintain novel processing logic for backward compatibility

### Step 4: Enhanced Git Integration
- Commit entire site structure to version control
- Adapt production git hook for complete site deployment
- Test end-to-end: local edit → preview → publish → live

### Step 5: Validation and Documentation
- Test all website functionality locally
- Verify production deployment works correctly
- Update CLAUDE.md with complete workflow documentation
- Create user guide for common site management tasks

## User Experience (Target)

### Daily Writing Workflow
```bash
# Write novel content
vim novel/scenes/e1_c08_s01_new_chapter.md

# Edit landing page
vim site/content/_index.md

# Preview complete site locally
./publish.sh --preview

# Publish everything
./publish.sh "Add Chapter 8 and update homepage"
```

### Site Management Workflow
```bash
# Add new story
vim site/content/stories/the_neural_stream.md

# Customize layout
vim site/layouts/stories/single.html

# Update styling
vim site/static/css/stillpoint.css

# Preview and publish
./publish.sh --preview
./publish.sh "New story layout and styling"
```

## Benefits

### Complete Control ✅
- **Landing page** - Update project description locally
- **Story content** - Manage all stories in version control
- **Site design** - Customize layouts and styling locally
- **Hugo configuration** - Control themes and site settings

### Development Workflow ✅
- **Local preview** - See changes before publishing
- **Version control** - Track all website changes
- **Easy rollback** - Undo any change with git
- **Collaborative ready** - Share complete site with others

### Publishing Efficiency ✅
- **One command** - Publish complete site changes
- **Selective publishing** - Novel-only or site-only updates
- **Automated validation** - Check links and structure
- **Production deployment** - Same reliable git-based process

## Risk Mitigation

### Backup Strategy
- Current production site backed up before changes
- Git history preserves all versions
- Production server maintains separate backup

### Gradual Migration
- Phase 1: Download and version complete site
- Phase 2: Set up local development
- Phase 3: Test publishing workflow
- Phase 4: Switch to new workflow

### Fallback Plan
- Original publishing workflow preserved
- Production backup available for recovery
- Git allows instant rollback to any point

This plan transforms your local development environment from novel-only publishing to complete website control, enabling you to manage your entire online presence from your local creative environment.