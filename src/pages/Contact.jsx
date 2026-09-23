import React from 'react'
import ContactSection from '../components/ContactSection'

const SECTION_CLASS = 'w-full flex flex-col items-center justify-start relative px-4 pb-12'

export default function Contact() {
  return (
    <div className="w-full flex flex-col relative overflow-x-hidden bg-white dark:bg-cozy-dark">
      <section className={SECTION_CLASS}>
        <ContactSection />
      </section>
    </div>
  )
}
