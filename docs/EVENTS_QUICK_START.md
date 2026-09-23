# 🚀 Events Database - Quick Start

## ✨ What Just Happened

Your InnoTech Hub website now **automatically fetches events from a live database**. No more hardcoded event data!

## 🎯 What's Working

✅ Upcoming events show on homepage
✅ Past events showcase
✅ Event detail pages  
✅ 8 sample events already loaded
✅ Error handling and loading states

## 🏃 Quick Test

### Local
```bash
npm run dev
# Visit http://localhost:5173/events
# You should see upcoming and past events!
```

### Production
Just push to main - events automatically fetch from Supabase.

## 📝 Add New Events

### Quick Way (SQL)
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Open SQL Editor
3. Paste:

```sql
INSERT INTO public.events (
  name, slug, category, description, status,
  start_date, end_date, registration_deadline,
  venue_type, venue_address, banner_url, gallery_urls,
  prize_pool, payment_required
) VALUES (
  'Your Event Name',
  'your-event-slug',
  'workshop',
  'Event description here',
  'published',
  '2026-05-20T10:00:00Z',
  '2026-05-20T14:00:00Z',
  '2026-05-18T23:59:59Z',
  'offline',
  'Event Address',
  '/image.jpg',
  ARRAY['/photo.jpg'],
  0,
  false
);
```

4. Run → Event appears on website instantly!

## 📋 Event Types

```javascript
category: 'hackathon' | 'workshop' | 'seminar' | 'competition' | 'festival' | 'conference'
venue_type: 'online' | 'offline' | 'hybrid'
status: 'draft' | 'published' | 'completed'
```

## 🔑 Key Details

### For Upcoming Events to Show
- ✅ `status` = `'published'`
- ✅ `start_date` in the future

### For Past Events to Show
- ✅ `status` = `'completed'`
- ✅ `start_date` in the past

## 📍 Event Data Fields

| Field | Type | Example |
|-------|------|---------|
| name | text | InnoTech Hackathon |
| slug | text | innotech-hackathon-2026 |
| category | text | hackathon |
| description | text | 24-hour innovation... |
| status | text | published |
| start_date | timestamp | 2026-03-15T09:00:00Z |
| end_date | timestamp | 2026-03-16T09:00:00Z |
| venue_type | text | offline |
| venue_address | text | St. Peters Campus |
| banner_url | text | /banner.jpg |
| gallery_urls | array | ['/img1.jpg', '/img2.jpg'] |
| prize_pool | number | 100000 |
| payment_required | boolean | false |
| payment_amount | number | 299 |

## 🎨 Customization

### Change Event Display
- Edit `src/components/UpcomingEventsSection.jsx`
- Edit `src/components/PastEventsSection.jsx`

### Change Event Sort
- Edit `api/events/index.js`
- Modify: `.order('start_date', { ascending: true })`

### Add Filters
- Edit event fetching to filter by category
- Add `category` param to API

## 🔗 Important Files

```
h:/Ith-2/
├── api/
│   └── events/
│       ├── index.js          ← API endpoint
│       └── [slug].js         ← Single event API
├── src/components/
│   ├── UpcomingEventsSection.jsx    ← Shows upcoming
│   ├── PastEventsSection.jsx        ← Shows past
│   └── EventCard.jsx                ← Individual card
├── scripts/
│   └── seed-events.mjs       ← Seed sample data
└── DATABASE_INTEGRATION.md   ← Full docs
```

## 🆘 Not Seeing Events?

```bash
# Test the API
curl http://localhost:5173/api/events

# Check browser console (F12)
# Error might show what's wrong
```

**Quick Checklist:**
- [ ] Events exist in Supabase? (Dashboard → events table)
- [ ] Event status is 'published'? (for upcoming)
- [ ] Start date is in future? (for upcoming)
- [ ] No JavaScript errors in console?

## 📚 Full Documentation

See:
- `DATABASE_INTEGRATION.md` - Complete setup guide
- `DATABASE_SETUP.md` - Detailed troubleshooting

## 🎉 You're Done!

Events are now live from your database. As you add events in Supabase, they instantly appear on your website!

---

**Questions?** Check the docs or test the API endpoint directly.
