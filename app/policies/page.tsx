import Hero from '@/components/pages/About-us/Hero'
import OurPolicies from '@/components/pages/policies/OurPolicies'
import React from 'react'

function page() {
  return (
    <div>
        <Hero
        heading="Our Policies"
        paragraph="Quran Academy stretches out the leading cause of Quran reading, learning, and memorizing to educate a more extensive scale under its probity."
        backgroundImage="/assets/home/hero4.png"
      />
      <OurPolicies/>
    </div>
  )
}

export default page