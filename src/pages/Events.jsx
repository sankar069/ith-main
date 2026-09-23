import React from 'react'
import OfficialEventPlatformSection from '../components/OfficialEventPlatformSection'
import EventFlowSection from '../components/EventFlowSection'
import EventsTelemetry from '../components/EventsTelemetry'
import GrowthDashboardSection from '../components/GrowthDashboardSection'

const SECTION_CLASS = 'w-full flex flex-col items-center justify-start relative px-4 pb-12'

export default function Events() {
  return (
    <div className="w-full flex flex-col relative overflow-x-hidden bg-white dark:bg-cozy-dark">
      <section className={SECTION_CLASS}>
        <OfficialEventPlatformSection />
      </section>
      <section className={SECTION_CLASS}>
        <EventFlowSection />
      </section>
      <section className={SECTION_CLASS}>
        <EventsTelemetry />
      </section>
      <section className={SECTION_CLASS}>
        <GrowthDashboardSection />
      </section>
    </div>
  )
}
