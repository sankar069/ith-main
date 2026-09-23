import React from 'react'

export default function CookiePolicy() {
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
          <h1 className="text-4xl font-bold text-cozy-dark dark:text-cozy-light mb-4">Cookie Policy</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Last updated: August 2, 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-[#1a1f26] rounded-lg border border-gray-200 dark:border-[#404854] p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-cozy-dark dark:text-cozy-light mb-3">1. What Are Cookies?</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit our website. They are widely used to make websites work more efficiently, as well as to provide information to the owners of the site.
            </p>
          </section>

          {/* Types of Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-cozy-dark dark:text-cozy-light mb-3">2. Types of Cookies We Use</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We use the following types of cookies on InnoTech-Hub:
            </p>
            <div className="space-y-4 ml-4">
              <div>
                <h3 className="font-semibold text-cozy-dark dark:text-cozy-light">Essential Cookies:</h3>
                <p className="text-gray-700 dark:text-gray-300">Required for basic site functionality such as authentication and security.</p>
              </div>
              <div>
                <h3 className="font-semibold text-cozy-dark dark:text-cozy-light">Performance Cookies:</h3>
                <p className="text-gray-700 dark:text-gray-300">Help us understand how you use our site and improve performance accordingly.</p>
              </div>
              <div>
                <h3 className="font-semibold text-cozy-dark dark:text-cozy-light">Functional Cookies:</h3>
                <p className="text-gray-700 dark:text-gray-300">Remember your preferences and settings to personalize your experience.</p>
              </div>
              <div>
                <h3 className="font-semibold text-cozy-dark dark:text-cozy-light">Marketing Cookies:</h3>
                <p className="text-gray-700 dark:text-gray-300">Track your activity to display relevant advertisements and track campaign effectiveness.</p>
              </div>
            </div>
          </section>

          {/* How We Use Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-cozy-dark dark:text-cozy-light mb-3">3. How We Use Cookies</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We use cookies for various purposes including:
            </p>
            <ul className="space-y-2 ml-4 mt-3 text-gray-700 dark:text-gray-300">
              <li>• To authenticate users and maintain session information</li>
              <li>• To remember user preferences and settings</li>
              <li>• To analyze site usage and gather statistics</li>
              <li>• To improve site functionality and user experience</li>
              <li>• To display personalized content and advertisements</li>
              <li>• To prevent fraud and enhance security</li>
            </ul>
          </section>

          {/* Third-Party Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-cozy-dark dark:text-cozy-light mb-3">4. Third-Party Cookies</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Some cookies may be set by third-party services we use, such as analytics providers and advertising networks. We do not control these third-party cookies and encourage you to review their policies directly.
            </p>
          </section>

          {/* Cookie Duration */}
          <section>
            <h2 className="text-2xl font-bold text-cozy-dark dark:text-cozy-light mb-3">5. Duration of Cookies</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Cookies may be either "session" cookies or "persistent" cookies. Session cookies are automatically deleted when you close your browser. Persistent cookies remain on your device until they expire or you manually delete them.
            </p>
          </section>

          {/* Managing Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-cozy-dark dark:text-cozy-light mb-3">6. How to Manage Cookies</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              Most web browsers allow you to control cookies through their settings. You can:
            </p>
            <ul className="space-y-2 ml-4 text-gray-700 dark:text-gray-300">
              <li>• Delete cookies already stored on your device</li>
              <li>• Set your browser to reject cookies</li>
              <li>• Set your browser to notify you when a cookie is being set</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-3 text-sm">
              Please note that disabling cookies may affect your ability to use certain features of our site.
            </p>
          </section>

          {/* Contact */}
          <section className="border-t border-gray-200 dark:border-[#404854] pt-8">
            <h2 className="text-2xl font-bold text-cozy-dark dark:text-cozy-light mb-3">7. Contact Us</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you have any questions about our use of cookies, please contact us at:
            </p>
            <div className="mt-4 text-gray-700 dark:text-gray-300">
              <p>Email: cookies@innotech-hub.com</p>
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
