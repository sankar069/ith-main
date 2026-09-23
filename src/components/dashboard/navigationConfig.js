import {
  LayoutDashboard,
  Calendar,
  BookMarked,
  FileText,
  Cpu,
  Award,
  Briefcase,
  CreditCard,
  Settings,
} from 'lucide-react'

export const dashboardNavigation = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    description: 'Innovation Passport & Analytics',
  },
  {
    id: 'explore-events',
    label: 'Explore Events',
    icon: Calendar,
    description: 'Discover & Register',
  },
  {
    id: 'my-events',
    label: 'My Events',
    icon: BookMarked,
    description: 'Registered & Attended',
  },
  {
    id: 'requirements',
    label: 'Requirements',
    icon: FileText,
    description: 'Event Guidelines & Rules',
  },
  {
    id: 'ai-tools',
    label: 'AI Suite',
    icon: Cpu,
    description: 'Growth Engine Tools',
  },
  {
    id: 'certificates',
    label: 'Certificates',
    icon: Award,
    description: 'Certificate Vault',
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: Briefcase,
    description: 'Project Showcase',
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: CreditCard,
    description: 'Payments & Invoices',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    description: 'Account & Preferences',
  },
]

// Sidebar sections for organization
export const sidebarSections = [
  {
    title: 'Main',
    items: ['overview'],
  },
  {
    title: 'Platform',
    items: ['explore-events', 'my-events', 'requirements'],
  },
  {
    title: 'Growth',
    items: ['ai-tools', 'certificates', 'projects'],
  },
  {
    title: 'Account',
    items: ['billing', 'settings'],
  },
]
