import { Card, CardContent } from '@/components/ui/card'
import React from 'react'

function Overview({ overview }: { overview: any }) {
  return (
    <div>
      <Card>
        <CardContent className="p-4 space-y-4 lg:px-10">

          {overview.summary &&
            <>
              <h2 className="text-xl font-semibold">Course Summary</h2>
              <p className="text-gray-600">
                {overview.summary}
              </p>
            </>
          }

          {overview.summary &&
            <>
              <h2 className="text-xl font-semibold">What You’ll Learn</h2>
              <p className="text-gray-600">
                {overview.whatYouLearn}
              </p>
            </>
          }

          {overview.summary &&
            <>
              <h2 className="text-xl font-semibold">Who This Course Is For</h2>
              <p className="text-gray-600">
                {overview.whoFor}
              </p>
            </>
          }

          {overview.summary &&
            <>
              <h2 className="text-xl font-semibold">Course Requirements</h2>
              <p className="text-gray-600">
                {overview.requirements}
              </p>
            </>
          }


          {overview.summary &&
            <>
              <h2 className="text-xl font-semibold">Certification</h2>
              <p className="text-gray-600">
                {overview.certification}
              </p>
            </>
          }
        </CardContent>
      </Card>
    </div>

  )
}

export default Overview