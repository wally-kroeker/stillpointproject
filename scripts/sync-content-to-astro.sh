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

log_fix() {
    echo -e "${YELLOW}🔧${NC} $1"
}

# Frontmatter validation and fixing functions

# Check if file has YAML frontmatter
has_yaml_frontmatter() {
    local file="$1"
    # Handle both Unix (LF) and Windows (CRLF) line endings
    head -1 "$file" | tr -d '\r' | grep -q "^---$"
}

# Extract value from YAML frontmatter
get_yaml_value() {
    local file="$1"
    local key="$2"

    # Extract frontmatter block and get value
    sed -n '/^---$/,/^---$/p' "$file" | grep "^${key}:" | sed "s/^${key}://; s/^[[:space:]]*//; s/\"//g; s/'//g"
}

# Fix story frontmatter - ensure required fields exist
fix_story_frontmatter() {
    local input_file="$1"
    local output_file="$2"
    local basename=$(basename "$input_file" .md)
    local fixes_made=false

    # Create temp file with fixed frontmatter
    local temp_content=$(mktemp)
    local temp_frontmatter=$(mktemp)

    # Check if file has frontmatter
    if has_yaml_frontmatter "$input_file"; then
        # Extract existing frontmatter (without --- markers)
        # Strip CRLF and get lines between first and second ---
        tr -d '\r' < "$input_file" | awk '/^---$/{if(++count==2) exit; if(count==1) next} count==1' > "$temp_frontmatter"

        # Extract body content (after second ---)
        tr -d '\r' < "$input_file" | awk '/^---$/{if(++count==2) {flag=1; next}} flag' > "$temp_content"
    else
        # No frontmatter - start fresh
        touch "$temp_frontmatter"
        cat "$input_file" > "$temp_content"
        fixes_made=true
    fi

    # Check and add required fields (check extracted frontmatter, not original file)
    if ! grep -q "^title:" "$temp_frontmatter"; then
        # Extract title from filename or first heading
        local title=$(echo "$basename" | sed 's/_/ /g; s/\b\(.\)/\u\1/g')
        echo "title: \"$title\"" >> "$temp_frontmatter"
        log_fix "Added title to $basename: $title"
        fixes_made=true
    fi

    if ! grep -q "^status:" "$temp_frontmatter"; then
        echo "status: \"published\"" >> "$temp_frontmatter"
        log_fix "Added status to $basename: published"
        fixes_made=true
    fi

    # Assemble fixed file
    echo "---" > "$output_file"
    cat "$temp_frontmatter" >> "$output_file"
    echo "---" >> "$output_file"
    echo "" >> "$output_file"
    cat "$temp_content" >> "$output_file"

    # Cleanup
    rm -f "$temp_content" "$temp_frontmatter"

    if [[ "$fixes_made" == true ]]; then
        return 0
    else
        return 1
    fi
}

# Fix novel frontmatter - ensure required fields exist and types are correct
fix_novel_frontmatter() {
    local input_file="$1"
    local output_file="$2"
    local basename=$(basename "$input_file" .md)
    local fixes_made=false

    # Create temp file with fixed frontmatter
    local temp_content=$(mktemp)
    local temp_frontmatter=$(mktemp)
    local fixed_frontmatter=$(mktemp)

    # Check if file has frontmatter
    if has_yaml_frontmatter "$input_file"; then
        # Extract existing frontmatter (without --- markers)
        # Strip CRLF and get lines between first and second ---
        tr -d '\r' < "$input_file" | awk '/^---$/{if(++count==2) exit; if(count==1) next} count==1' > "$temp_frontmatter"

        # Extract body content (after second ---)
        tr -d '\r' < "$input_file" | awk '/^---$/{if(++count==2) {flag=1; next}} flag' > "$temp_content"
    else
        log_warn "No frontmatter in novel scene: $basename"
        cp "$input_file" "$output_file"
        return 1
    fi

    # Process each line and fix types/add missing fields
    while IFS= read -r line; do
        # Fix era - ensure it's a string
        if [[ "$line" =~ ^era:[[:space:]]*[0-9]+$ ]]; then
            echo 'era: "The Cascade"' >> "$fixed_frontmatter"
            log_fix "Fixed era type in $basename: converted number to string"
            fixes_made=true
        # Fix chapter - ensure it's a string
        elif [[ "$line" =~ ^chapter:[[:space:]]*[0-9]+$ ]]; then
            local chapter_num=$(echo "$line" | sed 's/chapter:[[:space:]]*//')
            echo "chapter: \"E1C$(printf "%02d" $chapter_num)\"" >> "$fixed_frontmatter"
            log_fix "Fixed chapter type in $basename: converted $chapter_num to E1C$(printf "%02d" $chapter_num)"
            fixes_made=true
        # Fix scene - ensure it's a string
        elif [[ "$line" =~ ^scene:[[:space:]]*[0-9]+$ ]]; then
            local scene_num=$(echo "$line" | sed 's/scene:[[:space:]]*//')
            echo "scene: \"S$(printf "%02d" $scene_num)\"" >> "$fixed_frontmatter"
            log_fix "Fixed scene type in $basename: converted $scene_num to S$(printf "%02d" $scene_num)"
            fixes_made=true
        else
            echo "$line" >> "$fixed_frontmatter"
        fi
    done < "$temp_frontmatter"

    # Check for required status field
    if ! grep -q "^status:" "$fixed_frontmatter"; then
        echo "status: \"proofread\"" >> "$fixed_frontmatter"
        log_fix "Added status to $basename: proofread"
        fixes_made=true
    fi

    # Assemble fixed file
    echo "---" > "$output_file"
    cat "$fixed_frontmatter" >> "$output_file"
    echo "---" >> "$output_file"
    echo "" >> "$output_file"
    cat "$temp_content" >> "$output_file"

    # Cleanup
    rm -f "$temp_content" "$temp_frontmatter" "$fixed_frontmatter"

    if [[ "$fixes_made" == true ]]; then
        return 0
    else
        return 1
    fi
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

    # Process and copy all novel scene files with validation
    local count=0
    local fixed_count=0
    for file in "$source_dir"/*.md; do
        if [[ -f "$file" ]]; then
            local filename=$(basename "$file")
            local target_file="$target_dir/$filename"

            # Try to fix frontmatter if needed
            if fix_novel_frontmatter "$file" "$target_file"; then
                fixed_count=$((fixed_count + 1))
            else
                # No fixes needed, just copy
                cp "$file" "$target_file"
            fi
            count=$((count + 1))
        fi
    done

    if [[ $fixed_count -gt 0 ]]; then
        log_info "Synced $count novel scenes ($fixed_count auto-fixed) to $target_dir"
    else
        log_info "Synced $count novel scenes to $target_dir"
    fi
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

    # Process and copy all story files with validation
    local count=0
    local fixed_count=0
    for file in "$source_dir"/*.md; do
        if [[ -f "$file" ]]; then
            local filename=$(basename "$file")
            local target_file="$target_dir/$filename"

            # Try to fix frontmatter if needed
            if fix_story_frontmatter "$file" "$target_file"; then
                fixed_count=$((fixed_count + 1))
            else
                # No fixes needed, just copy
                cp "$file" "$target_file"
            fi
            count=$((count + 1))
        fi
    done

    if [[ $fixed_count -gt 0 ]]; then
        log_info "Synced $count short stories ($fixed_count auto-fixed) to $target_dir"
    else
        log_info "Synced $count short stories to $target_dir"
    fi
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
            count=$((count + 1))
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
                    count=$((count + 1))
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

    # Check for basic YAML frontmatter in novel files (handle CRLF)
    for file in "$CONTENT_DIR/novel"/*.md; do
        if [[ -f "$file" ]]; then
            if ! head -1 "$file" | tr -d '\r' | grep -q "^---$"; then
                log_warn "Missing frontmatter in $(basename "$file")"
                ((errors++))
            fi
        fi
    done

    # Check for basic YAML frontmatter in story files (handle CRLF)
    for file in "$CONTENT_DIR/stories"/*.md; do
        if [[ -f "$file" ]]; then
            if ! head -1 "$file" | tr -d '\r' | grep -q "^---$"; then
                log_warn "Missing frontmatter in $(basename "$file")"
                ((errors++))
            fi
        fi
    done

    if [[ $errors -eq 0 ]]; then
        log_info "Content validation passed"
    else
        log_error "Content validation failed with $errors errors"
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
    # sync_world_content - Disabled: world content not needed in Astro
    validate_content
    generate_stats

    echo
    log_info "Content sync completed successfully!"
    log_info "Start Astro dev server: cd astro-dev-site && npm run dev"
}

# Execute main function
main "$@"