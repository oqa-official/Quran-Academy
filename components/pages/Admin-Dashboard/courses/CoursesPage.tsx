"use client";
import { useEffect, useState } from "react";
import AddCourseForm from "./AddCourseForm";
import CoursesGrid from "./CoursesGrid";
import { Course } from "@/lib/types/courses";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/db/courses");

      if (!res.ok) {
        throw new Error("Failed to fetch courses.");
      }

      const data: Course[] = await res.json();

      if (!data || data.length === 0) {
        setCourses([]);
        setError("No courses found.");
        return;
      }

      setCourses(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while fetching courses.");
      toast.error(err.message || "Unable to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="container w-full">
      <h1 className="text-2xl font-bold mb-6">Manage Courses</h1>

      {/* Add New Course */}
      <AddCourseForm onSuccess={fetchCourses} />

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="space-y-3 max-w-[350px] flex flex-col justify-start items-start"
            >
              <Skeleton className="h-48 w-full rounded-md bg-primary" />
              <Skeleton className="h-10 w-full bg-primary" />
              <Skeleton className="h-4 w-[75%] bg-primary" />
              <Skeleton className="h-4 w-[50%] bg-primary" />
            </div>
          ))}
        </div>
      )}

      {/* Error / Empty State */}
      {!loading && error && (
        <p className="text-red-500 text-center mt-4">{error}</p>
      )}

      {/* Courses */}
      {!loading && !error && courses.length > 0 && (
        <CoursesGrid courses={courses} />
      )}
    </div>
  );
}
