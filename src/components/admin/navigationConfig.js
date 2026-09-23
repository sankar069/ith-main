import {
  LayoutDashboard,
  CalendarRange,
  Users,
  Newspaper,
  Settings,
} from 'lucide-react'

// Single source of truth for the admin sidebar. `status: 'soon'` items are
// still rendered (so the full information architecture is visible) but link
// to a "coming in a later phase" placeholder instead of a 404.
export const adminNavigation = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    path: '/admin',
    description: 'Command center summary',
    status: 'live',
  },
  {
    id: 'events',
    label: 'Event Management',
    icon: CalendarRange,
    path: '/admin/events',
    description: 'Master list, wizard & workspaces',
    status: 'live',
  },
  {
    id: 'users',
    label: 'Student & User Management',
    icon: Users,
    path: '/admin/users',
    description: 'Global directory & moderation',
    status: 'live',
  },
  {
    id: 'cms',
    label: 'Content & CMS',
    icon: Newspaper,
    path: '/admin/cms',
    description: 'Sponsors, media, roadmap, legal',
    status: 'live',
  },
  {
    id: 'settings',
    label: 'Admin Settings',
    icon: Settings,
    path: '/admin/settings',
    description: 'Profile, password, sub-admins',
    status: 'live',
  },
]
