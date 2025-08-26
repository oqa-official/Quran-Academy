import Hero from '@/components/pages/course/Hero'
import OurPlans from '@/components/pages/course/Plans'
import WhyGoForUs from '@/components/pages/course/WhyGoForUs'
import TestimonialsSection from '@/components/pages/home/Testimonials'
import React from 'react'

function page() {
  return (
    <div>
        <Hero/>
        <WhyGoForUs/>
        <OurPlans/>
        <TestimonialsSection/>
    </div>
  )
}

export default page