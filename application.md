# Application Blueprint: InnoTech-Hub (Cozy/Sharyap Theme)

## 1. Core Concept
To build the **InnoTech-Hub** ecosystem (a student SaaS & event platform) but entirely styled with the cozy, personal, illustrative aesthetic of **sharyap.com**. We are replacing the heavy, dark "glassmorphism and racing gradients" with a friendly, minimalist, modal-heavy, and cute interface.

## 2. Design System & Aesthetics
- **Color Palette**: 
  - **Light Mode**: Off-white/cream backgrounds, soft pastel accents (pink, light blue, soft green), dark grey text.
  - **Dark Mode**: Soft dark grey/navy backgrounds, warm text colors, muted accent colors.
- **Typography**: 
  - Switch from sharp sans-serifs to friendly, rounded, or monospace fonts (e.g., `Courier New`, `Quicksand`, or a cute pixel font for headers).
- **UI Elements**:
  - **Buttons**: Flat drop shadows (`drop-shadow-flat`), rounded edges, scale-up on hover (`hover:scale-105`) instead of glowing borders.
  - **Modals (Dialogs)**: Instead of long scrolling pages, use standard window-like dialogs with a distinct header bar (like a retro OS window) for Event Details, Profiles, and Registrations.
  - **Icons**: Replace generic tech icons with custom hand-drawn, flat, or pixel-art style SVG/PNG icons.
  - **Mascot/Illustrations**: Incorporate a cute mascot (similar to "Froggert") that guides students through the SaaS workflow (e.g., a mascot holding a ticket for events).

## 3. Tech Stack
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS (customized with cozy design tokens)
- **State Management**: Zustand or React Context
- **Routing**: React Router DOM
- **Backend/BaaS**: Supabase or Firebase (for Auth, Event DB, and User Profiles)
- **Hosting**: Vercel

## 4. Component Mapping (Tech -> Cozy)
| InnoTech-Hub Feature | Original Tech Style | New Cozy Style (Sharyap Theme) |
| --- | --- | --- |
| **Hero Section** | Dark, glowing text, tech grid background. | Centered, friendly greeting ("welcome to innotech-hub!"), soft background, cute floating illustrations. |
| **Telemetry Dashboard** | Neon numbers, glassmorphism cards. | A cozy bulletin board style or sticky-note grid displaying stats. |
| **Event Cards** | Glowing borders, aggressive gradients. | Soft rounded rectangles, flat shadows, cute ticket icons. |
| **Navigation** | Sticky glassmorphism header. | Minimalist icon grid (like desktop icons) that open modals when clicked. |
| **Student Dashboard** | Complex tech UI, charts. | A "notebook" or "journal" interface showing skills gained and certificates. |

## 5. Directory Structure
```text
src/
├── assets/          
│   ├── icons/       # Hand-drawn icons (about, work, links)
│   └── theme/       # Light/dark mode toggle images
├── components/      
│   ├── CozyModal/   # Reusable modal with retro/cute header
│   ├── DesktopIcon/ # Icon button that scales on hover (for navigation)
│   ├── EventTicket/ # Event display component
│   └── Mascot/      # Mascot animations/interactions
├── pages/
│   ├── Home.jsx     # Main desktop-like view (Icon Grid)
│   └── Dashboard.jsx# Student growth journal
├── styles/
│   └── index.css    # Tailwind entry + custom flat shadows
└── App.jsx
```

## 6. Implementation Workflow

### Step 1: Base Setup & Theming
- Initialize Tailwind CSS with custom colors for Light/Dark themes.
- Add custom utility classes for `drop-shadow-flat` and animations (`animate-bobbing`, `hover:scale-105`).
- Set up the global layout with the Light/Dark mode toggle button.

### Step 2: The "Desktop" Navigation
- Instead of a traditional top navbar, build a centered grid of "Desktop Icons" (e.g., Events, Dashboard, About, Login) mimicking a personal desktop.
- Implement the `<dialog>` HTML element for the cozy modal system. Clicking an icon opens its respective modal over the desktop.

### Step 3: Event Discovery & Registration
- Build the `Events` modal.
- List events as cute, clickable tickets.
- Add soft, rounded forms inside the modal for event registration.

### Step 4: Student Dashboard (The Journal)
- Build the `Dashboard` modal.
- Display "Registered Events" and "Certificates" using a scrap-book or journal aesthetic.
- Integrate backend logic to fetch the student's real data.

### Step 5: Polish & Mascot Integration
- Add an interactive mascot that sits at the bottom of the screen (similar to Froggert).
- Ensure all hover states feel tactile, bouncy, and responsive.
