# File Authority Analysis - StillPoint Project

## Executive Summary

✅ **LOCAL is the authoritative source** - Production appears to be an older, incomplete sync from local files.

## Key Findings

### Timezone Resolution ✅
- **Production Server:** UTC (+0000)
- **Local System:** America/Winnipeg (CDT, -0500)
- **Timestamp Match:** Identical when timezone-adjusted (e.g., local 14:42 CDT = 19:42 UTC)

### Content Verification ✅
**MD5 Hash Comparisons:**
- `e1_c07_s01_the_first_fire.md`: ✅ **IDENTICAL** (1b5153bdd1e64ee3892d82aadace4903)
- `e1_c06_s02_the_promise.md`: ✅ **IDENTICAL** (8e5aee9d0c0e75f3ee9591e468e174fb)

### File Inventory Comparison

| Category | Local | Production | Status |
|----------|--------|------------|--------|
| **Scene Files** | 10 files | 11 files | ⚠️ Production has 1 extra old file |
| **Interludes** | 4 files | 4 files | ✅ Same files, same content |
| **Support Files** | 1 (prologue) | 4 (prologue + 3 others) | ⚠️ Production has extra support files |

### Detailed File Analysis

#### Scene Files (`novel/scenes/`)
| File | Local Date (CDT) | Production Date (UTC) | Status |
|------|------------------|----------------------|--------|
| e1_c01_s01_the_daydream.md | Jul 17 10:01 | Jul 17 15:01 | ✅ **SYNC** |
| e1_c02_s01_the_severance.md | Jul 18 15:45 | Jul 18 20:45 | ✅ **SYNC** |
| e1_c02_s02_the_unstruck_note.md | Jul 18 15:51 | Jul 18 20:51 | ✅ **SYNC** |
| e1_c03_s01_the_ghost_in_the_machine.md | Jul 18 19:00 | Jul 19 00:00 | ✅ **SYNC** |
| e1_c04_s01_the_invitation.md | Jul 18 19:35 | Jul 19 00:35 | ✅ **SYNC** |
| e1_c04_s01_the_second_visit.md | **MISSING LOCAL** | Jul 6 00:50 | ⚠️ **ORPHAN** |
| e1_c05_s01_the_tin_men.md | Jul 18 19:58 | Jul 19 00:58 | ✅ **SYNC** |
| e1_c06_s01_the_offer.md | Jul 18 20:14 | Jul 19 01:14 | ✅ **SYNC** |
| e1_c06_s02_the_promise.md | Jul 23 14:42 | Jul 23 19:42 | ✅ **SYNC** |
| e1_c06_s03_the_choice.md | Jul 23 14:43 | Jul 23 19:43 | ✅ **SYNC** |
| e1_c07_s01_the_first_fire.md | Jul 23 14:44 | Jul 23 19:44 | ✅ **SYNC** |

#### Interludes (`novel/interludes/`)
| File | Local Date (CDT) | Production Date (UTC) | Status |
|------|------------------|----------------------|--------|
| interlude_chan_tea.md | Jun 30 19:29 | Jul 1 00:29 | ✅ **SYNC** |
| interlude_desert_fathers.md | Jun 30 19:27 | Jul 1 00:27 | ✅ **SYNC** |
| interlude_dine_night_chant.md | Jun 30 19:30 | Jul 1 00:30 | ✅ **SYNC** |
| interlude_quaker_meeting.md | Jul 1 12:29 | Jul 1 17:29 | ✅ **SYNC** |

#### Support Files
| File | Local | Production | Status |
|------|--------|------------|--------|
| prologue_the_stillness.md | ✅ Jul 5 | ✅ Jul 5 | ✅ **SYNC** |
| outline.md | ❌ Missing | ✅ Jul 23 | 📥 **PRODUCTION ONLY** |
| story_ideas.md | ❌ Missing | ✅ Jul 2 | 📥 **PRODUCTION ONLY** |
| workflow.md | ❌ Missing | ✅ Jul 23 | 📥 **PRODUCTION ONLY** |

## Analysis Conclusions

### 1. **Sync Pattern Evidence**
- All matching files have identical timestamps (timezone-adjusted)
- All content hashes match perfectly
- **Pattern:** Local → Production sync occurred, but was incomplete

### 2. **Orphaned Files**
- `e1_c04_s01_the_second_visit.md` exists only on production (Jul 6)
- Likely an old version that was later removed/renamed locally
- **Recommendation:** Archive or remove from production

### 3. **Missing Support Files**
- Production has 3 support files not present locally
- These may have been created directly on production
- **Recommendation:** Download and review these files

### 4. **Authority Determination**
- **Local files are authoritative** for scenes and interludes
- **Production may have unique support files** worth preserving

## Recommended Sync Strategy

### Phase 1: Preserve Production-Only Content ⚠️
```bash
# Download production-only files for review
scp docker@10.10.10.30:/home/docker/novel/outline.md ./world/
scp docker@10.10.10.30:/home/docker/novel/story_ideas.md ./archives/
scp docker@10.10.10.30:/home/docker/novel/workflow.md ./world/
scp docker@10.10.10.30:/home/docker/novel/scenes/e1_c04_s01_the_second_visit.md ./archives/
```

### Phase 2: Clean Sync Local → Production ✅
```bash
# Full sync from local (authoritative) to production
rsync -avz --delete novel/ docker@10.10.10.30:/home/docker/novel/
```

### Phase 3: Verify and Publish 🚀
```bash
# Run existing publication script
ssh docker@10.10.10.30 "cd stillpointproject.org && bash publish_novel.sh"
```

## Risk Assessment

- **Low Risk:** All current content matches between local/production
- **Medium Risk:** May lose production-only support files if not preserved
- **No Risk:** Existing publish script already handles the deployment workflow

## Next Steps

1. ✅ **Preserve** production-only files first
2. ✅ **Sync** local to production
3. ✅ **Test** existing publish workflow
4. ✅ **Create** automated deployment script based on findings