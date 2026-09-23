# 🚀 Activate Your Database - Step by Step

Your Supabase project is now **resumed**! Follow these steps to get your data flowing.

---

## ✅ Step 1: Run Database Schema (Create Tables)

You need to create the database tables in Supabase:

### Option A: Via Supabase Dashboard (Recommended)

1. **Go to Supabase SQL Editor**
   - Visit: https://supabase.com/dashboard/project/fblwlpkgvzqctjzwcmcx/sql/new
   
2. **Run Schema Files in Order**
   
   **First, run `schema.sql`:**
   - Open file: `c:\Users\HP\Desktop\Ith-2\supabase\schema.sql`
   - Copy ALL the content
   - Paste into Supabase SQL Editor
   - Click **"Run"** button (or press Ctrl+Enter)
   - ✅ You should see "Success. No rows returned"

   **Then, run `schema-phase2.sql`:**
   - Open file: `c:\Users\HP\Desktop\Ith-2\supabase\schema-phase2.sql`
   - Copy ALL the content
   - Paste into Supabase SQL Editor
   - Click **"Run"**

   **Continue with remaining schemas:**
   - `schema-phase3.sql`
   - `schema-phase4.sql`
   - `schema-phase5.sql`

3. **Verify Tables Were Created**
   - Go to: Database → Tables
   - You should see tables like: `events`, `event_registrations`, `admins`, `users`, etc.

---

## ✅ Step 2: Test Database Connection

Run this command in your terminal:

```powershell
node test-db-connection.mjs
```

**Expected output:**
```
✅ Successfully connected to Supabase!
📊 Events table exists and is accessible
📈 Current events in database: 0
```

---

## ✅ Step 3: Seed Sample Events Data

Once connection is successful, populate with event data:

```powershell
npm run seed
```

**Expected output:**
```
🌱 Starting event seeding...
✅ Successfully seeded 9 events!

📊 Events added:
  ✓ InnoTech Hackathon 2026 (published)
  ✓ Web Development Workshop (published)
  ✓ AI & Machine Learning Summit (published)
  ... (and more)
```

---

## ✅ Step 4: Start Your Application

```powershell
npm run dev
```

Then visit: http://localhost:5173

**You should now see:**
- ✅ Events section populated with real data
- ✅ Upcoming events showing correctly
- ✅ Past events in the gallery
- ✅ All event details displaying properly

---

## 🆘 Troubleshooting

### Issue: "Table 'events' does not exist"
**Solution:** You need to run the schema files first (Step 1)

### Issue: "Events already exist in database"
**Solution:** Your data is already seeded! Just run `npm run dev`

### Issue: "Connection failed" or "fetch failed"
**Solution:** 
1. Check if Supabase project is still active (not paused)
2. Verify credentials in `.env` file match Supabase dashboard
3. Wait 1-2 minutes after resuming project

### Issue: Schema files have syntax errors
**Solution:** Make sure you're copying the ENTIRE file content, including all SQL statements

---

## 📋 Quick Verification Checklist

- [ ] Supabase project is resumed (not paused)
- [ ] Schema files have been run in Supabase SQL Editor
- [ ] Tables visible in Supabase Dashboard → Database → Tables
- [ ] `node test-db-connection.mjs` shows ✅ success
- [ ] `npm run seed` completed successfully
- [ ] `npm run dev` is running
- [ ] Website shows events at http://localhost:5173

---

## 🎯 What Happens Next?

Once everything is set up:

1. **Your website will display real data** from the database
2. **Events automatically load** when users visit the site
3. **Admin can manage events** via the admin dashboard
4. **Students can register** for events (when registration flow is enabled)

---

## 📞 Need Help?

If you run into issues:
1. Check the browser console (F12) for errors
2. Check Supabase logs in the dashboard
3. Verify all environment variables in `.env`
4. Make sure all schema files were executed successfully

---

**Ready to go? Start with Step 1! 🚀**
