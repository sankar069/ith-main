import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardContent } from '../ui'
import { useDashboard } from '../../../contexts/DashboardContext'

// Import step components
import Step1Personal from './steps/Step1Personal'
import Step2Academic from './steps/Step2Academic'
import Step3Links from './steps/Step3Links'
import Step4Skills from './steps/Step4Skills'
import Step5Achievements from './steps/Step5Achievements'
import Step6OTP from './steps/Step6OTP'

const steps = [
  { id: 1, title: 'Personal Info', subtitle: 'Basic details' },
  { id: 2, title: 'Academic', subtitle: 'Education' },
  { id: 3, title: 'Links & Files', subtitle: 'Portfolio & Resume' },
  { id: 4, title: 'Skills', subtitle: 'Technical & Soft' },
  { id: 5, title: 'Achievements', subtitle: 'Roles & Awards' },
  { id: 6, title: 'Email OTP', subtitle: 'Verification' },
]

export default function OnboardingWizard() {
  const { updateUserProfile, addNotification, setIsFirstTimeSetup } = useDashboard()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    email: '',
    phone: '',
    headline: '',
    profileImage: null,

    // Academic
    university: '',
    degree: '',
    graduationYear: new Date().getFullYear() + 1,

    // Links & Files
    github: '',
    portfolio: '',
    linkedIn: '',
    resume: null,

    // Skills
    technicalSkills: [],
    softSkills: [],
    interests: [],

    // Achievements
    achievements: [],
    preferredRoles: [],

    // OTP
    otpCode: '',
    emailVerified: false,
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateStep = (step) => {
    const newErrors = {}

    switch (step) {
      case 1:
        if (!formData.fullName?.trim()) newErrors.fullName = 'Full name is required'
        if (!formData.email?.trim()) newErrors.email = 'Email is required'
        if (!formData.headline?.trim()) newErrors.headline = 'Professional headline is required'
        if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
          newErrors.phone = 'Phone number must be 10 digits'
        }
        break
      case 2:
        if (!formData.university?.trim()) newErrors.university = 'University name is required'
        if (!formData.degree?.trim()) newErrors.degree = 'Degree is required'
        if (!formData.graduationYear) newErrors.graduationYear = 'Graduation year is required'
        break
      case 3:
        if (!formData.github?.trim() && !formData.portfolio?.trim()) {
          newErrors.links = 'At least one link (GitHub or Portfolio) is required'
        }
        break
      case 6:
        if (!formData.emailVerified) {
          newErrors.otpCode = 'Email verification is required'
        }
        break
      default:
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    if (validateStep(currentStep)) {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Update user profile
        updateUserProfile({
          ...formData,
          profileSetupCompleted: true,
        })

        addNotification('Profile setup completed successfully!', 'success', 3000)
        setIsFirstTimeSetup(false)
      } catch {
        addNotification('Error completing profile setup. Please try again.', 'error', 3000)
      } finally {
        setLoading(false)
      }
    }
  }

  const renderStepContent = () => {
    const commonProps = {
      formData,
      errors,
      onChange: handleInputChange,
    }

    switch (currentStep) {
      case 1:
        return <Step1Personal {...commonProps} />
      case 2:
        return <Step2Academic {...commonProps} />
      case 3:
        return <Step3Links {...commonProps} />
      case 4:
        return <Step4Skills {...commonProps} />
      case 5:
        return <Step5Achievements {...commonProps} />
      case 6:
        return <Step6OTP {...commonProps} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-cozy-light dark:bg-cozy-dark py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-cozy-dark dark:text-cozy-light mb-2">
            Set Up Your Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete your innovation passport in {steps.length} simple steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  onClick={() => index < currentStep && setCurrentStep(step.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    currentStep === step.id
                      ? 'bg-[#c84c30] text-white scale-110'
                      : index < currentStep - 1
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {index < currentStep - 1 ? <Check className="w-4 h-4" /> : step.id}
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      index < currentStep - 1
                        ? 'bg-green-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Labels */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs text-center">
            {steps.map((step) => (
              <div key={step.id}>
                <p className="font-semibold text-cozy-dark dark:text-cozy-light">{step.title}</p>
                <p className="text-gray-500 dark:text-gray-400">{step.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-3 justify-between">
          <Button
            variant="secondary"
            onClick={goToPreviousStep}
            disabled={currentStep === 1}
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          {currentStep === steps.length ? (
            <Button
              variant="primary"
              onClick={handleComplete}
              loading={loading}
              className="flex-1"
            >
              <Check className="w-4 h-4" />
              Complete Setup
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={goToNextStep}
              className="flex-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Step Counter */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Step {currentStep} of {steps.length}
        </p>
      </div>
    </div>
  )
}
