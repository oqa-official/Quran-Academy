import { Card, CardContent } from '@/components/ui/card'
import React from 'react'

function InstructorInfo() {
  return (
    // The main container for the card, with bottom margin for spacing
    <div className='mb-10'>
      {/* The card itself, using shadow and rounded corners */}
      <Card>
        <CardContent className="p-4 space-y-4 lg:px-10">
          <div className="flex flex-col md:flex-row items-center gap-4">

            {/* Image section with a rounded shape and shadow */}
            <div className="flex-shrink-0">
              {/* The image element with responsive sizing and a circular shape */}
              <img
                src="/assets/courses/teacher.png"
                alt="Instructor Abdur Rehman"
                className="w-24 h-24 rounded-full object-cover shadow-lg"
              />
            </div>

            {/* Text content section, using flex to stack items */}
            <div className="flex-1 flex flex-col justify-center text-center md:text-left">
              {/* Instructor's name with bold font */}
              <p className="font-bold text-lg">Abdur Rehman</p>
              {/* Instructor's title in a muted color */}
              <p className="text-gray-600 text-sm">Pro Lacturar</p>
            </div>
          </div>
          <hr className="my-4 border-gray-300" />
          {/* The main paragraph of text about the instructor */}
          <p className="text-gray-700 text-base leading-relaxed">
            Sheikh Muhammad Salah is one of the best teachers in our faculty. He has memorized
            the Quran at the age of 15 and has been teaching for 7-8 years. He has extensive
            experience in various teaching methodologies to ensure students of all ages can
            grasp the concepts effectively. His teaching style is known for being patient and
            encouraging, creating a comfortable learning environment for all students.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorInfo;
