# Database Setup Guide - InnoTech Hub

## Overview

Your InnoTech Hub website now has a fully functional database integration using **Supabase PostgreSQL**. Events are automatically fetched from the database and displayed on the website.

## What's Connected

### Frontend Components
- **Upcoming Events Section** (`src/components/UpcomingEventsSection.jsx`)
  - Fetches from `/api/events?status=published`
  - Shows next 6 upcoming events
  - Includes loading states and error handling
  
- **Past Events Section** (`src/components/PastEventsSection.jsx`)
  - Fetches from `/api/events?status=completed`
  - Shows last 6 past events
  - Gallery view with media support

### Backend API
- **GET `/api/events`** - List all published events
  - Query param: `?status=completed` for past events
  - Returns: Array of events with details and pass information
  
- **GET `/api/events/[slug]`** - Get single event details
  - Used by the event detail page
  - Returns: Full event details including passes, registrations count

### Database Tables
- **events** - Main event data
  - Core fields: name, slug, category, description
  - Scheduling: start_date, end_date, registration_deadline
  - Venue: venue_type (online/offline/hybrid), venue_address, venue_link
  - Media: banner_url, gallery_urls
  - Prizes: prize_pool, prize_details
  - Payment: payment_required, payment_amount, payment_instructions
  - Status: draft, published, completed

- **event_registrations** - Student registrations (ready for future implementation)
  - Tracks: student info, payment status, registration date

## Current Data

The database has been pre-populated with 8 sample events:

### Upcoming Events (Published)
1. **InnoTech Hackathon 2026** - March 15-16, Offline
2. **Web Development Workshop** - Feb 20, Hybrid  
3. **AI & Machine Learning Summit** - March 22, Online
4. **Startup Pitch Competition** - April 5, Offline
5. **Code Challenge by Hack2Skills** - Feb 28, Online
6. **GeeksforGeeks Masterclass** - March 8, Online
7. **Gemini AI Workshop** - April 12, Hybrid

### Past Events (Completed)
1. **InnoTech Fest 2025** - Dec 1-3, 2025
2. **HackerRank Contest 2025** - Nov 15, 2025

## How It Works

### Request Flow
```
Website Page
    ↓
React Component (useEffect)
    ↓
fetch('/api/events')
    ↓
Vercel Serverless Function (/api/events/index.js)
    ↓
Supabase PostgreSQL
    ↓
Return Events (JSON)
    ↓
Update Component State
    ↓
Render Events UI
```

### Key Features Implemented

✅ **Loading States** - Shows skeleton loaders while fetching
✅ **Error Handling** - Displays error messages with retry buttons
✅ **Empty States** - Shows messages when no events exist
✅ **Responsive Design** - Works on mobile, tablet, desktop
✅ **Real-time Updates** - Picks up database changes automatically
✅ **Filtering** - Separates upcoming (published) from past (completed)
✅ **Sorting** - Events sorted by start_date (nearest first)

## Adding New Events

### Option 1: Using the Admin Console (Recommended)
Coming soon - Admin interface for managing events.

### Option 2: Direct Database
1. Go to Supabase Dashboard
2. Navigate to SQL Editor
3. Run:
```sql
INSERT INTO public.events (
  name, slug, category, description, status,
  start_date, end_date, registration_deadline,
  venue_type, venue_address, venue_link,
  banner_url, gallery_urls,
  prize_pool, prize_details,
  payment_required, payment_amount
) VALUES (
  'My Event', 'my-event', 'workshop', 'Event description', 'published',
  '2026-05-01T10:00:00Z', '2026-05-01T14:00:00Z', '2026-04-28T23:59:59Z',
  'offline', 'Venue Address', NULL,
  '/banner.jpg', ARRAY['/img1.jpg', '/img2.jpg'],
  0, NULL,
  FALSE, NULL
);
```

### Option 3: Re-seed All Data
To reset events to sample data:
```bash
# Edit scripts/seed-events.mjs to modify sample events
# Then delete all events from Supabase and run:
node scripts/seed-events.mjs
```

## Managing Event Status

Events can have three statuses:

- **draft** - Not visible anywhere (admin-only in future)
- **published** - Shows in "Upcoming Events" section
- **completed** - Shows in "Past Events" section (historical)

To publish an event:
```sql
UPDATE public.events 
SET status = 'published' 
WHERE slug = 'event-slug';
```

To mark as past:
```sql
UPDATE public.events 
SET status = 'completed' 
WHERE slug = 'event-slug';
```

## Environment Variables

Your Supabase credentials are in `.env`:

```
SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-key
VITE_SUPABASE_URL=same-as-above
VITE_SUPABASE_ANON_KEY=your-anon-key
```

⚠️ **Important**: Never commit `.env` to Git. It's already in `.gitignore`.

## Testing

### Local Testing
1. Start dev server: `npm run dev`
2. Visit `/events` page
3. Should see upcoming and past events loading

### Verify API
```bash
# Check upcoming events
curl https://innotech-hub-ith.vercel.app/api/events

# Check past events  
curl https://innotech-hub-ith.vercel.app/api/events?status=completed

# Check single event
curl https://innotech-hub-ith.vercel.app/api/events/innotech-hackathon-2026
```

## Troubleshooting

### Events Not Showing?

1. **Check API Response**
   ```bash
   curl http://localhost:5173/api/events
   # Should see JSON with events array
   ```

2. **Check Browser Console**
   - Open DevTools (F12)
   - Check Console tab for errors
   - Check Network tab to see fetch request

3. **Verify Supabase Connection**
   - Check .env has correct URL and keys
   - Visit Supabase dashboard to confirm data exists

4. **Check Event Status**
   ```sql
   SELECT name, status, start_date FROM public.events;
   ```
   - Upcoming events must have status='published'
   - Past events must have status='completed'

## Next Steps

### Implement Event Registration
1. Create registration form component
2. Add `/api/events/[slug]/register` endpoint
3. Store registrations in event_registrations table
4. Send confirmation emails

### Admin Event Management
1. Create admin event editor
2. Image upload for banners/gallery
3. Ticket tier management (event_passes table)
4. Registration CSV export

### Student Features
1. Event registration page
2. My registrations dashboard view
3. Calendar integration
4. Email reminders

## Support

For issues or questions:
- Check Supabase logs in dashboard
- Review API error responses
- Check component console output
- Verify environment variables are set

---

**Last Updated**: August 2026
**Version**: 1.0.0 - Event Fetching Complete
