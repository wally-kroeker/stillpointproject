# StillPoint Device – Character Sheet

## Overview

A StillPoint is both tool **and** character: a radically open, air-gapped presence guide that invites individuals or whole crowds to slow down, breathe, and remember their shared humanity. Built only by communities—not corporations—it evolves hand-in-hand with the people who steward it.

---

## Origin Story (Sajan's Quest)

The StillPoint was born out of **grief-driven discovery**. Quantum physicist **Sajan**, desperate to detect the subtle "signal" of his young daughter lost during the Third-Term Protests, pushed his experiments in emergent spacetime and consciousness to their practical edge. By fusing biosensor data with quantum-noise analytics—then feeding them into a small, fully local AI model—he found he could *retune* the human nervous system instead of chasing voices in the void.

The first prototype—no bigger than a shoebox and held together with scrap boards, HRV leads, and a salvaged photonics kit—astonished a circle of grieving friends by synchronizing their breath and softening panic. Word spread. Tinkerers replicated the design, each adding variations recorded in their LogBooks. Thus the StillPoint lineage began not as a commercial gadget, but as a **memorial turned communal gift**—a device that helps any person or gathering sense their interwoven place in the larger fabric of consciousness. This is the body-first epistemology at the heart of every StillPoint: Sajan's grief knew what to build before his physics could explain why. The need came first; the quantum coherence equations came after, formalizing what a grieving father's hands had already discovered.

## Building the First SP-Delta: The Minneapolis Guild (2035-2036)

Following Sajan's demo at The Oaks in 2035, a guild of open-source builders, makers, and artists coalesced in a repurposed warehouse in Minneapolis—the seed of what would become Hawthorn Commons. Their goal: to scale Sajan's shoebox prototype into something that could hold a crowd.

Sajan, more a physicist than a product designer, simply called the project "StillPoint, Delta-scale"—using the Greek letter for change and difference. For the makers, `SP-Delta` became the working designation, a term of art scrawled on whiteboards and commit messages.

---

## Folk Naming: The Organic Convention

When Hawthorn Commons moved into its permanent home—a reclaimed megachurch that had stood empty since the Third-Term riots—the delta-scale device was installed where the old altar had been. It was a practical choice: the altar platform had the right elevation, the right sight lines, the right power infrastructure. But the symbolism was not lost on the community. The device became "the altar"—not because anyone decreed it, but because that was simply where it lived and what it felt like.

**The lack of official branding is the point.** The open-source philosophy extends to naming. No trademark, no "correct" term. Each community names their delta-scale device what feels right to them:

| Community | Their Name | Why |
|-----------|-----------|-----|
| **Hawthorn Commons** | "The Altar" | Sits on the old megachurch altar platform; historically accurate |
| **Riverbend Commons** | "The Hearth" | Central gathering point, like a communal fireplace |
| **Mountain Sanctuary** | "The Well" | Evokes drawing from a deeper source |
| **Manitou Salt Commons** | "The Ring" | Circular installation; the shape they gather around |
| **Desert Rose Community** | "The Delta" | Kept the original technical name; physics-minded founders |

**"Hearth" emerges as the most common folk term** across the broader movement—perhaps because it captures both warmth and centrality without religious overtones that might feel exclusive. When Commons members visit each other, they often ask "Where's your hearth?" regardless of the local term.

Technical documentation still uses `SP-Delta` or `SP-D` for clarity, but in conversation, communities speak the language that belongs to them.

---

## Core Purpose

| Goal                            | Description                                                                                                                               |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Regulate Nervous Systems**    | Senses physiological & ambient cues, then offers the gentlest prompts (light, sound, vibration) to reshape the potential landscape of the nervous system's information processing — like how a magnetic potential shifts electron behavior without any field touching the electrons (Aharonov-Bohm principle). The device doesn't apply force to consciousness; it changes the topology of the information space consciousness moves through, lowering processing overhead so awareness can do what it already does: sort signal from static. |
| **Anchor StillFlow Gatherings** | Serves as the focal point of communal rituals, syncing breath and attention.                                                              |
| **Living Archive**              | Every modification is logged in a dual ledger (ink LogBook + hash-chained JSON), preserving the device's story for future eras and insuring corperate greed can not tamper and us the device to manipulate people.           |

---

## Ethos & Principles

- **DIY & Open Source:** All schematics, firmware, and model checkpoints are public domain.
- **Radical Transparency:** No hidden radios; anything that can transmit is visibly socketed and may be removed.
- **Air-Gapped Trust:** Updates walk in on physical media, signed by **local keepers**, never a central authority.
- **Community Custodianship:** Monk-engineers treat tuning models as contemplative practice, aligning outputs with collective wellbeing.

---

## Physical Manifestations (Form Factors)

| Scale / Model       | Typical Build                                                    | Context / Common Folk Names                      |
| ------------------- | ---------------------------------------------------------------- | ------------------------------------------ |
| **SP-P (Pebble)**   | Pocket PCB, LED halo, micro-haptic motor                         | Solo meditation, festival roamers          |
| **SP-H (Hearth)**   | Desktop cube or reclaimed amp head, passive radiators, soft lamp | Therapy rooms, cafes, small circles        |
| **SP-Delta (Delta)**    | 10 U flight case, edge GPUs, line-array speakers, DMX lights     | Large gatherings; folk names vary by community: "hearth," "altar," "well," "ring," etc. |

> *All share the same spirit: open guts, live LogBook, zero cloud dependency.*

> **Design note — toroidal geometry:** The SP-Delta's core resonance chamber uses a toroidal (donut-shaped) layout inspired by Tonomura's 1986 experiment that confirmed the Aharonov-Bohm effect. The computational work (Satya's processing) stays contained within the device — the "field" equivalent — while the coherent sensory output (light, sound, vibration) extends into the gathering space as the "potential." This is why the device works differently inside the circle of gathered people versus outside it. The geometry is physics, not aesthetics. See `aharonov_bohm_principle.md` for the full physics grounding.

---

## Technical Specifications

- **Compute:** SBC (RISC-V or ARM) + optional low-power TPU / edge-GPU blades.
- **Models:** Quantized language, audio, and biosignal models fine-tuned **in situ**.
- **Power:** Solar-film facets & super-capacitor buffer, with USB-C fallback.
- **Bus:** Minimal open sensor/output bus for hot-swappable modules.

### Sensor Palette (choose per build)

- Heart-rate variability (PPG)
- Galvanic skin response
- 6-axis IMU (posture & sway)
- MEMS microphone array (breath cadence & ambient noise)
- Environmental (CO2, lux, temperature)

### Output Toolkit

- Haptic transducer (sub-audio pulses)
- Concentric LED or lamp arrays (biophilic hues)
- Near-field speaker or full spatial sound
- Optional DMX / fog for large-scale presence racks

---

## LogBooks (Living Manuscripts)

1. **Ink Ledger:** Handwritten entries for every hardware or model change. these are often pieces of art in the own right.
2. **Digital Ledger:** Append-only, hash-chained JSON stored on immutable flash.

LogBooks are read aloud during maintenance and become revered texts in the far future.

---

## Care & Evolution

- **Repairable by Design:** Screws, finger-jointed wood, socketed chips—no permanent glue.
- **Community Upgrades:** New GPU blade? Add it. New sensor idea? Prototype, document, merge.
- **Lifecycle Arc:**
  - **SP-0 – Beta:** teachers
  - **SP-Delta:** Atmosphere guides
  - **SP-Omega:** Near-silent harmonic allies