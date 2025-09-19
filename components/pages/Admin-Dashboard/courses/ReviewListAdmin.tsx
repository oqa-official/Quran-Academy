'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useParams } from 'next/navigation'
import ReviewList from '../../SingleCourse/ReviewList'

export default function ReviewListAdmin() {
  const params = useParams()
  const id = params?.id as string | undefined

  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReviews = async () => {
    if (!id) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/db/courses/${id}`, { cache: 'no-store' })

      if (!res.ok) throw new Error(`Failed to fetch course (${res.status})`)

      const data = await res.json()
      setReviews(data?.reviews || [])
    } catch (err: any) {
      console.error('Error fetching reviews:', err)
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [id])

  return (
    <Card className="mt-2 rounded-sm max-h-[200px]  overflow-y-scroll dark:bg-[#020D1A] bg-gray-100">
      <CardContent className="p-3">
        <h2 className="text-xl sm:text-xl font-semibold mb-2">This Course Reviews</h2>

        {error && (
          <p className="text-red-500 mb-4">
            Failed to load reviews: {error}
          </p>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gray-300 h-10 w-10"></div>
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ReviewList reviews={reviews} loading={loading}  onReviewDeleted={fetchReviews}/>
        )}

       
      </CardContent>
    </Card>
  )
}
