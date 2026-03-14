---
task: Fix audio player duration display and event firing
slug: 20260313-225000_stillpoint-audio-player-fix
effort: extended
phase: observe
progress: 0/16
mode: interactive
started: 2026-03-13T22:50:00-06:00
updated: 2026-03-13T22:50:00-06:00
---

## Context

### The Problem
Audio player duration displays as '--:--', time doesn't count up during playback, and timeupdate events don't fire. Root cause identified from git status: audio files are deleted from the repo (marked with `D`), so audio elements can't load metadata.

### Root Cause Analysis
1. Git status shows DELETED audio files (D prefix)
2. Stories have audio_file frontmatter references pointing to nonexistent files
3. When audio element's src points to 404, loadedmetadata never fires
4. setDuration() and setIsLoaded() never execute
5. Result: duration stays 0, shows '--:--', timeupdate never fires

### What's Not the Problem
- AudioPlayer.tsx component logic is correct
- Event listeners are properly attached
- React state management is sound
- Portal positioning is correct

### What Must Happen
1. Determine which stories have audio_file references
2. Identify what happened to the audio files (deleted intentionally? deployment artifact?)
3. Decide fix approach: restore files, remove references, or add test files
4. Implement fix
5. Verify in browser that duration displays and time counts up

### Risks
- Audio files may have been deleted intentionally as cleanup (need to check git history)
- Some stories may not actually have audio recorded (mismatch between frontmatter and reality)
- Audio file paths in frontmatter may be incorrect (name mismatch)
- Need to avoid breaking other stories that don't have audio

## Criteria

- [ ] ISC-1: Identify all story files with audio_file frontmatter references
- [ ] ISC-2: Check git log to understand why audio files were deleted
- [ ] ISC-3: Verify which audio files are referenced but missing from disk
- [ ] ISC-4: Determine fix approach (restore, remove refs, or add tests)
- [ ] ISC-5: Update story frontmatter to fix/remove broken audio_file references
- [ ] ISC-6: Sync content to astro-dev-site if changes made
- [ ] ISC-7: Build astro-dev-site successfully with no errors
- [ ] ISC-8: Open browser to story page with audio player
- [ ] ISC-9: Confirm duration displays correctly (not '--:--')
- [ ] ISC-10: Confirm play button works and starts playback
- [ ] ISC-11: Confirm time counts up during playback
- [ ] ISC-12: Confirm scrubber bar shows progress correctly
- [ ] ISC-13: Confirm seeking works (click scrubber, playback jumps)
- [ ] ISC-14: Confirm bookmark button is visible
- [ ] ISC-15: Confirm bookmark save/restore works
- [ ] ISC-16: Verify no console errors about audio loading
