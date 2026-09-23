# 🌐 Network Access Guide - Access from Other Devices

## ✅ Server is Now Exposed on Network!

Your InnoTech Hub website is now accessible from any device on your local network.

---

## 📱 Access URLs

### **From Other Devices on Same Network:**

#### **Wi-Fi Network Access:**
```
http://10.24.10.99:3000
```

#### **Ethernet Network Access:**
```
http://14.14.28.248:3000
```

#### **From This Laptop (Local):**
```
http://localhost:3000
```

---

## 🎯 Which IP to Use?

**Use the IP that matches your network connection:**

| Your Device Connected To | Use This URL |
|-------------------------|--------------|
| **Same Wi-Fi** (10.24.x.x) | `http://10.24.10.99:3000` |
| **Same Ethernet** (14.14.x.x) | `http://14.14.28.248:3000` |
| **This laptop** | `http://localhost:3000` |

💡 **Most common:** If your phone/tablet is on Wi-Fi, use **http://10.24.10.99:3000**

---

## 📲 How to Access from Mobile/Tablet:

### **Step 1: Check Connection**
Make sure your mobile device is connected to the **same Wi-Fi network** as your laptop.

### **Step 2: Open Browser**
Open any browser (Chrome, Safari, Firefox) on your device.

### **Step 3: Enter URL**
Type: **http://10.24.10.99:3000**

### **Step 4: Explore!**
✅ You should see the InnoTech Hub homepage!

---

## 🔐 Login Credentials (For Demo)

### **Admin Dashboard:**
- URL: `http://10.24.10.99:3000/admin/login`
- Email: `ithadmin@ith.com`
- Password: `admin@2026`

### **Student Dashboard:**
- URL: `http://10.24.10.99:3000/student/login`
- Email: `demo.student@innotechhub.com`
- Password: `Demo@2026`

---

## 🔥 What's Working:

✅ Full website accessible on network  
✅ All API endpoints working  
✅ Database connected  
✅ Admin login functional  
✅ Student login functional  
✅ Events loading properly  
✅ All pages accessible  

---

## 🆘 Troubleshooting

### **Can't connect from another device?**

1. **Check Network Connection:**
   - Both devices must be on the **same network**
   - Check Wi-Fi name/SSID on both devices

2. **Try Alternative IP:**
   - If Wi-Fi IP doesn't work, try Ethernet IP
   - Wi-Fi: `http://10.24.10.99:3000`
   - Ethernet: `http://14.14.28.248:3000`

3. **Check Windows Firewall:**
   ```powershell
   # Run as Administrator
   netsh advfirewall firewall add rule name="Node.js Server" dir=in action=allow protocol=TCP localport=3000
   ```

4. **Restart Server:**
   - Stop current server (Ctrl+C)
   - Run: `npx vercel dev --yes`

5. **Verify Server is Running:**
   - On your laptop, visit: `http://localhost:3000`
   - Should work fine

---

## 🔍 Testing Connection

### **From Another Device:**

**Test 1: Health Check**
```
http://10.24.10.99:3000/api/health
```
Should return: `{"status":"ok"}`

**Test 2: Events API**
```
http://10.24.10.99:3000/api/events
```
Should return JSON with events

**Test 3: Homepage**
```
http://10.24.10.99:3000
```
Should load the full website

---

## 📊 Server Information

| Property | Value |
|----------|-------|
| **Server** | Vercel Dev |
| **Port** | 3000 |
| **Host** | 0.0.0.0 (All interfaces) |
| **Local IP (Wi-Fi)** | 10.24.10.99 |
| **Local IP (Ethernet)** | 14.14.28.248 |
| **Status** | 🟢 Running |
| **Database** | 🟢 Connected |

---

## 💡 Pro Tips

1. **QR Code:**
   - Generate QR code for `http://10.24.10.99:3000`
   - Scan from mobile for quick access

2. **Bookmark:**
   - Save the URL on your mobile browser
   - Quick access for demos

3. **Share:**
   - Anyone on your network can access
   - Great for team demos/testing

4. **Keep Laptop Awake:**
   - Don't let laptop sleep
   - Server will stop if laptop sleeps

5. **Development Only:**
   - This is for local testing only
   - For production, deploy to Vercel

---

## 🎉 Ready to Demo!

Your website is now accessible from:
- ✅ Your laptop
- ✅ Phones on same Wi-Fi
- ✅ Tablets on same network
- ✅ Other computers on same network

**Just share the URL:** `http://10.24.10.99:3000` 🚀

---

## 🛑 To Stop the Server

Press **Ctrl+C** in the terminal where `vercel dev` is running.

---

**Last Updated:** Now  
**Server Status:** 🟢 Running on http://10.24.10.99:3000
