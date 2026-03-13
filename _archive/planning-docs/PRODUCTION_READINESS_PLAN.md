# StillPoint Astro Migration - Production Readiness Plan

**Status:** Local development complete, staging and production deployment pending
**Last Updated:** 2025-09-29
**Target Go-Live:** TBD after staging validation

---

## Executive Summary

The Astro site is functionally complete in local development with all core features working. This document outlines the remaining tasks, risks, and deployment strategy to safely migrate from Hugo to Astro in production.

---

## Current State Analysis

### ✅ **Completed (Phase 1: Development)**

1. **Core Infrastructure**
   - Astro v5.14.1 with MDX and sitemap integrations
   - Content collections configured (novel, stories, world, blog)
   - Glob loaders working correctly with `entry.id` pattern
   - Dark mode infrastructure in place with localStorage persistence

2. **Content & Pages**
   - Homepage redesigned matching Hugo production aesthetic
   - Novel index page with 10 chapters displaying correctly
   - Story index page with 12 stories (all types: stories, outlines, briefs)
   - Dynamic routes for `/novel/[slug]` and `/stories/[slug]` working
   - Proper YAML frontmatter on all content files
   - Reading layouts with optimal typography

3. **Frontmatter & Schemas**
   - Comprehensive Zod schemas with 20+ optional fields for future expansion
   - Novel schema: 12 fields (title, era, location, pov_character, voice, word_count, etc.)
   - Stories schema: 25+ fields (type, featured, themes, related_world, etc.)
   - All existing content validated

4. **Development Environment**
   - Dev server running on localhost:4321
   - Hot module reloading functional
   - Build process verified (`npm run build` works)

### ⚠️ **Incomplete/Issues**

1. **Dark Mode Toggle**
   - JavaScript exists in Layout.astro
   - Button renders but icon not updating dynamically
   - Theme persistence working, but UX polish needed

2. **Content Workflow**
   - Content currently in two places: source (`/novel/`, `/short_stories/`) AND Astro (`/astro-dev-site/src/content/`)
   - `sync-content-to-astro.sh` script exists but workflow not enforced
   - Risk of content divergence

3. **Configuration**
   - astro.config.mjs still has placeholder site URL: `https://example.com`
   - Should be: `https://stillpointproject.org`

4. **Unused/Template Pages**
   - `/blog` section still has Astro template content
   - `/about` page is template placeholder
   - `debug-stories.astro` debug page should be removed before production

5. **Production Server**
   - CloudFlare tunnel currently points to Hugo on port 8080
   - Need to reconfigure tunnel OR change Astro production port
   - Hugo backup strategy defined but not tested

---

## Critical Decisions Required

### Decision 1: Content Editing Workflow

**Options:**

**A. Source-First Workflow (Recommended)**
```
Edit: /novel/scenes/*.md, /short_stories/*.md
Sync: ./scripts/sync-content-to-astro.sh
Build: cd astro-dev-site && npm run build
```
**Pros:**
- Single source of truth for content
- Content versioned separately from Astro code
- Easier for non-technical content editors
- Matches existing Hugo workflow mental model

**Cons:**
- Extra sync step before local dev/build
- Risk of forgetting to sync
- Two copies of content on disk

**B. Astro-Direct Workflow**
```
Edit: /astro-dev-site/src/content/{novel,stories}/*.md
Build: cd astro-dev-site && npm run build
```
**Pros:**
- No sync step needed
- Single location for content
- Simpler mental model

**Cons:**
- Content coupled with Astro code
- Harder to reuse content with different frameworks
- Breaks existing `/novel/` and `/short_stories/` structure

**Recommendation:** **Option A (Source-First)** - Add git pre-commit hook to auto-sync content, ensuring consistency. Document workflow clearly in CLAUDE.md.

---

### Decision 2: Production Port Strategy

**Current Hugo:**
- Hugo server runs on `localhost:8080`
- CloudFlare tunnel points to `localhost:8080`
- Public URL: `https://stillpointproject.org`

**Astro Options:**

**A. Change Astro to Port 8080**
- Modify `deploy-production.sh` to serve Astro on port 8080
- No CloudFlare tunnel reconfiguration needed
- Seamless switchover

**B. Keep Astro on Different Port (e.g., 3000)**
- Reconfigure CloudFlare tunnel to new port
- More complex deployment
- Allows running Hugo and Astro simultaneously during transition

**Recommendation:** **Option A (Port 8080)** - Minimize infrastructure changes, reduce deployment risk.

---

### Decision 3: Staging Testing Duration

**Recommendation:** Run staging for **minimum 48 hours** before production deployment:
- Test all pages load correctly
- Verify dark mode works across browsers
- Check mobile responsiveness
- Test story and novel reading experience
- Validate CloudFlare tunnel connectivity (if using staging URL)
- Perform load testing with realistic traffic

---

## Production Readiness Checklist

### Phase 2: Pre-Staging (Est. 2-4 hours)

- [ ] **Fix Dark Mode Toggle Icon Update**
  - Investigate why button text doesn't update on click
  - Test theme persistence across page navigations
  - Verify prefers-color-scheme detection

- [ ] **Update Configuration**
  - Change `astro.config.mjs` site URL to `https://stillpointproject.org`
  - Review and update `/astro-dev-site/package.json` metadata
  - Set proper meta tags for SEO

- [ ] **Clean Up Template Content**
  - Remove or redirect `/blog` section (or customize it)
  - Update `/about` page with actual project information
  - Delete `debug-stories.astro`
  - Remove Astro template social links from old Header.astro

- [ ] **Implement Content Workflow**
  - Document chosen workflow in CLAUDE.md
  - Add git pre-commit hook if using Source-First workflow
  - Test sync script end-to-end
  - Add validation: ensure sync script detects missing content

- [ ] **Test Full Build**
  - Run `npm run build` and verify no errors
  - Check `dist/` directory structure
  - Validate all pages render correctly in `npm run preview`
  - Test with production environment variables

- [ ] **Add Missing Frontmatter**
  - Verify all novel scenes have complete YAML
  - Check all stories have proper metadata
  - Validate world content if using

---

### Phase 3: Staging Deployment (Est. 1-2 hours)

- [ ] **Deploy to Staging**
  ```bash
  ./scripts/deploy-staging.sh
  ```

- [ ] **Validate Staging Environment**
  - [ ] Access `http://10.10.10.30:4000` successfully
  - [ ] Homepage loads with correct styling
  - [ ] Navigate to `/novel` - verify all chapters listed
  - [ ] Open random chapter - verify formatting
  - [ ] Navigate to `/stories` - verify all stories listed
  - [ ] Open "The Neural Stream" - verify full story renders
  - [ ] Test dark mode toggle - verify it works
  - [ ] Test on mobile device/responsive view
  - [ ] Check browser console for errors
  - [ ] Test breadcrumb navigation
  - [ ] Verify footer displays correctly

- [ ] **Performance Testing**
  - [ ] Measure page load times (should be <2s)
  - [ ] Check Lighthouse scores (target: 90+ performance)
  - [ ] Verify images load correctly
  - [ ] Test with slow 3G throttling

- [ ] **Content Validation**
  - [ ] Verify all 10 novel chapters accessible
  - [ ] Verify all 12 stories accessible
  - [ ] Check that proper stories display (not outlines/briefs in main listing)
  - [ ] Validate reading experience (line length, spacing, fonts)

- [ ] **Cross-Browser Testing**
  - [ ] Chrome/Chromium
  - [ ] Firefox
  - [ ] Safari (if available)
  - [ ] Mobile Safari (iOS)
  - [ ] Mobile Chrome (Android)

---

### Phase 4: Production Preparation (Est. 2-3 hours)

- [ ] **Review Deploy Scripts**
  - [ ] Verify `deploy-production.sh` backup logic
  - [ ] Confirm Hugo backup directory will be created
  - [ ] Test SSH key access to production server
  - [ ] Verify port 8080 strategy

- [ ] **Backup Current Production**
  - [ ] Document current Hugo git commit hash
  - [ ] Take manual backup of Hugo site
  - [ ] Document CloudFlare tunnel configuration
  - [ ] Create rollback procedure document

- [ ] **Prepare Monitoring**
  - [ ] Set up basic uptime monitoring
  - [ ] Configure error alerting (if available)
  - [ ] Prepare logging strategy

- [ ] **Communication Plan**
  - [ ] Notify any stakeholders of maintenance window
  - [ ] Prepare rollback messaging
  - [ ] Document expected downtime (target: <5 minutes)

---

### Phase 5: Production Deployment (Est. 30 minutes + monitoring)

- [ ] **Pre-Flight Checks**
  - [ ] Staging validated for 48+ hours
  - [ ] No critical issues found
  - [ ] Rollback procedure documented and tested
  - [ ] Backup verified

- [ ] **Execute Deployment**
  ```bash
  ./scripts/deploy-production.sh
  ```

- [ ] **Post-Deployment Validation** (Critical - Do Immediately)
  - [ ] Visit `https://stillpointproject.org` - homepage loads
  - [ ] Navigate to `/novel` - chapter list appears
  - [ ] Open first chapter - content displays correctly
  - [ ] Navigate to `/stories` - story list appears
  - [ ] Open "The Neural Stream" - full story loads
  - [ ] Test dark mode toggle
  - [ ] Check browser console - no critical errors
  - [ ] Verify on mobile device

- [ ] **Monitor for Issues** (First 24 hours)
  - [ ] Check for 404 errors
  - [ ] Monitor server logs
  - [ ] Watch for user reports (if applicable)
  - [ ] Verify CloudFlare tunnel stability

- [ ] **Rollback if Needed**
  - If critical issues found:
    ```bash
    # SSH to production server
    ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30

    # Stop Astro
    pkill -f "node.*stillpoint-production"

    # Restore Hugo from backup
    cd /home/docker/hugo-backup-TIMESTAMP
    nohup hugo server -p 8080 -D --bind 0.0.0.0 > hugo.log 2>&1 &

    # Verify Hugo restored
    curl http://localhost:8080
    ```

---

## Risk Assessment

### High Risk Items

1. **CloudFlare Tunnel Disruption**
   - **Risk:** Tunnel configuration might not work with new setup
   - **Mitigation:** Keep Hugo backup running on different port initially
   - **Rollback Time:** ~2 minutes

2. **Content Rendering Issues**
   - **Risk:** Some markdown/MDX might not render correctly in production
   - **Mitigation:** Thorough staging testing of all content
   - **Rollback Time:** ~2 minutes

3. **Port Conflicts**
   - **Risk:** Port 8080 already in use or blocked
   - **Mitigation:** Pre-check port availability, kill Hugo cleanly
   - **Rollback Time:** ~1 minute

### Medium Risk Items

1. **Dark Mode Bugs**
   - **Impact:** UX degraded but site functional
   - **Mitigation:** Can fix in hotfix if needed

2. **Mobile Layout Issues**
   - **Impact:** Poor mobile experience
   - **Mitigation:** Responsive CSS already in place, test thoroughly in staging

3. **Performance Degradation**
   - **Impact:** Slow page loads
   - **Mitigation:** Static site should be fast, monitor Lighthouse scores

### Low Risk Items

1. **Missing Metadata**
   - **Impact:** Some pages missing descriptions/SEO
   - **Mitigation:** Can add incrementally post-launch

2. **Blog Section Placeholder**
   - **Impact:** Confusing if users find it
   - **Mitigation:** Remove or hide before production

---

## Technical Debt

### Short-Term (Address before production)
1. Dark mode toggle icon update bug
2. Remove template placeholder pages
3. Update site configuration URLs
4. Finalize content workflow

### Medium-Term (Address within 2 weeks post-launch)
1. Add automated content sync to git workflow
2. Implement proper 404 page
3. Add RSS feed generation
4. Optimize images (if any)
5. Add more comprehensive error handling

### Long-Term (Address as needed)
1. World building pages/section
2. Blog section customization or removal
3. Search functionality
4. Comments or interaction features
5. Analytics integration

---

## Deployment Timeline Estimate

**Total Estimated Time:** 6-10 hours

| Phase | Task | Duration | Notes |
|-------|------|----------|-------|
| 2 | Pre-Staging Fixes | 2-4 hours | Dark mode, cleanup, config |
| 3 | Staging Deployment | 1-2 hours | Deploy + initial validation |
| 3 | Staging Soak Time | 48 hours | Waiting period, periodic checks |
| 4 | Production Prep | 2-3 hours | Backups, documentation, final review |
| 5 | Production Deploy | 30 mins | Actual deployment |
| 5 | Post-Deploy Monitor | 24 hours | Ongoing monitoring |

**Recommended Schedule:**
- **Day 1 Morning:** Complete Pre-Staging fixes (Phase 2)
- **Day 1 Afternoon:** Deploy to staging, begin validation (Phase 3)
- **Days 1-3:** Staging soak testing (48+ hours)
- **Day 3:** Production preparation (Phase 4)
- **Day 4 Morning:** Production deployment (Phase 5)
- **Days 4-5:** Close monitoring

---

## Success Criteria

### Must-Have (Go/No-Go)
- [ ] All pages load without errors
- [ ] Novel chapters readable
- [ ] Stories accessible and properly formatted
- [ ] Dark mode functional (even if icon buggy)
- [ ] Mobile responsive
- [ ] CloudFlare tunnel operational
- [ ] Rollback procedure tested

### Nice-to-Have
- [ ] Dark mode icon updates correctly
- [ ] Lighthouse score >90
- [ ] Page load <1s
- [ ] No console warnings
- [ ] Perfect mobile experience

---

## Key Contacts & Resources

### Documentation
- Hugo workflow: `/HUGO_PUBLISHING_WORKFLOW.md`
- Project context: `/CLAUDE.md`
- Content sync script: `/scripts/sync-content-to-astro.sh`
- Staging deploy: `/scripts/deploy-staging.sh`
- Production deploy: `/scripts/deploy-production.sh`

### Server Access
- **Production:** `docker@10.10.10.30`
- **SSH Key:** `~/.ssh/id_rsa_stillpoint`
- **Hugo Port:** 8080
- **Staging Port:** 4000
- **CloudFlare:** Tunnel PID 201

### Rollback Procedures
See Phase 5 "Rollback if Needed" section above.

---

## Next Immediate Actions

### Priority 1 (Required for Staging)
1. Fix dark mode toggle icon update
2. Update `astro.config.mjs` with production URL
3. Remove/update template pages (blog, about, debug)
4. Document and test content sync workflow

### Priority 2 (Required for Production)
5. Deploy to staging
6. Validate staging environment thoroughly
7. Run cross-browser and mobile tests
8. Document rollback procedure step-by-step
9. Prepare production deployment checklist

### Priority 3 (Polish)
10. Add 404 page
11. Optimize meta tags for SEO
12. Add RSS feed
13. Performance optimization pass

---

## Appendix A: Content Sync Workflow (Recommended)

### Manual Workflow
```bash
# 1. Edit content in source directories
vim novel/scenes/e1_c08_new_scene.md

# 2. Sync to Astro
./scripts/sync-content-to-astro.sh

# 3. Test locally
cd astro-dev-site && npm run dev

# 4. Build for deployment
npm run build

# 5. Deploy
./scripts/deploy-staging.sh  # or deploy-production.sh
```

### Automated Workflow (Future Enhancement)
```bash
# Add to .git/hooks/pre-commit
#!/bin/bash
./scripts/sync-content-to-astro.sh
git add astro-dev-site/src/content/
```

---

## Appendix B: Quick Reference Commands

### Local Development
```bash
cd astro-dev-site && npm run dev       # Start dev server (port 4321)
npm run build                          # Build for production
npm run preview                        # Preview production build
```

### Content Management
```bash
./scripts/sync-content-to-astro.sh     # Sync content from source
```

### Deployment
```bash
./scripts/deploy-staging.sh            # Deploy to staging (port 4000)
./scripts/deploy-production.sh         # Deploy to production (port 8080)
```

### Server Access
```bash
ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30   # SSH to production
```

### Hugo Rollback (Emergency)
```bash
ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30
cd /home/docker/hugo-backup-TIMESTAMP
nohup hugo server -p 8080 -D --bind 0.0.0.0 > hugo.log 2>&1 &
```

---

**Document Owner:** AI Assistant (Claude)
**Review Cadence:** Update after each major milestone
**Status:** Draft - Awaiting user review and decision on critical items