import React from 'react'

export default function Accessibility() {
  return (
    <div className="min-h-screen bg-cozy-light dark:bg-cozy-dark py-20 px-4 pt-24">
      <div className="max-w-4xl mx-auto">
        {/* Logo */}
        <div className="mb-8">
          <a href="/" className="flex items-center gap-2 font-bold text-lg hover:text-[#c84c30] transition-colors">
            <div className="w-10 h-10 rounded bg-[#c84c30] flex items-center justify-center">
              <span className="text-white font-bold">IH</span>
            </div>
            <span>InnoTech-Hub</span>
          </a>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-cozy-dark dark:text-cozy-light mb-4">Accessibility Statement</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Last updated: August 2, 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-[#1a1f26] rounded-lg border border-gray-200 dark:border-[#404854] p-8 space-y-8">
          {/* Commitment */}
          <section>
            <h2 className="text-2xl font-bold text-cozy-dark dark:text-cozy-light mb-3">1. Our Commitment</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              InnoTech-Hub is committed to ensuring digital accessibility for people with disabilities. We are continuously improving the user experience for everyone and applying the relevant accessibility standards.
            </p>
          </section>

          {/* WCAG Compliance */}
          <section>
            <h2 className="text-2xl font-bold text-cozy-dark dark:text-cozy-light mb-3">2. WCAG Compliance</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standard. Our platform includes:
            </p>
            <ul className="space-y-2 ml-4 text-gray-700 dark:text-gray-300">
              <li>• Keyboard navigation support for all interactive elements</li>
              <li>• Semantic HTML structure for screen reader compatibility</li>
              <li>• Sufficient color contrast ratios (4.5:1 for normal text)</li>
              <li>• Alt text descriptions for all images and icons</li>
              <li>• ARIA labels and roles for dynamic content</li>
              <li>• Focus indicators for keyboard navigation</li>
              <li>• Resizable text without loss of functionality</li>
              <li>• Captions and transcripts for video content</li>
            </ul>
          </section>

          {/* Accessibility Features */}
          <section>
            <h2 className="text-2xl font-bold text-cozy-dark dark:text-cozy-light mb-3">3. Key Accessibility Features</h2>
            <div className="space-y-4 ml-4">
              <div>
                <h3 className="font-semibold text-cozy-dark dark:text-cozy-light">Dark Mode:</h3>
                <p className="text-gray-700 dark:text-gray-300">Reduces eye strain and provides better readability for users with visual sensitivities.</p>
              </div>
              <div>
                <h3 className="font-semibold text-cozy-dark dark:text-cozy-light">Keyboard Navigation:</h3>
                <p className="text-gray-700 dark:text-gray-300">Full keyboard accessibility for users who cannot use a mouse.</p>
              </div>
              <div>
                <h3 className="font-semibold text-cozy-dark dark:text-cozy-light">Screen Reader Support:</h3>
                <p className="text-gray-700 dark:text-gray-300">Compatible with major screen readers including NVDA, JAWS, and VoiceOver.</p>
              </div>
              <div>
                <h3 className="font-semibold text-cozy-dark dark:text-cozy-light">Text Scaling:</h3>
                <p className="text-gray-700 dark:text-gray-300">All content remains usable when text is enlarged up to 200%.</p>
              </div>
              <div>
                <h3 className="font-semibold text-cozy-dark dark:text-cozy-light">Skip Links:</h3>
                <p className="text-gray-700 dark:text-gray-300">Quick navigation links to jump to main content areas.</p>
              </div>
            </div>
          </section>

          {/* Known Limitations */}
          <section>
            <h2 className="text-2xl font-bold text-cozy-dark dark:text-cozy-light mb-3">4. Known Limitations</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              While we strive for full accessibility, some limitations may exist:
            </p>
            <ul className="space-y-2 ml-4 text-gray-700 dark:text-gray-300">
              <li>• Embedded third-party content may not fully comply with WCAG standards</li>
              <li>• Some complex data visualizations may require additional context</li>
              <li>• PDF documents may have varying accessibility levels</li>
            </ul>
          </section>

          {/* User Preferences */}
          <section>
            <h2 className="text-2xl font-bold text-cozy-dark dark:text-cozy-light mb-3">5. Accessibility Tools & Resources</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              We recommend using the following tools to enhance your accessibility experience:
            </p>
            <ul className="space-y-2 ml-4 text-gray-700 dark:text-gray-300">
              <li>• Browser zoom: Ctrl/Cmd + Plus to enlarge content</li>
              <li>• Built-in dark mode toggle in dashboard settings</li>
              <li>• High contrast mode in your operating system</li>
              <li>• Text-to-speech browser extensions</li>
            </ul>
          </section>

          {/* Feedback */}
          <section>
            <h2 className="text-2xl font-bold text-cozy-dark dark:text-cozy-light mb-3">6. Accessibility Feedback</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We welcome feedback on the accessibility of InnoTech-Hub. Please let us know if you encounter any accessibility barriers or have suggestions for improvement. Your feedback helps us serve everyone better.
            </p>
          </section>

          {/* Contact */}
          <section className="border-t border-gray-200 dark:border-[#404854] pt-8">
            <h2 className="text-2xl font-bold text-cozy-dark dark:text-cozy-light mb-3">7. Contact Us</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you have accessibility concerns or need assistance, please contact us at:
            </p>
            <div className="mt-4 text-gray-700 dark:text-gray-300">
              <p>Email: accessibility@innotech-hub.com</p>
              <p>Phone: +1 (800) ACCESS-HUB</p>
              <p>Address: InnoTech-Hub Community Center</p>
            </div>
          </section>
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <a href="/" className="text-[#c84c30] hover:text-[#a83820] font-semibold">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
