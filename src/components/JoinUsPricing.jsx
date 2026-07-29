import React from 'react'
import { Check, X, Sparkles, Zap, Crown } from 'lucide-react'

const TIERS = [
  {
    id: 'free',
    name: 'Free',
    icon: Sparkles,
    price: '₹0',
    period: 'forever',
    tagline: 'Explore the ecosystem',
    features: [
      { text: '5 credits for AI tools', included: true },
      { text: 'No event access', included: false },
      { text: 'No discounts on event passes', included: false },
      { text: 'No priority at high-profile official events', included: false },
    ],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    id: 'plus',
    name: 'Plus',
    icon: Zap,
    price: '₹299',
    period: '/month',
    tagline: 'For active builders',
    features: [
      { text: '50 credits per AI tool', included: true },
      { text: 'Up to 30% off event passes', included: true },
      { text: '2 mentor sessions per month', included: true },
      { text: 'Standard event access', included: true },
    ],
    cta: 'Choose Plus',
    highlighted: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: Crown,
    price: '₹449',
    period: '/month',
    tagline: 'Full platform access',
    features: [
      { text: 'Unlimited access to events & AI tools', included: true },
      { text: 'Up to 50% off event passes', included: true },
      { text: '5 mentor sessions per month', included: true },
      { text: 'Priority at high-profile official events', included: true },
    ],
    cta: 'Choose Pro',
    highlighted: false,
  },
]

export default function JoinUsPricing({ onSelectPlan, compact = false, variant = 'dark' }) {
  const isLight = variant === 'light'

  return (
    <div className={`w-full ${compact ? '' : 'max-w-5xl mx-auto'}`}>
      <div className="text-center mb-8">
        <p className={`text-xs font-sans font-semibold uppercase tracking-[0.2em] mb-2 ${isLight ? 'text-gray-400' : 'text-gray-400'}`}>
          Join InnoTech Hub
        </p>
        <h2 className={`text-2xl md:text-3xl font-display font-bold ${isLight ? 'text-cozy-dark' : 'text-white'}`}>
          Choose your <span className="text-[#c84c30] italic font-serif">membership</span>.
        </h2>
        <p className={`mt-2 text-sm font-sans max-w-md mx-auto ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
          Payment integration coming soon — pick a plan to preview what you get.
        </p>
      </div>

      <div className={`grid gap-4 ${compact ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 md:grid-cols-3'}`}>
        {TIERS.map((tier) => {
          const Icon = tier.icon
          return (
            <div
              key={tier.id}
              className={`relative flex flex-col rounded-2xl p-5 transition-all duration-300 ${
                tier.highlighted
                  ? isLight
                    ? 'bg-[#fdf0ed] border-2 border-[#c84c30] shadow-sm scale-[1.02]'
                    : 'bg-[#c84c30]/10 border-2 border-[#c84c30] shadow-[0_0_30px_rgba(200,76,48,0.15)] scale-[1.02]'
                  : isLight
                    ? 'bg-gray-50 border border-gray-200 hover:border-gray-300'
                    : 'bg-white/5 border border-white/10 hover:border-white/20'
              }`}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#c84c30] text-white text-[10px] font-sans font-bold uppercase tracking-wider">
                  Popular
                </span>
              )}

              <div className="flex items-center gap-2 mb-3">
                <div className={`p-2 rounded-xl ${tier.highlighted ? 'bg-[#c84c30]/20' : isLight ? 'bg-white' : 'bg-white/10'}`}>
                  <Icon className={`w-4 h-4 ${tier.highlighted ? 'text-[#c84c30]' : isLight ? 'text-gray-500' : 'text-gray-300'}`} />
                </div>
                <div>
                  <h3 className={`text-lg font-display font-bold ${isLight ? 'text-cozy-dark' : 'text-white'}`}>{tier.name}</h3>
                  <p className="text-[11px] text-gray-500 font-sans">{tier.tagline}</p>
                </div>
              </div>

              <div className="mb-4">
                <span className={`text-3xl font-display font-bold ${isLight ? 'text-cozy-dark' : 'text-white'}`}>{tier.price}</span>
                <span className="text-sm text-gray-500 font-sans ml-1">{tier.period}</span>
              </div>

              <ul className="flex-1 space-y-2.5 mb-5">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs font-sans">
                    {feature.included ? (
                      <Check className="w-3.5 h-3.5 text-[#c84c30] shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? (isLight ? 'text-gray-600' : 'text-gray-300') : 'text-gray-400'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => onSelectPlan?.(tier.id)}
                className={`w-full py-2.5 rounded-full text-sm font-sans font-semibold transition-all active:scale-[0.98] ${
                  tier.highlighted
                    ? 'bg-[#c84c30] hover:bg-[#b04027] text-white shadow-sm'
                    : isLight
                      ? 'bg-white hover:bg-gray-50 text-cozy-dark border border-gray-200'
                      : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
