import { Card, CardContent } from '@/components/ui/card';
import React, { useState } from 'react';

// Define the type for a single review object
type ReviewType = {
  name: string;
  date: string;
  text: string;
  rating: number;
};

// Use the defined type for the reviewsData array
const reviewsData: ReviewType[] = [
  {
    name: 'Ali Johar',
    date: 'March 22, 2022',
    text: 'Good Coure',
    rating: 5,
  },
  {
    name: 'Hannan Ali',
    date: 'March 22, 2022',
    text: 'Good work',
    rating: 5,
  },
  {
    name: 'falak',
    date: 'January 20, 2024',
    text: 'good',
    rating: 0,
  },
];

const ReviewComponent = () => {
  const [userRating, setUserRating] = useState<number>(0);
  const [userName, setUserName] = useState<string>('');
  const [userReview, setUserReview] = useState<string>('');

  const renderStars = (rating: number) => {
    const totalStars = 5;
    const stars = [];
    for (let i = 1; i <= totalStars; i++) {
      stars.push(
        <svg
          key={i}
          className={`h-5 w-5 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.961a1 1 0 00.95.691h4.168c.969 0 1.371 1.24.588 1.81l-3.376 2.454a1 1 0 00-.364 1.118l1.287 3.961c.3.921-.755 1.688-1.54 1.118l-3.376-2.454a1 1 0 00-1.176 0l-3.376 2.454c-.784.57-1.84-.197-1.54-1.118l1.287-3.961a1 1 0 00-.364-1.118L2.094 9.389c-.783-.57-.381-1.81.588-1.81h4.168a1 1 0 00.95-.691l1.286-3.961z" />
        </svg>
      );
    }
    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-2 text-gray-500">/ {rating} Star</span>
      </div>
    );
  };
  
  const handleStarClick = (rating: number) => {
    setUserRating(rating);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would handle the form submission, e.g., send data to an API
    console.log({
      name: userName,
      rating: userRating,
      review: userReview,
    });
    // Reset form fields
    setUserName('');
    setUserRating(0);
    setUserReview('');
  };

  const renderFormStars = () => {
    const totalStars = 5;
    const stars = [];
    for (let i = 1; i <= totalStars; i++) {
      stars.push(
        <svg
          key={i}
          className={`h-7 w-7 cursor-pointer ${i <= userRating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          onClick={() => handleStarClick(i)}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.961a1 1 0 00.95.691h4.168c.969 0 1.371 1.24.588 1.81l-3.376 2.454a1 1 0 00-.364 1.118l1.287 3.961c.3.921-.755 1.688-1.54 1.118l-3.376-2.454a1 1 0 00-1.176 0l-3.376 2.454c-.784.57-1.84-.197-1.54-1.118l1.287-3.961a1 1 0 00-.364-1.118L2.094 9.389c-.783-.57-.381-1.81.588-1.81h4.168a1 1 0 00.95-.691l1.286-3.961z" />
        </svg>
      );
    }
    return stars;
  };

  return (
   <Card>
    <CardContent className='p-5 lg:px-10'>
         <div className=" bg-white">
      <div className=" mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6">Student Reviews</h2>
        {reviewsData.map((review, index) => (
          <div key={index} className="mb-8 border-b border-gray-200 pb-4 last:border-b-0">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 mr-4"></div>
              <div>
                <h3 className="text-lg font-medium text-primary">{review.name}</h3>
                <p className="text-sm text-gray-500">{review.date}</p>
              </div>
            </div>
            <p className="text-gray-700 mt-2 mb-2">{review.text}</p>
            {renderStars(review.rating)}
          </div>
        ))}

        <div className="mt-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">Leave A Comment</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 sr-only">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter Your Name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-3 border"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">Your Rating:</label>
              <div className="flex items-center">
                {renderFormStars()}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="review" className="block text-sm font-medium text-gray-700 sr-only">Review</label>
              <textarea
                id="review"
                name="review"
                rows={4 as number} // Corrected: Using a type assertion to fix the 'rows' error
                placeholder="Type Review Here"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-3 border"
                value={userReview}
                onChange={(e) => setUserReview(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="w-full px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-black bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Post Comment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </CardContent>
   </Card>
  );
};

export default ReviewComponent;