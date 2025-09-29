#!/bin/bash

# StillPoint Content Sync - Novel to Astro
# Syncs content from novel/, short_stories/, and world/ to Astro content collections

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ASTRO_DIR="$PROJECT_ROOT/astro-dev-site"
CONTENT_DIR="$ASTRO_DIR/src/content"

# Functions
log_info() {
    echo -e "${GREEN}✅${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

log_error() {
    echo -e "${RED}❌${NC} $1"
    exit 1
}

log_step() {
    echo -e "${BLUE}🔄${NC} $1"
}

# Validate directories exist
validate_directories() {
    log_step "Validating directory structure..."

    if [[ ! -d "$PROJECT_ROOT/novel" ]]; then
        log_error "Novel directory not found: $PROJECT_ROOT/novel"
    fi

    if [[ ! -d "$ASTRO_DIR" ]]; then
        log_error "Astro directory not found: $ASTRO_DIR"
    fi

    if [[ ! -d "$CONTENT_DIR" ]]; then
        log_error "Astro content directory not found: $CONTENT_DIR"
    fi

    log_info "Directory structure validated"
}

# Sync novel scenes
sync_novel_content() {
    log_step "Syncing novel scenes..."

    local source_dir="$PROJECT_ROOT/novel/scenes"
    local target_dir="$CONTENT_DIR/novel"

    if [[ ! -d "$source_dir" ]]; then
        log_warn "Novel scenes directory not found: $source_dir"
        return
    fi

    # Create target directory
    mkdir -p "$target_dir"

    # Copy all novel scene files
    local count=0
    for file in "$source_dir"/*.md; do
        if [[ -f "$file" ]]; then
            cp "$file" "$target_dir/"
            ((count++))
        fi
    done

    log_info "Synced $count novel scenes to $target_dir"
}

# Sync short stories
sync_stories_content() {
    log_step "Syncing short stories..."

    local source_dir="$PROJECT_ROOT/short_stories"
    local target_dir="$CONTENT_DIR/stories"

    if [[ ! -d "$source_dir" ]]; then
        log_warn "Short stories directory not found: $source_dir"
        return
    fi

    # Create target directory
    mkdir -p "$target_dir"

    # Copy all story files
    local count=0
    for file in "$source_dir"/*.md; do
        if [[ -f "$file" ]]; then
            cp "$file" "$target_dir/"
            ((count++))
        fi
    done

    log_info "Synced $count short stories to $target_dir"
}

# Sync world building content
sync_world_content() {
    log_step "Syncing world building content..."

    local source_dir="$PROJECT_ROOT/world"
    local target_dir="$CONTENT_DIR/world"

    if [[ ! -d "$source_dir" ]]; then
        log_warn "World directory not found: $source_dir"
        return
    fi

    # Create target directory structure
    mkdir -p "$target_dir"

    # Copy world bible and main files
    local count=0
    for file in "$source_dir"/*.md; do
        if [[ -f "$file" ]]; then
            cp "$file" "$target_dir/"
            ((count++))
        fi
    done

    # Copy subdirectories (characters, locations, etc.)
    for subdir in "$source_dir"/*; do
        if [[ -d "$subdir" ]]; then
            local dirname=$(basename "$subdir")
            mkdir -p "$target_dir/$dirname"
            for file in "$subdir"/*.md; do
                if [[ -f "$file" ]]; then
                    cp "$file" "$target_dir/$dirname/"
                    ((count++))
                fi
            done
        fi
    done

    log_info "Synced $count world building files to $target_dir"
}

# Validate content after sync
validate_content() {
    log_step "Validating synced content..."

    local errors=0

    # Check for missing novel content
    local source_novel_count=$(find "$PROJECT_ROOT/novel/scenes" -name "*.md" 2>/dev/null | wc -l)
    local synced_novel_count=$(find "$CONTENT_DIR/novel" -name "*.md" 2>/dev/null | wc -l)

    if [[ $source_novel_count -ne $synced_novel_count ]]; then
        log_warn "Novel scene count mismatch: source=$source_novel_count, synced=$synced_novel_count"
        ((errors++))
    fi

    # Check for missing story content
    local source_stories_count=$(find "$PROJECT_ROOT/short_stories" -name "*.md" 2>/dev/null | wc -l)
    local synced_stories_count=$(find "$CONTENT_DIR/stories" -name "*.md" 2>/dev/null | wc -l)

    if [[ $source_stories_count -ne $synced_stories_count ]]; then
        log_warn "Story count mismatch: source=$source_stories_count, synced=$synced_stories_count"
        ((errors++))
    fi

    # Check for basic YAML frontmatter in novel files
    for file in "$CONTENT_DIR/novel"/*.md; do
        if [[ -f "$file" ]]; then
            if ! grep -q "^---$" "$file"; then
                log_warn "Missing frontmatter in $(basename "$file")"
                ((errors++))
            fi
        fi
    done

    # Check for basic YAML frontmatter in story files
    for file in "$CONTENT_DIR/stories"/*.md; do
        if [[ -f "$file" ]]; then
            if ! grep -q "^---$" "$file"; then
                log_warn "Missing frontmatter in $(basename "$file")"
                ((errors++))
            fi
        fi
    done

    if [[ $errors -eq 0 ]]; then
        log_info "Content validation passed"
    else
        log_warn "Content validation completed with $errors warnings"
    fi
}

# Generate content statistics
generate_stats() {
    log_step "Generating content statistics..."

    local novel_count=$(find "$CONTENT_DIR/novel" -name "*.md" 2>/dev/null | wc -l)
    local stories_count=$(find "$CONTENT_DIR/stories" -name "*.md" 2>/dev/null | wc -l)
    local world_count=$(find "$CONTENT_DIR/world" -name "*.md" 2>/dev/null | wc -l)
    local total_count=$((novel_count + stories_count + world_count))

    echo -e "\n${BLUE}📊 Content Sync Summary:${NC}"
    echo "  Novel scenes: $novel_count"
    echo "  Short stories: $stories_count"
    echo "  World building: $world_count"
    echo "  Total files: $total_count"
}

# Main execution
main() {
    echo -e "${BLUE}🚀 StillPoint Content Sync${NC}"
    echo "Syncing content to Astro development environment..."
    echo

    validate_directories
    sync_novel_content
    sync_stories_content
    sync_world_content
    validate_content
    generate_stats

    echo
    log_info "Content sync completed successfully!"
    log_info "Start Astro dev server: cd astro-dev-site && npm run dev"
}

# Execute main function
main "$@"