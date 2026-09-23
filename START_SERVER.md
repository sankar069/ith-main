# 🚀 How to Start Your InnoTech Hub Server Properly

## ⚠️ IMPORTANT: The Issue

You were running **`npm run dev`** which only starts the Vite frontend.  
The `/api` routes (serverless functions) **DO NOT WORK** with `npm run dev`.

That's why you see "Unable to load events" - the API calls are failing with 502 errors!

---

## ✅ SOLUTION: Use `vercel dev` Instead

### Step 1: Stop any running servers

If you have a server running, press **Ctrl+C** in the terminal to stop it.

### Step 2: Start with Vercel CLI

Run this command in your terminal:

```powershell
npx vercel dev
```

### Step 3: Wait for it to start

You'll see output like:

```
Vercel CLI 58.5.1
> Ready! Available at http://localhost:3000
```

### Step 4: Open your browser

Visit: **http://localhost:3000** (Note: port 3000, not 5173!)

---

## 🎯 What's the Difference?

| Command | Frontend | API Routes | Result |
|---------|----------|------------|--------|
| `npm run dev` | ✅ Works | ❌ 502 Error | Events don't load |
| `npx vercel dev` | ✅ Works | ✅ Works | Everything works! |

---

## 🔍 How Vercel Dev Works

`vercel dev` does three things:

1. **Starts Vite** (your React frontend on port 5173)
2. **Starts API functions** (your /api routes on port 3001)  
3. **Proxies everything** (serves both on port 3000)

So when your frontend calls `/api/events`, Vercel Dev forwards it to the serverless function properly!

---

## 📋 Quick Start Checklist

- [ ] Stop any running servers (Ctrl+C)
- [ ] Run: `npx vercel dev`
- [ ] Wait for "Ready! Available at..."
- [ ] Open: http://localhost:3000
- [ ] See your events load! 🎉

---

## 🆘 Troubleshooting

### "Vercel not found"
Run: `npm install vercel` then try again

### "Port already in use"
Another process is using port 3000. Either:
- Stop the other process
- Or Vercel will ask you to use a different port

### Still getting errors?
Check the terminal output - Vercel will show API errors clearly

---

## 💡 Pro Tip: Add to package.json

For convenience, you can add this to your `package.json` scripts:

```json
"scripts": {
  "dev": "vite",
  "dev:full": "vercel dev",
  ...
}
```

Then run: `npm run dev:full`

---

**Ready? Run `npx vercel dev` now!** 🚀
