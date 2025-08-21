
import Hero from '@/components/pages/home/Hero'
import HowItWorks from '@/components/pages/home/HowItWorks'
import StatsSection from '@/components/pages/home/StatsSection'
import VisionMission from '@/components/pages/home/VisionMission'
import WhyChooseUs from '@/components/pages/home/WhyChooseUs'
import React from 'react'

export default function page() {
  return (
    <>
     <Hero/>
     <StatsSection/>
     <WhyChooseUs/>
     <VisionMission/>
     <HowItWorks/>
    </>
  )
}
