import React from 'react'
import AboutSection from '../components/AboutSection'
import CultureComparisonSection from '../components/CultureComparisonSection'

const SECTION_CLASS = 'w-full flex flex-col items-center justify-start relative px-4 pb-12'

export default function About() {
  return (
    <div className="w-full flex flex-col relative overflow-x-hidden bg-white dark:bg-cozy-dark">
      <section className={SECTION_CLASS}>
        <AboutSection />
      </section>
      <section className={SECTION_CLASS}>
        <CultureComparisonSection />
      </section>
    </div>
  )
}
