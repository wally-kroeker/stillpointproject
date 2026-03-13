#!/bin/bash

# StillPoint Audio Generation via Kokoro TTS
# Generates MP3 narration from story/novel markdown files

set -e

# Configuration
TTS_HOST="walub.kroeker.fun:8880"
TTS_VOICE="af_bella"
TTS_MODEL="kokoro"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ASTRO_PUBLIC="$PROJECT_ROOT/astro-dev-site/public"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

usage() {
    echo "Usage: $0 [OPTIONS] <markdown-file>"
    echo ""
    echo "Generate audio narration from a story or novel markdown file."
    echo ""
    echo "Options:"
    echo "  --voice <name>    TTS voice (default: af_bella)"
    echo "  --all             Generate audio for all published stories"
    echo "  --force           Regenerate even if audio already exists"
    echo "  -h, --help        Show this help"
    echo ""
    echo "Exclusions:"
    echo "  Files with 'audio_exclude: true' in frontmatter are skipped."
    echo "  Files with type 'outline', 'scene_brief', or 'planning' are skipped."
    echo ""
    echo "Examples:"
    echo "  $0 short_stories/the_unfiltered_feed.md"
    echo "  $0 --voice am_adam novel/scenes/e1_c01_s01_the_daydream.md"
    echo "  $0 --all"
    exit 0
}

# Parse arguments
ALL_MODE=false
FORCE=false
while [[ $# -gt 0 ]]; do
    case "$1" in
        --voice)
            TTS_VOICE="$2"
            shift 2
            ;;
        --all)
            ALL_MODE=true
            shift
            ;;
        --force)
            FORCE=true
            shift
            ;;
        -h|--help)
            usage
            ;;
        *)
            INPUT_FILE="$1"
            shift
            ;;
    esac
done

# Check if a file should be excluded from audio generation
should_exclude() {
    local file="$1"
    local content
    content=$(tr -d '\r' < "$file")

    # Check audio_exclude flag
    if echo "$content" | grep -q '^audio_exclude: *true'; then
        echo "audio_exclude: true"
        return 0
    fi

    # Check for non-narrative types (outlines, briefs, planning docs)
    if echo "$content" | grep -q '^type:.*\(outline\|scene_brief\|planning\)'; then
        echo "non-narrative type"
        return 0
    fi

    return 1
}

# Check if file is published/canonical
is_published() {
    local file="$1"
    tr -d '\r' < "$file" | grep -q '^status:.*\(published\|canonical\)'
}

# Check if file already has audio_file in frontmatter
has_audio_frontmatter() {
    local file="$1"
    tr -d '\r' < "$file" | grep -q '^audio_file:'
}

# Extract plain text from markdown (strip frontmatter + formatting)
extract_text() {
    local file="$1"
    # Strip CRLF, remove YAML frontmatter, then strip markdown formatting
    sed 's/\r$//' "$file" | \
        awk 'BEGIN{c=0} /^---$/{c++; next} c>=2' | \
        sed 's/^#\+ //' | \
        sed 's/\*\*\([^*]*\)\*\*/\1/g' | \
        sed 's/\*\([^*]*\)\*/\1/g' | \
        sed 's/\[\[\([^]]*\)\]\]/\1/g' | \
        sed 's/\[\([^]]*\)\]([^)]*)/\1/g' | \
        sed '/^$/N;/^\n$/d'
}

# Determine output path from input file
get_output_path() {
    local file="$1"
    local slug

    if [[ "$file" == *"short_stories/"* ]] || [[ "$file" == *"short_stories\\"* ]]; then
        slug=$(basename "$file" | sed 's/\.\(md\|mdx\)$//')
        echo "$ASTRO_PUBLIC/audio/stories/${slug}.mp3"
    elif [[ "$file" == *"novel/"* ]]; then
        slug=$(basename "$file" | sed 's/\.\(md\|mdx\)$//')
        echo "$ASTRO_PUBLIC/audio/novel/${slug}.mp3"
    else
        slug=$(basename "$file" | sed 's/\.\(md\|mdx\)$//')
        echo "$ASTRO_PUBLIC/audio/${slug}.mp3"
    fi
}

# Get the web-relative path for frontmatter
get_frontmatter_path() {
    local output_path="$1"
    echo "${output_path#$ASTRO_PUBLIC}"
}

# Inject audio_file into source frontmatter
inject_audio_frontmatter() {
    local file="$1"
    local audio_path="$2"

    if has_audio_frontmatter "$file"; then
        return 0
    fi

    # Insert audio_file line before the closing --- of frontmatter
    # Strategy: find second --- line and insert before it
    local temp
    temp=$(mktemp)
    sed 's/\r$//' "$file" | awk -v path="$audio_path" '
        BEGIN { count=0 }
        /^---$/ {
            count++
            if (count == 2) {
                print "audio_file: \"" path "\""
            }
        }
        { print }
    ' > "$temp"
    mv "$temp" "$file"
    echo -e "${GREEN}Injected audio_file into:${NC} $(basename "$file")"
}

# Generate audio for a single file
generate_single() {
    local file="$1"
    local skip_exclusion_check="${2:-false}"

    if [[ ! -f "$file" ]]; then
        echo -e "${RED}Error: File not found: $file${NC}"
        return 1
    fi

    # Check exclusions (unless explicitly targeting a single file)
    if [[ "$skip_exclusion_check" != "true" ]]; then
        local reason
        if reason=$(should_exclude "$file"); then
            echo -e "${YELLOW}Skipping${NC} $(basename "$file") — $reason"
            return 0
        fi
    fi

    local output_path
    output_path=$(get_output_path "$file")
    local frontmatter_path
    frontmatter_path=$(get_frontmatter_path "$output_path")

    # Skip if audio already exists (unless --force)
    if [[ "$FORCE" != "true" ]] && [[ -f "$output_path" ]]; then
        echo -e "${YELLOW}Skipping${NC} $(basename "$file") — audio exists (use --force to regenerate)"
        # Still inject frontmatter if missing
        inject_audio_frontmatter "$file" "$frontmatter_path"
        return 0
    fi

    # Create output directory
    mkdir -p "$(dirname "$output_path")"

    echo -e "${BLUE}Generating audio for:${NC} $(basename "$file")"
    echo -e "${BLUE}Voice:${NC} $TTS_VOICE"

    # Extract text
    local text
    text=$(extract_text "$file")
    local word_count
    word_count=$(echo "$text" | wc -w | tr -d ' ')
    echo -e "${BLUE}Words:${NC} $word_count"

    if [[ "$word_count" -lt 10 ]]; then
        echo -e "${YELLOW}Skipping${NC} $(basename "$file") — too few words ($word_count)"
        return 0
    fi

    # Call TTS API
    local start_time
    start_time=$(date +%s)

    # Escape text for JSON
    local json_text
    json_text=$(echo "$text" | python3 -c 'import sys,json; print(json.dumps(sys.stdin.read()))')

    local http_code
    http_code=$(curl -s -w "%{http_code}" -X POST "http://${TTS_HOST}/v1/audio/speech" \
        -H "Content-Type: application/json" \
        -d "{\"model\":\"${TTS_MODEL}\",\"input\":${json_text},\"voice\":\"${TTS_VOICE}\",\"response_format\":\"mp3\"}" \
        --output "$output_path")

    local end_time
    end_time=$(date +%s)
    local elapsed=$((end_time - start_time))

    if [[ "$http_code" != "200" ]]; then
        echo -e "${RED}Error: TTS API returned HTTP $http_code${NC}"
        rm -f "$output_path"
        return 1
    fi

    # Verify output
    local file_size
    file_size=$(ls -lh "$output_path" | awk '{print $5}')

    echo -e "${GREEN}Generated:${NC} $file_size in ${elapsed}s"

    # Auto-inject audio_file into source frontmatter
    inject_audio_frontmatter "$file" "$frontmatter_path"

    echo ""
}

# Generate for all published stories and novel scenes
generate_all() {
    echo -e "${BLUE}Scanning for published content...${NC}"
    echo ""
    local generated=0
    local skipped=0
    local failed=0

    for file in "$PROJECT_ROOT"/short_stories/*.{md,mdx}; do
        [[ -f "$file" ]] || continue
        if ! is_published "$file"; then
            continue
        fi
        if generate_single "$file"; then
            generated=$((generated + 1))
        else
            failed=$((failed + 1))
        fi
    done

    for file in "$PROJECT_ROOT"/novel/scenes/*.{md,mdx}; do
        [[ -f "$file" ]] || continue
        if ! is_published "$file"; then
            continue
        fi
        if generate_single "$file"; then
            generated=$((generated + 1))
        else
            failed=$((failed + 1))
        fi
    done

    echo -e "${GREEN}Done:${NC} $generated processed, $failed failed"
}

# Main
if [[ "$ALL_MODE" == true ]]; then
    generate_all
elif [[ -n "$INPUT_FILE" ]]; then
    generate_single "$INPUT_FILE" "true"
else
    usage
fi
