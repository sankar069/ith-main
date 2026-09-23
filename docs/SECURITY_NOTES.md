# Security Implementation Notes

## TOKEN STORAGE LIMITATION

### Current State
**Student Authentication**: Supabase SDK stores JWT tokens in `localStorage` by default.  
**Admin Authentication**: JWT tokens transmitted via `Authorization: Bearer` header, typically stored in client-side JavaScript memory or localStorage.

### Security Impact
**Risk Level**: MEDIUM  
**OWASP Classification**: A07:2021 - Identification and Authentication Failures

**Vulnerability**: localStorage is accessible to any JavaScript running on the domain, including:
- XSS attacks (mitigated via DOMPurify sanitization)
- Browser extensions
- Third-party scripts

### Why Not Fixed in This Remediation
Fixing this properly requires ARCHITECTURAL changes that would break existing functionality:

1. **Supabase SDK Default Behavior**  
   Supabase JS client stores tokens in localStorage by default. Changing this requires custom session management.

2. **Required Changes**  
   - Backend: Implement HTTP-only cookie-based session management
   - Backend: Create session store (Redis/Postgres) for server-side session tracking
   - Frontend: Refactor all Supabase client auth calls to use custom auth flow
   - Frontend: Update studentFetch to send cookies instead of Bearer tokens
   - Infrastructure: Configure cookie domain/path/secure flags
   - Testing: Retest entire authentication flow

3. **Scope Impact**  
   - Student login/signup
   - Dashboard authentication
   - All student API calls
   - Session persistence
   - Multi-tab synchronization

### Mitigation Measures IN PLACE
1. ✅ **XSS Prevention**: DOMPurify sanitization on all user-generated HTML
2. ✅ **CORS Protection**: Explicit origin allowlist, no wildcard
3. ✅ **CSP Headers**: Content-Security-Policy blocks inline script injection
4. ✅ **Short Token Lifetime**: Supabase tokens expire (default: 1 hour)
5. ✅ **Token Validation**: Server-side JWT verification on every request
6. ✅ **HTTPS-Only**: Enforced via HSTS header (production)

### Recommended Solution (FUTURE WORK)
Implement HttpOnly cookie-based authentication:

```javascript
// Backend: api/_lib/sessionAuth.js
export function createSession(userId, response) {
  const sessionId = generateSecureToken();
  await sessionStore.set(sessionId, { userId, createdAt: Date.now() });
  
  response.setHeader('Set-Cookie', [
    `session=${sessionId}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`
  ]);
}

export async function requireSession(request) {
  const cookies = parseCookies(request.headers.cookie);
  const sessionId = cookies.session;
  
  if (!sessionId) throw new AuthError('Not authenticated', 401);
  
  const session = await sessionStore.get(sessionId);
  if (!session) throw new AuthError('Session expired', 401);
  
  return session;
}
```

```javascript
// Frontend: refactor Supabase SDK usage
// Instead of: supabase.auth.signInWithPassword()
// Use: fetch('/api/auth/login', { method: 'POST', credentials: 'include' })
```

**Estimated Effort**: 2-3 days  
**Testing Required**: Full authentication flow regression testing  
**Breaking Change**: Yes - existing sessions will be invalidated

---

## RATE LIMITING IMPLEMENTATION

### Current Implementation
**Type**: In-memory Map-based rate limiter  
**Suitable For**: Development, low-traffic applications, basic protection

**Limitations**:
1. Resets on serverless cold start (Vercel serverless functions)
2. Not shared across multiple serverless instances
3. No persistent storage

### Production Upgrade Path
For high-traffic production, use Upstash Redis or Vercel KV:

```bash
npm install @upstash/ratelimit @upstash/redis
```

```javascript
// api/_lib/rateLimit.js (production version)
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv(); // Reads UPSTASH_REDIS_REST_URL and TOKEN

export const loginLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  analytics: true,
  prefix: 'ith:ratelimit:login',
});

export async function checkRateLimit(identifier) {
  const { success, remaining, reset } = await loginLimiter.limit(identifier);
  return { allowed: success, remaining, resetTime: reset };
}
```

**Cost**: Upstash free tier: 10,000 requests/day  
**Setup Time**: 15 minutes

---

## CSP HEADER EXCEPTIONS

### Current CSP Policy
```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; 
  ...
```

### Exceptions Explained

**`'unsafe-inline'` in script-src**  
**Reason**: Required for Vite dev server and React hot module replacement (HMR)  
**Impact**: Allows inline <script> tags (XSS risk if combined with DOM injection)  
**Mitigation**: DOMPurify sanitization prevents user content from injecting scripts

**`'unsafe-eval'` in script-src**  
**Reason**: Required for Vite's dynamic import() during development  
**Impact**: Allows eval(), Function(), setTimeout(string) (code injection risk)  
**Mitigation**: No user input ever reaches eval() - only bundler-generated code

### Production Hardening (RECOMMENDED)
After building for production, tighten CSP:

```javascript
// vercel.json (production config)
{
  "headers": [{
    "source": "/(.*)",
    "headers": [{
      "key": "Content-Security-Policy",
      "value": "default-src 'self'; script-src 'self' 'sha256-[HASH_OF_INLINE_SCRIPTS]'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; ..."
    }]
  }]
}
```

**How to generate hashes**:
1. Build application: `npm run build`
2. Extract inline scripts from dist/index.html
3. Generate SHA-256: `echo -n "SCRIPT_CONTENT" | openssl dgst -sha256 -binary | openssl base64`
4. Replace 'unsafe-inline' with 'sha256-HASH'

---

## VERCEL ENVIRONMENT VARIABLES

### Required Production Setup

After deploying to Vercel, configure these environment variables in:  
**Vercel Dashboard** → Project → Settings → Environment Variables

```bash
# Authentication
ADMIN_JWT_SECRET=[64-character hex from: openssl rand -hex 64]
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=[strong password]

# Supabase (Server-side)
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[rotated service role key from Supabase dashboard]

# Supabase (Client-side - safe to expose)
VITE_SUPABASE_URL=https://[project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=[anon key from Supabase dashboard]

# Node environment
NODE_ENV=production
```

**CRITICAL**: Never commit these values to git.  
**CRITICAL**: Rotate SUPABASE_SERVICE_ROLE_KEY immediately (see CREDENTIAL_ROTATION_REQUIRED.md)

---

## PASSWORD SECURITY

### Admin Authentication
**Current**: Basic bcrypt/scrypt via environment variable comparison  
**Limitation**: Hardcoded credentials in environment

**Recommended Improvement**: Migrate to proper admin user table with hashed passwords
```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL, -- bcrypt/argon2
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'event_manager')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Student Authentication
**Implementation**: Supabase Auth (secure by default)  
**Password Hashing**: Argon2id (handled by Supabase)  
**Status**: ✅ Secure

---

## SUPABASE ROW LEVEL SECURITY

### Critical Tables Requiring RLS

**users** (student profiles)
```sql
-- Users can only read/update their own profile
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = auth_user_id);
```

**event_registrations**
```sql
-- Students can only see their own registrations
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own registrations"
ON event_registrations FOR SELECT
USING (auth.uid() = (SELECT auth_user_id FROM users WHERE id = student_id));
```

**events**
```sql
-- Public read, admin-only write
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are viewable by everyone"
ON events FOR SELECT
USING (true);

-- Admin writes handled via service role (bypasses RLS)
```

**Action Required**: Audit and apply RLS policies in Supabase SQL Editor

---

## INPUT VALIDATION COVERAGE

### Endpoints with Zod Validation ✅
- [x] /api/admin/login - adminLoginSchema
- [x] /api/admin/upload - fileUploadMetadataSchema (via validateUploadedFile)
- [x] /api/student/upload - fileUploadMetadataSchema (via validateUploadedFile)

### Endpoints Requiring Validation (TODO)
- [ ] /api/admin/events (POST) - eventCreateSchema
- [ ] /api/admin/events/[id] (PUT) - eventUpdateSchema
- [ ] /api/admin/users/[id] (PUT) - userFilterSchema
- [ ] /api/student/register (POST) - eventRegistrationSchema
- [ ] /api/student/profile (PUT) - studentProfileUpdateSchema
- [ ] /api/admin/cms/* - cmsPageSchema

**Priority**: HIGH - Implement validation in next sprint

---

## MONITORING & LOGGING

### Security Events to Log (NOT YET IMPLEMENTED)
1. Failed login attempts (track IP, email, timestamp)
2. Rate limit hits
3. Authorization failures (IDOR attempts)
4. File upload rejections
5. JWT validation failures
6. Suspicious activity patterns

**Recommended Tool**: Sentry, LogRocket, or Datadog  
**Cost**: Most have free tiers for small projects

---

## PENETRATION TESTING CHECKLIST

Before production launch, manually test:

### Authentication
- [ ] Brute force login with 10+ attempts (should hit rate limit)
- [ ] Login with SQL injection payloads: `' OR '1'='1`
- [ ] Login with expired JWT (capture token, wait for expiry, reuse)
- [ ] Login with forged JWT (change email claim, try to access)
- [ ] Login with malformed JWT (invalid signature, missing claims)

### Authorization (IDOR)
- [ ] Student A tries to access Student B's profile via ID manipulation
- [ ] Student tries to access /api/admin/* endpoints
- [ ] Admin tries to delete user without super_admin role
- [ ] Event manager tries to modify another manager's event

### XSS
- [ ] Submit event description with `<script>alert('XSS')</script>`
- [ ] Submit profile bio with `<img src=x onerror=alert('XSS')>`
- [ ] Submit legal page content with SVG containing `<script>`
- [ ] Check if sanitized content renders without executing

### File Upload
- [ ] Upload 100MB file (should reject)
- [ ] Upload .exe file renamed to .jpg (magic byte check should reject)
- [ ] Upload PHP file (should reject)
- [ ] Upload SVG with embedded `<script>` (should reject)
- [ ] Upload PDF with valid header + appended executable

### CORS
- [ ] Make API request from unauthorized origin (should get 403)
- [ ] Make preflight OPTIONS request from valid origin (should get 204)

---

**Last Updated**: [Security remediation sprint]  
**Next Review**: Before production deployment  
**Owner**: Security/DevOps team
