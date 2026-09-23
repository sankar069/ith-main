import React from 'react'
import RoadmapSection from '../components/RoadmapSection'

const SECTION_CLASS = 'w-full flex flex-col items-center justify-start relative px-4 pb-12'

export default function Roadmap() {
  return (
    <div className="w-full flex flex-col relative overflow-x-hidden bg-white dark:bg-cozy-dark">
      <section className={SECTION_CLASS}>
        <RoadmapSection />
      </section>
    </div>
  )
}
