# 🔴 CRITICAL SECURITY ALERT

## Exposed Credentials Requiring IMMEDIATE Rotation

The `.env` file containing production secrets was previously committed to git history.

### **ACTIONS REQUIRED IMMEDIATELY:**

#### 1. Rotate Supabase Service Role Key
1. Go to Supabase Dashboard → Settings → API
2. Click "Reset service_role secret key"
3. Update the new key in Vercel environment variables
4. **DO NOT** commit the new key to git

#### 2. Rotate JWT Secret
1. Generate new secret:
   ```bash
   openssl rand -hex 64
   ```
2. Update `ADMIN_JWT_SECRET` in Vercel environment variables
3. All admin sessions will be invalidated (expected)

#### 3. Change Admin Password
1. Log into admin console
2. Go to Settings → Change Password
3. Set a strong, unique password

#### 4. Clean Git History
```bash
# Remove .env from all git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env .env.local" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (WARNING: requires team coordination)
git push origin --force --all
git push origin --force --tags
```

#### 5. Verify .gitignore
Ensure `.env` and all variants are in `.gitignore`

#### 6. Enable Secret Scanning
- GitHub: Enable Secret Scanning in repository settings
- Use GitGuardian or similar for additional protection

### **Credentials Exposed (Historical):**
- ✅ Supabase Service Role Key
- ✅ JWT Signing Secret  
- ✅ Admin Email/Password
- ✅ Database URL

### **Severity:** CRITICAL
### **Impact:** Full database compromise, authentication bypass
### **Status:** **REQUIRES MANUAL INTERVENTION**

---

**Last Updated:** $(date)
**Audit Phase:** 3 - Final Security Hardening
