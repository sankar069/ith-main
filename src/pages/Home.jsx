import React from 'react'
import HomeSection from '../components/HomeSection'
import UpcomingEventsSection from '../components/UpcomingEventsSection'
import PastEventsSection from '../components/PastEventsSection'
import ReadySection from '../components/ReadySection'

const SECTION_CLASS = 'w-full flex flex-col items-center justify-start relative px-4 pb-12'

export default function Home() {
  return (
    <div className="w-full flex flex-col relative overflow-x-hidden bg-white dark:bg-cozy-dark">
      <section className="w-full flex flex-col relative overflow-x-hidden">
        <HomeSection />
      </section>
      <section className={SECTION_CLASS}>
        <UpcomingEventsSection />
      </section>
      <section className={SECTION_CLASS}>
        <PastEventsSection />
      </section>
      <section className="w-full flex flex-col relative overflow-x-hidden">
        <ReadySection />
      </section>
    </div>
  )
}
