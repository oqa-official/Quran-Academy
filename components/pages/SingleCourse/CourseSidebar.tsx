import React from 'react'
import CourseInfo from './CourseInfo'
import InstructorInfo from './InstructorInfo'

function CourseSidebar() {
  return (
    <div className='flex flex-col gap-4'>
        <CourseInfo/>
        <InstructorInfo/>
    </div>
  )
}

export default CourseSidebar