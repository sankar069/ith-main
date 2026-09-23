import React from 'react'
import ProductsSaaSSection from '../components/ProductsSaaSSection'
import BusinessModelSection from '../components/BusinessModelSection'

const SECTION_CLASS = 'w-full flex flex-col items-center justify-start relative px-4 pb-12'

export default function SaaS() {
  return (
    <div className="w-full flex flex-col relative overflow-x-hidden bg-white dark:bg-cozy-dark">
      <section className={SECTION_CLASS}>
        <ProductsSaaSSection />
      </section>
      <section className={SECTION_CLASS}>
        <BusinessModelSection />
      </section>
    </div>
  )
}
