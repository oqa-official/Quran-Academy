
import CTASection from '@/components/pages/home/CTAsection'
import FeaturedSectionCarousel from '@/components/pages/home/FeaturedSectionCarousel'
import FloatingButtons from '@/components/pages/home/FloatingButtons'
import Hero from '@/components/pages/home/Hero'
import HowItWorks from '@/components/pages/home/HowItWorks'
import Pricing_Section from '@/components/pages/home/Pricing'
import StatsSection from '@/components/pages/home/StatsSection'
import TestimonialsSection from '@/components/pages/home/Testimonials'
import VisionMission from '@/components/pages/home/VisionMission'
import WhyChooseUs from '@/components/pages/home/WhyChooseUs'

export default function page() {
  return (
    <>
     <Hero/>
     <StatsSection/>
     <WhyChooseUs/>
     <FeaturedSectionCarousel/>
     <VisionMission/>
     <Pricing_Section/>
     <HowItWorks/>
     <TestimonialsSection/>
     <CTASection/>
     <FloatingButtons/>
    </>
  )
}
