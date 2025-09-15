'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useParams } from 'next/navigation'
import ReviewList from './ReviewList'
import PostReview from './PostReview'
import { useUser } from '@/context/UserContext'

export default function CourseReviews() {
   const { userId }  = useUser();
  const params = useParams()
  const slug = params?.slug as string | undefined

  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReviews = async () => {
    if (!slug) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/db/courses/${slug}`, { cache: 'no-store' })

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
  }, [slug])

  return (
    <Card className="mt-10">
      <CardContent className="p-5 lg:px-10">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6">Student Reviews</h2>

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

        {/* Post Review Form */}
        {userId ? <div className="mt-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">
            {reviews?.length === 0 ? 'Be the first to review' : 'Leave A Comment'}
          </h2>
          {slug && <PostReview courseSlug={slug} onReviewAdded={fetchReviews} />}
        </div> :<p>Please Login First to add your Review..</p>}
       
      </CardContent>
    </Card>
  )
}
