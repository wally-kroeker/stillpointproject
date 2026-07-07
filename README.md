# The StillPoint

**A human-AI collaborative novel about what happens when humanity learns to be still.**

**Read it now:** [stillpointproject.org](https://stillpointproject.org)

## About This Project

The StillPoint is an experiment in transparent human-AI storytelling. It started in late 2024 as a simple idea — what if someone invented a device that could induce genuine contemplative presence? — and has grown over two years into a full science fiction world spanning seven decades, with a cast of characters, a deep technology canon, and a philosophy grounded in the tension between acceleration and stillness.

From the beginning, this has been a collaboration between a human author (Wally Kroeker) and AI creative partners. There has never been an attempt to hide that. The project is as much about exploring what human-AI creative partnership looks like in practice as it is about telling a story.

### How it's made

The early development used Roo Code (a VS Code AI coding assistant) with a multi-agent system: a **Creative Partner** for brainstorming and story architecture, a **Narrator** for producing scene prose, an **Editor** for craft feedback from a fresh-reader perspective, and a **Lore Keeper** for maintaining canon consistency across the world bible. Each agent had its own system prompt and personality. The Creative Partner would produce scene briefs — detailed documents specifying the core tension, emotional arc, sensory palette, and key beats — and hand them off to the Narrator for prose generation. The Editor would review without any world-building context, deliberately canon-blind, so it could catch craft issues a lore-steeped reader might miss.

The project later migrated to Claude Code with similar specialized agents, and the tooling has evolved continuously — from manual prompting to structured workflows to automated content pipelines. The world bible, character cards, location descriptions, and technology specs are all maintained as structured markdown files that the AI agents read before producing any content. Nothing is generated in a vacuum.

The human role is vision, architecture, editorial judgment, and the question of *why this story matters*. The AI role is prose generation, consistency checking, and the kind of tireless iteration that turns a rough scene brief into polished narrative. Both are essential. Neither is sufficient alone.

This repository is the whole thing — the stories, the world, the platform, and the process — published openly because transparency is the point.

## The Story

What happens when humanity builds a device that can induce genuine contemplative presence — and then has to decide what to do with it?

The StillPoint follows the invention of the StillPoint device and the world it creates across three eras:

- **Era 1: The Cascade (2029-2036)** — Near-future crisis. The attention economy has fractured society. A physicist named Sajan Mehta discovers something unexpected in his lab, and the world splits between those who want to control it and those who want to share it.

- **Era 2: The Balance War (2037-2060)** — Societal transition. Commons communities emerge around StillPoint technology while powerful interests fight to contain what they can't commodify.

- **Era 3: Luminous Presence (2061-2095)** — A new world. Decades after the transition, a nine-year-old girl named Kaia carves her first Pebble from a salt wall in an underground commons, and begins learning what it means to hold questions without needing answers.

## The Practice — a Third Way

The Saga is fiction, but the question underneath it is not: what does it look like to live well alongside increasingly capable AI, without either surrendering to it or trying to dismantle it?

The StillPoint project treats that as a third road. The first road hands the future to systems built to capture attention. The second road rejects the technology wholesale. The third road keeps the tools but changes the terms — local, human-positive, owned by the people who use it. The image that recurs in the work is the tipi against the pyramid: portable, communal, and sovereign, set against something extractive and dominating.

This repository is where that thinking gets worked out in the open. The practice materials — guides and shared resources for building still places in a noisy world — are emerging here and are openly licensed (CC BY-SA 4.0) so others can adopt and adapt them. The aim is to be proof of the wholeness it describes, not a platform for a leader.

## What's Here

This repository is the complete source for The StillPoint — the stories, the world, and the web platform that publishes them.

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

## License

This repository holds three kinds of work under three licenses. See [`LICENSE`](LICENSE) for the full statement.

- **The creative work — All Rights Reserved.** The novel, short stories, fan fiction, and the fictional world bible (`novel/`, `short_stories/`, `fan_fiction/`, `world/`) are © 2025–2026 Wally Kroeker. They are published for reading and reference, and may not be reproduced, distributed, or used for AI training without permission.
- **Movement & practice materials — CC BY-SA 4.0.** Materials about the StillPoint practice and the third way — meant to be adopted and adapted by others — are licensed [CC BY-SA 4.0](LICENSE-CC-BY-SA).
- **The platform code — MIT.** The website and tooling (`astro-dev-site/`, `scripts/`) are [MIT-licensed](LICENSE-MIT).
