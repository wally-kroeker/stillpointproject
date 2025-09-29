# StillPoint Astro Migration - Rollback Procedures

**Last Updated:** 2025-09-29
**Production Hugo Commit:** `269fb6ecddf4ce7c9fcd8cc63fb96d4097b430de`
**Hugo Version:** v0.125.7 extended

---

## Critical Information

### Current Production Environment (Hugo)
- **Server:** docker@10.10.10.30
- **Path:** `/home/docker/stillpoint-project`
- **Port:** 8080
- **Process:** Hugo server running (PIDs: 30365, 30481)
- **Public URL:** https://stillpointproject.org
- **CloudFlare Tunnel:** PID 201 (points to localhost:8080)
- **Git Commit:** 269fb6ecddf4ce7c9fcd8cc63fb96d4097b430de
- **Commit Message:** "Fix story page formatting and add stories navigation CSS"
- **Commit Date:** 2025-09-25 00:40:45 +0000

### Staging Environment (Astro)
- **Server:** docker@10.10.10.30
- **Path:** `/home/docker/stillpoint-staging`
- **Port:** 4000
- **Process:** Node.js server (staging-server.js)
- **Staging URL:** http://10.10.10.30:4000
- **Build Files:** 31 files deployed

### SSH Access
- **Key:** `~/.ssh/id_rsa_stillpoint`
- **User:** docker
- **Host:** 10.10.10.30
- **Test:** `ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30 "echo 'Access verified'"`

---

## Rollback Scenarios

### Scenario 1: Immediate Rollback (Critical Production Failure)

**Use Case:** Astro deployment breaks production site, requires immediate restoration.

**Time to Restore:** 2-5 minutes

**Steps:**

1. **SSH to Production Server**
   ```bash
   ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30
   ```

2. **Kill Astro Process** (if running on port 8080)
   ```bash
   pkill -f "stillpoint-production"
   # Or if using Node.js:
   pkill -f "node.*8080"
   ```

3. **Verify Port 8080 is Free**
   ```bash
   netstat -tlnp | grep 8080
   # Should return nothing
   ```

4. **Restart Hugo Server**
   ```bash
   cd /home/docker/stillpoint-project
   nohup hugo server -p 8080 -D --bind 0.0.0.0 --ignoreCache --noHTTPCache --cleanDestinationDir > hugo_rollback.log 2>&1 &
   ```

5. **Verify Hugo is Running**
   ```bash
   curl http://localhost:8080 | head -20
   # Should return HTML from homepage
   ```

6. **Test Public Site**
   ```bash
   # From local machine:
   curl -I https://stillpointproject.org
   # Should return 200 OK
   ```

7. **Monitor Hugo Logs**
   ```bash
   tail -f /home/docker/stillpoint-project/hugo_rollback.log
   ```

**CloudFlare Tunnel Note:** The tunnel should automatically reconnect to port 8080 since it was already pointing there. No tunnel reconfiguration needed.

---

### Scenario 2: Planned Rollback (Astro Issues Found During Testing)

**Use Case:** Staging testing reveals issues that require reverting to Hugo before production deployment.

**Time to Execute:** 5-10 minutes

**Steps:**

1. **Document Astro Issues**
   - Record specific problems found
   - Screenshot errors if applicable
   - Note which pages/features are affected

2. **Stop Staging Server** (optional, to conserve resources)
   ```bash
   ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30
   pkill -f "staging-server"
   ```

3. **Verify Hugo Still Running**
   ```bash
   ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30
   ps aux | grep hugo
   curl http://localhost:8080 | head -20
   ```

4. **Test Production Site**
   - Visit https://stillpointproject.org
   - Verify all pages load correctly
   - Check novel chapters and stories

5. **Document Decision**
   - Update `PRODUCTION_READINESS_PLAN.md` with findings
   - Create GitHub issue with Astro problems
   - Set timeline for fixes

**Status:** Hugo remains in production, Astro deployment postponed.

---

### Scenario 3: Post-Production Rollback (Issues Found After Astro Deployment)

**Use Case:** Astro deployed to production but issues found within 24-48 hours.

**Time to Restore:** 5-10 minutes

**Steps:**

1. **Assess Severity**
   - **Critical:** Site down, major functionality broken → Immediate rollback
   - **Major:** Significant bugs but site functional → Schedule rollback window
   - **Minor:** Small issues, can be hotfixed → Consider fixing forward instead

2. **Create Hugo Backup Verification**
   ```bash
   ssh -i ~/.ssh/id_rsa_stillpoint docker@10.10.10.30
   cd /home/docker/stillpoint-project
   git log -1 --format='%H %s %ad'
   # Verify this matches: 269fb6ecddf4ce7c9fcd8cc63fb96d4097b430de
   ```

3. **Kill Astro Production Process**
   ```bash
   pkill -f "stillpoint-production"
   # Or specific Node command from deploy script
   ```

4. **Restore Hugo**
   ```bash
   cd /home/docker/stillpoint-project
   git checkout 269fb6ecddf4ce7c9fcd8cc63fb96d4097b430de
   nohup hugo server -p 8080 -D --bind 0.0.0.0 --ignoreCache --noHTTPCache --cleanDestinationDir > hugo_restored.log 2>&1 &
   ```

5. **Verify Restoration**
   ```bash
   # Check Hugo process
   ps aux | grep hugo

   # Test locally
   curl http://localhost:8080 | head -30

   # Test publicly
   curl -I https://stillpointproject.org
   ```

6. **Monitor for 1 Hour**
   ```bash
   tail -f /home/docker/stillpoint-project/hugo_restored.log
   ```

7. **Post-Rollback Actions**
   - Notify stakeholders (if any)
   - Document what went wrong
   - Update deployment plan with lessons learned
   - Set timeline for Astro fixes and re-deployment

---

## Verification Checklist

After any rollback, verify these items:

### Production Site Accessible
- [ ] Homepage loads: https://stillpointproject.org
- [ ] Novel index loads: https://stillpointproject.org/novel
- [ ] Sample chapter loads: https://stillpointproject.org/novel/the-daydream
- [ ] Stories index loads: https://stillpointproject.org/stories
- [ ] Sample story loads: https://stillpointproject.org/stories/the-neural-stream

### Hugo Process Health
- [ ] Hugo process running on port 8080
- [ ] No error messages in logs
- [ ] CPU/memory usage normal (<5% CPU, <100MB RAM)
- [ ] Log file growing (indicating active requests)

### CloudFlare Tunnel
- [ ] Tunnel process running (PID 201 or new PID)
- [ ] Tunnel connected to localhost:8080
- [ ] Public URL resolving correctly
- [ ] No SSL/TLS errors

### Content Integrity
- [ ] All 10 novel chapters accessible
- [ ] All published stories accessible
- [ ] Images/assets loading
- [ ] Navigation working
- [ ] No 404 errors on known pages

---

## Common Issues and Solutions

### Issue: Hugo Won't Start on Port 8080
**Symptom:** Error "address already in use"
**Solution:**
```bash
# Find process using port 8080
netstat -tlnp | grep 8080
# Kill the process
kill <PID>
# Restart Hugo
cd /home/docker/stillpoint-project
nohup hugo server -p 8080 -D --bind 0.0.0.0 > hugo.log 2>&1 &
```

### Issue: CloudFlare Tunnel Not Connecting
**Symptom:** Public site returns 502 Bad Gateway
**Solution:**
```bash
# Check tunnel status
ps aux | grep cloudflared
# If tunnel is down, restart it (requires tunnel credentials)
# Note: Tunnel should auto-reconnect; wait 1-2 minutes first
```

### Issue: Git State Inconsistent
**Symptom:** Git shows uncommitted changes or wrong commit
**Solution:**
```bash
cd /home/docker/stillpoint-project
git stash  # Save any uncommitted work
git fetch origin
git checkout 269fb6ecddf4ce7c9fcd8cc63fb96d4097b430de
git status  # Verify clean state
```

### Issue: Hugo Version Mismatch
**Symptom:** Hugo fails to build or serve
**Solution:**
```bash
hugo version
# Should show: hugo v0.125.7-... extended
# If not, reinstall correct Hugo version
```

---

## Emergency Contacts

**Primary Administrator:** walub (local machine development)
**Production Server:** docker@10.10.10.30 (SSH access required)
**Documentation:** This file, `PRODUCTION_READINESS_PLAN.md`, `CLAUDE.md`

---

## Notes

- **Hugo is battle-tested:** Current production site has been stable since September 24, 2025
- **Zero-downtime not guaranteed:** Rollback requires stopping Astro and starting Hugo (2-5 minutes)
- **Data loss risk:** Minimal - all content in git, Hugo deployment is static files
- **CloudFlare tunnel:** Should automatically reconnect, but may take 1-2 minutes to stabilize

---

## Post-Rollback Analysis Template

Use this template when documenting rollback incidents:

### Incident Report: [Date/Time]

**Rollback Trigger:**
[What went wrong? Critical bug? Performance issue? User reports?]

**Rollback Scenario Used:**
[Scenario 1, 2, or 3]

**Time to Restore:**
[Actual time taken from decision to production restored]

**Root Cause:**
[What caused the Astro deployment to fail?]

**Impact:**
[How many users affected? How long was site degraded?]

**Lessons Learned:**
[What should be added to testing checklist? What was missed?]

**Action Items:**
- [ ] Fix identified in Astro codebase
- [ ] Add test for this scenario
- [ ] Update deployment procedures
- [ ] Re-deploy when ready

---

**Document Status:** Ready for use
**Last Verified:** 2025-09-29 (staging deployment successful)