# 🚀 Pre-Production Deployment Checklist
## InnoTech-Hub Security Hardening

**Use this checklist to ensure all security fixes are properly deployed to production.**

---

## 🔴 CRITICAL - MUST COMPLETE (Blocking)

### ☐ 1. Rotate Exposed Credentials
**Time Required**: 30-60 minutes  
**Blocker**: YES - Application compromised until completed

#### 1.1 Generate New JWT Secret
```bash
# Generate cryptographically secure secret (64 characters)
openssl rand -hex 64

# Copy output, save securely
```
- [ ] Generated new JWT secret
- [ ] Saved to password manager

#### 1.2 Rotate Supabase Service Role Key
1. [ ] Go to: https://supabase.com/dashboard/project/fblwlpkgvzqctjzwcmcx/settings/api
2. [ ] Click "Reset service_role secret key"
3. [ ] Copy NEW key
4. [ ] Save to password manager

#### 1.3 Change Admin Password
- [ ] Generate strong password (16+ chars, mixed case, numbers, symbols)
- [ ] Save to password manager

#### 1.4 Clean Git History
**WARNING**: This rewrites git history - coordinate with team

**Option A: BFG Repo-Cleaner (Recommended)**
```bash
# Download BFG: https://reps.io/bfg-repo-cleaner/
java -jar bfg.jar --delete-files .env
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

**Option B: git filter-branch**
```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env .env.local" \
  --prune-empty --tag-name-filter cat -- --all
git push origin --force --all
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

- [ ] Git history cleaned
- [ ] Force-pushed to remote
- [ ] Verified .env no longer in history: `git log --all --full-history -- .env`

---

### ☐ 2. Configure Vercel Environment Variables
**Time Required**: 10 minutes  
**Blocker**: YES

1. [ ] Go to: Vercel Dashboard → Project → Settings → Environment Variables
2. [ ] Add/Update variables:

```bash
# Authentication (NEW VALUES)
ADMIN_JWT_SECRET=[PASTE 64-CHAR HEX FROM STEP 1.1]
ADMIN_EMAIL=admin@innotech-hub.com
ADMIN_PASSWORD=[PASTE NEW PASSWORD FROM STEP 1.3]

# Supabase Server-side (ROTATED VALUES)
SUPABASE_URL=https://fblwlpkgvzqctjzwcmcx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[PASTE ROTATED KEY FROM STEP 1.2]

# Supabase Client-side (Public keys - safe to expose)
VITE_SUPABASE_URL=https://fblwlpkgvzqctjzwcmcx.supabase.co
VITE_SUPABASE_ANON_KEY=[GET FROM SUPABASE DASHBOARD - Settings → API]

# Environment
NODE_ENV=production
```

3. [ ] Set environment scope: Production, Preview, Development
4. [ ] Save changes

---

### ☐ 3. Apply Supabase Row Level Security
**Time Required**: 5 minutes  
**Blocker**: YES - Database vulnerable without RLS

1. [ ] Go to: https://supabase.com/dashboard/project/fblwlpkgvzqctjzwcmcx
2. [ ] Navigate to: SQL Editor
3. [ ] Copy SQL from `SECURITY_NOTES.md` section "SUPABASE ROW LEVEL SECURITY"
4. [ ] Execute SQL statements
5. [ ] Verify policies active: Database → Tables → users → Policies tab

**SQL Preview** (full version in SECURITY_NOTES.md):
```sql
-- Users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = auth_user_id);

-- Event registrations  
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own registrations"
ON event_registrations FOR SELECT
USING (auth.uid() = (SELECT auth_user_id FROM users WHERE id = student_id));

-- Events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are viewable by everyone"
ON events FOR SELECT
USING (true);
```

- [ ] RLS policies applied
- [ ] Verified policies in Supabase dashboard

---

### ☐ 4. Update CORS Production Origins
**Time Required**: 2 minutes  
**Blocker**: YES - API calls will fail

1. [ ] Open: `api/_lib/auth.js`
2. [ ] Update `ALLOWED_ORIGINS` array with actual production domain:

```javascript
const ALLOWED_ORIGINS = [
  'https://YOUR-ACTUAL-DOMAIN.com',  // ← REPLACE THIS
  'https://www-alternative-domain.com',  // If you have multiple
  ...(process.env.NODE_ENV === 'development' ? [
    'http://localhost:5173',
    ...
  ] : [])
];
```

3. [ ] Commit and push changes
4. [ ] Redeploy

---

### ☐ 5. Deploy to Vercel
**Time Required**: 5-10 minutes

```bash
# Option A: Git push (if auto-deploy enabled)
git add .
git commit -m "Security hardening complete"
git push origin main

# Option B: Manual deploy
npm run build
vercel --prod
```

- [ ] Deployment successful
- [ ] No build errors
- [ ] Environment variables loaded

---

### ☐ 6. Verify Deployment
**Time Required**: 10 minutes  
**Blocker**: YES - Ensures everything works

#### 6.1 Check Security Headers
```bash
curl -I https://YOUR-DOMAIN.com
```

**Expected Headers**:
- [ ] `Content-Security-Policy: ...`
- [ ] `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- [ ] `X-Frame-Options: DENY`
- [ ] `X-Content-Type-Options: nosniff`

#### 6.2 Test Admin Login
```bash
curl -X POST https://YOUR-DOMAIN.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@innotech-hub.com","password":"YOUR_NEW_PASSWORD"}'
```

**Expected**: `200 OK` with token

- [ ] Admin login successful
- [ ] Old password rejected

#### 6.3 Test Rate Limiting
```bash
# Run 6 times rapidly
for i in {1..6}; do
  curl -X POST https://YOUR-DOMAIN.com/api/admin/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}' \
    -w "\nAttempt $i: HTTP %{http_code}\n"
done
```

**Expected**: First 5 = `401`, 6th = `429`

- [ ] Rate limiting active

#### 6.4 Test CORS
```bash
# Test allowed origin
curl -X POST https://YOUR-DOMAIN.com/api/admin/login \
  -H "Origin: https://YOUR-DOMAIN.com" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}' \
  -i

# Test disallowed origin
curl -X POST https://YOUR-DOMAIN.com/api/admin/login \
  -H "Origin: https://evil.com" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}' \
  -i
```

**Expected**: Allowed = `401` (or `200`), Disallowed = `403`

- [ ] CORS protection active

#### 6.5 Test XSS Protection
1. [ ] Login to admin console
2. [ ] Navigate to CMS → Legal Pages → Privacy Policy
3. [ ] Add test content: `<script>alert('XSS')</script>`
4. [ ] Save and visit `/privacy-policy`
5. [ ] Verify: No alert shown, script stripped in source

#### 6.6 Test File Upload
```bash
# Create test file
echo "<?php system('whoami'); ?>" > malicious.jpg

# Upload (with valid student token)
curl -X POST https://YOUR-DOMAIN.com/api/student/upload \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -F "file=@malicious.jpg" \
  -F "folder=payment-proof"
```

**Expected**: `400 "File content does not match declared type"`

- [ ] File upload security active

---

## 🟡 HIGH PRIORITY - Complete Within 24 Hours

### ☐ 7. Enable Monitoring & Logging
**Time Required**: 30 minutes

#### Option A: Sentry (Recommended)
```bash
npm install @sentry/react @sentry/node
```

1. [ ] Create Sentry account: https://sentry.io
2. [ ] Create project
3. [ ] Add DSN to Vercel env: `SENTRY_DSN`
4. [ ] Initialize in `src/main.jsx`:
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
});
```
5. [ ] Deploy changes

#### Option B: LogRocket
1. [ ] Create LogRocket account
2. [ ] Follow integration guide
3. [ ] Deploy

- [ ] Error tracking enabled
- [ ] Test by throwing test error

---

### ☐ 8. Run Security Scans
**Time Required**: 15 minutes

#### 8.1 Dependency Audit
```bash
npm audit
npm audit fix  # Apply automatic fixes
```

- [ ] No critical vulnerabilities
- [ ] Document unfixable issues

#### 8.2 OWASP ZAP Scan (Optional)
1. [ ] Download: https://www.zaproxy.org/download/
2. [ ] Run automated scan against staging
3. [ ] Review and address findings

- [ ] Scan completed
- [ ] Findings documented

---

### ☐ 9. Enable GitHub/GitLab Secret Scanning
**Time Required**: 5 minutes

**GitHub**:
1. [ ] Go to: Repository → Settings → Security & analysis
2. [ ] Enable: "Secret scanning"
3. [ ] Enable: "Dependency graph"
4. [ ] Enable: "Dependabot alerts"

**GitLab**:
1. [ ] Go to: Project → Settings → CI/CD → Secret Detection
2. [ ] Enable secret detection

---

## 🟢 RECOMMENDED - Complete Within 1 Week

### ☐ 10. Implement Remaining Input Validation
**Time Required**: 2-4 hours

**Endpoints Requiring Zod Validation**:
- [ ] `/api/admin/events` (POST) - eventCreateSchema
- [ ] `/api/admin/events/[id]` (PUT) - eventUpdateSchema
- [ ] `/api/admin/users/[id]` (PUT) - userFilterSchema
- [ ] `/api/student/register` (POST) - eventRegistrationSchema
- [ ] `/api/student/profile` (PUT) - studentProfileUpdateSchema
- [ ] `/api/admin/cms/*` - cmsPageSchema

**Pattern** (see `api/admin/login.js` for example):
```javascript
import { validateInput, eventCreateSchema } from '../_lib/validation.js';

export default withAdminHandler(['POST'], async (req, res) => {
  const validatedData = validateInput(eventCreateSchema, req.body || {});
  // ... use validatedData
});
```

---

### ☐ 11. Create Security Tests
**Time Required**: 4-6 hours

Create: `api/__tests__/security.test.js`

**Test Cases**:
- [ ] JWT validation (expired, forged, malformed)
- [ ] Rate limiting (brute force)
- [ ] CORS (allowed/disallowed origins)
- [ ] XSS (injection attempts)
- [ ] File upload (malicious files)
- [ ] IDOR (access other users' resources)

---

### ☐ 12. Upgrade Rate Limiter (If High Traffic)
**Time Required**: 1 hour  
**Trigger**: > 1000 requests/day

```bash
npm install @upstash/ratelimit @upstash/redis
```

1. [ ] Create Upstash account: https://upstash.com
2. [ ] Create Redis database
3. [ ] Add credentials to Vercel env
4. [ ] Replace `api/_lib/rateLimit.js` (code in SECURITY_NOTES.md)
5. [ ] Deploy and test

---

## 📋 FINAL VERIFICATION

### Pre-Launch Checklist
- [ ] All CRITICAL items completed
- [ ] Credentials rotated and verified
- [ ] Security headers active
- [ ] Rate limiting tested
- [ ] CORS protection verified
- [ ] XSS sanitization working
- [ ] File upload security tested
- [ ] Admin login working
- [ ] Student login working
- [ ] Monitoring enabled
- [ ] Security scans completed
- [ ] Documentation updated

### Sign-Off
- [ ] Security lead approved: _________________ Date: _______
- [ ] DevOps lead approved: __________________ Date: _______
- [ ] Product owner approved: ________________ Date: _______

---

## 🆘 ROLLBACK PLAN

If critical issues discovered post-deployment:

### Immediate Actions
1. Revert deployment:
```bash
vercel rollback YOUR-DOMAIN.com
```

2. Investigate issue in staging
3. Fix and redeploy
4. Re-verify checklist

### Emergency Contacts
- **Security Team**: security@innotech-hub.com
- **DevOps Lead**: devops@innotech-hub.com
- **On-Call**: [Phone number]

---

## 📚 REFERENCE DOCUMENTS

- **Full Audit Report**: `SECURITY_REMEDIATION_REPORT.md`
- **Quick Summary**: `SECURITY_FIXES_SUMMARY.md`
- **Implementation Notes**: `SECURITY_NOTES.md`
- **Credential Rotation**: `CREDENTIAL_ROTATION_REQUIRED.md`
- **This Checklist**: `PRE_PRODUCTION_CHECKLIST.md`

---

**Checklist Version**: 1.0  
**Last Updated**: 2026-09-20  
**Next Review**: After production deployment

---

**⚠️ DO NOT DEPLOY TO PRODUCTION UNTIL ALL CRITICAL ITEMS ARE CHECKED ⚠️**
