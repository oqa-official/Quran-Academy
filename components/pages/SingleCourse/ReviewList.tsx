"use client";
import React, { useState } from "react";
import { Star } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

type ReviewType = {
  _id: string;
  username: string;
  reviewText: string;
  reviewUserId : string;
  rating: number;
  date: string;
  image?: string;
};

export default function ReviewList({
  reviews,
  loading,
  onReviewDeleted,
}: {
  reviews: ReviewType[];
  loading: boolean;
  onReviewDeleted: () => void;
}) {
  const [visibleCount, setVisibleCount] = useState(5);
  const { userId } = useUser();

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/db/reviews/${id}`, { method: "DELETE" });

      if (!res.ok) throw new Error("Failed to delete review");

      toast.success("Review Deleted Successfully")

      onReviewDeleted(); // ✅ refresh reviews
    } catch (err) {
      console.error("Error deleting review:", err);
     toast.error("Failed to delete review")
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  if (loading) return <p className="text-gray-500">Loading reviews...</p>;
  if (!reviews || reviews.length === 0)
    return <p className="text-gray-500">No reviews yet.</p>;

  return (
    <div className="">
      {reviews
        .slice()
        .reverse()
        .slice(0, visibleCount)
        .map((review) => (
          <div
            key={review._id}
            className="mb-8  border-b border-gray-200 pb-4 last:border-b-0"
          >
            <div className="flex items-center mb-2">
              <img
                src={review.image || "/assets/courses/user-placeholder.png"}
                alt={review.username}
                className="w-8 h-8 rounded-full mr-4 object-cover bg-gray-200"
              />
              <div>
                <p className="text-base font-medium text-primary">
                  {review.username}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <p className="text-gray-700 mt-2 mb-2">{review.reviewText}</p>
            {renderStars(review.rating)}

            {/* ✅ Delete button */}
           {review.reviewUserId === userId && (
  <div className="mt-1">
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="text-xs text-red-500 hover:underline">
          Delete
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this review?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 text-white hover:bg-red-600"
            onClick={() => handleDelete(review._id)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
)}

          </div>
        ))}

      {visibleCount < reviews.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setVisibleCount((prev) => prev + 3)}
            className="px-4 py-2 text-sm rounded-md border bg-white hover:bg-gray-100"
          >
            Show more
          </button>
        </div>
      )}
    </div>
  );
}
