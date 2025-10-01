# StillPoint Project - Content Publishing Workflow

**Complete guide for publishing new stories, novel chapters, and other content to stillpointproject.org**

**Version 2.0** - Now with automated deployment scripts!

Last Updated: September 30, 2025

---

## Overview

This document walks you through the complete process of creating and publishing content to the StillPoint Project website. The workflow follows a **source-first approach**: you write content in the main `/short_stories/` or `/novel/` directories, then sync it to the Astro build system for deployment.

**Estimated Time:**
- **Automated (using scripts):** 5-8 minutes from finished story to live on production
- **Manual (step-by-step):** 20-25 minutes (includes learning/verification steps)

---

## Quick Start (Automated Deployment)

**For experienced users:** Skip the manual workflow and use the automated deployment scripts that handle content sync, building, and deployment in one command.

### Deploy to Staging (Testing)

Test your content on the staging server (http://10.10.10.30:4000) before production:

```bash
cd /home/walub/projects/StillPoint
./scripts/deploy-staging.sh
```

**What this does:**
- Syncs content from source directories to Astro
- Builds the Astro site
- Deploys to staging server on port 4000
- Starts staging server process
- Validates deployment

**Time:** ~3-4 minutes

### Deploy to Production

Deploy to the live site (https://stillpointproject.org):

```bash
cd /home/walub/projects/StillPoint
./scripts/deploy-production.sh
```

**What this does:**
- Confirms deployment (safety check)
- Backs up current Hugo production (emergency rollback)
- Syncs latest content to Astro
- Builds production-optimized Astro site
- Deploys to production server on port 8080
- Restarts production server
- Validates deployment and CloudFlare tunnel

**Time:** ~5-6 minutes

### Sync Content Only

If you just need to sync content without deploying:

```bash
cd /home/walub/projects/StillPoint
./scripts/sync-content-to-astro.sh
```

**What this does:**
- Copies all `.md` files from `/short_stories/` → `astro-dev-site/src/content/stories/`
- Copies all `.md` files from `/novel/scenes/` → `astro-dev-site/src/content/novel/`
- Copies all `.md` files from `/world/` → `astro-dev-site/src/content/world/`
- Validates frontmatter and file counts
- Shows sync statistics

**Time:** ~30 seconds

### When to Use Which Approach

**Use Automated Scripts When:**
- You're deploying content you've already tested locally
- You're confident in your frontmatter and content structure
- You want fast, reliable deployments
- You're deploying to production regularly

**Use Manual Workflow When:**
- You're learning the system for the first time
- You need to troubleshoot deployment issues
- You want to understand what's happening at each step
- You're making infrastructure changes (not just content updates)

---

## Prerequisites

- Story written and ready to publish
- Git repository initialized at `/home/walub/projects/StillPoint`
- SSH access to production server (key: `~/.ssh/id_rsa_stillpoint`)
- Node.js installed (v18.20.8+)
- Working directory clean (no uncommitted changes to main content)

---

## Step-by-Step Publishing Process

### Phase 0: Version Control Setup (2 minutes)

Before making content changes, ensure you have a clean working state:

```bash
cd /home/walub/projects/StillPoint
git status
```

If you have uncommitted changes, commit or stash them:

```bash
# Option 1: Commit existing changes
git add .
git commit -m "Work in progress before new story"

# Option 2: Stash changes to apply later
git stash save "WIP before new story"
```

**Optional:** Create a feature branch for this story:

```bash
git checkout -b story/your-story-name
```

This allows you to work on the story independently from other changes.

---

### Phase 1: Create Content with Proper Metadata (5 minutes)

#### 1.1 Write Your Story

Create your content file in the appropriate directory:
- **Short Stories:** `/short_stories/your_story_name.md`
- **Novel Scenes:** `/novel/scenes/e1_c01_s01_scene_name.md`

Use `snake_case` for filenames (lowercase with underscores).

#### 1.2 Add YAML Frontmatter

Every content file **must** start with YAML frontmatter. This metadata controls how the story appears on the website.

**Short Story Template:**
```yaml
---
title: "The Unscheduled Moment"
status: "published"
type: "short_story"
description: "A transit coordinator in Era 3 learns that some moments matter more than optimization."
word_count: 1100
page_count: 4
era: "Era 3 - Luminous Presence"
location: "Transit Hub Seven, Neo-Singapore"
pov_character: "Keiko Chen"
characters: ["Keiko Chen", "Mrs. Okoye", "Tomas", "Yuki"]
featured: true
themes: ["presence", "technology", "human_dignity", "efficiency_vs_humanity"]
related_world: ["stillpoint_device", "luminous_presence_era"]
---
```

**Required Fields:**
- `title`: Story title (displayed as heading)
- `status`: `"published"`, `"draft"`, or `"canonical"`
- `type`: `"short_story"`, `"vignette"`, `"outline"`, etc.
- `description`: One-sentence summary (displayed in story list)
- `word_count`: Total word count
- `era`: Which era the story is set in

**Optional but Recommended:**
- `featured`: `true` to highlight on homepage
- `characters`: List of character names
- `themes`: Story themes for categorization
- `location`: Setting
- `pov_character`: Point-of-view character

#### 1.3 Add Wiki-Links for Canon Elements

Use `[[double brackets]]` to link canonical world elements:
- `[[StillPoint]]` - StillPoint devices
- `[[Chorus]]` - Chorus AI system
- `[[Riverbend]]` - Riverbend Commons

These will be converted to actual links when world-building content is added.

**Example:**
```markdown
Keiko pressed her hand to the [[StillPoint]] pendant beneath
her uniform collar—a small gesture, barely a second of contact.
```

---

### Phase 2: Sync to Astro Build System (2 minutes)

**Automated Option:** Use the sync script to copy all content at once:

```bash
cd /home/walub/projects/StillPoint
./scripts/sync-content-to-astro.sh
```

This automatically syncs all stories, novel scenes, and world-building content. Skip to Phase 3 if using this script.

---

**Manual Option (for learning/single-file updates):**

#### 2.1 Copy Story to Astro Content Collection

From the project root directory:

```bash
cd /home/walub/projects/StillPoint

# For short stories:
cp short_stories/your_story.md astro-dev-site/src/content/stories/

# For novel scenes:
cp novel/scenes/your_scene.md astro-dev-site/src/content/novel/
```

**Why this step?** The Astro static site generator reads from its own `src/content/` directory. This manual copy ensures your source files remain the canonical version.

#### 2.2 Verify the Copy

```bash
ls -la astro-dev-site/src/content/stories/your_story.md
```

You should see the file with today's timestamp.

---

### Phase 3: Build and Test Locally (3 minutes)

#### 3.1 Build the Site

```bash
cd astro-dev-site
npm run build
```

**Expected Output:**
```
✓ Completed in 1.21s
[@astrojs/sitemap] `sitemap-index.xml` created at `dist`
[build] 26 page(s) built in 1.21s
[build] Complete!
```

Look for your story in the build output:
```
▶ src/pages/stories/[...slug].astro
  └─ /stories/your_story/index.html (+1ms)
```

#### 3.2 Verify Build Output

Check that the HTML file was generated:

```bash
ls -la dist/stories/your_story/index.html
```

#### 3.3 Optional: Test Locally

Start the development server to preview:

```bash
npm run dev
```

Visit `http://localhost:4321/stories/your_story` in your browser to see the rendered story.

**Press Ctrl+C when done testing.**

---

### Phase 4: Deploy to Production (5 minutes)

**Automated Option (Recommended):** Use the deployment script for safe, automated deployment:

```bash
cd /home/walub/projects/StillPoint
./scripts/deploy-production.sh
```

**What this does:**
1. Asks for confirmation before deploying (safety check)
2. Backs up current production to `/home/docker/hugo-backup-TIMESTAMP/` (emergency rollback)
3. Syncs latest content from source directories
4. Builds production-optimized Astro site
5. Stops current production server
6. Deploys built files to `/home/docker/stillpoint-production/`
7. Starts new production server on port 8080
8. Verifies CloudFlare tunnel is working
9. Tests that production server responds
10. Displays deployment summary with helpful commands

**Time:** ~5-6 minutes (including build)

**Safety Features:**
- Confirmation prompt prevents accidental deployment
- Automatic Hugo backup for emergency rollback
- Server validation before declaring success
- Detailed logging for troubleshooting

Skip to Phase 5 (Validation) if using this script.

---

**Manual Option (for advanced troubleshooting):**

#### 4.1 Stop Production Server

```bash
ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30 "pkill -f 'production-server'"
```

This safely stops the Node.js server running on port 8080.

#### 4.2 Deploy Built Files

```bash
cd /home/walub/projects/StillPoint/astro-dev-site
scp -i ~/.ssh/id_rsa_stillpoint -r dist/* docker@10.10.10.30:/home/docker/stillpoint-production/
```

**This copies:**
- All HTML pages
- CSS and JavaScript
- Images and fonts
- Sitemap and RSS feed

**Time:** ~10-20 seconds depending on file size.

#### 4.3 Restart Production Server

```bash
ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30 \
  'nohup node /home/docker/production-server.js > /home/docker/production.log 2>&1 &'
```

Wait 3 seconds for the server to start.

#### 4.4 Verify Server is Running

```bash
ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30 \
  "ps aux | grep production-server | grep -v grep"
```

**Expected output:**
```
docker  51131  0.0  3.5  588360  36592  ?  Sl  22:09  0:00  node /home/docker/production-server.js
```

---

### Phase 5: Validate Live Site (3 minutes)

#### 5.1 Check Stories Index

Visit: **https://stillpointproject.org/stories**

Your new story should appear in the list with:
- Title
- Description
- Era label
- Word count
- Status badge

#### 5.2 Check Full Story Page

Visit: **https://stillpointproject.org/stories/your_story**

Verify:
- [ ] Title displays correctly
- [ ] Story content renders properly
- [ ] No metadata/frontmatter visible
- [ ] "← Back to Stories" link works
- [ ] Dark mode toggle works

#### 5.3 Test on Mobile (Optional)

Open the story on your phone to check:
- Text is readable without zooming
- Navigation works on small screens
- Dark mode toggle accessible

---

### Phase 6: Commit to Version Control (3 minutes)

#### 6.1 Review Changes Before Committing

Check what files have been modified:

```bash
cd /home/walub/projects/StillPoint
git status
```

You should see:
- `short_stories/your_story.md` (new file or modified)
- Possibly outline files or related documentation

Review the diff to ensure content is correct:

```bash
git diff short_stories/your_story.md
```

#### 6.2 Stage Files for Commit

```bash
# Stage only the source story file (canonical version)
git add short_stories/your_story.md

# If you updated related files (outlines, character cards, etc.)
git add short_stories/your_story_outline.md
git add world/characters/your_character.md
```

**Important:** Do NOT commit Astro content files (`astro-dev-site/src/content/stories/`) - these are synced copies, not canonical source.

#### 6.3 Create Descriptive Commit

Use a commit message that includes:
- Story title and era
- Key themes and characters
- Word count
- Deployment status
- Brief description of story's significance

```bash
git commit -m "Add Era 3 short story: Your Story Title

- Set in Era 3 (Luminous Presence, 2068)
- Characters: Character1, Character2
- Themes: presence, technology, human_dignity
- Word count: 1,100 words
- Status: published
- Deployed to stillpointproject.org/stories/your_story

Story explores [1-2 sentence description of what the story
is about and its thematic significance to the StillPoint Saga].

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

**For major revisions to existing stories:**

```bash
git commit -m "Revise 'The Neural Stream' - Add stakes and ambiguity

Major revision addressing editorial feedback:
- Added personal stakes (rent pressure, relationship failures)
- Added subscriber hemorrhage section (214 lost subscribers)
- Added 'The Pause' - Marcus wrestling with doubt
- Revised Riley's dialogue to be vulnerable and messy
- Added split audience with harsh criticism
- Revised ending to show ambiguous victory with real costs

Expanded from 5,500 to 6,800 words. Status remains 'canonical'
until deployed to production.

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

#### 6.4 Verify Commit

```bash
# View the commit you just made
git log -1

# View the commit with file changes
git show --stat

# View the full diff of what was committed
git show
```

#### 6.5 Optional: Push to Remote Repository

If you're using a remote git repository (GitHub, GitLab, etc.):

```bash
# Push to main branch
git push origin master

# Or push feature branch
git push origin story/your-story-name
```

**Note:** This is separate from production deployment. Pushing to git creates a version history backup but doesn't update the live website.

---

## Git Workflow Best Practices

### For New Stories

```bash
# 1. Check status before starting
git status

# 2. Optional: Create feature branch
git checkout -b story/your-story-name

# 3. Write your story in /short_stories/

# 4. Stage and commit
git add short_stories/your_story.md
git commit -m "Add new story: Your Story Title

- Era: Era 3
- Word count: 1,100
- Status: canonical (pre-deployment)

[Brief description]

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# 5. Deploy to production (Phases 2-5 above)

# 6. After successful deployment, update status to "published"
# Edit frontmatter: status: "published"
git add short_stories/your_story.md
git commit -m "Update status: Your Story Title now published

Deployed to https://stillpointproject.org/stories/your_story

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# 7. Optional: Push to remote
git push origin story/your-story-name
```

### For Story Revisions

```bash
# 1. Check current status
git status
git diff short_stories/your_story.md

# 2. Make revisions to the story

# 3. Commit with descriptive message
git add short_stories/your_story.md
git commit -m "Revise 'Your Story Title' - [brief description]

- What changed: [bullet points]
- Word count: old → new
- Status: remains 'canonical' until re-deployed

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# 4. Deploy revised version (Phases 2-5)

# 5. After deployment, update status if needed
git add short_stories/your_story.md
git commit -m "Update status: Revised version of Your Story Title published

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Common Git Commands

```bash
# View commit history
git log --oneline -10

# View specific file history
git log --oneline short_stories/your_story.md

# See what changed in last commit
git show

# Undo uncommitted changes
git checkout -- short_stories/your_story.md

# View difference between versions
git diff HEAD~1 short_stories/your_story.md

# Create and switch to branch
git checkout -b story/story-name

# Switch back to main branch
git checkout master

# List all branches
git branch -a
```

---

## Quick Reference Commands

### Automated Deployment Scripts (Recommended)

```bash
# Sync content only (no deployment)
./scripts/sync-content-to-astro.sh

# Deploy to staging server (http://10.10.10.30:4000)
./scripts/deploy-staging.sh

# Deploy to production (https://stillpointproject.org)
./scripts/deploy-production.sh
```

### Check Server Status

```bash
# Production server (port 8080)
ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30 \
  "ps aux | grep production-server | grep -v grep"

# Staging server (port 4000)
ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30 \
  "ps aux | grep staging-server | grep -v grep"
```

### View Server Logs

```bash
# Production logs
ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30 \
  "tail -f /home/docker/production.log"

# Staging logs
ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30 \
  "tail -f /home/docker/staging.log"
```

### Manual Deployment (Advanced)

```bash
# One-command deployment after manual build
cd /home/walub/projects/StillPoint/astro-dev-site && \
ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30 "pkill -f 'production-server'" && \
scp -i ~/.ssh/id_rsa_stillpoint -r dist/* docker@10.10.10.30:/home/docker/stillpoint-production/ && \
ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30 'nohup node /home/docker/production-server.js > /home/docker/production.log 2>&1 &'
```

### Emergency Rollback to Hugo

See `ROLLBACK_PROCEDURES.md` for complete rollback instructions.

Quick rollback command:
```bash
ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30
cd /home/docker/hugo-backup-TIMESTAMP
nohup hugo server -p 8080 -D --bind 0.0.0.0 > hugo.log 2>&1 &
```

---

## Directory Structure Reference

```
/home/walub/projects/StillPoint/
├── short_stories/                    # Source files (canonical)
│   └── your_story.md
├── novel/scenes/                     # Novel source files (canonical)
│   └── e1_c01_s01_scene_name.md
├── astro-dev-site/                   # Astro build system
│   ├── src/content/
│   │   ├── stories/                  # Synced from short_stories/
│   │   └── novel/                    # Synced from novel/scenes/
│   └── dist/                         # Built static files (generated)
│       ├── index.html
│       ├── stories/
│       │   └── your_story/
│       │       └── index.html
│       └── novel/
└── scripts/
    ├── sync-content-to-astro.sh      # Auto-sync script (optional)
    ├── deploy-staging.sh             # Deploy to staging server
    └── deploy-production.sh          # Deploy to production (WIP)
```

**Key Principle:** `/short_stories/` and `/novel/scenes/` are the **source of truth**. Astro content is synced copies.

---

## Deployment Scripts Reference

The project includes three automated deployment scripts that handle the entire deployment workflow. These scripts are production-tested and include error handling, validation, and safety features.

### Script Locations

All scripts are in the `/scripts/` directory:
- `sync-content-to-astro.sh` - Content synchronization
- `deploy-staging.sh` - Staging deployment
- `deploy-production.sh` - Production deployment

### sync-content-to-astro.sh

**Purpose:** Syncs content from source directories to Astro content collections.

**Usage:**
```bash
cd /home/walub/projects/StillPoint
./scripts/sync-content-to-astro.sh
```

**What it does:**
1. Validates directory structure exists
2. Copies all `.md` files from `/short_stories/` to `astro-dev-site/src/content/stories/`
3. Copies all `.md` files from `/novel/scenes/` to `astro-dev-site/src/content/novel/`
4. Copies all `.md` files from `/world/` to `astro-dev-site/src/content/world/` (including subdirectories)
5. Validates frontmatter exists in all files
6. Checks file counts match between source and destination
7. Displays sync statistics

**Time:** ~30 seconds

**When to use:**
- After creating new content files
- Before building the site locally
- When you want to test content locally before deploying
- Automatically called by deployment scripts

**Output example:**
```
🚀 StillPoint Content Sync
Syncing content to Astro development environment...

🔄 Validating directory structure...
✅ Directory structure validated
🔄 Syncing novel scenes...
✅ Synced 10 novel scenes to astro-dev-site/src/content/novel
🔄 Syncing short stories...
✅ Synced 13 short stories to astro-dev-site/src/content/stories
🔄 Syncing world building content...
✅ Synced 45 world building files to astro-dev-site/src/content/world
🔄 Validating synced content...
✅ Content validation passed
🔄 Generating content statistics...

📊 Content Sync Summary:
  Novel scenes: 10
  Short stories: 13
  World building: 45
  Total files: 68

✅ Content sync completed successfully!
✅ Start Astro dev server: cd astro-dev-site && npm run dev
```

### deploy-staging.sh

**Purpose:** Deploys Astro site to staging environment for testing.

**Usage:**
```bash
cd /home/walub/projects/StillPoint
./scripts/deploy-staging.sh
```

**What it does:**
1. Checks prerequisites (Node.js, SSH key, directories)
2. Syncs latest content using `sync-content-to-astro.sh`
3. Installs npm dependencies if needed
4. Builds Astro site with `npm run build`
5. Creates `/home/docker/stillpoint-staging/` directory on server
6. Copies built files via `scp` to staging directory
7. Creates Node.js staging server script on port 4000
8. Starts staging server process
9. Tests that server responds
10. Displays staging URL and helpful commands

**Time:** ~3-4 minutes

**Staging URL:** http://10.10.10.30:4000

**When to use:**
- Testing new content before production
- Verifying design/layout changes
- QA testing with team members
- Testing frontmatter changes

**Output example:**
```
🚀 StillPoint Astro - Staging Deployment
Deploying to staging environment...

🔄 Checking prerequisites...
✅ Using Node.js 22.20.0
✅ Prerequisites check completed
🔄 Syncing latest content to Astro...
✅ Content synced
🔄 Building Astro site for staging...
✅ Build completed - 68 files generated
🔄 Deploying to staging server...
✅ Deployed 68 files to staging
🔄 Setting up staging server process...
✅ Staging server configured and started
🔄 Generating deployment summary...

🎯 Staging Deployment Summary:
  Local build: /home/walub/projects/StillPoint/astro-dev-site/dist
  Staging server: docker@10.10.10.30:/home/docker/stillpoint-staging
  Staging URL: http://10.10.10.30:4000
  Server logs: ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30 'tail -f /home/docker/staging.log'

🔄 Testing staging server...
✅ Staging server is responding

✅ Staging deployment completed successfully!
✅ Access staging site at: http://10.10.10.30:4000
```

### deploy-production.sh

**Purpose:** Deploys Astro site to production with safety checks and automatic backup.

**Usage:**
```bash
cd /home/walub/projects/StillPoint
./scripts/deploy-production.sh
```

**What it does:**
1. Displays warning and asks for confirmation (prevents accidents)
2. Checks prerequisites (Node.js, SSH key, directories)
3. **Backs up current Hugo production** to timestamped directory (for emergency rollback)
4. Syncs latest content using `sync-content-to-astro.sh`
5. Installs npm dependencies if needed
6. Builds production-optimized Astro site
7. Stops current production server on port 8080
8. Creates `/home/docker/stillpoint-production/` directory
9. Copies built files via `scp` to production directory
10. Creates Node.js production server script on port 8080
11. Starts production server process
12. Verifies CloudFlare tunnel is working (no reconfiguration needed)
13. Tests that production server responds
14. Displays deployment summary with backup location

**Time:** ~5-6 minutes

**Production URL:** https://stillpointproject.org

**Safety Features:**
- Interactive confirmation prompt
- Automatic backup of previous deployment
- Server validation before success message
- Rollback instructions in output
- CloudFlare tunnel verification

**When to use:**
- Deploying finalized content to live site
- After staging validation passes
- For production hotfixes
- Scheduled content releases

**Important:** Always test on staging first!

**Output example:**
```
🚀 StillPoint Astro - Production Deployment
⚠️  This will replace the current Hugo production site

Are you sure you want to deploy to production? (y/N): y
🔄 Checking prerequisites...
✅ Using Node.js 22.20.0
✅ Prerequisites check completed
🔄 Backing up current Hugo production...
✅ Hugo production backed up
🔄 Syncing latest content to Astro...
✅ Content synced successfully
🔄 Building Astro site for production...
✅ Production build completed - 68 files generated
🔄 Deploying to production server...
✅ Deployed 68 files to production
🔄 Setting up production Astro server...
✅ Production server configured and started
🔄 Verifying CloudFlare tunnel configuration...
✅ CloudFlare tunnel verification complete (no changes needed)
🔄 Generating production deployment summary...

🎯 Production Deployment Summary:
  Hugo backup: /home/docker/hugo-backup-20250930-143022
  Astro production: docker@10.10.10.30:/home/docker/stillpoint-production
  Production server: port 8080 (same as Hugo - no tunnel reconfiguration needed)
  Server logs: ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30 'tail -f /home/docker/production.log'

  ✅ CloudFlare tunnel: No changes needed (already pointed to port 8080)
  ⚠️  Next steps:
  1. Test live site: https://stillpointproject.org
  2. Monitor logs for any errors
  3. Check all pages load correctly

🔄 Testing production server...
✅ Production server is responding on port 8080
✅ Public site should be live at https://stillpointproject.org

✅ Production deployment completed!
✅ Astro site should be live at https://stillpointproject.org
⚠️  Monitor logs and test thoroughly
⚠️  Rollback instructions in ROLLBACK_PROCEDURES.md if needed
```

### Script Troubleshooting

**Script fails with "Node.js not found":**
- Install Node.js v18.20.8 or higher
- Check if `fnm` (Fast Node Manager) is installed: `command -v fnm`
- Scripts will auto-select correct Node version if fnm is available

**Script fails with "SSH key not found":**
- Verify SSH key exists: `ls -la ~/.ssh/id_rsa_stillpoint`
- Check SSH key permissions: `chmod 600 ~/.ssh/id_rsa_stillpoint`
- Test SSH connection: `ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30 "echo 'Connected'"`

**Staging/Production server not responding after deployment:**
- Check server logs: `ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30 "tail -30 /home/docker/production.log"`
- Check if process is running: `ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30 "ps aux | grep production-server"`
- Manually restart: `ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30 'nohup node /home/docker/production-server.js > /home/docker/production.log 2>&1 &'`

**Content sync warnings about frontmatter:**
- Check that all `.md` files start with `---` YAML frontmatter
- Verify all required fields are present (title, status, type, etc.)
- Check for YAML syntax errors (unmatched quotes, incorrect indentation)

**Build fails with "Collection does not exist":**
- Run content sync first: `./scripts/sync-content-to-astro.sh`
- Check `astro-dev-site/src/content/` directories exist
- Verify frontmatter schema matches content.config.ts

---

## Common Issues and Solutions

### Issue: Build Fails with "Collection does not exist"

**Cause:** Missing YAML frontmatter or invalid frontmatter format.

**Solution:** Check your frontmatter matches the schema exactly. All required fields must be present.

### Issue: Story Not Appearing in Stories List

**Cause:** Story status might be set to `"draft"` instead of `"published"`.

**Solution:** Change `status: "draft"` to `status: "published"` in frontmatter, rebuild, and redeploy.

### Issue: Production Server Not Responding

**Check if server is running:**
```bash
ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30 \
  "ps aux | grep production-server | grep -v grep"
```

**Restart if needed:**
```bash
ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30 \
  'nohup node /home/docker/production-server.js > /home/docker/production.log 2>&1 &'
```

### Issue: Site Shows Old Content

**Cause:** Browser cache or CloudFlare cache.

**Solution:** Hard refresh in browser (Ctrl+Shift+R or Cmd+Shift+R).

---

## Content Schema Quick Reference

### Short Story Frontmatter

```yaml
---
# Required
title: "Story Title"
status: "published"  # or "draft", "canonical"
type: "short_story"  # or "vignette", "outline"
description: "One sentence summary"
word_count: 1100
era: "Era 3 - Luminous Presence"

# Recommended
page_count: 4
location: "Location Name"
pov_character: "Character Name"
characters: ["Character 1", "Character 2"]
featured: true
themes: ["theme1", "theme2"]
related_world: ["canonical_element"]
---
```

### Novel Scene Frontmatter

```yaml
---
# Required
title: "Scene Title"
era: "The Cascade"  # or "The Balance War", "Luminous Presence"
location: "Location Name"
pov_character: "Character Name"
voice: "Third-person limited, contemplative"
word_count: 1500
page_count: 6
status: "published"

# Recommended
chapter: "E1C01"
scene: "S01"
characters: ["Jonah", "Maren", "Liam"]
themes: ["presence", "community"]
related_world: ["stillpoint_device", "riverbend_commons"]
---
```

---

## Production Environment Details

- **Public URL:** https://stillpointproject.org
- **Server:** docker@10.10.10.30
- **Production Directory:** `/home/docker/stillpoint-production/`
- **Server Script:** `/home/docker/production-server.js`
- **Server Port:** 8080 (connected via CloudFlare tunnel)
- **Server Process:** Node.js HTTP server with directory index routing
- **CloudFlare Tunnel:** PID 201 (auto-connects to localhost:8080)

### Server Specifications

- **Platform:** Ubuntu 22.04.5 LTS
- **Node.js:** Installed via system packages
- **Routing:** Custom Node.js server with fallback chain:
  1. Try exact file path
  2. Try `path/index.html`
  3. Try `path.html`
  4. Return 404

---

## Related Documentation

- **CLAUDE.md** - Project overview and AI assistant instructions
- **ROLLBACK_PROCEDURES.md** - Emergency rollback to Hugo
- **PRODUCTION_READINESS_PLAN.md** - Complete migration status
- **world/workflow.md** - Chapter development workflow
- **world/still_point_world_bible.md** - Canonical world reference

---

## Workflow Example: Publishing "The Unscheduled Moment"

Here's a real example from September 29, 2025:

1. **Wrote story** in Narrator mode → 1100 words, Era 3
2. **Created file** at `short_stories/the_unscheduled_moment.md`
3. **Added frontmatter** with all required fields
4. **Copied to Astro:** `cp short_stories/the_unscheduled_moment.md astro-dev-site/src/content/stories/`
5. **Built site:** `npm run build` → Generated `dist/stories/the_unscheduled_moment/index.html`
6. **Deployed:** Stopped server, SCP'd files, restarted server
7. **Validated:** https://stillpointproject.org/stories/the_unscheduled_moment ✅
8. **Committed:** Git commit with descriptive message

**Total time:** 18 minutes from finished draft to live on production.

---

## Getting Help

If you encounter issues not covered in this guide:

1. Check `ROLLBACK_PROCEDURES.md` for server-related issues
2. Check build logs in terminal for Astro errors
3. Check production logs: `ssh docker@10.10.10.30 "tail -f /home/docker/production.log"`
4. Refer to `CLAUDE.md` for content schema requirements

---

**Document Version:** 2.0
**Last Updated:** September 30, 2025
**Maintainer:** Claude Code
**Status:** Production-tested workflow with automated deployment scripts

**What's New in v2.0:**
- Added Quick Start section with automated deployment scripts
- Documented all three deployment scripts (`sync-content-to-astro.sh`, `deploy-staging.sh`, `deploy-production.sh`)
- Added script output examples and troubleshooting
- Reorganized to show automated options first, manual workflow second
- Updated Quick Reference Commands to prioritize scripts
- Maintained complete manual workflow for learning and troubleshooting