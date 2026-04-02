#!/bin/bash

# StillPoint Astro - Staging Deployment
# Deploys Astro site to staging environment on production server

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
PRODUCTION_SERVER="${STILLPOINT_SERVER:-docker@10.10.10.30}"
STAGING_DIR="${STILLPOINT_STAGING_DIR:-/home/docker/stillpoint-staging}"
SSH_KEY="${STILLPOINT_SSH_KEY:-$HOME/.ssh/id_ed25519}"

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

    local node_version=$(node --version | sed 's/v//')
    log_info "Using Node.js $node_version"

    # Check if fnm is available and use correct Node version
    if command -v fnm &> /dev/null; then
        export PATH="/home/walub/.local/share/fnm:$PATH"
        eval "$(fnm env)"
        fnm use v22.20.0 &> /dev/null || log_warn "Could not switch to Node v22.20.0"
    fi

    log_info "Prerequisites check completed"
}

# Sync content before building
sync_content() {
    log_step "Syncing latest content to Astro..."

    cd "$PROJECT_ROOT"
    if [[ -f "scripts/sync-content-to-astro.sh" ]]; then
        timeout 60 ./scripts/sync-content-to-astro.sh || log_warn "Content sync timed out or failed"
        log_info "Content synced"
    else
        log_warn "Content sync script not found, using existing content"
    fi
}

# Build Astro site
build_site() {
    log_step "Building Astro site for staging..."

    cd "$ASTRO_DIR"

    # Install dependencies if node_modules is missing
    if [[ ! -d "node_modules" ]]; then
        log_step "Installing dependencies..."
        npm install
    fi

    # Build the site
    npm run build

    if [[ ! -d "dist" ]]; then
        log_error "Build failed - dist directory not created"
    fi

    local file_count=$(find dist -type f | wc -l)
    log_info "Build completed - $file_count files generated"
}

# Deploy to staging server
deploy_to_staging() {
    log_step "Deploying to staging server..."

    # Create staging directory on server
    ssh -i "$SSH_KEY" "$PRODUCTION_SERVER" "mkdir -p $STAGING_DIR"

    # Copy built site to staging
    scp -i "$SSH_KEY" -r "$ASTRO_DIR/dist/"* "$PRODUCTION_SERVER:$STAGING_DIR/"

    # Check if deployment was successful
    local remote_files=$(ssh -i "$SSH_KEY" "$PRODUCTION_SERVER" "find $STAGING_DIR -type f | wc -l")
    log_info "Deployed $remote_files files to staging"
}

# Set up staging server process
setup_staging_server() {
    log_step "Setting up staging server process..."

    # Create a simple staging server script
    ssh -i "$SSH_KEY" "$PRODUCTION_SERVER" << 'EOF'
        # Kill any existing staging process
        pkill -f "staging-server" || true

        # Create staging server script
        cat > /home/docker/staging-server.js << 'JSEOF'
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 4000;
const STAGING_DIR = '/home/docker/stillpoint-staging';

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
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.m4a': 'audio/mp4'
};

const server = http.createServer((req, res) => {
    let pathname = url.parse(req.url).pathname;

    // Handle root path
    if (pathname === '/') {
        pathname = '/index.html';
    }

    // Handle directory paths - try index.html
    if (pathname.endsWith('/')) {
        pathname = pathname + 'index.html';
    }

    const filePath = path.join(STAGING_DIR, pathname);

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
                            res.writeHead(200, { 'Content-Type': 'text/html', 'Content-Length': htmlData.length, 'Accept-Ranges': 'bytes' });
                            res.end(htmlData);
                        }
                    });
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html', 'Content-Length': dirData.length, 'Accept-Ranges': 'bytes' });
                    res.end(dirData);
                }
            });
        } else {
            const ext = path.extname(filePath);
            const mimeType = mimeTypes[ext] || 'text/plain';
            const headers = {
                'Content-Type': mimeType,
                'Content-Length': data.length,
                'Accept-Ranges': 'bytes'
            };
            res.writeHead(200, headers);
            res.end(data);
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Staging server running on port ${PORT}`);
});
JSEOF

        # Start staging server
        nohup node /home/docker/staging-server.js > /home/docker/staging.log 2>&1 &
        echo "Staging server started on port 4000"
EOF

    log_info "Staging server configured and started"
}

# Generate deployment summary
generate_summary() {
    log_step "Generating deployment summary..."

    echo -e "\n${BLUE}🎯 Staging Deployment Summary:${NC}"
    echo "  Local build: $ASTRO_DIR/dist"
    echo "  Staging server: $PRODUCTION_SERVER:$STAGING_DIR"
    echo "  Staging URL: http://${STILLPOINT_SERVER#*@}:4000"
    echo "  Server logs: ssh -i $SSH_KEY $PRODUCTION_SERVER 'tail -f /home/docker/staging.log'"

    # Check if staging server is responding
    log_step "Testing staging server..."
    sleep 2
    if ssh -i "$SSH_KEY" "$PRODUCTION_SERVER" "curl -s http://localhost:4000 > /dev/null"; then
        log_info "Staging server is responding"
    else
        log_warn "Staging server may not be responding yet"
    fi
}

# Main execution
main() {
    echo -e "${BLUE}🚀 StillPoint Astro - Staging Deployment${NC}"
    echo "Deploying to staging environment..."
    echo

    check_prerequisites
    sync_content
    build_site
    deploy_to_staging
    setup_staging_server
    generate_summary

    echo
    log_info "Staging deployment completed successfully!"
    log_info "Access staging site at: http://${STILLPOINT_SERVER#*@}:4000"
}

# Execute main function
main "$@"