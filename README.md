# InnoTech-Hub - Student Innovation & Events Platform

## 🚨 CRITICAL SECURITY NOTICE

**⚠️ THIS APPLICATION IS NOT PRODUCTION READY ⚠️**

Critical security vulnerabilities have been identified. See [README_SECURITY.md](./docs/README_SECURITY.md) for details.

**DO NOT DEPLOY TO PRODUCTION** until security issues are resolved.

**Immediate Action Required:** [SECURITY_IMMEDIATE_ACTIONS.md](./docs/SECURITY_IMMEDIATE_ACTIONS.md)

---

## About InnoTech-Hub

InnoTech-Hub is a comprehensive student innovation platform that connects students with hackathons, workshops, and tech events. Build projects, earn certificates, and grow your skills.

### Features

- 🎯 Event Management System
- 👥 Student Dashboard
- 🏆 Certificate Management
- 📊 Project Tracking
- 👨‍💼 Admin Console
- 🎨 Cozy, Student-Friendly UI

---

## 🔒 Security Status

**Security Score:** 10/100 (FAIL)  
**Status:** 🔴 NOT PRODUCTION READY

**Critical Issues:**
- Exposed production secrets
- No CORS restrictions
- No rate limiting
- XSS vulnerabilities
- No CSRF protection

**See:** [README_SECURITY.md](./docs/README_SECURITY.md) for complete security documentation.

---

## Tech Stack

- **Frontend:** React 19 + Vite
- **Styling:** Tailwind CSS
- **Backend:** Vercel Serverless Functions
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth + Custom JWT
- **State:** Zustand

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/innotech-hub.git
cd innotech-hub

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure environment variables (see below)
# Edit .env with your credentials
```

### Environment Variables

Create `.env` file with:

```bash
# Supabase (Server-side)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Supabase (Client-side)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Admin Authentication
ADMIN_JWT_SECRET=generate_with_openssl_rand_hex_64
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_strong_password
```

**⚠️ NEVER commit .env to git!**

### Database Setup

```bash
# Run database migrations in Supabase SQL Editor:
# 1. supabase/schema.sql
# 2. supabase/schema-phase2.sql
# 3. supabase/schema-phase3.sql
# 4. supabase/schema-phase4.sql
# 5. supabase/schema-phase5.sql
```

### Development

```bash
# Start development server
npm run dev

# Application runs on http://localhost:5173
```

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📚 Documentation

**[View All Documentation →](./docs/README.md)**

**Quick Links:**
- **Security:** [README_SECURITY.md](./docs/README_SECURITY.md)
- **Database:** [DATABASE_SETUP.md](./docs/DATABASE_SETUP.md)
- **Admin Setup:** [ADMIN_SETUP.md](./docs/ADMIN_SETUP.md)
- **Deployment:** [DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md)
- **Final Score:** [FINAL_SCORE_93.md](./docs/FINAL_SCORE_93.md) - 93/100 ✅

---

## 🔐 Security

**IMPORTANT:** This application has known security vulnerabilities.

Before any deployment:
1. Read [SECURITY_IMMEDIATE_ACTIONS.md](./docs/SECURITY_IMMEDIATE_ACTIONS.md)
2. Rotate all credentials
3. Fix critical vulnerabilities
4. Perform security testing
5. Get third-party security audit

---

## 🤝 Contributing

1. Read security guidelines
2. Never commit secrets
3. Follow code review process
4. Write security tests
5. Document security considerations

---

## 📜 License

[Add your license here]

---

## 🆘 Support

- **Security Issues:** [security@innotech-hub.com]
- **Bug Reports:** [GitHub Issues]
- **Documentation:** [Wiki]

---

## ⚠️ Disclaimer

This application contains known security vulnerabilities and is NOT suitable for production use without significant security hardening. Use at your own risk.
