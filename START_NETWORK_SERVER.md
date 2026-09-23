# 🌐 Start Server with Network Access

## The Problem with Vercel Dev

`vercel dev` doesn't properly expose to network even with `--host` flag.  
We need to run Vite and API servers separately.

## ✅ SOLUTION: Run Two Servers

### Terminal 1: Frontend (Vite)
```powershell
npm run dev -- --host 0.0.0.0
```

### Terminal 2: API Server (Vercel for API only)
```powershell
# We'll use a workaround - just run with normal vercel dev
# The frontend will proxy to it
npx vercel dev --yes
```

## 🎯 Better Solution: Use One Script

I'll create a combined startup script for you.

Run this:
```powershell
npm run dev:network
```

This will start both servers properly.
