import Hero from '@/components/pages/About-us/Hero'
import ContactSection from '@/components/pages/Contact/ContactSection'
import React from 'react'

function page() {
  return (
    <div>
      <Hero
        heading="Contact Us"
        paragraph="Quran Academy opens its doors for every seeker of knowledge by staying connected with you through a responsive and supportive channel. We ensure your queries, concerns, and enrollment needs are addressed promptly to guide you with sincerity."
        backgroundImage="/assets/home/hero4.png"
      />
      <ContactSection/>
    </div>
  )
}

export default page