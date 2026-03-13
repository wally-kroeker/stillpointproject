# How Cursor Manages Project Context

This guide explains how Cursor IDE manages project context and how the StillPoint Saga project is configured.

## Cursor Context Management

Cursor manages project context through multiple mechanisms:

### 1. Rules System (`.cursor/rules/`)
- **Location:** `.cursor/rules/` directory in project root
- **Purpose:** Version-controlled, project-specific rules
- **Format:** Markdown files with project guidelines
- **Scope:** Applies to all AI assistants working in this project
- **Our file:** `.cursor/rules/stillpoint-project.md`

### 2. AGENTS.md (Alternative Format)
- **Location:** Project root (`AGENTS.md`)
- **Purpose:** Vendor-neutral agent instructions format
- **Format:** Markdown file with concise project context
- **Scope:** Compatible with multiple AI coding assistants
- **Our file:** `AGENTS.md` (created for broader compatibility)

### 3. Codebase Indexing
- Cursor automatically indexes your entire codebase
- Enables context-aware assistance and accurate code suggestions
- Supports multi-repository workspaces and large monorepos

### 4. Model Context Protocol (MCP)
- Cursor can connect to external tools and data sources via MCP
- Enhances understanding through additional context
- Our project uses: Context7 (documentation) and Playwright (browser testing)

## StillPoint Saga Configuration

### Files Created
1. **`.cursor/rules/stillpoint-project.md`**
   - Comprehensive project rules
   - Detailed frontmatter requirements
   - Publishing workflow
   - Specialized mode definitions

2. **`AGENTS.md`**
   - Concise agent instructions
   - Quick reference for critical rules
   - Links to complete documentation

### How It Works
When you work in Cursor:
1. Cursor reads `.cursor/rules/` files automatically
2. Cursor reads `AGENTS.md` if present
3. Cursor indexes your codebase for context
4. AI assistants use this context to provide relevant help

### Priority
- `.cursor/rules/` takes precedence (more detailed)
- `AGENTS.md` serves as quick reference
- Both reference `CLAUDE.md` for complete documentation

## Best Practices

1. **Keep rules updated:** When project structure changes, update `.cursor/rules/stillpoint-project.md`
2. **Reference CLAUDE.md:** The full documentation in `CLAUDE.md` remains the source of truth
3. **Version control:** Both `.cursor/rules/` and `AGENTS.md` should be committed to git
4. **Test changes:** After updating rules, test with a simple query to ensure context is working

## Syncing with CLAUDE.md

The rules in `.cursor/rules/` and `AGENTS.md` are derived from `CLAUDE.md`. If you make significant changes to `CLAUDE.md`, consider updating the Cursor rules files to stay in sync.

## Additional Resources

- [Cursor Documentation - Context](https://docs.cursor.com/en/context)
- [AGENTS.md Standard](https://agentdotmd.github.io/)
- `CLAUDE.md` - Complete project documentation

