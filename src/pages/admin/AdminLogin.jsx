import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react'
import { useAdminStore } from '../../store/useAdminStore'
import { adminFetch, ApiError } from '../../lib/adminApi'

export default function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAdminStore((s) => s.login)

  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.email.trim()) next.email = 'Email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.'
    if (!form.password) next.password = 'Password is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    if (!validate()) return

    setLoading(true)
    try {
      const data = await adminFetch('/api/admin/login', {
        method: 'POST',
        body: { email: form.email.trim(), password: form.password },
      })
      login(data.token, data.admin)
      const redirectTo = location.state?.from || '/admin'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cozy-light dark:bg-cozy-dark px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#c84c30] flex items-center justify-center mb-4 shadow-sm">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-cozy-dark dark:text-cozy-light">
            Admin Console
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
            Sign in to manage InnoTech-Hub events, users, and content.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-[#404854] rounded-2xl shadow-sm p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {submitError && (
              <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">{submitError}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-cozy-dark dark:text-cozy-light mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="ithadmin@ith.com"
                  autoComplete="username"
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border transition bg-cozy-light dark:bg-cozy-dark/50 text-cozy-dark dark:text-cozy-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c84c30] ${
                    errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-cozy-dark dark:text-cozy-light mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full pl-12 pr-12 py-3 rounded-lg border transition bg-cozy-light dark:bg-cozy-dark/50 text-cozy-dark dark:text-cozy-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c84c30] ${
                    errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500 font-medium">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-[#c84c30] hover:bg-[#a83c24] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-xs text-center text-gray-500 dark:text-gray-500 mt-6">
          Restricted to authorized InnoTech-Hub administrators only.
        </p>
      </div>
    </div>
  )
}
