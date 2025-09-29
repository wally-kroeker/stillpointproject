# Story Files Frontmatter Audit

**Date:** 2025-09-29
**Purpose:** Categorize story files and document frontmatter fixes needed for Astro migration

## Categorization

### ✅ Complete Stories (Has good frontmatter)
1. **the_neural_stream.md** - Canonical short story (5500 words)
   - Status: GOOD - Has proper frontmatter with type: "Short Story"
   - Action: Minor update - change `type: "Short Story"` to `type: "short_story"` (enum requirement)

2. **the_unfiltered_feed.md** - Vignette (1100 words)
   - Status: GOOD - Has proper frontmatter
   - Action: Add `type: "vignette"` field

3. **the_geode_and_the_courier.md** - Short story (2000 words)
   - Status: GOOD - Already has YAML frontmatter (fixed earlier)
   - Action: Add `type: "short_story"` field

### ✅ Miller's Daughter Series (Has frontmatter)
4. **Kimi2_Part1_TheGrindstone.md** - Story part 1 (1500 words)
   - Status: GOOD - Has proper frontmatter
   - Action: Add `type: "short_story"`, `description` field

5. **Kimi2_Part2_TheRiverAndTheHum.md** - Story part 2 (1600 words)
   - Status: GOOD - Has proper frontmatter
   - Action: Add `type: "short_story"`, `description` field

6. **Kimi2_Part3_TheMillersChoice.md** - Story part 3 (1700 words)
   - Status: GOOD - Has proper frontmatter
   - Action: Add `type: "short_story"`, `description` field

7. **e1_ss_tmd_s01_the_grindstone.md** - Story rewrite part 1 (1511 words)
   - Status: GOOD - Has proper frontmatter
   - Action: Add `type: "short_story"`, `description` field, clarify relationship to Kimi2 version

8. **e1_ss_tmd_s02_the_river_and_the_hum.md** - Story rewrite part 2 (1549 words)
   - Status: GOOD - Has proper frontmatter
   - Action: Add `type: "short_story"`, `description` field

9. **e1_ss_tmd_s03_the_millers_choice.md** - Story rewrite part 3 (1529 words)
   - Status: GOOD - Has proper frontmatter
   - Action: Add `type: "short_story"`, `description` field

### 📝 Planning/Outline Files (Needs categorization)
10. **the_millers_daughter_outline.md** - Planning document
    - Status: NEEDS WORK - Has basic frontmatter but needs `type` field
    - Action: Add `type: "outline"`

11. **the_neural_stream_outline.md** - Planning document
    - Status: NEEDS WORK - Has basic frontmatter but needs `type` field
    - Action: Add `type: "outline"`

12. **the_neural_stream_scene_brief.md** - Scene brief
    - Status: NEEDS WORK - Has basic frontmatter but needs `type` field
    - Action: Add `type: "scene_brief"`

## Implementation Priority

### Phase 1: Add Required Fields (type)
All files need `type` field added to pass schema validation.

### Phase 2: Enhance Complete Stories
Add rich metadata to published/canonical stories:
- description (one-sentence summary)
- characters array
- themes array
- featured flag
- related_world array

### Phase 3: Document Relationships
- Link Miller's Daughter variants (Kimi2 vs e1_ss_tmd versions)
- Document which are latest/canonical versions
- Add canonical_order for multi-part stories

## Files Summary
- **Complete Stories:** 3 (neural_stream, unfiltered_feed, geode_courier)
- **Story Parts:** 6 (Miller's Daughter in two versions)
- **Planning Docs:** 3 (outlines and scene brief)
- **Total:** 12 files

## Next Steps
1. Add `type` field to all files
2. Enhance metadata on complete stories
3. Test Astro dev server
4. Consider moving planning docs to separate directory