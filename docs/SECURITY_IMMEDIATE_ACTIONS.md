# 🚨 IMMEDIATE SECURITY ACTIONS REQUIRED

**STOP**: Do NOT deploy this application to production until these actions are completed.

---

## ⏰ WITHIN 1 HOUR

### 1. Rotate Supabase Service Role Key
```
1. Go to: https://supabase.com/dashboard/project/[project-id]/settings/api
2. Click "Reset service_role secret key"
3. Copy the NEW key
4. Update Vercel: Settings → Environment Variables → SUPABASE_SERVICE_ROLE_KEY
5. Redeploy application
```

### 2. Generate New JWT Secret
```bash
# On your local machine:
openssl rand -hex 64

# Copy the output and:
# 1. Update Vercel: ADMIN_JWT_SECRET environment variable
# 2. Redeploy application
# Note: All admin sessions will be invalidated (expected)
```

### 3. Update Admin Password
```
1. Login to admin console with current credentials
2. Navigate to: Settings → Security
3. Change password to a strong, unique password
4. Use password manager to store it
5. Do NOT commit the new password anywhere
```

---

## ⏰ WITHIN 24 HOURS

### 4. Remove .env from Git History
```bash
# WARNING: This rewrites git history - coordinate with team

cd h:\Ith-2

# Configure git safe directory if needed
git config --global --add safe.directory H:/Ith-2

# Remove .env from ALL git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env .env.local .env.production .env.development" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (requires team coordination)
git push origin --force --all
git push origin --force --tags

# Clean up
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### 5. Enable Secret Scanning
```
GitHub Repository:
1. Go to: Settings → Code security and analysis
2. Enable: Dependency graph
3. Enable: Dependabot alerts
4. Enable: Dependabot security updates
5. Enable: Secret scanning
6. Enable: Push protection
```

### 6. Make Repository Private (if currently public)
```
1. Go to: Repository Settings → Danger Zone
2. Click: "Change repository visibility"
3. Select: "Make private"
4. Confirm action
```

---

## ⏰ WITHIN 1 WEEK

### 7. Fix CORS Wildcard
**File:** `api/_lib/auth.js`

**Replace:**
```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
```

**With:**
```javascript
const ALLOWED_ORIGINS = [
  'https://innotech-hub.vercel.app',
  'https://innotech-hub-ith.vercel.app',
  ...(process.env.NODE_ENV === 'development' ? [
    'http://localhost:5173',
    'http://localhost:3000'
  ] : [])
];

const origin = req.headers.origin;

if (ALLOWED_ORIGINS.includes(origin)) {
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
} else {
  if (process.env.NODE_ENV === 'production') {
    return sendJson(res, 403, { error: 'Origin not allowed' });
  }
}
```

### 8. Add Rate Limiting
**Install dependencies:**
```bash
npm install @upstash/ratelimit @upstash/redis
```

**Setup Upstash:**
1. Create account: https://upstash.com
2. Create Redis database
3. Copy REST URL and Token
4. Add to Vercel environment variables

**File:** `api/_lib/rateLimit.js`
```javascript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const loginRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  analytics: true,
});
```

**Update:** `api/admin/login.js`
```javascript
import { loginRateLimiter } from '../_lib/rateLimit.js';

export default withAdminHandler(['POST'], async (req, res) => {
  // Rate limiting
  const identifier = `${req.ip || req.headers['x-forwarded-for']}:${req.body?.email || 'unknown'}`;
  const { success, remaining, reset } = await loginRateLimiter.limit(identifier);

  if (!success) {
    return sendJson(res, 429, {
      error: 'Too many login attempts. Please try again later.',
      retryAfter: Math.ceil((reset - Date.now()) / 1000)
    });
  }

  // ... existing login logic
});
```

### 9. Integrate XSS Protection
**Files:**
- `src/pages/PrivacyPolicy.jsx`
- `src/pages/TermsOfService.jsx`

**Add import:**
```javascript
import { createSafeHTML } from '../lib/sanitize'
```

**Replace:**
```javascript
dangerouslySetInnerHTML={{ __html: content || '<p>Loading…</p>' }}
```

**With:**
```javascript
dangerouslySetInnerHTML={createSafeHTML(content || '<p>Loading…</p>', 'richText')}
```

### 10. Add Security Headers
**File:** `vercel.json`

**Add:**
```json
{
  "rewrites": [
    { "source": "/((?!api/|@)[^.]*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

---

## 📋 VERIFICATION CHECKLIST

After completing the above:

**Credentials:**
- [ ] Supabase service role key rotated
- [ ] JWT secret regenerated (64+ bytes)
- [ ] Admin password changed
- [ ] .env removed from git history
- [ ] All Vercel environment variables updated
- [ ] Repository is private
- [ ] Secret scanning enabled

**Code Changes:**
- [ ] CORS wildcard removed
- [ ] Rate limiting added to login endpoint
- [ ] XSS sanitization integrated
- [ ] Security headers configured

**Testing:**
- [ ] Admin login works
- [ ] Rate limiting blocks after 5 attempts
- [ ] CORS rejects unauthorized origins
- [ ] Legal pages don't render malicious HTML
- [ ] Application builds successfully
- [ ] All API endpoints functional

---

## 🚦 DEPLOYMENT STATUS

**Before These Actions:**
- ❌ Production deployment: BLOCKED
- ❌ Public beta: BLOCKED
- ❌ Private beta: BLOCKED
- ✅ Local development: OK
- ✅ Internal demo: OK (test data only)

**After These Actions:**
- ⚠️ Production deployment: STILL NOT READY
- ⚠️ Public beta: STILL NOT READY
- ✅ Private beta: OK (with monitoring)
- ✅ Local development: OK
- ✅ Internal demo: OK

**For full production readiness, see:** `SECURITY_FINAL_REPORT.md` (Sections L & M)

---

## 📞 QUESTIONS?

**Security Team Contact:** [Add contact information]  
**Emergency Escalation:** [Add escalation procedure]  
**Security Incident:** Report immediately to security team

---

## 📚 ADDITIONAL RESOURCES

- Full audit report: `SECURITY_FINAL_REPORT.md`
- Credential rotation guide: `SECURITY_WARNING.md`
- Critical issues summary: `SECURITY_PHASE_3_CRITICAL_ISSUES.md`

---

**Last Updated:** December 2024  
**Next Review:** After critical fixes implemented  
**Status:** 🔴 CRITICAL ACTIONS REQUIRED
