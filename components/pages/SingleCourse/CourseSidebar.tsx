import React from 'react'
import CourseInfo from './CourseInfo'
import FeaturedBooks from './FeaturedBooks'

function CourseSidebar({ course }: { course: any }) {
  return (
    <div className='flex flex-col gap-4'>
        <CourseInfo course={course}/>
        <FeaturedBooks/>
    </div>
  )
}

export default CourseSidebar