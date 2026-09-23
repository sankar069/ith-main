# 🚨 CREDENTIAL ROTATION REQUIRED - IMMEDIATE ACTION

**Date:** $(Get-Date)  
**Status:** 🔴 CRITICAL - Action Required Within 24 Hours

---

## EXPOSED CREDENTIALS

The following credentials were committed to the repository and MUST be rotated immediately:

### 1. Supabase Service Role Key
**Location:** Previously in `.env` file (now removed)  
**Action Required:** ROTATE IMMEDIATELY

**Steps:**
1. Go to: https://supabase.com/dashboard/project/fblwlpkgvzqctjzwcmcx/settings/api
2. Click "Reset service_role secret key"
3. Copy NEW key
4. Update in Vercel: Project Settings → Environment Variables → `SUPABASE_SERVICE_ROLE_KEY`
5. Redeploy application

**Risk if not rotated:** Complete database compromise, all data accessible

---

### 2. JWT Signing Secret
**Location:** Previously in `.env` file (now removed)  
**Current Value:** Weak, predictable secret  
**Action Required:** GENERATE NEW STRONG SECRET

**Steps:**
```bash
# Generate cryptographically secure secret
openssl rand -hex 64
```

**Update in Vercel:**
- Variable: `ADMIN_JWT_SECRET`
- Value: [OUTPUT FROM ABOVE COMMAND]
- Redeploy

**Risk if not rotated:** JWT token forgery, authentication bypass

---

### 3. Admin Credentials
**Location:** Previously in `.env` file (now removed)  
**Current:** `ithadmin@ith.com` / `admin@2026`  
**Action Required:** CHANGE PASSWORD IMMEDIATELY

**Steps:**
1. Login to admin console with current credentials
2. Navigate to: Settings → Security → Change Password
3. Set strong password (16+ characters, mixed case, numbers, symbols)
4. Store in password manager
5. Update `ADMIN_PASSWORD` in Vercel (temporary until real auth system)

**Risk if not rotated:** Unauthorized admin access

---

### 4. Supabase Project URL
**Location:** Previously exposed in `.env`  
**Current:** `https://fblwlpkgvzqctjzwcmcx.supabase.co`  
**Action Required:** Consider new project for production

**Note:** If this was a development/test project, create NEW production project.  
If this IS production, proceed with key rotation above.

---

## GIT HISTORY CLEANUP

The `.env` file has been removed but remains in git history.

**Required Command:**
```bash
# WARNING: This rewrites git history - coordinate with team
cd h:\Ith-2

# Remove .env from ALL git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env .env.local .env.backup" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (requires team coordination)
git push origin --force --all

# Clean up
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

**Alternative (recommended):** Use BFG Repo-Cleaner:
```bash
# Download from: https://reps.io/bfg-repo-cleaner/
java -jar bfg.jar --delete-files .env
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force
```

---

## VERIFICATION CHECKLIST

After rotation, verify:

- [ ] Supabase service role key rotated
- [ ] JWT secret regenerated (64+ hex characters)
- [ ] Admin password changed
- [ ] All Vercel environment variables updated
- [ ] Application redeployed
- [ ] Old credentials no longer work
- [ ] New credentials work correctly
- [ ] Git history cleaned
- [ ] GitHub/GitLab secret scanning enabled

---

## NEW ENVIRONMENT VARIABLES (Vercel)

Set in Vercel Project Settings → Environment Variables:

```bash
# Supabase (Server-side) - ROTATED VALUES
SUPABASE_URL=https://fblwlpkgvzqctjzwcmcx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[NEW_SERVICE_ROLE_KEY_FROM_SUPABASE_DASHBOARD]

# Supabase (Client-side) - Public keys, safe to expose
VITE_SUPABASE_URL=https://fblwlpkgvzqctjzwcmcx.supabase.co
VITE_SUPABASE_ANON_KEY=[ANON_KEY_FROM_SUPABASE_DASHBOARD]

# Admin Authentication - NEW STRONG SECRET
ADMIN_JWT_SECRET=[OUTPUT_FROM_openssl_rand_-hex_64]

# Admin Credentials - TEMPORARY
ADMIN_EMAIL=ithadmin@ith.com
ADMIN_PASSWORD=[NEW_STRONG_PASSWORD]

# Node Environment
NODE_ENV=production
```

---

## TIMELINE

**Hour 0-2:** Rotate all credentials  
**Hour 2-4:** Clean git history  
**Hour 4-24:** Verify and monitor  
**Day 2+:** Enable secret scanning, security monitoring

---

## CONTACTS

**Security Team:** [Add contact]  
**DevOps Lead:** [Add contact]  
**Emergency:** [Add 24/7 contact]

---

**This is NOT optional. These credentials are PUBLICLY EXPOSED in git history.**

**Until rotated, assume the application is already compromised.**
