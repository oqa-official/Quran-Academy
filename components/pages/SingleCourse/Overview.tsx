import { Card, CardContent } from '@/components/ui/card'
import React from 'react'

function Overview() {
  return (
   <div>
  <Card>
    <CardContent className="p-4 space-y-4 lg:px-10">
      <h2 className="text-xl font-semibold">Course Summary</h2>
      <p className="text-gray-600">
        This Quran Academy presents this course exclusively designed for
        beginners. It covers the fundamentals of reading and reciting the Holy
        Quran with proper pronunciation.
      </p>

      <h3 className="text-lg font-semibold">What You’ll Learn</h3>
      <p className="text-gray-600">
        Students will gradually learn Arabic alphabets, Tajweed rules, and fluency in
        recitation. The course also provides essential Islamic teachings to help
        learners strengthen their understanding of faith.
      </p>

      <h3 className="text-lg font-semibold">Who This Course Is For</h3>
      <p className="text-gray-600">
        This course is designed for children, beginners, and anyone who wishes to
        start their journey in Quran recitation from scratch.
      </p>

      <h3 className="text-lg font-semibold">Course Requirements</h3>
      <p className="text-gray-600">
        No prior knowledge is needed. A willingness to learn and regular practice
        are the only essentials for success in this course.
      </p>

      <h3 className="text-lg font-semibold">Certification</h3>
      <p className="text-gray-600">
        Upon successful completion, students will receive a certificate of
        achievement from Quran Academy, recognizing their progress and dedication.
      </p>
    </CardContent>
  </Card>
</div>

  )
}

export default Overview