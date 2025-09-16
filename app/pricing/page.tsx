import React from 'react'
import Pricing_Section from '@/components/pages/home/Pricing'
import Hero from '@/components/pages/About-us/Hero'


function page() {
  return (
    <>
      <Hero
        heading="Our Economical Pricing"
        paragraph="Quran Academy stretches out the leading cause of Quran reading, learning, and memorizing to educate a more extensive scale under economical prics."
        backgroundImage="/assets/home/hero4.png"
      />
      <Pricing_Section/>
    </>
  )
}

export default page