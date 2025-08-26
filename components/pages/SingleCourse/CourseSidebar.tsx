import React from 'react'
import CourseInfo from './CourseInfo'
import FeaturedBooks from './FeaturedBooks'

function CourseSidebar() {
  return (
    <div className='flex flex-col gap-4'>
        <CourseInfo/>
        <FeaturedBooks/>
    </div>
  )
}

export default CourseSidebar