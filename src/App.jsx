import React, { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAppStore } from './store/useAppStore'

// Critical path - load immediately
import SiteLayout from './components/SiteLayout'
import Home from './pages/Home'
import StudentProtectedRoute from './components/StudentProtectedRoute'
import AdminProtectedRoute from './components/admin/AdminProtectedRoute'

// Lazy load secondary routes
const About = lazy(() => import('./pages/About'))
const AISuite = lazy(() => import('./pages/AISuite'))
const SaaS = lazy(() => import('./pages/SaaS'))
const Events = lazy(() => import('./pages/Events'))
const EventDetails = lazy(() => import('./pages/EventDetails'))
const Team = lazy(() => import('./pages/Team'))
const Roadmap = lazy(() => import('./pages/Roadmap'))
const Partners = lazy(() => import('./pages/Partners'))
const Contact = lazy(() => import('./pages/Contact'))
const Login = lazy(() => import('./pages/Login'))
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'))
const PublicProfile = lazy(() => import('./pages/PublicProfile'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'))
const Accessibility = lazy(() => import('./pages/Accessibility'))

// Admin Console - lazy load entire admin section
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminLayout = lazy(() => import('./components/admin/layout/AdminLayout'))
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'))
const EventMasterList = lazy(() => import('./pages/admin/EventMasterList'))
const EventWorkspace = lazy(() => import('./pages/admin/EventWorkspace'))
const EventWizard = lazy(() => import('./pages/admin/EventWizard'))
const UserManagement = lazy(() => import('./pages/admin/UserManagement'))
const ContentCMS = lazy(() => import('./pages/admin/ContentCMS'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
)

function App() {
  const { isDarkMode } = useAppStore()

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={
              <div className="animate-fade-in">
                <Home />
              </div>
            } />
            <Route path="/about" element={<About />} />
            <Route path="/ai-suite" element={<AISuite />} />
            <Route path="/saas" element={<SaaS />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:slug" element={<EventDetails />} />
            <Route path="/team" element={<Team />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route element={<StudentProtectedRoute />}>
              <Route path="/dashboard" element={<StudentDashboard />} />
            </Route>
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/accessibility" element={<Accessibility />} />
          </Route>

          {/* Public Innovator Profile — standalone, own layout, no auth required */}
          <Route path="/u/:id" element={<PublicProfile />} />

          {/* Admin Console — separate layout, not wrapped in SiteLayout */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminOverview />} />
              <Route path="/admin/events" element={<EventMasterList />} />
              <Route path="/admin/events/new" element={<EventWizard />} />
              <Route path="/admin/events/:id" element={<EventWorkspace />} />
              <Route path="/admin/events/:id/edit" element={<EventWizard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/cms" element={<ContentCMS />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
