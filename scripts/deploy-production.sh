#!/bin/bash

# StillPoint Astro - Production Deployment
# Deploys Astro site to production server

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
PRODUCTION_SERVER="docker@10.10.10.30"
PRODUCTION_DIR="/home/docker/stillpoint-production"
BACKUP_DIR="/home/docker/astro-backup-$(date +%Y%m%d-%H%M%S)"
SSH_KEY="$HOME/.ssh/id_ed25519"

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

# Check prerequisites
check_prerequisites() {
    log_step "Checking prerequisites..."

    # Check if Astro directory exists
    if [[ ! -d "$ASTRO_DIR" ]]; then
        log_error "Astro directory not found: $ASTRO_DIR"
    fi

    # Check if SSH key exists
    if [[ ! -f "$SSH_KEY" ]]; then
        log_error "SSH key not found: $SSH_KEY"
    fi

    # Check Node.js version
    if ! command -v node &> /dev/null; then
        log_error "Node.js not found. Please install Node.js v18.20.8 or higher."
    fi

    # Use fnm if available
    if command -v fnm &> /dev/null; then
        export PATH="/home/walub/.local/share/fnm:$PATH"
        eval "$(fnm env)"
        fnm use v22.20.0 &> /dev/null || log_warn "Could not switch to Node v22.20.0"
    fi

    local node_version=$(node --version | sed 's/v//')
    log_info "Using Node.js $node_version"

    log_info "Prerequisites check completed"
}

# Backup current Astro production
backup_production() {
    log_step "Backing up current production deployment..."

    ssh -i "$SSH_KEY" "$PRODUCTION_SERVER" << EOF
        # Create backup of current production
        if [[ -d "$PRODUCTION_DIR" ]]; then
            cp -r $PRODUCTION_DIR $BACKUP_DIR
            echo "Production backup created at $BACKUP_DIR"
        else
            echo "No existing production directory found (first deployment)"
        fi
EOF

    log_info "Current production backed up to $BACKUP_DIR"
}

# Sync content before building
sync_content() {
    log_step "Syncing latest content to Astro..."

    cd "$PROJECT_ROOT"
    if [[ -f "scripts/sync-content-to-astro.sh" ]]; then
        if ./scripts/sync-content-to-astro.sh; then
            log_info "Content synced successfully"
        else
            log_error "Content sync failed - check output above"
            return 1
        fi
    else
        log_warn "Content sync script not found, using existing content"
    fi
}

# Build Astro site for production
build_site() {
    log_step "Building Astro site for production..."

    cd "$ASTRO_DIR"

    # Install dependencies if needed
    if [[ ! -d "node_modules" ]]; then
        log_step "Installing dependencies..."
        npm install
    fi

    # Build the site with production optimizations
    npm run build

    if [[ ! -d "dist" ]]; then
        log_error "Build failed - dist directory not created"
    fi

    local file_count=$(find dist -type f | wc -l)
    log_info "Production build completed - $file_count files generated"
}

# Stop production server
stop_production_server() {
    log_step "Stopping production server..."

    ssh -i "$SSH_KEY" "$PRODUCTION_SERVER" << 'EOF'
        # Stop any existing production server
        pkill -f "production-server" || true

        # Wait for process to fully terminate
        sleep 2

        # Verify it's stopped
        if pgrep -f "production-server" > /dev/null; then
            echo "Warning: Production server may still be running"
            pkill -9 -f "production-server" || true
            sleep 1
        fi

        echo "Production server stopped"
EOF

    log_info "Production server stopped"
}

# Deploy to production server
deploy_to_production() {
    log_step "Deploying built files to production..."

    # Create production directory on server
    ssh -i "$SSH_KEY" "$PRODUCTION_SERVER" "mkdir -p $PRODUCTION_DIR"

    # Copy built site to production
    scp -i "$SSH_KEY" -r "$ASTRO_DIR/dist/"* "$PRODUCTION_SERVER:$PRODUCTION_DIR/"

    # Check if deployment was successful
    local remote_files=$(ssh -i "$SSH_KEY" "$PRODUCTION_SERVER" "find $PRODUCTION_DIR -type f | wc -l")
    log_info "Deployed $remote_files files to production"
}

# Start production server
start_production_server() {
    log_step "Starting production Astro server..."

    ssh -i "$SSH_KEY" "$PRODUCTION_SERVER" << 'EOF'
        # Install Node.js if not available
        if ! command -v node &> /dev/null; then
            curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
            sudo apt-get install -y nodejs
        fi

        # Create production server script
        cat > /home/docker/production-server.js << 'JSEOF'
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;
const PRODUCTION_DIR = '/home/docker/stillpoint-production';

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.mp3': 'audio/mpeg',
    '.ogg': 'audio/ogg',
    '.wav': 'audio/wav'
};

const server = http.createServer((req, res) => {
    let pathname = url.parse(req.url).pathname;

    // Handle root path
    if (pathname === '/') {
        pathname = '/index.html';
    }

    const filePath = path.join(PRODUCTION_DIR, pathname);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            // Try appending /index.html for directory paths
            const dirIndexPath = path.join(filePath, 'index.html');
            fs.readFile(dirIndexPath, (dirErr, dirData) => {
                if (dirErr) {
                    // Try appending .html for clean URLs
                    const htmlPath = filePath + '.html';
                    fs.readFile(htmlPath, (htmlErr, htmlData) => {
                        if (htmlErr) {
                            res.writeHead(404);
                            res.end('Not Found');
                        } else {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.end(htmlData);
                        }
                    });
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(dirData);
                }
            });
        } else {
            const ext = path.extname(filePath);
            const mimeType = mimeTypes[ext] || 'text/plain';
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(data);
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`StillPoint Astro production server running on port ${PORT}`);
});
JSEOF

        # Start production server on port 8080
        nohup node /home/docker/production-server.js > /home/docker/production.log 2>&1 &
        echo "Production server started on port 8080"
EOF

    log_info "Production server configured and started"
}

# Verify CloudFlare tunnel
verify_cloudflare_tunnel() {
    log_step "Verifying CloudFlare tunnel configuration..."

    ssh -i "$SSH_KEY" "$PRODUCTION_SERVER" << 'EOF'
        # CloudFlare tunnel should already be pointing to localhost:8080
        # No reconfiguration needed - tunnel is already configured
        ps aux | grep cloudflared | grep -v grep || echo "Warning: CloudFlare tunnel not running"
EOF

    log_info "CloudFlare tunnel verification complete (no changes needed)"
}

# Generate deployment summary
generate_summary() {
    log_step "Generating production deployment summary..."

    echo -e "\n${BLUE}🎯 Production Deployment Summary:${NC}"
    echo "  Production backup: $BACKUP_DIR"
    echo "  Astro production: $PRODUCTION_SERVER:$PRODUCTION_DIR"
    echo "  Production server: port 8080 (CloudFlare tunnel connected)"
    echo "  Server logs: ssh -i $SSH_KEY $PRODUCTION_SERVER 'tail -f /home/docker/production.log'"
    echo ""
    echo "  ${GREEN}CloudFlare tunnel:${NC} No changes needed (already pointed to port 8080)"
    echo "  ${YELLOW}Next steps:${NC}"
    echo "  1. Test live site: https://stillpointproject.org"
    echo "  2. Monitor logs for any errors"
    echo "  3. Check all pages load correctly"

    # Check if production server is responding
    log_step "Testing production server..."
    sleep 3
    if ssh -i "$SSH_KEY" "$PRODUCTION_SERVER" "curl -s http://localhost:8080 > /dev/null"; then
        log_info "Production server is responding on port 8080"
        log_info "Public site should be live at https://stillpointproject.org"
    else
        log_warn "Production server may not be responding yet - wait 30 seconds and check"
    fi
}

# Rollback function (for emergencies)
rollback_to_previous() {
    log_step "Rolling back to previous deployment..."

    if [[ -z "$1" ]]; then
        log_error "Usage: rollback_to_previous <backup_directory>"
        return 1
    fi

    local ROLLBACK_DIR="$1"

    ssh -i "$SSH_KEY" "$PRODUCTION_SERVER" << EOF
        # Stop current production server
        pkill -f "production-server.js" || true

        # Restore previous production from backup
        if [[ -d "$ROLLBACK_DIR" ]]; then
            rm -rf $PRODUCTION_DIR
            cp -r $ROLLBACK_DIR $PRODUCTION_DIR
            echo "Production restored from $ROLLBACK_DIR"

            # Restart production server
            nohup node /home/docker/production-server.js > /home/docker/production.log 2>&1 &
            echo "Production server restarted"
        else
            echo "Error: Backup directory not found: $ROLLBACK_DIR"
            exit 1
        fi
EOF

    log_info "Rolled back to previous deployment from $ROLLBACK_DIR"
}

# Generate audio for published content
generate_audio() {
    log_step "Generating audio for published content..."

    local audio_script="$PROJECT_ROOT/scripts/generate-audio.sh"
    if [[ -f "$audio_script" ]]; then
        if bash "$audio_script" --all; then
            log_info "Audio generation completed"
        else
            log_warn "Audio generation had errors (continuing with deployment)"
        fi
    else
        log_warn "Audio generation script not found, skipping"
    fi
}

# Main execution
main() {
    echo -e "${BLUE}🚀 StillPoint Astro - Production Deployment${NC}"
    echo "⚠️  This will deploy to the live production site"
    echo

    # Safety check
    read -p "Are you sure you want to deploy to production? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Production deployment cancelled"
        exit 0
    fi

    check_prerequisites
    generate_audio
    backup_production
    sync_content
    build_site
    stop_production_server
    deploy_to_production
    start_production_server
    verify_cloudflare_tunnel
    generate_summary

    echo
    log_info "Production deployment completed!"
    log_info "Astro site should be live at https://stillpointproject.org"
    log_warn "Monitor logs and test thoroughly"
    log_warn "Rollback command: ./scripts/deploy-production.sh rollback <backup-dir>"
    echo
    echo "  Recent backups available at: /home/docker/astro-backup-*"
}

# Allow script to be sourced for rollback function or handle rollback command
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    # Check if rollback command was provided
    if [[ "$1" == "rollback" ]]; then
        if [[ -z "$2" ]]; then
            echo -e "${RED}❌${NC} Error: Backup directory required for rollback"
            echo "Usage: $0 rollback /home/docker/astro-backup-YYYYMMDD-HHMMSS"
            echo ""
            echo "Available backups:"
            ssh -i "$HOME/.ssh/id_rsa_stillpoint" docker@10.10.10.30 "ls -lhd /home/docker/astro-backup-* 2>/dev/null | tail -5"
            exit 1
        fi
        rollback_to_previous "$2"
    else
        main "$@"
    fi
fi