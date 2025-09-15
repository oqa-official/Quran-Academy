// 'use client'
// import { useUser } from '@/context/UserContext'
// import { Star } from 'lucide-react'
// import React, { useState } from 'react'

// interface PostReviewProps {
//   courseSlug: string // actually course ID
//   onReviewAdded: () => void
// }

// export default function PostReview({ courseSlug, onReviewAdded }: PostReviewProps) {
//   const { userId } = useUser();
  
//   const [userRating, setUserRating] = useState(0)
//   const [userName, setUserName] = useState('')
//   const [userReview, setUserReview] = useState('')
//   const [loading, setLoading] = useState(false)

//   const handleStarClick = (rating: number) => {
//     setUserRating(rating)
//   }

// const renderFormStars = () => {
//   return [1, 2, 3, 4, 5].map((i) => (
//     <Star
//       key={i}
//       onClick={() => handleStarClick(i)}
//       className={`w-8 h-8 cursor-pointer transition-colors ${
//         i <= userRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
//       }`}
//       fill={i <= userRating ? "currentColor" : "none"}  // filled star when selected
//       stroke="currentColor" // keeps the outline visible
//     />
//   ))
// }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!userRating) return alert('Please select a rating!')

//     setLoading(true)
//     try {
//       const res = await fetch(`/api/db/reviews`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           username: userName,
//           reviewUserId : userId,
//           reviewText: userReview,
//           rating: userRating,
//           course: courseSlug, // send course ID here
//         }),
//       })
//       console.log("slug", courseSlug)
//       console.log("response====== reviews", res)

//       if (!res.ok) throw new Error('Failed to post review')

//       setUserName('')
//       setUserReview('')
//       setUserRating(0)
//       onReviewAdded() // refresh the list
//     } catch (err) {
//       console.error('Error posting review:', err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <input
//         type="text"
//         placeholder="Enter Your Name"
//         className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm"
//         value={userName}
//         onChange={(e) => setUserName(e.target.value)}
//         required
//       />

//       <div>
//         <p className="mb-1 font-medium text-gray-700">Your Rating:</p>
//         <div className="flex space-x-1">{renderFormStars()}</div>
//       </div>

//       <textarea
//         placeholder="Type Review Here"
//         rows={4}
//         className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm"
//         value={userReview}
//         onChange={(e) => setUserReview(e.target.value)}
//         required
//       ></textarea>

//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full bg-accent hover:bg-accent-hover text-black px-6 py-3 rounded-md font-medium disabled:opacity-50 transition"
//       >
//         {loading ? 'Posting...' : 'Post Review'}
//       </button>
//     </form>
//   )
// }























'use client'
import { useUser } from '@/context/UserContext'
import { Star } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface PostReviewProps {
  courseSlug: string // actually course ID
  onReviewAdded: () => void
}

export default function PostReview({ courseSlug, onReviewAdded }: PostReviewProps) {
  const { userId, role } = useUser();

  const [userRating, setUserRating] = useState(0)
  const [userName, setUserName] = useState('')
  const [userReview, setUserReview] = useState('')
  const [loading, setLoading] = useState(false)

  // ✅ Fetch user’s name based on role + userId (like DashboardHeader)
  useEffect(() => {
    if (!userId || !role) return;

    const fetchName = async () => {
      try {
        let endpoint = "";
        switch (role) {
          case "admin":
            endpoint = `/api/db/admin/${userId}`;
            break;
          case "instructor":
            endpoint = `/api/db/instructors/${userId}`;
            break;
          case "student":
            endpoint = `/api/db/students/${userId}`;
            break;
          default:
            return;
        }

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Failed to fetch user info");
        const data = await res.json();
        setUserName(data.name);
      } catch (err) {
        console.error("Error fetching name:", err);
        setUserName("");
      }
    };

    fetchName();
  }, [userId, role]);

  const handleStarClick = (rating: number) => {
    setUserRating(rating)
  }

  const renderFormStars = () => {
    return [1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        onClick={() => handleStarClick(i)}
        className={`w-8 h-8 cursor-pointer transition-colors ${
          i <= userRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
        fill={i <= userRating ? "currentColor" : "none"}
        stroke="currentColor"
      />
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userRating) return toast.error('Please select a rating!')

    setLoading(true)
    try {
      const res = await fetch(`/api/db/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userName,
          reviewUserId: userId,
          reviewText: userReview,
          rating: userRating,
          course: courseSlug, // send course ID
        }),
      })

      if (!res.ok) throw new Error('Failed to post review')

      setUserReview('')
      setUserRating(0)
      onReviewAdded()
    } catch (err) {
      console.error('Error posting review:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ✅ Read-only name */}
      <input
        type="text"
        className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm bg-gray-100 cursor-not-allowed"
        value={userName}
        readOnly
      />

      <div>
        <p className="mb-1 font-medium text-gray-700">Your Rating:</p>
        <div className="flex space-x-1">{renderFormStars()}</div>
      </div>

      <textarea
        placeholder="Type Review Here"
        rows={4}
        className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm"
        value={userReview}
        onChange={(e) => setUserReview(e.target.value)}
        required
      ></textarea>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent hover:bg-accent-hover text-black px-6 py-3 rounded-md font-medium disabled:opacity-50 transition"
      >
        {loading ? 'Posting...' : 'Post Review'}
      </button>
    </form>
  )
}
