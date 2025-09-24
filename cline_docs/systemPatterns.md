# System Patterns - StillPoint Saga

## Project Architecture

### File Organization Patterns
```
StillPoint Project/
├── world/                          # World-building (Creative Partner editable)
│   ├── still_point_world_bible.md  # Master reference document
│   ├── outline.md                  # Master story structure (MOVED HERE for access)
│   ├── characters/                 # Character profile cards
│   ├── locations/                  # Location detail cards  
│   ├── lore/                      # Philosophical and historical concepts
│   └── technology/                # Technology explanation cards
├── novel/                         # Story content (Narrator domain)
│   ├── scenes/                    # Individual scene files
│   ├── interludes/               # Historical vignettes
│   └── prologue_the_stillness.md # Canon prologue
├── short_stories/                 # Standalone stories (Creative Partner editable)
└── cline_docs/                   # Development documentation (Creative Partner editable)
    ├── activeContext.md          # Current session state
    ├── progress.md              # Overall project status
    ├── systemPatterns.md        # This file - architectural patterns
    ├── productContext.md        # Project vision and goals
    └── techContext.md           # Technical development context
```

### Mode Specialization Patterns

#### Creative Partner (Current Mode)
- **Domain:** World-building, brainstorming, outline development
- **File Access:** `^(world/|short_stories/|cline_docs/).*\.md$`
- **Core Functions:** Ideation, lore creation, character development, plot exploration
- **Restrictions:** Cannot edit `novel/scenes/` - that's Narrator territory
- **Key Insight:** Moved outline to `world/outline.md` to enable Creative Partner access

#### Narrator
- **Domain:** Final scene writing
- **File Access:** Full `novel/` directory access
- **Purpose:** Write finished scenes directly from Creative Partner outlines and concepts
- **Voice:** Maintains established style and character voice consistency

#### Editor
- **Domain:** Craft feedback and revision suggestions
- **Purpose:** Review finished scenes for narrative craft, not canon consistency
- **Focus:** Prose quality, character development, dramatic structure

#### Lore Keeper
- **Domain:** Canon consistency and world-building accuracy
- **Purpose:** Audit scenes/chapters for consistency with established world bible
- **Authority:** Can flag canon violations and suggest corrections

### Development Workflow Patterns

#### Streamlined Scene Development
1. **Creative Partner:** Brainstorm chapter concepts, develop detailed scene outlines
2. **Narrator:** Write complete scene directly from Creative Partner outline
3. **Editor:** Review for craft and suggest improvements
4. **Lore Keeper:** Audit for canon consistency
5. **Creative Partner:** Update world-building based on established content

#### World-Building Development
1. **Creative Partner:** Identify needed lore/character/location development
2. **Creative Partner:** Create detailed cards in appropriate `world/` subdirectories
3. **Creative Partner:** Update world bible with new canonical elements
4. **All Modes:** Reference new cards in future work

### Content Quality Patterns

#### Canon Hierarchy
1. **Primary Canon:** `world/still_point_world_bible.md` - Master reference
2. **Secondary Canon:** Cards in `world/` subdirectories - Detailed specifications
3. **Tertiary Canon:** `world/outline.md` - Story structure and chapter details
4. **Implementation:** Finished scenes in `novel/scenes/` - Must align with above

#### Consistency Maintenance
- **Technology Usage:** StillPoint devices ONLY for human presence practice
- **Community Structure:** Commons as federation of micro-communities, not monoliths
- **Character Evolution:** Track aging and development across 70-year timeline
- **Thematic Continuity:** Each era explores different aspect of human/technology relationship

### Collaboration Patterns

#### Memory Bank Protocol
- **Update Trigger:** Major accomplishments, scope changes, or user request
- **Required Files:** activeContext.md, progress.md, systemPatterns.md, productContext.md, techContext.md
- **Update Focus:** Current state, recent changes, next steps, architectural insights

#### Mode Switching Protocol
- **Reason Required:** Clear justification for mode change
- **Context Transfer:** Ensure new mode has necessary information
- **Task Boundaries:** Respect each mode's specialized domain

#### File Access Protocol
- **Respect Restrictions:** Don't attempt to edit files outside mode permissions
- **Cross-Reference Links:** Use `[[file_name]]` for connections between world elements
- **Version Control:** Document major changes in change-log format

### Technical Implementation Patterns

#### StillPoint Device Technology
- **Purpose:** Human nervous system regulation and presence practice ONLY
- **NOT for:** Productivity optimization, plant monitoring, general AI tasks
- **Variants:** SP-0 (prototype), SP-H (hearth), SP-Δ (communal), SP-Ω (ambient), SP-P (pebble)
- **Core Principle:** Technology serves human presence, not efficiency

#### Commons Community Structure
- **Model:** Federation of diverse micro-communities
- **Examples:** Contemplatives, Makers, Feeders, Garden Mystics, Night Market, Loud Ones
- **Unity Principle:** Shared values and mutual aid, not uniformity
- **Governance:** Commons Protocol enables coordination while preserving autonomy

#### AI Integration Philosophy
- **Satya AI:** Truth-focused, 2-second pause, serves human reflection
- **Chorus AI:** Speed-focused, corporate-controlled, serves productivity
- **Ghost Current:** Decentralized mesh, privacy-first, serves community connection
- **Evolution:** From tools TO infrastructure TO invisible support

This system architecture enables coherent development across multiple modes while maintaining clear boundaries and canonical consistency.