import React, { useState } from 'react'
import { Mail, Check } from 'lucide-react'
import { Input, Button } from '../../ui'

export default function Step6OTP({ formData, errors, onChange }) {
  const [otpSent, setOtpSent] = useState(false)
  const [loadingOtp, setLoadingOtp] = useState(false)
  const [otpAttempts, setOtpAttempts] = useState(0)
  const [resendCooldown, setResendCooldown] = useState(0)

  const handleSendOtp = async () => {
    setLoadingOtp(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setOtpSent(true)
      setResendCooldown(60)

      // Countdown timer
      const interval = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } finally {
      setLoadingOtp(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (formData.otpCode.length === 6) {
      setLoadingOtp(true)
      try {
        // Simulate OTP verification
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          onChange('emailVerified', true)
        } else {
          setOtpAttempts(prev => prev + 1)
          alert('Invalid OTP. Please try again.')
        }
      } finally {
        setLoadingOtp(false)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Email Verification Status */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          {formData.emailVerified ? (
            <>
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-semibold text-green-700 dark:text-green-400">Email Verified</p>
                <p className="text-sm text-green-600 dark:text-green-300 mt-0.5">
                  {formData.email}
                </p>
              </div>
            </>
          ) : (
            <>
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-100">Verify your email</p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-0.5">
                  We'll send a verification code to {formData.email}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {!formData.emailVerified ? (
        <>
          {!otpSent ? (
            <Button
              variant="primary"
              onClick={handleSendOtp}
              loading={loadingOtp}
              className="w-full"
            >
              Send Verification Code
            </Button>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-cozy-dark dark:text-cozy-light mb-2">
                  Enter 6-Digit Code
                </label>
                <Input
                  placeholder="000000"
                  maxLength="6"
                  type="tel"
                  value={formData.otpCode}
                  onChange={(e) => onChange('otpCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  error={errors.otpCode}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="primary"
                  onClick={handleVerifyOtp}
                  loading={loadingOtp}
                  disabled={formData.otpCode.length !== 6}
                  className="flex-1"
                >
                  Verify Code
                </Button>

                <Button
                  variant="secondary"
                  onClick={handleSendOtp}
                  loading={loadingOtp}
                  disabled={resendCooldown > 0}
                  className="flex-1"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                </Button>
              </div>

              {otpAttempts > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <p className="text-xs text-yellow-900 dark:text-yellow-100">
                    Attempts: {otpAttempts}/3. Check your email and try again.
                  </p>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
          <Check className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-semibold text-green-900 dark:text-green-100">Email verified successfully!</p>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              Your profile is now verified and ready to use.
            </p>
          </div>
        </div>
      )}

      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">🔒 Security:</span> Email verification ensures account security and helps us send important updates about your registered events.
        </p>
      </div>
    </div>
  )
}
