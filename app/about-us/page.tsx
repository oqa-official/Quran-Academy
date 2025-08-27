import AboutUs from '@/components/pages/About-us/AboutUs'
import Features from '@/components/pages/About-us/Features'
import Hero from '@/components/pages/About-us/Hero'
import { StatisticsSection } from '@/components/pages/About-us/Statistics'
import TestimonialsSection from '@/components/pages/home/Testimonials'
import VisionMission from '@/components/pages/home/VisionMission'
import React from 'react'

function page() {
  return (
    <>
      <Hero
        heading="About Us"
        paragraph="Quran Academy stretches out the leading cause of Quran reading, learning, and memorizing to educate a more extensive scale under its probity."
        backgroundImage="/assets/home/hero4.png"
      />

      <AboutUs />
      <VisionMission />
      <Features />
      <StatisticsSection />
      <TestimonialsSection />
    </>
  )
}

export default page