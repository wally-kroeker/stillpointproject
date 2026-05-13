#!/usr/bin/env bash
# install-systemd-units.sh
# Install systemd units + sudoers fragment for StillPoint + WookieFoot on LXC 118.
# MUST run as root (via sudo).
# Idempotent — safe to re-run.
#
# Intended invocation from your laptop:
#   cat scripts/systemd/install-systemd-units.sh \
#     scripts/systemd/stillpoint.service \
#     scripts/systemd/stillpoint-staging.service \
#     scripts/systemd/wookiefoot.service \
#     scripts/systemd/docker-deploy-restart.sudoers \
#   | ssh -t docker@10.10.10.30 'sudo bash -s'
#
# (The script reads the four file payloads from stdin via heredoc markers below — no, simpler:
#  we ship the unit content INLINE so a single `cat install-systemd-units.sh | sudo bash` works.)

set -euo pipefail

if [[ $EUID -ne 0 ]]; then
    echo "ERROR: must run as root (use sudo)" >&2
    exit 1
fi

UNIT_DIR=/etc/systemd/system
SUDOERS_FILE=/etc/sudoers.d/docker-deploy-restart

log() { echo "[install] $*"; }

# ---------- 1. Stop any existing nohup-managed processes ----------
log "Stopping any nohup-managed legacy processes..."
pkill -f 'node /home/docker/production-server.js' 2>/dev/null || true
pkill -f 'node /home/docker/staging-server.js' 2>/dev/null || true
pkill -f 'node /home/docker/wookiefoot-staging/node_modules/next' 2>/dev/null || true
pkill -f 'next-server' 2>/dev/null || true
sleep 2

# ---------- 2. Write unit files ----------
log "Writing $UNIT_DIR/stillpoint.service"
cat > "$UNIT_DIR/stillpoint.service" <<'UNIT_STILLPOINT'
[Unit]
Description=StillPoint Astro production server (port 8080)
Documentation=https://stillpointproject.org
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=docker
Group=docker
WorkingDirectory=/home/docker
ExecStart=/home/docker/.local/share/fnm/node-versions/v22.22.1/installation/bin/node /home/docker/production-server.js
Restart=always
RestartSec=3
StandardOutput=append:/home/docker/production.log
StandardError=append:/home/docker/production.log
KillSignal=SIGTERM
TimeoutStopSec=10

[Install]
WantedBy=multi-user.target
UNIT_STILLPOINT

log "Writing $UNIT_DIR/stillpoint-staging.service"
cat > "$UNIT_DIR/stillpoint-staging.service" <<'UNIT_STILLPOINT_STAGING'
[Unit]
Description=StillPoint Astro staging server (port 4000)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=docker
Group=docker
WorkingDirectory=/home/docker
ExecStart=/home/docker/.local/share/fnm/node-versions/v22.22.1/installation/bin/node /home/docker/staging-server.js
Restart=always
RestartSec=3
StandardOutput=append:/home/docker/staging.log
StandardError=append:/home/docker/staging.log
KillSignal=SIGTERM
TimeoutStopSec=10

[Install]
WantedBy=multi-user.target
UNIT_STILLPOINT_STAGING

log "Writing $UNIT_DIR/wookiefoot.service"
cat > "$UNIT_DIR/wookiefoot.service" <<'UNIT_WOOKIEFOOT'
[Unit]
Description=WookieFoot band site (Next.js, port 4001)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=docker
Group=docker
WorkingDirectory=/home/docker/wookiefoot-staging
Environment=PORT=4001
Environment=API_PORT=4001
Environment=NODE_ENV=production
ExecStart=/home/docker/.local/share/fnm/node-versions/v22.22.1/installation/bin/node /home/docker/wookiefoot-staging/node_modules/next/dist/bin/next start -p 4001
Restart=always
RestartSec=3
StandardOutput=append:/home/docker/wookiefoot-staging.log
StandardError=append:/home/docker/wookiefoot-staging.log
KillSignal=SIGTERM
TimeoutStopSec=15

[Install]
WantedBy=multi-user.target
UNIT_WOOKIEFOOT

# ---------- 3. Write sudoers fragment (validate before installing) ----------
log "Writing sudoers fragment to temp + validating with visudo -c"
TMP_SUDOERS=$(mktemp)
cat > "$TMP_SUDOERS" <<'SUDOERS_FRAGMENT'
# Allow the `docker` user to manage the three site services without a password.
# Scoped tightly: only start/stop/restart on these three units. No blanket sudo.
docker ALL=(root) NOPASSWD: /bin/systemctl start stillpoint, /bin/systemctl stop stillpoint, /bin/systemctl restart stillpoint, /bin/systemctl start stillpoint-staging, /bin/systemctl stop stillpoint-staging, /bin/systemctl restart stillpoint-staging, /bin/systemctl start wookiefoot, /bin/systemctl stop wookiefoot, /bin/systemctl restart wookiefoot
SUDOERS_FRAGMENT

if ! visudo -c -f "$TMP_SUDOERS" >/dev/null; then
    echo "ERROR: sudoers fragment failed validation; aborting BEFORE install" >&2
    rm -f "$TMP_SUDOERS"
    exit 2
fi
install -m 0440 -o root -g root "$TMP_SUDOERS" "$SUDOERS_FILE"
rm -f "$TMP_SUDOERS"
log "Installed $SUDOERS_FILE (mode 0440)"

# ---------- 4. Reload systemd and verify each unit syntactically ----------
log "systemctl daemon-reload"
systemctl daemon-reload

for u in stillpoint stillpoint-staging wookiefoot; do
    log "systemd-analyze verify $u.service"
    systemd-analyze verify "$UNIT_DIR/$u.service" || {
        echo "ERROR: $u.service failed verify" >&2
        exit 3
    }
done

# ---------- 5. Enable + start ----------
for u in stillpoint stillpoint-staging wookiefoot; do
    log "systemctl enable --now $u"
    systemctl enable --now "$u"
done

sleep 4

# ---------- 6. Status report ----------
echo
log "===== STATUS ====="
for u in stillpoint stillpoint-staging wookiefoot; do
    echo
    echo "--- $u ---"
    systemctl is-enabled "$u" || true
    systemctl is-active "$u" || true
    systemctl status "$u" --no-pager -n 5 || true
done

echo
log "===== LISTENING PORTS ====="
ss -ltnp 2>/dev/null | grep -E ':(8080|4000|4001)\b' || echo "WARN: no expected ports listening"

echo
log "Install complete."
