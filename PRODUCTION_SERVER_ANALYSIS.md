# Production Server Analysis - StillPoint Project

## Server Details
- **Host:** 10.10.10.30
- **User:** docker
- **SSH Key Location:** `~/.ssh/id_rsa_stillpoint` (copied from Windows mount)
- **Connection Status:** ✅ Working

## Current Production File Structure

### Novel Content Location: `/home/docker/novel/`

```
/home/docker/novel/
├── interludes/
├── outline.md (Jul 23 21:25)
├── prologue_the_stillness.md (Jul 5 20:08)
├── scenes/
│   ├── e1_c01_s01_the_daydream.md (Jul 17 15:01)
│   ├── e1_c02_s01_the_severance.md (Jul 18 20:45)
│   ├── e1_c02_s02_the_unstruck_note.md (Jul 18 20:51)
│   ├── e1_c03_s01_the_ghost_in_the_machine.md (Jul 19 00:00)
│   ├── e1_c04_s01_the_invitation.md (Jul 19 00:35)
│   ├── e1_c04_s01_the_second_visit.md (Jul 6 00:50) ⚠️ OLD VERSION?
│   ├── e1_c05_s01_the_tin_men.md (Jul 19 00:58)
│   ├── e1_c06_s01_the_offer.md (Jul 19 01:14)
│   ├── e1_c06_s02_the_promise.md (Jul 23 19:42)
│   ├── e1_c06_s03_the_choice.md (Jul 23 19:43)
│   └── e1_c07_s01_the_first_fire.md (Jul 23 19:44)
├── story_ideas.md (Jul 2 16:43)
└── workflow.md (Jul 23 21:27)
```

### Publication System: `/home/docker/stillpointproject.org/`

```
/home/docker/stillpointproject.org/
├── publish_novel.sh (Jul 20 18:17) ✅ EXISTING AUTOMATION
├── my-landing-page/ (Hugo site)
└── [other website files]
```

## Local vs Production Comparison

### Files That May Need Attention:
1. **`e1_c04_s01_the_second_visit.md`** - Production version dated Jul 6, much older than other files
2. **Prologue** - Production: Jul 5, Local: Jul 5 (likely same)
3. **Most recent production updates:** Jul 23 (chapters 6-7)

### Local Project Structure:
```
./novel/
├── briefs/
├── interludes/
│   ├── interlude_chan_tea.md
│   ├── interlude_desert_fathers.md
│   ├── interlude_dine_night_chant.md
│   └── interlude_quaker_meeting.md
├── prologue_the_stillness.md
└── scenes/
    ├── e1_c01_s01_the_daydream.md (Jul 17 10:01)
    ├── e1_c02_s01_the_severance.md (Jul 18 15:45)
    ├── e1_c02_s02_the_unstruck_note.md (Jul 18 15:51)
    ├── e1_c03_s01_the_ghost_in_the_machine.md (Jul 18 19:00)
    ├── e1_c04_s01_the_invitation.md (Jul 18 19:35)
    ├── e1_c05_s01_the_tin_men.md (Jul 18 19:58)
    ├── e1_c06_s01_the_offer.md (Jul 18 20:14)
    ├── e1_c06_s02_the_promise.md (Jul 23 14:42)
    ├── e1_c06_s03_the_choice.md (Jul 23 14:43)
    └── e1_c07_s01_the_first_fire.md (Jul 23 14:44)
```

## Key Observations:

### 🔍 Timestamp Discrepancies:
- **Production times are later in the day** than local times for same dates
- **Jul 23 files:** Local shows 14:42-14:44, Production shows 19:42-19:44 (5-hour difference)
- This suggests **production files may be newer** or there's a timezone difference

### ⚠️ Potential Issues:
1. **Missing local interludes on production** - Local has 4 interlude files not present on production
2. **`e1_c04_s01_the_second_visit.md`** appears to be outdated on production (Jul 6 vs others in Jul 18-23 range)
3. **Timezone confusion** - Need to determine which files are actually newer

### ✅ Existing Infrastructure:
- Working `publish_novel.sh` script already configured
- Hugo site structure in place
- SSH access established

## Recommended Next Steps:

1. **Compare file contents** to determine which versions are current
2. **Establish sync direction** (local → production or production → local)
3. **Handle interlude files** that exist locally but not on production
4. **Create backup strategy** before any sync operations
5. **Test the existing publish_novel.sh** to ensure it works with current Hugo setup

## Questions to Resolve:
- Are the local files or production files the authoritative version?
- Should interludes be deployed to production?
- What timezone is the production server using?
- When was the last time you manually updated production files?