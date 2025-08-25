import { Card, CardContent } from '@/components/ui/card'
import React from 'react'

function InstructorInfo() {
    return (
        <div className='mb-10'>
            <Card>
                <CardContent className="px-4 py-3">
                    <div className="flex flex-col justify-start items-start gap-3">
                    <h3 className="text-lg font-semibold mb-2">About Course Instructor</h3>

                       


                        <img
                            src="/assets/courses/teacher.png"
                            alt="Teacher"
                            className="w-full rounded-md shadow-lg shadow-gray-600"
                        />
                         <div className='mt-3'>
                            <p className="font-medium text-xl">Hafiz Muhammad Usman</p>
                            <p className="text-base text-gray-600">10+ Years Experience</p>
                        </div>

                        <p className='mt-2'>Ustadh Muhammad Usman is very upstanding experience in Teaching Quran. He memorized the Quran at the age of 10 at Al-Jamiya Masjid Al-Aloum institute of Lahore and recited Quran in Taraweeh prayers. Sheikh Usman is one of our best Quran teachers, he has particular pattern in teaching, even all his Students like his sessions a lot.</p>

                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default InstructorInfo