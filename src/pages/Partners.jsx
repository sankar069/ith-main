import React from 'react'
import PartnersSponsorsSection from '../components/PartnersSponsorsSection'
import VisionBannerSection from '../components/VisionBannerSection'

const SECTION_CLASS = 'w-full flex flex-col items-center justify-start relative px-4 pb-12'

export default function Partners() {
  return (
    <div className="w-full flex flex-col relative overflow-x-hidden bg-white dark:bg-cozy-dark">
      <section className="w-full flex flex-col items-center justify-start relative px-0 pb-0">
        <PartnersSponsorsSection />
      </section>
      <section className={SECTION_CLASS}>
        <VisionBannerSection />
      </section>
    </div>
  )
}
