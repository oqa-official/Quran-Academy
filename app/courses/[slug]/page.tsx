import FeaturedSectionCarousel from '@/components/pages/home/FeaturedSectionCarousel'
import CoursePageLayout from '@/components/pages/SingleCourse/CoursePageLayout'
import CourseSidebar from '@/components/pages/SingleCourse/CourseSidebar'
import Hero from '@/components/pages/SingleCourse/Hero'
import React from 'react'

function page() {
  return (
    <>
    <Hero/>

    <div className='container flex flex-col md:flex-row justify-between items-start my-20 gap-10 space-y-5'>
        <div className='md:w-2/3 w-full'>
        <CoursePageLayout/>
        </div>

        <div className='md:w-1/3 w-full'>
            <CourseSidebar/>
        </div>

    </div>
        <FeaturedSectionCarousel heading={"Similar Cources"} lamp={false}/>
    </>
  )
}

export default page