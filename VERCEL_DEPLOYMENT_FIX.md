# 🚀 Vercel Deployment Fix Guide

## ⚠️ Issue: Deployment Failed After Build

Your build **succeeded** ✅ but deployment **failed** ❌ at "Deploying outputs..."

This is almost always due to **missing environment variables** in Vercel.

---

## 🔧 Fix: Add Environment Variables

### **Step 1: Go to Vercel Dashboard**

1. Visit: https://vercel.com/dashboard
2. Find your project: `ith-main`
3. Click **Settings** → **Environment Variables**

### **Step 2: Add All Required Variables**

Add these **EXACT** variables (copy from your `.env` file):

```env
# Supabase Server-Side (CRITICAL - Required for API)
SUPABASE_URL=https://fblwlpkgvzqctjzwcmcx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZibHdscGtndnpxY3RqendjbWN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTczMDg2OSwiZXhwIjoyMTAxMzA2ODY5fQ.AxoJOlbEIchIwyrqE_VY2vCM00iTWNpa6NG_0lXrrSU

# Supabase Client-Side (Required for Student Auth)
VITE_SUPABASE_URL=https://fblwlpkgvzqctjzwcmcx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZibHdscGtndnpxY3RqendjbWN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3MzA4NjksImV4cCI6MjEwMTMwNjg2OX0._uspu8ebwZSs0pM98i5oA3FF8K6ZWGb64XbmkC25Jl4

# Admin Authentication (Required for Admin Login)
ADMIN_JWT_SECRET=super-secret-key-for-jwt-signing-innotech-hub-2026-change-in-production
ADMIN_EMAIL=ithadmin@ith.com
ADMIN_PASSWORD=admin@2026
```

### **Step 3: Set Environment for All**

⚠️ **IMPORTANT:** For each variable, make sure to check:
- ✅ **Production**
- ✅ **Preview**
- ✅ **Development**

This ensures the variables work in all environments.

### **Step 4: Redeploy**

After adding all variables:
1. Go to **Deployments** tab
2. Find the failed deployment
3. Click **•••** (three dots)
4. Click **Redeploy**

OR

Push a new commit:
```bash
git commit --allow-empty -m "trigger redeploy"
git push origin main
```

---

## 🎯 Quick Checklist

Before redeploying, verify:

- [ ] All 6 environment variables added
- [ ] All variables checked for Production, Preview, Development
- [ ] Supabase project is active (not paused)
- [ ] Environment variable values have no extra spaces
- [ ] VITE_ prefix variables are included (client-side)

---

## 🔍 Common Issues & Solutions

### **Issue 1: "Cannot read property of undefined"**
**Cause:** Missing environment variables  
**Fix:** Add all 6 variables listed above

### **Issue 2: "502 Bad Gateway" after deployment**
**Cause:** Supabase credentials wrong or project paused  
**Fix:** 
- Verify Supabase URL and keys
- Check Supabase project is active

### **Issue 3: "Build succeeded but deployment failed"**
**Cause:** Vercel can't create serverless functions without env vars  
**Fix:** Add environment variables and redeploy

### **Issue 4: Admin login doesn't work in production**
**Cause:** Missing ADMIN_JWT_SECRET  
**Fix:** Add ADMIN_JWT_SECRET to environment variables

---

## 📋 Environment Variable Format

When adding in Vercel Dashboard:

**Name:** (exact name, case-sensitive)
```
SUPABASE_URL
```

**Value:** (no quotes, just the value)
```
https://fblwlpkgvzqctjzwcmcx.supabase.co
```

**Environments:** Select all three
```
✅ Production
✅ Preview  
✅ Development
```

Click **Save** after each variable.

---

## 🚀 After Successful Deployment

Once deployed successfully, you'll get a URL like:
```
https://ith-main.vercel.app
```

Or your custom domain if configured.

### **Test These URLs:**

1. **Homepage:** https://your-domain.vercel.app
2. **API Health:** https://your-domain.vercel.app/api/health
3. **Events API:** https://your-domain.vercel.app/api/events
4. **Admin Login:** https://your-domain.vercel.app/admin/login
5. **Student Login:** https://your-domain.vercel.app/student/login

---

## 🔒 Security Note

⚠️ **After deployment, change these in production:**

1. **ADMIN_JWT_SECRET** - Generate new: `openssl rand -hex 32`
2. **ADMIN_PASSWORD** - Use strong password
3. Review Supabase RLS policies

---

## 📊 Deployment Logs

To see full deployment logs:
1. Go to Vercel Dashboard
2. Click on the failed deployment
3. Scroll to see complete error message
4. Look for:
   - "Missing environment variable"
   - "Cannot connect to database"
   - "401/403 authentication errors"

---

## ✅ Success Indicators

Your deployment is successful when you see:

```
✅ Build Completed
✅ Deploying outputs...
✅ Deployment ready
✅ Assigned to production
```

And you can access:
- ✅ Homepage loads
- ✅ API endpoints respond
- ✅ Admin/Student login works

---

## 🆘 Still Having Issues?

1. **Check build logs** for specific error
2. **Verify all environment variables** are correct
3. **Test Supabase connection** from Vercel Functions
4. **Check Vercel function logs** in dashboard
5. **Ensure database schema** is run in Supabase

---

## 📞 Next Steps

1. Add environment variables (most important!)
2. Redeploy
3. Test the deployed app
4. Run database seed scripts if needed
5. Update DNS/domain if using custom domain

---

**Once you add the environment variables and redeploy, your app should work perfectly! 🎉**

The build succeeded, so the code is fine. Just need those environment variables!
