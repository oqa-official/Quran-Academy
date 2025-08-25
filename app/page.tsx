
import CTASection from '@/components/pages/home/CTAsection'
import FeaturedCourses from '@/components/pages/home/FeaturedCourses'
import FeaturedSectionCarousel from '@/components/pages/home/FeaturedSectionCarousel'
import FloatingButtons from '@/components/pages/home/FloatingButtons'
import Hero from '@/components/pages/home/Hero'
import HowItWorks from '@/components/pages/home/HowItWorks'
import StatsSection from '@/components/pages/home/StatsSection'
import TestimonialsSection from '@/components/pages/home/Testimonials'
import VisionMission from '@/components/pages/home/VisionMission'
import WhyChooseUs from '@/components/pages/home/WhyChooseUs'
import React from 'react'

export default function page() {
  return (
    <>
     <Hero/>
     <StatsSection/>
     <WhyChooseUs/>
     {/* <FeaturedCourses/> */}
     <FeaturedSectionCarousel/>
     <VisionMission/>
     <HowItWorks/>
     <TestimonialsSection/>
     <CTASection/>
     <FloatingButtons/>
    </>
  )
}
