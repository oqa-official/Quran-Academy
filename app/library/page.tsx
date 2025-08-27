import Hero from '@/components/pages/About-us/Hero'
import FreeBooks from '@/components/pages/Library/FreeBooks'
import React from 'react'

function page() {
  return (
    <div>
      <Hero
        heading="Library"
        paragraph="Quran Academy offers a free digital library where you can access and read authentic Islamic books anytime to enrich your learning."
        backgroundImage="/assets/home/hero4.png"
      />
      <FreeBooks/>
    </div>
  )
}

export default page