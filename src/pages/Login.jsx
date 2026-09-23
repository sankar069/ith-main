import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Globe, Apple, AlertCircle } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { useStudentStore } from '../store/useStudentStore'
import { studentFetch } from '../lib/studentApi'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  // Lets entry points elsewhere on the site (the "Join!" CTA, JoinUsModal's
  // plan picker) deep-link straight into signup with the email pre-filled,
  // instead of always landing on a blank sign-in form.
  const [mode, setMode] = useState(searchParams.get('mode') === 'signup' ? 'signup' : 'signin')
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    email: searchParams.get('email') || '',
    password: '',
    firstName: '',
    lastName: '',
    rememberMe: false,
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const { login, setProfile } = useStudentStore()

  const establishSession = async (session) => {
    // Populate the token first so the profile fetch below can authenticate.
    login(session.access_token, null)
    try {
      const data = await studentFetch('/api/student/profile')
      setProfile(data.profile)
    } catch {
      // Profile row may not exist yet (e.g. trigger not deployed) — the
      // session itself is still valid, dashboard tabs will show empty states.
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    if (!isSupabaseConfigured) {
      setSubmitError('Sign-up/sign-in isn\'t configured yet — VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are missing. Set them in .env and restart the dev server.')
      return
    }
    setSubmitting(true)
    try {
      if (mode === 'signup') {
        const fullName = `${form.firstName} ${form.lastName}`.trim()
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { full_name: fullName } },
        })
        if (error) throw error
        if (!data.session) {
          setSubmitError('Account created! Check your email to confirm it, then sign in.')
          setMode('signin')
          return
        }
        await establishSession(data.session)
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        })
        if (error) throw error
        await establishSession(data.session)
      }
      navigate('/dashboard')
    } catch (err) {
      setSubmitError(err.message || 'Unable to sign in. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cozy-light dark:bg-cozy-dark">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-screen md:min-h-auto">
          
          {/* Left Side - Form */}
          <div className="flex flex-col justify-center py-8 md:py-0">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#c84c30] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IH</span>
                </div>
                <span className="font-serif font-bold text-cozy-dark dark:text-cozy-light">InnoTech</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-display font-bold text-cozy-dark dark:text-cozy-light mb-3">
                {mode === 'signin' ? 'Sign in' : 'Create Account'}
              </h1>
              
              <p className="text-gray-600 dark:text-gray-400 text-base">
                {mode === 'signin' 
                  ? 'New to InnoTech? '
                  : 'Already have an account? '
                }
                <button 
                  onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                  className="text-[#c84c30] hover:text-[#a83c24] font-semibold"
                >
                  {mode === 'signin' ? 'Create an account.' : 'Sign in.'}
                </button>
              </p>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {submitError && (
                <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-300">{submitError}</p>
                </div>
              )}

              {/* Signup name fields */}
              {mode === 'signup' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-cozy-light dark:bg-cozy-dark/50 text-cozy-dark dark:text-cozy-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c84c30] transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-cozy-light dark:bg-cozy-dark/50 text-cozy-dark dark:text-cozy-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c84c30] transition"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-cozy-light dark:bg-cozy-dark/50 text-cozy-dark dark:text-cozy-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c84c30] transition"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-cozy-light dark:bg-cozy-dark/50 text-cozy-dark dark:text-cozy-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c84c30] transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              {mode === 'signin' && (
                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={form.rememberMe}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-400">Remember for 30 days</span>
                  </label>
                  <button type="button" className="text-sm text-[#c84c30] hover:text-[#a83c24] font-semibold">
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-lg bg-[#c84c30] hover:bg-[#a83c24] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold transition-colors active:scale-[0.98] mt-6"
              >
                {submitting
                  ? (mode === 'signin' ? 'Signing in…' : 'Creating account…')
                  : (mode === 'signin' ? 'Sign in' : 'Create account')}
              </button>
            </form>

            {/* OAuth */}
            <div className="mt-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-cozy-light dark:bg-cozy-dark text-gray-600 dark:text-gray-400">or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-cozy-dark/50 transition"
                >
                  <Globe className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <span className="text-sm font-semibold text-cozy-dark dark:text-cozy-light">Google</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-cozy-dark/50 transition"
                >
                  <Apple className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <span className="text-sm font-semibold text-cozy-dark dark:text-cozy-light">Apple</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="hidden lg:flex items-center justify-center relative">
            <div className="w-full max-w-md aspect-square relative">
              {/* Abstract geometric shapes */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Background shapes - using brand colors */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#c84c30]/20 dark:bg-[#c84c30]/10 rounded-full opacity-70"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#8ab4f8]/15 dark:bg-[#8ab4f8]/10 rounded-full opacity-50"></div>
                <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-[#c84c30]/10 dark:bg-[#c84c30]/5 rounded-full opacity-60"></div>
                
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-5 dark:opacity-10"
                  style={{
                    backgroundImage: 'linear-gradient(0deg, transparent 24%, #c84c30 25%, #c84c30 26%, transparent 27%, transparent 74%, #c84c30 75%, #c84c30 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #c84c30 25%, #c84c30 26%, transparent 27%, transparent 74%, #c84c30 75%, #c84c30 76%, transparent 77%, transparent)',
                    backgroundSize: '50px 50px'
                  }}
                />

                {/* Chevron pattern */}
                <div className="absolute right-12 top-1/3 w-20 h-24 opacity-40">
                  <svg viewBox="0 0 100 150" className="w-full h-full text-[#c84c30]" fill="currentColor">
                    <path d="M 20 30 L 50 60 L 80 30" stroke="currentColor" strokeWidth="3" fill="none" />
                    <path d="M 20 60 L 50 90 L 80 60" stroke="currentColor" strokeWidth="3" fill="none" />
                    <path d="M 20 90 L 50 120 L 80 90" stroke="currentColor" strokeWidth="3" fill="none" />
                  </svg>
                </div>

                {/* Decorative elements */}
                <div className="absolute bottom-1/4 right-1/4 w-16 h-16 border-2 border-[#c84c30]/40 dark:border-[#c84c30]/30 rounded-lg opacity-40 transform rotate-45"></div>
                <div className="absolute top-1/4 left-1/3 w-12 h-12 border-4 border-dotted border-[#8ab4f8]/50 dark:border-[#8ab4f8]/40 rounded-full opacity-30"></div>
              </div>

              {/* Center flower-like shape - primary brand color */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 relative">
                  {[0, 72, 144, 216, 288].map((angle) => (
                    <div
                      key={angle}
                      className="absolute w-8 h-8 bg-[#c84c30] dark:bg-[#c84c30] rounded-full opacity-80"
                      style={{
                        transform: `rotate(${angle}deg) translateY(-48px) rotate(-${angle}deg)`,
                      }}
                    />
                  ))}
                  <div className="absolute inset-4 bg-[#c84c30] dark:bg-[#c84c30] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
