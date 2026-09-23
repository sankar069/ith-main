# InnoTech-Hub Login Guide

## 🔐 Admin Console Login

**URL:** `http://localhost:5173/admin/login`

**Credentials:**
- **Email:** `ithadmin@ith.com`
- **Password:** `admin@2026`

After successful login, you'll be taken to the Admin Dashboard at `/admin`

**Features:**
- Event management (create, edit, delete events)
- View event registrations
- User management
- CMS (coming soon)
- Admin settings (coming soon)

---

## 👨‍🎓 Student Dashboard Login

**URL:** `http://localhost:5173/login`

**How it works:**
- Enter any email address
- Enter any password (no validation)
- Click "Sign in"
- Redirected to `/dashboard`

**Role Detection:**
- If email contains "admin" → Admin role
- Otherwise → Student role

**Dashboard Features:**
- Overview tab with stats
- Event discovery and registration
- My events
- AI tools access
- Certificates, Projects
- Leaderboard, Billing

---

## 🏠 Home Page

**URL:** `http://localhost:5173/`

- Landing page with hero section
- Event discovery
- AI suite information
- Business model section
- Testimonials
- Contact section

---

## 📄 Legal Pages

- Privacy Policy: `http://localhost:5173/privacy-policy`
- Terms of Service: `http://localhost:5173/terms-of-service`
- Cookie Policy: `http://localhost:5173/cookie-policy`
- Accessibility: `http://localhost:5173/accessibility`

---

## 🌓 Dark/Light Mode Toggle

Available in the **user profile dropdown** (top-right corner of dashboard)

Moon 🌙 = Switch to Light Mode
Sun ☀️ = Switch to Dark Mode

Toggle persists across page refreshes (stored in localStorage)

---

## 📋 Environment Variables

File: `.env` (in root directory)

```env
ADMIN_JWT_SECRET=super-secret-key-for-jwt-signing-innotech-hub-2026-change-in-production
ADMIN_EMAIL=ithadmin@ith.com
ADMIN_PASSWORD=admin@2026
```

**Note:** In production (Vercel), set these in Project Settings → Environment Variables

---

## ✅ Quick Test Checklist

- [ ] Visit home page: `http://localhost:5173/`
- [ ] Admin login: `http://localhost:5173/admin/login` (use credentials above)
- [ ] Student login: `http://localhost:5173/login` (any email)
- [ ] Dashboard navigation (9 tabs)
- [ ] Dark/Light mode toggle in profile dropdown
- [ ] Legal pages all have logo
- [ ] No text overlaps on pages

---

