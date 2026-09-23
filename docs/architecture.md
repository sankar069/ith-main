# Architecture Analysis & Setup

## 1. Previous Architecture (sharyap.com)
- **Frontend Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (Next.js serverless/SSG)
- **Languages**: HTML, CSS, JavaScript
- **Key Features**: Static portfolio content, Modals, Light/Dark mode toggles, Image optimization.
- **Backend Setup**: Minimal to none. Likely static site generation (SSG) with no dedicated database, using static JSON or hardcoded data for portfolio items.

## 2. New Architecture (innotech-hub-ith.vercel.app)
- **Frontend Framework**: React (built with Vite)
- **Styling**: Tailwind CSS, CSS Variables (for themes), Custom animations (glassmorphism, gradients).
- **Languages**: HTML, CSS, JavaScript/TypeScript.
- **Deployment**: Vercel.
- **Backend Setup (SaaS Ecosystem)**:
  - **Authentication**: JWT-based or managed Auth (Firebase/Supabase/Clerk) for student login/signup.
  - **Database**: Relational (PostgreSQL) or NoSQL (MongoDB/Firestore) to handle user profiles, event registrations, projects, and certificates.
  - **AI Integration**: AI idea generator and resume analyzer likely powered by OpenAI API or Gemini API via serverless edge functions.
  - **Hosting/Infrastructure**: Vercel Serverless Functions / Edge Functions for API routes.
