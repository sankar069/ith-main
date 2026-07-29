import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft } from 'lucide-react'
import JoinUsPricing from '../components/JoinUsPricing'
import LoginIllustration from '../components/LoginIllustration'

function FormField({ label, type, value, onChange, icon: Icon, rightSlot }) {
  const [focused, setFocused] = useState(false)

  return (
    <div
      className={`relative rounded-xl bg-gray-50 border transition-all duration-200 ${
        focused ? 'border-[#c84c30] shadow-[0_0_0_3px_rgba(200,76,48,0.1)]' : 'border-gray-200'
      }`}
    >
      <label className="block px-4 pt-2.5 text-[11px] font-sans text-gray-400 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex items-center px-4 pb-2.5 gap-2">
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent text-cozy-dark text-sm font-sans outline-none placeholder:text-gray-400"
          placeholder={label}
        />
        {Icon && <Icon className="w-4 h-4 text-gray-400 shrink-0" />}
        {rightSlot}
      </div>
    </div>
  )
}

export default function Login() {
  const [searchParams] = useSearchParams()
  const initialView = searchParams.get('view') === 'pricing' ? 'pricing' : searchParams.get('mode') === 'signup' ? 'signup' : 'signin'

  const [view, setView] = useState(initialView)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })

  const updateField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(`${view} submitted:`, form)
  }

  const handleSelectPlan = (planId) => {
    setView('signup')
    console.log('Selected plan:', planId)
  }

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 md:p-8 overflow-hidden">
      {/* Landscape background */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/login-landscape.png"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/10" />
      </div>

      <div className="w-full max-w-5xl min-h-[560px] bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col">
        {/* Top nav */}
        <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-100 bg-[#0d213b]">
              <img src="/ith-logo.jpg" alt="InnoTech Hub" className="w-full h-full object-cover scale-110" />
            </div>
            <span className="font-serif font-bold text-cozy-dark text-sm group-hover:text-[#c84c30] transition-colors">
              InnoTech Hub
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-sans text-gray-500 hover:text-cozy-dark transition-colors">
              Home
            </Link>
            <button
              type="button"
              onClick={() => setView('pricing')}
              className={`text-sm font-sans transition-colors ${
                view === 'pricing' ? 'text-[#c84c30] font-semibold' : 'text-gray-500 hover:text-cozy-dark'
              }`}
            >
              Join Us
            </button>
          </nav>
        </div>

        <div className="flex flex-1 flex-col lg:flex-row min-h-0">
          {/* Left — form / pricing */}
          <div className="flex-1 flex flex-col justify-center px-6 md:px-10 lg:px-12 py-8 lg:py-10 overflow-y-auto custom-scrollbar">
            {view === 'pricing' ? (
              <>
                <button
                  type="button"
                  onClick={() => setView('signin')}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 font-sans mb-4 transition-colors self-start"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to sign in
                </button>
                <JoinUsPricing onSelectPlan={handleSelectPlan} compact variant="light" />
              </>
            ) : (
              <>
                <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-gray-400 mb-2">
                  {view === 'signup' ? 'Start for free' : 'Welcome back'}
                </p>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-cozy-dark mb-1">
                  {view === 'signup' ? (
                    <>Create new account<span className="text-[#c84c30]">.</span></>
                  ) : (
                    <>Sign in with email<span className="text-[#c84c30]">.</span></>
                  )}
                </h1>
                <p className="text-sm text-gray-500 font-sans mb-8">
                  {view === 'signup'
                    ? 'Join the student-first innovation ecosystem.'
                    : 'Access events, AI tools, and your student dashboard.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  {view === 'signup' && (
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        label="First name"
                        type="text"
                        value={form.firstName}
                        onChange={updateField('firstName')}
                        icon={User}
                      />
                      <FormField
                        label="Last name"
                        type="text"
                        value={form.lastName}
                        onChange={updateField('lastName')}
                        icon={User}
                      />
                    </div>
                  )}

                  <FormField
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={updateField('email')}
                    icon={Mail}
                  />

                  <FormField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={updateField('password')}
                    icon={Lock}
                    rightSlot={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />

                  {view === 'signin' && (
                    <div className="flex justify-end">
                      <button type="button" className="text-xs font-sans font-semibold text-gray-500 hover:text-[#c84c30] transition-colors">
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    {view === 'signup' && (
                      <button
                        type="button"
                        onClick={() => setView('pricing')}
                        className="flex-1 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-cozy-dark text-sm font-sans font-semibold transition-colors"
                      >
                        View plans
                      </button>
                    )}
                    <button
                      type="submit"
                      className={`py-3 rounded-full bg-[#c84c30] hover:bg-[#b04027] text-white text-sm font-sans font-semibold transition-all active:scale-[0.98] ${
                        view === 'signup' ? 'flex-1' : 'w-full'
                      }`}
                    >
                      {view === 'signup' ? 'Create account' : 'Get Started'}
                    </button>
                  </div>
                </form>

                {view === 'signin' && (
                  <>
                    <div className="flex items-center gap-3 my-6">
                      <div className="flex-1 border-t border-dotted border-gray-200" />
                      <span className="text-[11px] text-gray-400 font-sans">Or sign in with</span>
                      <div className="flex-1 border-t border-dotted border-gray-200" />
                    </div>

                    <div className="flex justify-center gap-3">
                      {['Google', 'GitHub', 'Apple'].map((provider) => (
                        <button
                          key={provider}
                          type="button"
                          className="w-12 h-12 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-sans font-semibold text-gray-500 hover:text-cozy-dark transition-all"
                        >
                          {provider[0]}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <p className="mt-6 text-sm text-gray-500 font-sans text-center">
                  {view === 'signup' ? (
                    <>
                      Already a member?{' '}
                      <button type="button" onClick={() => setView('signin')} className="text-[#c84c30] font-semibold hover:underline">
                        Log In
                      </button>
                    </>
                  ) : (
                    <>
                      New here?{' '}
                      <button type="button" onClick={() => setView('signup')} className="text-[#c84c30] font-semibold hover:underline">
                        Create account
                      </button>
                      {' · '}
                      <button type="button" onClick={() => setView('pricing')} className="text-[#c84c30] font-semibold hover:underline">
                        View plans
                      </button>
                    </>
                  )}
                </p>
              </>
            )}
          </div>

          {/* Right — illustration over landscape */}
          <div className="hidden lg:flex relative w-[42%] shrink-0 bg-white/40 backdrop-blur-sm border-l border-white/50">
            <LoginIllustration />
          </div>
        </div>
      </div>
    </div>
  )
}
