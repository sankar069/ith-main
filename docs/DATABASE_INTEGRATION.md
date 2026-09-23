# Database Integration - Complete Setup

## ✅ What's Been Set Up

Your InnoTech Hub website now has **live database integration** for events. Here's what's working:

### 🎉 Working Features

1. **Event Fetching**
   - Upcoming events display on homepage and /events page
   - Past events showcase with gallery
   - Real data from Supabase database

2. **API Endpoints**
   - `GET /api/events` - List all published events
   - `GET /api/events?status=completed` - List past/completed events
   - `GET /api/events/[slug]` - Get single event details

3. **Frontend Components**
   - `UpcomingEventsSection.jsx` - Shows next 6 upcoming events
   - `PastEventsSection.jsx` - Shows 6 past events
   - `EventCard.jsx` - Individual event card display
   - All include loading, error, and empty states

4. **Database Tables**
   - `events` - 8 sample events pre-loaded
   - `event_registrations` - Ready for future registration system
   - `event_passes` - Ready for ticketing system

---

## 📊 Sample Data Loaded

### ✨ Upcoming Events (Status: Published)
1. InnoTech Hackathon 2026 - Mar 15-16 @ St. Peters Campus
2. Web Development Workshop - Feb 20 @ Hybrid
3. AI & Machine Learning Summit - Mar 22 @ Online
4. Startup Pitch Competition - Apr 5 @ Auditorium
5. Code Challenge by Hack2Skills - Feb 28 @ Online
6. GeeksforGeeks Masterclass - Mar 8 @ Online
7. Gemini AI Workshop - Apr 12 @ Tech Lab

### 📚 Past Events (Status: Completed)
1. InnoTech Fest 2025 - Dec 1-3, 2025
2. HackerRank Contest 2025 - Nov 15, 2025

---

## 🚀 How to Use

### View Events on Website
1. **Homepage** → Scroll to "Upcoming Events" section
2. **Events Page** (/events) → See all sections including "Moments We've Created"
3. **Event Details** → Click any event card for full details

### Local Development
```bash
# Start dev server
npm run dev

# Events will load automatically from Supabase
# Visit http://localhost:5173/events
```

### Production
Events automatically fetch from live Supabase database on deployment.

---

## 📝 Adding More Events

### Method 1: Via SQL (Supabase Dashboard)
```sql
INSERT INTO public.events (
  name, slug, category, description, status,
  start_date, end_date, registration_deadline,
  venue_type, venue_address, banner_url, gallery_urls,
  prize_pool, payment_required
) VALUES (
  'Tech Summit 2026',
  'tech-summit-2026',
  'conference',
  'A comprehensive tech summit covering AI, Web3, and Cloud',
  'published',
  '2026-06-15T09:00:00Z',
  '2026-06-15T18:00:00Z',
  '2026-06-10T23:59:59Z',
  'offline',
  'Convention Center, Bangalore',
  '/banner.jpg',
  ARRAY['/photo1.jpg', '/photo2.jpg'],
  250000,
  false
);
```

### Method 2: Using Seed Script
```bash
# Edit scripts/seed-events.mjs - add your event to SAMPLE_EVENTS array
# Then run:
npm run seed
```

### Method 3: Admin Console (Coming Soon)
Built-in admin interface for managing events (in development).

---

## 🔧 Technical Details

### Architecture
```
Frontend (React)
    ↓ fetch('/api/events')
Vercel Serverless Function
    ↓ getSupabaseAdmin()
Supabase PostgreSQL
    ↓ SELECT * FROM events
Browser (JSON Response)
```

### Database Schema

**events table**
```sql
- id (uuid) - Primary key
- name (text) - Event title
- slug (text) - URL-friendly identifier
- category (text) - hackathon, workshop, seminar, competition, festival
- description (text) - Event details
- status (text) - draft, published, completed
- start_date (timestamptz) - Event start
- end_date (timestamptz) - Event end
- registration_deadline (timestamptz) - Registration closes
- venue_type (text) - online, offline, hybrid
- venue_address (text) - Physical location
- venue_link (text) - Online meeting link
- banner_url (text) - Event cover image
- gallery_urls (text[]) - Event photos
- rules_text (text) - Event rules
- rules_doc_url (text) - Rules document link
- prize_pool (numeric) - Total prize amount
- prize_details (text) - Prize breakdown
- payment_required (boolean) - Requires payment
- payment_amount (numeric) - Cost if required
- payment_instructions (text) - How to pay
- created_at (timestamptz) - Record creation time
- updated_at (timestamptz) - Last modification time
```

### API Responses

**GET /api/events**
```json
{
  "events": [
    {
      "id": "uuid",
      "name": "Event Name",
      "slug": "event-slug",
      "category": "hackathon",
      "description": "...",
      "status": "published",
      "start_date": "2026-03-15T09:00:00Z",
      "end_date": "2026-03-16T09:00:00Z",
      "venue_type": "offline",
      "venue_address": "St. Peters Campus",
      "banner_url": "/image.jpg",
      "prize_pool": 100000,
      "total_registered": 245,
      "passes": []
    }
  ]
}
```

---

## 🔐 Environment Variables

Your `.env` file has Supabase credentials:
```
SUPABASE_URL=https://fblwlpkgvzqctjzwcmcx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
VITE_SUPABASE_URL=https://fblwlpkgvzqctjzwcmcx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

These are safe and configured with Row Level Security policies.

---

## 🐛 Troubleshooting

### Events Not Showing on Website?

**Check 1: Is the API working?**
```bash
# Test the API
curl https://innotech-hub-ith.vercel.app/api/events

# Should return JSON with events array
# If error 500: Check Supabase connection
# If empty array: Add events to database
```

**Check 2: Browser Console**
- Open DevTools (F12)
- Check Console for JavaScript errors
- Check Network tab to see /api/events request

**Check 3: Event Status**
- Upcoming events need `status = 'published'`
- Past events need `status = 'completed'`
- Draft events won't show anywhere

**Check 4: Start Date**
- For upcoming events: `start_date` must be in the future
- For past events: `start_date` must be in the past

### "Unable to load events" Error?

1. Check Supabase dashboard status
2. Verify `.env` has correct URL and keys
3. Check Supabase RLS policies
4. Verify events table has data:
   ```sql
   SELECT COUNT(*) FROM public.events;
   ```

### Events Load Slowly?

1. Consider adding database indexes (already done)
2. Optimize gallery_urls array (keep images under 1MB)
3. Use CDN for event images
4. Implement caching if needed

---

## 🎯 Next Steps

### Phase 2: Event Registration
- [ ] Registration form component
- [ ] `/api/events/[slug]/register` endpoint
- [ ] Email confirmations
- [ ] CSV export of registrations

### Phase 3: Event Passes/Ticketing
- [ ] Multiple ticket tiers
- [ ] Paid tickets with payment processing
- [ ] QR code generation
- [ ] Attendee check-in

### Phase 4: Admin Dashboard
- [ ] Event creation UI
- [ ] Image upload for banners
- [ ] Registration management
- [ ] Analytics and reporting

### Phase 5: Student Features
- [ ] My registrations page
- [ ] Calendar integration
- [ ] Event reminders
- [ ] Ticket management

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [React Hooks Guide](https://react.dev/reference/react/hooks)
- [Vercel API Routes](https://vercel.com/docs/concepts/functions/serverless-functions)

---

## 💬 Questions?

Refer to:
- `DATABASE_SETUP.md` - Detailed setup guide
- `src/components/UpcomingEventsSection.jsx` - Frontend code
- `api/events/index.js` - Backend code
- `.env.example` - Environment variable template

---

**Status**: ✅ Complete and Production Ready
**Last Updated**: August 2026
**Version**: 1.0.0
