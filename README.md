# The StillPoint Saga

A multi-era science fiction novel spanning 2029-2095, exploring humanity's path from technological acceleration crisis to contemplative renaissance.

**Read it now:** [stillpointproject.org](https://stillpointproject.org)

## The Story

What happens when humanity builds a device that can induce genuine contemplative presence — and then has to decide what to do with it?

The StillPoint Saga follows the invention of the StillPoint device and the world it creates across three eras:

- **Era 1: The Cascade (2029-2036)** — Near-future crisis. The attention economy has fractured society. A physicist named Sajan Mehta discovers something unexpected in his lab, and the world splits between those who want to control it and those who want to share it.

- **Era 2: The Balance War (2037-2060)** — Societal transition. Commons communities emerge around StillPoint technology while powerful interests fight to contain what they can't commodify.

- **Era 3: Luminous Presence (2061-2095)** — A new world. Decades after the transition, a nine-year-old girl named Kaia carves her first Pebble from a salt wall in an underground commons, and begins learning what it means to hold questions without needing answers.

## What's Here

This repository is the complete source for the StillPoint Saga — the stories, the world, and the web platform that publishes them.

```
StillPoint/
├── novel/                  # Novel chapters and interludes
│   ├── scenes/             # Main chapter scenes
│   └── interludes/         # Historical vignettes spanning 1500 years
├── short_stories/          # Standalone stories set in the StillPoint world
├── world/                  # World bible, characters, locations, technology, lore
│   ├── characters/         # Character cards
│   ├── locations/          # Commons and setting descriptions
│   ├── technology/         # StillPoint device, Ghost Current, Satya AI, Pebbles
│   └── lore/               # Philosophy, governance, economics
├── fan_fiction/             # Community and experimental stories
├── astro-dev-site/         # Astro web platform (stillpointproject.org)
└── scripts/                # Content sync and deployment tools
```

## Published Content

### Novel
- **Prologue:** The Stillness
- **Chapter 1:** The Daydream
- **Chapter 2:** The Severance, The Unstruck Note
- **Interludes:** Five contemplative vignettes spanning from 6th-century desert monasticism to 16th-century Dissolution of Monasteries

### Short Stories
- **The Neural Stream** — A streaming platform that reads your neural state
- **The Seed Imprint** — A child's first year with a Pebble companion
- **The Unfiltered Feed** — What happens when the filters come off
- **The Unscheduled Moment** — Finding presence in an optimized world
- **The Geode and the Courier** — A courier's delivery to a remote commons
- **Instruction Layers** — The hidden architecture of attention
- **The Miller's Daughter** (3 parts) — A prairie family navigating the transition

## Running Locally

```bash
cd astro-dev-site
npm install
npm run dev
```

Visit [localhost:4321](http://localhost:4321)

Content lives in the source directories (`novel/`, `short_stories/`, `world/`) and syncs to the Astro site via `./scripts/sync-content-to-astro.sh`.

## A Human-AI Collaboration

This project is written transparently as a collaboration between a human author and AI creative partners. The world-building, story architecture, and editorial direction are human-driven. Scene prose is produced by specialized AI writing agents grounded in the world bible, then edited through multiple passes. The process is part of the story the project tells about human-AI partnership.

## License

Copyright 2025-2026 Wally Kroeker. All rights reserved.

The stories, world-building content, and creative works in this repository are published for reading and reference. They may not be reproduced, distributed, or used for AI training without permission.

The Astro web platform code is available under the MIT License.
