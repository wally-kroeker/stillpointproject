#!/bin/bash

# StillPoint Project - One-Command Publishing
# Optimized git-based workflow for stillpointproject.org

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SSH_KEY="$HOME/.ssh/id_rsa_stillpoint"
PRODUCTION_REMOTE="production"
PRODUCTION_BRANCH="master"

# Functions
log_info() {
    echo -e "${GREEN}✅${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

log_error() {
    echo -e "${RED}❌${NC} $1"
}

log_step() {
    echo -e "${BLUE}🔄${NC} $1"
}

show_help() {
    echo "StillPoint Project Publishing Script"
    echo ""
    echo "Usage: $0 [OPTIONS] [MESSAGE]"
    echo ""
    echo "Options:"
    echo "  --dry-run     Show what would be published without actually publishing"
    echo "  --force       Skip validation and publish immediately"
    echo "  --status      Show current repository status"
    echo "  --preview     Run local Hugo development server (requires Hugo)"
    echo "  --novel-only  Publish only novel content changes"
    echo "  --site-only   Publish only website/layout changes"
    echo "  --help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                           # Publish complete site with auto-generated message"
    echo "  $0 'Add Chapter 8'           # Publish with custom commit message"
    echo "  $0 --preview                 # Preview complete site locally"
    echo "  $0 --dry-run                 # Preview what would be published"
    echo "  $0 --novel-only 'New scene'  # Publish only novel changes"
    echo "  $0 --site-only 'New layout'  # Publish only site structure changes"
    echo "  $0 --status                  # Check repository status"
    echo ""
}

check_prerequisites() {
    log_step "Checking prerequisites..."

    # Check if we're in a git repository
    if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
        log_error "Not in a git repository"
        exit 1
    fi

    # Check if SSH key exists (copy from Windows mount if needed)
    if [ ! -f "$SSH_KEY" ]; then
        log_warn "SSH key not found, copying from Windows mount..."
        mkdir -p "$(dirname "$SSH_KEY")"
        if [ -f "/mnt/c/Users/walub/.ssh/id_rsa" ]; then
            cp "/mnt/c/Users/walub/.ssh/id_rsa" "$SSH_KEY"
            chmod 600 "$SSH_KEY"
            log_info "SSH key copied and permissions set"
        else
            log_error "SSH key not found at /mnt/c/Users/walub/.ssh/id_rsa"
            exit 1
        fi
    fi

    # Check if production remote exists
    if ! git remote get-url "$PRODUCTION_REMOTE" > /dev/null 2>&1; then
        log_error "Production remote '$PRODUCTION_REMOTE' not configured"
        echo "Run: git remote add $PRODUCTION_REMOTE docker@10.10.10.30:/home/docker/stillpoint-project-bare.git"
        exit 1
    fi

    log_info "Prerequisites check passed"
}

run_local_preview() {
    log_step "Starting local Hugo development server..."

    # Check if Hugo is available
    if ! command -v hugo >/dev/null 2>&1; then
        log_error "Hugo not found - cannot run local preview"
        log_info "Install Hugo: https://gohugo.io/installation/"
        echo "  Linux: apt install hugo"
        echo "  Windows: winget install Hugo.Hugo.Extended"
        echo "  macOS: brew install hugo"
        exit 1
    fi

    # Check if site directory exists
    if [ ! -d "site" ]; then
        log_error "Site directory not found - run full setup first"
        exit 1
    fi

    # Update Hugo config for local development
    cd site
    local config_backup=""
    if grep -q "localhost:8080" config.toml; then
        log_info "Hugo configured for local development"
    else
        log_step "Updating Hugo config for local preview..."
        config_backup=$(mktemp)
        cp config.toml "$config_backup"
        sed -i 's|baseURL = ".*"|baseURL = "http://localhost:1313/"|g' config.toml
    fi

    # Generate novel content from source
    log_step "Processing novel content for preview..."
    ../scripts/process-content.sh > /dev/null 2>&1 || log_warn "Content processing had issues"

    log_info "🌐 Starting Hugo server at http://localhost:1313"
    log_info "📝 Live reload enabled - edit files to see changes"
    log_info "⏹️  Press Ctrl+C to stop"
    echo ""

    # Start Hugo server
    hugo server --bind 0.0.0.0 --port 1313 --buildDrafts

    # Restore config if we backed it up
    if [ -n "$config_backup" ] && [ -f "$config_backup" ]; then
        mv "$config_backup" config.toml
        log_info "Config restored"
    fi

    cd ..
}

validate_content() {
    log_step "Validating content..."

    local issues=0
    local content_type="${1:-full}"

    # Novel content validation (always done)
    if [ ! -d "novel/scenes" ]; then
        log_error "novel/scenes directory not found"
        issues=$((issues + 1))
    fi

    local scene_count=$(find novel/scenes -name "*.md" 2>/dev/null | wc -l)
    if [ "$scene_count" -eq 0 ]; then
        log_error "No scene files found in novel/scenes/"
        issues=$((issues + 1))
    else
        log_info "Found $scene_count scene files"
    fi

    local interlude_count=$(find novel/interludes -name "*.md" 2>/dev/null | wc -l)
    log_info "Found $interlude_count interlude files"

    # Site content validation (if doing full site)
    if [ "$content_type" = "full" ] || [ "$content_type" = "site-only" ]; then
        # Check for site directory
        if [ ! -d "site" ]; then
            log_error "Site directory not found"
            issues=$((issues + 1))
        else
            # Check for key site files
            local site_issues=0

            [ ! -f "site/config.toml" ] && log_warn "Hugo config not found" && site_issues=$((site_issues + 1))
            [ ! -f "site/content/_index.md" ] && log_warn "Landing page not found" && site_issues=$((site_issues + 1))
            [ ! -d "site/layouts" ] && log_warn "Layouts directory not found" && site_issues=$((site_issues + 1))

            local story_count=$(find site/content/stories -name "*.md" 2>/dev/null | wc -l)
            log_info "Found $story_count story files"

            local layout_count=$(find site/layouts -name "*.html" 2>/dev/null | wc -l)
            log_info "Found $layout_count layout templates"

            if [ "$site_issues" -gt 2 ]; then
                log_error "Critical site structure issues found"
                issues=$((issues + 1))
            fi
        fi
    fi

    # Check for broken YAML frontmatter (basic check)
    local broken_yaml=0
    for file in novel/scenes/*.md novel/interludes/*.md site/content/*.md site/content/stories/*.md; do
        if [ -f "$file" ]; then
            if ! head -20 "$file" | grep -q "^---$" ; then
                log_warn "Possible YAML frontmatter issue in: $(basename "$file")"
                broken_yaml=$((broken_yaml + 1))
            fi
        fi
    done 2>/dev/null

    if [ "$broken_yaml" -gt 0 ]; then
        log_warn "$broken_yaml files may have YAML frontmatter issues"
    fi

    if [ "$issues" -gt 0 ]; then
        log_error "$issues validation issues found"
        return 1
    fi

    log_info "Content validation passed"
    return 0
}

show_changes() {
    log_step "Checking for changes..."

    # Show status
    if git diff-index --quiet HEAD --; then
        log_info "No uncommitted changes"
    else
        log_info "Uncommitted changes found:"
        git status --porcelain | while read line; do
            echo "  $line"
        done
    fi

    # Show what would be pushed
    local commits_ahead=$(git rev-list --count HEAD...origin/master 2>/dev/null || git rev-list --count HEAD 2>/dev/null)
    if [ "$commits_ahead" -gt 0 ]; then
        log_info "$commits_ahead commits ready to publish"
        log_step "Recent commits:"
        git log --oneline -n 5 | sed 's/^/  /'
    else
        log_info "Repository is up to date"
    fi
}

commit_changes() {
    local commit_message="$1"
    local publish_mode="${2:-full}"

    # Check if there are any changes to commit
    if git diff-index --quiet HEAD --; then
        log_info "No changes to commit"
        return 0
    fi

    log_step "Committing changes..."

    # Add changes based on publish mode
    case "$publish_mode" in
        "novel-only")
            git add novel/ world/
            ;;
        "site-only")
            git add site/
            ;;
        "full"|*)
            git add .
            ;;
    esac

    # Generate commit message if not provided
    if [ -z "$commit_message" ]; then
        local timestamp=$(date "+%Y-%m-%d %H:%M")

        # Analyze what's being committed
        local new_scenes=$(git diff --cached --name-only | grep "novel/scenes" | wc -l)
        local new_interludes=$(git diff --cached --name-only | grep "novel/interludes" | wc -l)
        local world_changes=$(git diff --cached --name-only | grep "world/" | wc -l)
        local site_changes=$(git diff --cached --name-only | grep "site/" | wc -l)
        local story_changes=$(git diff --cached --name-only | grep "site/content/stories" | wc -l)
        local layout_changes=$(git diff --cached --name-only | grep "site/layouts" | wc -l)

        local description=""
        case "$publish_mode" in
            "novel-only")
                [ "$new_scenes" -gt 0 ] && description="${description}+${new_scenes} scenes "
                [ "$new_interludes" -gt 0 ] && description="${description}+${new_interludes} interludes "
                [ "$world_changes" -gt 0 ] && description="${description}+world updates "
                commit_message="Novel: ${description}($(date "+%m/%d"))"
                ;;
            "site-only")
                [ "$story_changes" -gt 0 ] && description="${description}+${story_changes} stories "
                [ "$layout_changes" -gt 0 ] && description="${description}+layouts "
                [ "$site_changes" -gt "$story_changes" ] && description="${description}+site updates "
                commit_message="Site: ${description}($(date "+%m/%d"))"
                ;;
            *)
                [ "$new_scenes" -gt 0 ] && description="${description}+${new_scenes} scenes "
                [ "$new_interludes" -gt 0 ] && description="${description}+${new_interludes} interludes "
                [ "$story_changes" -gt 0 ] && description="${description}+${story_changes} stories "
                [ "$layout_changes" -gt 0 ] && description="${description}+layouts "
                [ "$world_changes" -gt 0 ] && description="${description}+world "
                commit_message="Publish: ${description}($(date "+%m/%d"))"
                ;;
        esac

        if [ -z "$description" ]; then
            commit_message="Update: $timestamp"
        fi
    fi

    # Commit with message
    git commit -m "$commit_message"
    log_info "Changes committed: '$commit_message'"
}

publish_to_production() {
    local publish_mode="${1:-full}"

    log_step "Publishing to production..."

    # Use the SSH key explicitly
    export GIT_SSH_COMMAND="ssh -i $SSH_KEY -o StrictHostKeyChecking=no"

    # Push to production
    if git push "$PRODUCTION_REMOTE" "$PRODUCTION_BRANCH"; then
        log_info "🚀 Published to stillpointproject.org successfully!"

        # Show publication summary
        log_step "Publication Summary:"

        # Novel content stats
        local scene_count=$(find novel/scenes -name "*.md" | wc -l)
        local interlude_count=$(find novel/interludes -name "*.md" | wc -l)
        echo "  📚 Scenes: $scene_count"
        echo "  🎭 Interludes: $interlude_count"

        # Site content stats (if applicable)
        if [ "$publish_mode" = "full" ] || [ "$publish_mode" = "site-only" ]; then
            local story_count=$(find site/content/stories -name "*.md" 2>/dev/null | wc -l)
            local layout_count=$(find site/layouts -name "*.html" 2>/dev/null | wc -l)
            echo "  📖 Stories: $story_count"
            echo "  🎨 Layouts: $layout_count"

            # Check if we have site config
            if [ -f "site/config.toml" ]; then
                local site_title=$(grep '^title = ' site/config.toml | cut -d'"' -f2 2>/dev/null || echo "The StillPoint Project")
                echo "  🏠 Site: $site_title"
            fi
        fi

        echo "  🌐 Live at: https://stillpointproject.org"
        echo "  📊 Mode: $publish_mode"

        return 0
    else
        log_error "Publication failed"
        return 1
    fi
}

# Main script logic
main() {
    echo "=== StillPoint Project Publisher ==="
    echo ""

    # Parse arguments
    DRY_RUN=false
    FORCE=false
    PREVIEW=false
    PUBLISH_MODE="full"  # full, novel-only, site-only
    COMMIT_MESSAGE=""

    while [[ $# -gt 0 ]]; do
        case $1 in
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --force)
                FORCE=true
                shift
                ;;
            --preview)
                PREVIEW=true
                shift
                ;;
            --novel-only)
                PUBLISH_MODE="novel-only"
                shift
                ;;
            --site-only)
                PUBLISH_MODE="site-only"
                shift
                ;;
            --status)
                check_prerequisites
                show_changes
                exit 0
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                COMMIT_MESSAGE="$1"
                shift
                ;;
        esac
    done

    # Handle preview mode
    if [ "$PREVIEW" = true ]; then
        check_prerequisites
        run_local_preview
        exit 0
    fi

    # Execute publishing workflow
    check_prerequisites

    if [ "$DRY_RUN" = true ]; then
        log_step "DRY RUN MODE - No changes will be made"
        show_changes
        exit 0
    fi

    # Validate based on publish mode
    if [ "$FORCE" = false ]; then
        validate_content "$PUBLISH_MODE" || exit 1
    else
        log_warn "Validation skipped due to --force flag"
    fi

    show_changes
    commit_changes "$COMMIT_MESSAGE" "$PUBLISH_MODE"
    publish_to_production "$PUBLISH_MODE"

    if [ $? -eq 0 ]; then
        log_info "✨ Publication completed successfully!"
    else
        log_error "Publication failed. Check the output above for details."
        exit 1
    fi
}

# Run main function with all arguments
main "$@"