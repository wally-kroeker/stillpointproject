# Git-Based Workflow Optimization Plan

## Current Structure Analysis ❌

### Production (Inefficient)
```
/home/docker/
├── novel/                    (source content)
├── stillpointproject.org/    (separate directory)
│   ├── publish_novel.sh      (copies files between directories)
│   └── my-landing-page/      (Hugo site)
│       └── content/novel/    (copied/processed content)
```

**Problems:**
- ❌ Two separate directories requiring manual file copying
- ❌ No version control
- ❌ Complex multi-step manual process
- ❌ Hugo content duplicated from source

### Local (Good but not git-integrated)
```
/mnt/c/Obsidian/.../The StillPoint Project/
├── novel/          (source content)
├── world/          (world building)
├── characters/     (character cards)
└── CLAUDE.md       (project instructions)
```

## Optimized Structure 🎯

### Unified Production Repository
```
/home/docker/stillpoint-project/  (single git repo)
├── .git/
├── .gitignore
├── novel/                    (source - versioned)
│   ├── scenes/
│   ├── interludes/
│   └── prologue.md
├── world/                    (versioned)
│   ├── characters/
│   ├── locations/
│   └── still_point_world_bible.md
├── site/                     (Hugo integrated)
│   ├── config.yaml
│   ├── static/
│   ├── themes/
│   ├── content/              (generated - not versioned)
│   │   └── novel/            (processed from ../novel/)
│   └── public/               (Hugo output - not versioned)
├── scripts/
│   ├── post-receive          (git hook - auto triggers)
│   ├── process-content.sh    (adapted from publish_novel.sh)
│   └── deploy.sh            (manual rebuild if needed)
└── CLAUDE.md                 (project instructions)
```

### Key Optimizations

#### 1. **Eliminate Directory Separation** 🔥
- **Before:** `/novel/` + `/stillpointproject.org/` (separate)
- **After:** Single unified repository with integrated Hugo site

#### 2. **Eliminate File Copying** 🔥
- **Before:** `cp /novel/* /stillpointproject.org/my-landing-page/content/`
- **After:** Direct processing from `novel/` to `site/content/novel/`

#### 3. **Git-Triggered Automation** 🔥
- **Before:** Manual SSH + script execution
- **After:** `git push` → automatic processing + Hugo build

#### 4. **Version Everything Important** 🔥
- **Source content** (novel/, world/, characters/)
- **Hugo configuration** (site/config.yaml, themes/)
- **Build scripts** (scripts/)
- **Ignore generated content** (site/content/, site/public/)

## Implementation Plan

### Phase 1: Production Repository Setup

#### Step 1: Create Unified Structure
```bash
# On production server
cd /home/docker
git init --bare stillpoint-project-bare.git
git clone stillpoint-project-bare.git stillpoint-project

cd stillpoint-project
mkdir -p {novel/{scenes,interludes},world/{characters,locations},site/{content,static,themes},scripts}
```

#### Step 2: Migrate Existing Content
```bash
# Copy current novel content
cp -r /home/docker/novel/* ./novel/

# Copy Hugo site
cp -r /home/docker/stillpointproject.org/my-landing-page/* ./site/

# Adapt processing script
cp /home/docker/stillpointproject.org/publish_novel.sh ./scripts/process-content.sh
```

#### Step 3: Create Git Post-Receive Hook
```bash
# /home/docker/stillpoint-project-bare.git/hooks/post-receive
#!/bin/bash
cd /home/docker/stillpoint-project
git --git-dir=.git --work-tree=. checkout -f main

echo "🔄 Processing novel content..."
cd scripts
./process-content.sh

echo "🚀 Building Hugo site..."
cd ../site
hugo

echo "✅ Publication complete!"
```

### Phase 2: Local Repository Setup

#### Step 1: Initialize Local Git
```bash
# In your current project directory
git init
git add .
git commit -m "Initial StillPoint Project commit"
```

#### Step 2: Add Production Remote
```bash
git remote add production docker@10.10.10.30:/home/docker/stillpoint-project-bare.git
```

#### Step 3: Create Streamlined Publish Script
```bash
# ./publish.sh
#!/bin/bash
echo "📝 Committing latest changes..."
git add .
git commit -m "Publish: $(date)"

echo "🚀 Publishing to production..."
git push production main

echo "✅ Published to stillpointproject.org"
```

### Phase 3: Optimized Scripts

#### Enhanced process-content.sh
- Adapt current `publish_novel.sh` logic
- Process from `../novel/` to `../site/content/novel/`
- Add validation and error handling
- Generate build statistics

#### Smart .gitignore
```
# Generated content (don't version)
site/content/novel/
site/public/
site/resources/

# OS files
.DS_Store
Thumbs.db

# Editor files
.vscode/
*.swp
*.swo

# Logs
*.log
```

## Workflow Comparison

### Current Workflow ❌
```bash
# 5+ manual steps
ssh docker@10.10.10.30
cd /home/docker
rsync novel/ ...
cd stillpointproject.org
./publish_novel.sh
exit
```

### Optimized Workflow ✅
```bash
# Single command
./publish.sh
```

## Advanced Features Enabled

### 1. **Instant Rollback**
```bash
git revert HEAD~1  # Undo last publication
git push production main
```

### 2. **Branch Development**
```bash
git checkout -b draft-chapter-8
# Work on drafts without affecting main
git checkout main && git merge draft-chapter-8
```

### 3. **Release Tagging**
```bash
git tag v1.0 -m "First complete draft"
git push production --tags
```

### 4. **Change Tracking**
```bash
git log --oneline novel/scenes/  # See all scene changes
git diff HEAD~5 novel/           # Compare with 5 commits ago
```

## Migration Steps Required

### Production Server Changes:
1. ✅ Create unified repository structure
2. ✅ Migrate existing content and Hugo site
3. ✅ Set up git post-receive hook
4. ✅ Adapt processing script to new paths
5. ✅ Test automated build process

### Local Development Changes:
1. ✅ Initialize git repository
2. ✅ Add production remote
3. ✅ Create streamlined publish script
4. ✅ Add appropriate .gitignore
5. ✅ Test end-to-end workflow

### Benefits Summary:
- **90% reduction** in publish commands (5 steps → 1)
- **Complete version history** of all content
- **Instant rollback** capability
- **Automated processing** via git hooks
- **Elimination of file copying** between directories
- **Future-ready** for collaboration and CI/CD
- **Maintains all existing Hugo processing** logic

This structure eliminates all major inefficiencies while adding powerful git-based capabilities. Ready to implement?